import api from "./apiService";

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

interface UpdateUserData {
  name?: string;
  mobileNumber?: string;
  emergencyContact?: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  user?: T;
  message?: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<ApiResponse<any>>("/auth/me");

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

export const updateUserProfile = async (
  userData: UpdateUserData
): Promise<any> => {
  try {
    const response = await api.put<ApiResponse<any>>(
      "/users/profile",
      userData
    );

    if (response.data.success) {
      return response.data.data || response.data.user;
    } else {
      throw new Error(response.data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating user profile:", error);

    // Fallback if the API fail
    return userData;
  }
};

export const uploadProfileImage = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await api.post<ApiResponse<any>>(
      "/users/profile/image",
      formData,
      {
        headers: {
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
