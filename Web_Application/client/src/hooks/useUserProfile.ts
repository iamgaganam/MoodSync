import { useState, useEffect, useCallback } from "react";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  mobileNumber: string;
  emergencyContact: string;
  profileImage: string;
  emailVerified: boolean;
  joinDate: string;
}

interface UseUserProfileReturn {
  profileData: UserProfile | null;
  setProfileData: (data: UserProfile | null) => void;
  tempData: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  setTempData: (data: UserProfile | null) => void;
  setIsEditing: (editing: boolean) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  refreshProfile: () => void;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { isLoggedIn, logout } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [tempData, setTempData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  /**
   * Gets authentication token from localStorage
   */
  const getAuthToken = (): string | null => {
    return (
      localStorage.getItem("token") || localStorage.getItem("access_token")
    );
  };

  /**
   * Formats stored user data to match profile structure
   */
  const formatStoredUserData = (userData: any): UserProfile => ({
    name: userData.name,
    email: userData.email,
    role: userData.role || "user",
    mobileNumber: userData.mobileNumber || "",
    emergencyContact: userData.emergencyContact || "",
    profileImage: userData.profileImage || "",
    emailVerified: userData.emailVerified || false,
    joinDate: userData.createdAt || new Date().toISOString(),
  });

  /**
   * Gets fallback profile data from localStorage
   */
  const getFallbackProfileData = (): UserProfile | null => {
    const storedUser =
      localStorage.getItem("user") || localStorage.getItem("moodSync_user");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return formatStoredUserData(userData);
      } catch (parseError) {
        console.error("Failed to parse stored user data:", parseError);
        return null;
      }
    }
    return null;
  };

  /**
   * Handles authentication errors
   */
  const handleAuthError = (error: any): void => {
    if (error.response?.status === 401) {
      setError("Authentication required. Please log in.");
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      logout();
    } else {
      setError(error.message || "Failed to load profile data");
    }
  };

  /**
   * Fetches profile data with API fallback to localStorage
   */
  const fetchProfile = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Attempt API call first
      try {
        const data = await getUserProfile();
        setProfileData(data);
        setTempData(data);
        return;
      } catch (apiError: any) {
        console.warn("API call failed, using localStorage fallback");

        // Fallback to localStorage
        const fallbackData = getFallbackProfileData();
        if (fallbackData) {
          setProfileData(fallbackData);
          setTempData(fallbackData);
          return;
        }

        throw new Error("Profile data not available from any source");
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  /**
   * Refreshes profile data if authenticated
   */
  const refreshProfile = useCallback((): void => {
    if (getAuthToken()) {
      fetchProfile();
    } else {
      setError("Authentication required. Please log in.");
      setIsLoading(false);
    }
  }, [fetchProfile]);

  /**
   * Saves profile changes.
   */
  const handleSave = async (): Promise<void> => {
    if (!tempData) return;

    try {
      setIsLoading(true);

      try {
        const updatedData = await updateUserProfile(tempData);
        setProfileData(updatedData);
        setTempData(updatedData);
      } catch (apiError) {
        console.warn("API update failed, updating UI only");
        setProfileData(tempData);
      }

      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancels profile editing and reverts changes
   */
  const handleCancel = (): void => {
    setTempData(profileData);
    setIsEditing(false);
  };

  // Fetch profile data when authentication status changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    } else {
      setError("Authentication required. Please log in.");
      setIsLoading(false);
    }
  }, [isLoggedIn, fetchProfile]);

  return {
    profileData,
    setProfileData,
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
