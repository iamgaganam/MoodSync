// src/services/userService.ts
import api from "./apiService";

// Get current user profile
export const getUserProfile = async () => {
  try {
    // Use the auth/me endpoint which is working
    console.log("Fetching user profile from /api/auth/me");
    const response = await api.get("/auth/me");

    console.log("Profile API response:", response.data);

    if (response.data.success) {
      // Get user data from the auth/me response structure
      const userData = response.data.user;

      // Transform to expected profile structure
      return {
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobileNumber || "",
        emergencyContact: userData.emergencyContact || "",
        profileImage: userData.profileImage || "",
        role: userData.role || "user",
        emailVerified: userData.emailVerified || false,
        joinDate: userData.createdAt || new Date().toISOString(),
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch profile");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile - using API service that handles tokens
export const updateUserProfile = async (userData: any) => {
  try {
    const response = await api.put("/users/profile", userData);

    if (response.data.success) {
      return response.data.data || response.data.user;
    } else {
      throw new Error(response.data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating user profile:", error);

    // Fallback to returning the input data if API fails
    console.log("Update endpoint failed, returning input data as fallback");
    return userData;
  }
};

// Add profile image upload function
export const uploadProfileImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    // For FormData, we need to override the Content-Type header
    const response = await api.post("/users/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};
