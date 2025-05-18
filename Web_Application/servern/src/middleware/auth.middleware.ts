// server/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.utils";

// Extend Express Request interface to include user
// This needs to be in a single place to avoid conflicts
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader ? "Present" : "Missing");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
      return;
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    console.log("Token extracted, attempting verification");

    // Verify token
    const decoded = verifyToken(token);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    // Add user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Add an alias to match our controller function expectations
export const authMiddleware = authenticate;
