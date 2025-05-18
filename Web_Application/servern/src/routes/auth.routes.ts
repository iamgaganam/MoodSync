// server/src/routes/auth.routes.ts
import express from "express";
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshAccessToken); // Add this line

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);

export default router;
