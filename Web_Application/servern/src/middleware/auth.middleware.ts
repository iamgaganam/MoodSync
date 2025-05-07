import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.utils";

// Extend Express Request interface to include user
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

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
      return;
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

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
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * Middleware to check user roles
 * @param roles Allowed roles
 */
export const authorize = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Convert roles to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Unauthorized. Insufficient permissions.",
      });
      return;
    }

    next();
  };
};
