import bcrypt from "bcrypt";
import { config } from "../config/env.config";

/**
 * Hash a password with bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Password hashing failed");
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword Plain text password
 * @param hashedPassword Hashed password
 * @returns Boolean indicating if passwords match
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

/**
 * Check if password meets security requirements
 * @param password Password to validate
 * @returns Object with isValid flag and error message
 */
export const validatePasswordStrength = (
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
