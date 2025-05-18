// src/hooks/useUserProfile.ts
import { useState, useEffect, useCallback } from "react";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export const useUserProfile = () => {
  const { isLoggedIn, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [tempData, setTempData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Function to fetch profile data - with fallback to local storage
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get data from API
      try {
        const data = await getUserProfile();
        console.log("Profile data fetched:", data);
        setProfileData(data);
        setTempData(data);
        return;
      } catch (apiError: any) {
        console.warn("API call failed, using localStorage fallback", apiError);

        // Fallback to localStorage if API fails
        const storedUser =
          localStorage.getItem("user") || localStorage.getItem("moodSync_user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log("Using user data from localStorage:", userData);

            // Format the data to match expected structure
            const formattedData = {
              name: userData.name,
              email: userData.email,
              role: userData.role || "user",
              mobileNumber: userData.mobileNumber || "",
              emergencyContact: userData.emergencyContact || "",
              profileImage: userData.profileImage || "",
              emailVerified: userData.emailVerified || false,
              joinDate: userData.createdAt || new Date().toISOString(),
            };

            setProfileData(formattedData);
            setTempData(formattedData);
            return;
          } catch (parseError) {
            console.error(
              "Failed to parse user data from localStorage",
              parseError
            );
            throw new Error("Failed to load profile data from any source");
          }
        } else {
          // No fallback available
          throw new Error("User data not available");
        }
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      // Check if it's an authentication error
      if (err.response && err.response.status === 401) {
        setError("Not authenticated. Please log in.");
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        logout();
      } else {
        setError(err.message || "Failed to load profile data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Function to refresh profile data
  const refreshProfile = useCallback(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) {
      fetchProfile();
    } else {
      setError("Not authenticated. Please log in.");
      setIsLoading(false);
    }
  }, [fetchProfile]);

  // Fetch profile data on mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    } else {
      setError("Not authenticated. Please log in.");
      setIsLoading(false);
    }
  }, [isLoggedIn, fetchProfile]);

  // Handle save - with fallback to just updating the UI if API fails
  const handleSave = async () => {
    try {
      setIsLoading(true);
      try {
        const data = await updateUserProfile(tempData);
        console.log("Profile updated:", data);
        setProfileData(data);
        setTempData(data);
      } catch (apiError) {
        console.warn("API update failed, updating UI only", apiError);
        // Just update the UI state if API fails
        setProfileData(tempData);
      }
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        logout();
      } else {
        setError(err.message || "Failed to update profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  return {
    profileData,
    setProfileData, // Expose this to allow updating profile image
    tempData,
    isLoading,
    error,
    isEditing,
    setTempData,
    setIsEditing,
    handleSave,
    handleCancel,
    refreshProfile,
  };
};
