import * as jwt from "jsonwebtoken";

export interface TokenPayload {
  id?: string;
  userId?: string;
  email: string;
  role: "user" | "admin" | "doctor" | "therapist";
  [key: string]: any;
}

export const generateRandomToken = (length = 32): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

export const generateToken = (
  payload: TokenPayload,
  expiresIn: string = "1d"
): string => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret";
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" as any });
};

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
