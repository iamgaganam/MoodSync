import axios from "axios";

const API_URL = "http://localhost:5000/api";

interface UserProfile {
  name: string;
  email: string;
  mobileNumber: string;
  emergencyContact: string;
  profileImage: string;
  role: string;
  emailVerified: boolean;
  joinDate: string;
}

/**
 * Retrieves authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("token") || localStorage.getItem("access_token");
};

/**
 * Creates authorization header for API requests
 */
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

/**
 * Fetches current user profile
 * @returns Promise<UserProfile> User profile data
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, getAuthHeader());

    if (response.data.success) {
      const userData = response.data.user;

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

/**
 * Updates user profile information
 * @param userData Updated user data
 * @returns Promise<any> Updated user data
 */
export const updateUserProfile = async (userData: Partial<UserProfile>) => {
  try {
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
    // Fallback data for emergency failure bru.
    return userData;
  }
};

/**
 * Uploads user profile image
 * @param file Image file to upload
 * @returns Promise<any> Upload response data
 */
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
