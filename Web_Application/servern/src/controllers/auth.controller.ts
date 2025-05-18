// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
  TokenPayload, // Import TokenPayload interface
} from "../utils/jwt.utils";
import winston from "winston";
import mongoose from "mongoose";

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

/**
 * Get user ID as string, handling different possible types
 */
const getUserIdAsString = (user: any): string => {
  if (!user) return "";

  // Handle MongoDB ObjectID
  if (user._id && typeof user._id === "object" && user._id.toString) {
    return user._id.toString();
  }

  // Handle string ID
  if (user._id && typeof user._id === "string") {
    return user._id;
  }

  // Fallback to user.id
  if (user.id) {
    return typeof user.id === "object" ? user.id.toString() : String(user.id);
  }

  // Last resort
  return String(user._id || "");
};

/**
 * Validates password strength
 */
const validatePasswordStrength = (
  password: string
): { isValid: boolean; message?: string } => {
  // Minimum length check
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }

  // All checks passed
  return { isValid: true };
};

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      mobileNumber,
      emergencyContact,
      password,
      confirmPassword,
      role = "user",
    } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already in use",
      });
      return;
    }

    // Check password strength
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
      return;
    }

    // Create new user with all fields
    const newUser = {
      name,
      email,
      mobileNumber: mobileNumber || "", // Default to empty string if not provided
      emergencyContact: emergencyContact || "", // Default to empty string if not provided
      password, // Will be hashed by pre-save hook
      profileImage: "",
      role,
      // Additional fields
      emailVerified: false, // Require email verification
      emailVerificationToken: generateRandomToken(),
    };

    const user = await User.create(newUser);

    // Generate tokens with payload that includes both id and userId
    const payload: TokenPayload = {
      id: getUserIdAsString(user),
      userId: getUserIdAsString(user),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refreshToken hash in database for future validation
    // This is optional but adds more security
    user.refreshToken = refreshToken;
    await user.save();

    // Base URL for profile image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage
      ? `${baseUrl}/uploads/profile-images/${user.profileImage}`
      : "";

    // Return user info and tokens (excluding password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        emergencyContact: user.emergencyContact,
        profileImage: profileImageUrl,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });

    // In a real application, send email verification email here
    logger.info(`New user registered: ${user.email}`);
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email and explicitly select password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      res.status(401).json({
        success: false,
        message: "Account is temporarily locked. Please try again later.",
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account if too many failed attempts (e.g., 5)
      if (user.failedLoginAttempts >= 5) {
        // Lock for 30 minutes
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }

      // Skip validation when saving during login
      await user.save({ validateBeforeSave: false });

      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    // Generate tokens with payload that includes both id and userId
    const payload: TokenPayload = {
      id: getUserIdAsString(user),
      userId: getUserIdAsString(user),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refreshToken in database
    user.refreshToken = refreshToken;

    // Skip validation when saving during login
    await user.save({ validateBeforeSave: false });

    // Base URL for profile image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage
      ? `${baseUrl}/uploads/profile-images/${user.profileImage}`
      : "";

    // Return user info and tokens
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber || "",
        emergencyContact: user.emergencyContact || "",
        profileImage: profileImageUrl,
        role: user.role,
        emailVerified: user.emailVerified || false,
        createdAt: user.createdAt,
      },
    });

    logger.info(`User logged in: ${user.email}`);
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/**
 * Refresh access token using refresh token
 * @route POST /api/auth/refresh-token
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
      return;
    }

    // Find user by id
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Optional: Verify the refresh token matches the one stored in DB
    // This adds an extra layer of security
    if (user.refreshToken !== refreshToken) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    // Generate new access token with payload that includes both id and userId
    const newAccessToken = generateToken({
      id: getUserIdAsString(user),
      userId: getUserIdAsString(user),
      email: user.email,
      role: user.role,
    });

    // Return new access token
    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    logger.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during token refresh",
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // User ID is attached to request by auth middleware
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get base URL for profile image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage
      ? `${baseUrl}/uploads/profile-images/${user.profileImage}`
      : "";

    // Return user info
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber || "",
        emergencyContact: user.emergencyContact || "",
        profileImage: profileImageUrl,
        role: user.role,
        emailVerified: user.emailVerified || false,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Logout a user
 * @route POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // User ID is attached to request by auth middleware
    const userId = req.user?.userId;

    if (userId) {
      // Find user and clear refresh token
      await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Don't reveal if user exists or not for security
    if (!user) {
      res.status(200).json({
        success: true,
        message:
          "If your email is registered, a password reset link will be sent",
      });
      return;
    }

    // Generate reset token
    const resetToken = generateRandomToken();

    // Set token and expiration (1 hour)
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Skip validation when saving during password reset request
    await user.save({ validateBeforeSave: false });

    // In a real application, send reset email here with the token
    // For development, just return the token
    logger.info(`Password reset requested for: ${user.email}`);

    res.status(200).json({
      success: true,
      message:
        "If your email is registered, a password reset link will be sent",
      // Include token for development only, remove in production
      resetToken:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    logger.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Reset password using token
 * @route POST /api/auth/reset-password
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    // Check password strength
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
      return;
    }

    // Find user by reset token and check if token is expired
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    // Skip validation when saving during password reset
    await user.save({ validateBeforeSave: false });

    logger.info(`Password reset successful for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    logger.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Verify email using token
 * @route GET /api/auth/verify-email/:token
 */
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
      return;
    }

    // Mark email as verified and clear token
    user.emailVerified = true;
    user.emailVerificationToken = undefined;

    // Skip validation when saving during email verification
    await user.save({ validateBeforeSave: false });

    logger.info(`Email verified for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    logger.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
