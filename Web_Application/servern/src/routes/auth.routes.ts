import { Router } from "express";
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

const router = Router();

// Public authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.get("/verify-email/:token", verifyEmail);

// Protected routes requiring authentication
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);

export default router;
