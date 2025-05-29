import { Router } from "express";
import {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All activity routes require authentication
router.post("/", authMiddleware, createActivity);
router.get("/", authMiddleware, getActivities);
router.put("/:id", authMiddleware, updateActivity);
router.delete("/:id", authMiddleware, deleteActivity);

export default router;
