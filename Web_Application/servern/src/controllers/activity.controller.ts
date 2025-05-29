import { Request, Response } from "express";
import Activity, { IActivity } from "../models/activity.model";
import mongoose from "mongoose";

export const createActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const newActivity: IActivity = new Activity({
      userId,
      title: req.body.title,
      description: req.body.description || "",
      date: req.body.date,
      time: req.body.time,
      category: req.body.category || "other",
      isCompleted: req.body.isCompleted || false,
    });

    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).json({
      message: "Error creating activity",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Date filtering from query parameters
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    let query: any = { userId };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const activities = await Activity.find(query).sort({ date: 1, time: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching activities",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const activityId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ message: "Invalid activity ID" });
    }

    // Verify ownership before update
    const activity = await Activity.findOne({ _id: activityId, userId });
    if (!activity) {
      return res
        .status(404)
        .json({ message: "Activity not found or access denied" });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({
      message: "Error updating activity",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const activityId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ message: "Invalid activity ID" });
    }

    // Verify ownership before deletion
    const activity = await Activity.findOne({ _id: activityId, userId });
    if (!activity) {
      return res
        .status(404)
        .json({ message: "Activity not found or access denied" });
    }

    await Activity.findByIdAndDelete(activityId);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting activity",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
