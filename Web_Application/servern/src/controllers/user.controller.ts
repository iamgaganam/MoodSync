import { Request, Response } from "express";
import User from "../models/user.model";
import fs from "fs";
import path from "path";

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get user ID from token payload - handle multiple property names
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - No valid user ID in token",
      });
      return;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage
      ? `${baseUrl}/uploads/profile-images/${user.profileImage}`
      : "";

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber || "",
        emergencyContact: user.emergencyContact || "",
        profileImage: profileImageUrl,
        role: user.role || "user",
        joinDate: user.createdAt,
        emailVerified: user.emailVerified || false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { name, mobileNumber, emergencyContact } = req.body;

    // Basic validation
    if (name && name.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name || undefined,
        mobileNumber: mobileNumber !== undefined ? mobileNumber : undefined,
        emergencyContact:
          emergencyContact !== undefined ? emergencyContact : undefined,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = updatedUser.profileImage
      ? `${baseUrl}/uploads/profile-images/${updatedUser.profileImage}`
      : "";

    res.status(200).json({
      success: true,
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        mobileNumber: updatedUser.mobileNumber || "",
        emergencyContact: updatedUser.emergencyContact || "",
        profileImage: profileImageUrl,
        role: updatedUser.role || "user",
        joinDate: updatedUser.createdAt,
        emailVerified: updatedUser.emailVerified || false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
    });
  }
};

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image file provided",
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Clean up old profile image
    if (user.profileImage) {
      const oldImagePath = path.join(
        __dirname,
        "../../uploads/profile-images",
        user.profileImage
      );

      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        // Log error but don't fail the upload
        console.error("Error deleting old profile image:", err);
      }
    }

    user.profileImage = req.file.filename;
    await user.save();

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = `${baseUrl}/uploads/profile-images/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        profileImage: profileImageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
    });
  }
};
