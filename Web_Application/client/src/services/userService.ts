// src/services/userService.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get token from localStorage
const getAuthToken = (): string | null => {
  // Check for both "token" and "access_token" to handle any inconsistency
  const token =
    localStorage.getItem("token") || localStorage.getItem("access_token");
  console.log("Token for API request:", token ? "Present" : "Missing");
  return token;
};

// Create auth header
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// Get current user profile - use working endpoint
export const getUserProfile = async () => {
  try {
    // Use the auth/me endpoint which is working
    console.log("Fetching user profile from /api/auth/me");
    const response = await axios.get(`${API_URL}/auth/me`, getAuthHeader());

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

// Update user profile - try with real endpoint now
export const updateUserProfile = async (userData: any) => {
  try {
    // Try to use the real update endpoint
    const response = await axios.put(
      `${API_URL}/users/profile`,
      userData,
      getAuthHeader()
    );

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

// Add new function for profile image upload
export const uploadProfileImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await axios.post(
      `${API_URL}/users/profile/image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
