import * as jwt from "jsonwebtoken";

/**
 * Token payload interface for TypeScript
 */
export interface TokenPayload {
  id?: string; // Make id optional
  userId?: string; // Add userId field
  email: string;
  role: "user" | "admin" | "doctor" | "therapist";
  [key: string]: any; // Allow for additional properties
}

/**
 * Generate a random token string
 * @param length - Length of the token
 * @returns Random string token
 */
export const generateRandomToken = (length = 32): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

/**
 * Generate JWT token
 * @param payload - Data to include in token
 * @param expiresIn - Token expiration time
 * @returns Generated JWT token
 */
export const generateToken = (
  payload: TokenPayload,
  expiresIn: string | number = "1d"
): string => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret";

  // Use any to bypass type checking temporarily
  const options: any = {
    expiresIn: expiresIn,
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Generate refresh token with longer expiry
 * @param payload - Data to include in token
 * @returns Generated refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

  // Use any to bypass type checking temporarily
  const options: any = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Verify JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret";
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Token verification failed:", error.message);
    } else {
      console.error("Token verification failed with unknown error");
    }
    return null;
  }
};

/**
 * Verify refresh token
 * @param token - Refresh token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Refresh token verification failed:", error.message);
    } else {
      console.error("Refresh token verification failed with unknown error");
    }
    return null;
  }
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generateRandomToken, // Added to export
};
