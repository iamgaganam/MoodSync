import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
  TokenPayload,
} from "../utils/jwt.utils";
import winston from "winston";
import mongoose from "mongoose";

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

// Handle different user ID formats consistently
const getUserIdAsString = (user: any): string => {
  if (!user) return "";

  if (user._id && typeof user._id === "object" && user._id.toString) {
    return user._id.toString();
  }

  if (user._id && typeof user._id === "string") {
    return user._id;
  }

  if (user.id) {
    return typeof user.id === "object" ? user.id.toString() : String(user.id);
  }

  return String(user._id || "");
};

// Password strength validation
const validatePasswordStrength = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }

  return { isValid: true };
};

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

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already in use",
      });
      return;
    }

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
      return;
    }

    const newUser = {
      name,
      email,
      mobileNumber: mobileNumber || "",
      emergencyContact: emergencyContact || "",
      password,
      profileImage: "",
      role,
      emailVerified: false,
      emailVerificationToken: generateRandomToken(),
    };

    const user = await User.create(newUser);

    const payload: TokenPayload = {
      id: getUserIdAsString(user),
      userId: getUserIdAsString(user),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage
      ? `${baseUrl}/uploads/profile-images/${user.profileImage}`
      : "";

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

    logger.info(`New user registered: ${user.email}`);
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Account lockout check
    if (user.lockUntil && user.lockUntil > new Date()) {
      res.status(401).json({
        success: false,
        message: "Account is temporarily locked. Please try again later.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account after 5 failed attempts for 30 minutes
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }

      await user.save({ validateBeforeSave: false });

      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    const payload: TokenPayload = {
      id: getUserIdAsString(user),
      userId: getUserIdAsString(user),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage
      ? `${baseUrl}/uploads/profile-images/${user.profileImage}`
      : "";

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

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify stored refresh token matches
    if (user.refreshToken !== refreshToken) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    const newAccessToken = generateToken({
      id: getUserIdAsString(user),
      userId: getUserIdAsString(user),
      email: user.email,
      role: user.role,
    });

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

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage
      ? `${baseUrl}/uploads/profile-images/${user.profileImage}`
      : "";

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

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (userId) {
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

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Security feature is to: don't reveal if user exists
    if (!user) {
      res.status(200).json({
        success: true,
        message:
          "If your email is registered, a password reset link will be sent",
      });
      return;
    }

    const resetToken = generateRandomToken();

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    logger.info(`Password reset requested for: ${user.email}`);

    res.status(200).json({
      success: true,
      message:
        "If your email is registered, a password reset link will be sent",
      // Development only used
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

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
      return;
    }

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

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

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

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
      return;
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;

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
