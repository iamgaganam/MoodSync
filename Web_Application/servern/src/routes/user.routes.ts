// server/src/routes/user.routes.ts
import express from "express";
import {
  getProfile,
  updateProfile,
  uploadImage,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { uploadProfileImage } from "../utils/upload.utils";

const router = express.Router();

// Get user profile
router.get("/profile", authenticate, getProfile);

// Update user profile
router.put("/profile", authenticate, updateProfile);

// Upload profile image
router.post(
  "/profile/image",
  authenticate,
  uploadProfileImage.single(
    "profileImage"
  ) as unknown as express.RequestHandler,
  uploadImage
);

export default router;
