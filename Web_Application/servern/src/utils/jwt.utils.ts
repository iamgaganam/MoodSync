import jwt, { SignOptions, Secret } from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate a JWT token
 * @param payload The data to be encoded in the token
 * @returns JWT token string
 */
export const generateToken = (payload: TokenPayload): string => {
  const jwtSecret: Secret =
    process.env.JWT_SECRET || "default_jwt_secret_not_secure";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, jwtSecret, {
    expiresIn,
  } as SignOptions);
};

/**
 * Verify and decode a JWT token
 * @param token The JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret_not_secure";
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Generate a random token for password reset or email verification
 * @returns Random token string
 */
export const generateRandomToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
