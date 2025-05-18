// server/src/controllers/user.controller.ts
import { Request, Response } from "express";
import User from "../models/user.model";
import fs from "fs";
import path from "path";

/**
 * Get user profile
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Profile request received");
    console.log("User from token:", req.user);

    // Get user ID from authenticated request - checking all possible property names
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      console.error("No userId found in token payload:", req.user);
      res.status(401).json({
        success: false,
        message: "Unauthorized - No valid user ID in token",
      });
      return;
    }

    // Find user in database
    const user = await User.findById(userId).select("-password");
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get base URL for profile image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage
      ? `${baseUrl}/uploads/profile-images/${user.profileImage}`
      : "";

    // Return user profile
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
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Update profile request received");
    console.log("Request body:", req.body);

    // Get user ID from authenticated request
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // Get update data from request body
    const { name, mobileNumber, emergencyContact } = req.body;

    // Validate data
    if (name && name.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
      return;
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name || undefined, // Only update if provided
        mobileNumber: mobileNumber !== undefined ? mobileNumber : undefined,
        emergencyContact:
          emergencyContact !== undefined ? emergencyContact : undefined,
      },
      { new: true } // Return updated document
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get base URL for profile image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = updatedUser.profileImage
      ? `${baseUrl}/uploads/profile-images/${updatedUser.profileImage}`
      : "";

    // Return updated user profile
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
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
    });
  }
};

/**
 * Upload profile image
 */
export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image file provided",
      });
      return;
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Delete old profile image if exists
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
        console.error("Error deleting old profile image:", err);
      }
    }

    // Update user profile image
    user.profileImage = req.file.filename;
    await user.save();

    // Get base URL for profile image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = `${baseUrl}/uploads/profile-images/${req.file.filename}`;

    // Return success response
    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        profileImage: profileImageUrl,
      },
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
    });
  }
};
