import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../utils/validator";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../utils/validator";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/verify-email/:token", verifyEmail);

// Protected routes
router.get("/me", authenticate, getCurrentUser);

export default router;
