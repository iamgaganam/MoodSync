import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { generateToken } from "../utils/jwt.utils";
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
      mobileNumber, // Added field
      emergencyContact, // Added field
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

    // Validate mobile number and emergency contact
    if (!mobileNumber) {
      res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
      return;
    }

    if (!emergencyContact) {
      res.status(400).json({
        success: false,
        message: "Emergency contact is required",
      });
      return;
    }

    if (mobileNumber === emergencyContact) {
      res.status(400).json({
        success: false,
        message: "Emergency contact cannot be the same as your mobile number",
      });
      return;
    }

    // Create new user with all fields
    const newUser = {
      name,
      email,
      mobileNumber, // Added field
      emergencyContact, // Added field
      password, // Will be hashed by pre-save hook
      role,
      // Additional fields
      emailVerified: false, // Require email verification
      emailVerificationToken: Math.random().toString(36).substring(2, 15),
    };

    const user = await User.create(newUser);

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user info and token (excluding password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        emergencyContact: user.emergencyContact,
        role: user.role,
        emailVerified: user.emailVerified,
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
      user.failedLoginAttempts += 1;

      // Lock account if too many failed attempts (e.g., 5)
      if (user.failedLoginAttempts >= 5) {
        // Lock for 30 minutes
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }

      await user.save();

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
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user info and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        emergencyContact: user.emergencyContact,
        role: user.role,
        emailVerified: user.emailVerified,
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

    // Return user info
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        emergencyContact: user.emergencyContact,
        role: user.role,
        emailVerified: user.emailVerified,
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
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Set token and expiration (1 hour)
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

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

    await user.save();

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

    await user.save();

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
