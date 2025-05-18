// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export interface User {
  name: string;
  email: string;
  role?: string;
  mobileNumber?: string;
  emergencyContact?: string;
  profileImage?: string;
  id?: string;
  // Doctor specific fields
  specialization?: string;
  hospital?: string;
  // Chat related fields
  status?: "active" | "inactive";
  lastActive?: Date;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (
    user: User,
    token: string,
    refreshToken: string,
    rememberMe?: boolean
  ) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  isInitialized: boolean;
  // Added for chat functionality
  getToken: () => string | null;
  updateUserStatus: (status: "active" | "inactive") => void;
}

// Keys for localStorage - UPDATED for consistency
const USER_STORAGE_KEY = "moodSync_user";
const TOKEN_STORAGE_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const REMEMBER_ME_KEY = "moodSync_rememberMe";

const API_URL = "http://localhost:5000/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isLoggedIn = Boolean(user);

  // Function to get the current token
  const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  };

  // Function to update user status (for chat)
  const updateUserStatus = async (status: "active" | "inactive") => {
    if (!user) return;

    try {
      const token = getToken();
      if (!token) return;

      // Update the user status in the database
      await axios.patch(
        `${API_URL}/users/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local user state
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          status,
        };
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Function to refresh the access token
  const refreshToken = async (): Promise<boolean> => {
    try {
      // Get the refresh token from localStorage
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        // No refresh token available, user needs to login again
        logout();
        return false;
      }

      // Call the refresh token API endpoint
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken,
      });

      if (response.data.success) {
        // Update the access token in localStorage
        localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
        console.log("Token refreshed successfully");
        return true;
      } else {
        // Refresh token failed, user needs to login again
        logout();
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      return false;
    }
  };

  // Function to check if the stored token is valid with your Node.js backend
  const checkAuthStatus = async (): Promise<boolean> => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      return false;
    }

    try {
      // Using your Node.js backend's user profile endpoint to validate token
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If the request is successful, the token is valid
      if (response.data.success) {
        // Get updated user data from the response
        const userData = response.data.user;
        const userObject = {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          mobileNumber: userData.mobileNumber,
          emergencyContact: userData.emergencyContact,
          profileImage: userData.profileImage,
          id: userData.id,
          specialization: userData.specialization,
          hospital: userData.hospital,
          status: userData.status || "inactive",
          lastActive: userData.lastActive,
        };

        // Update user state with fresh data from API
        setUser(userObject);

        // Also update localStorage with the latest user data
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObject));

        return true;
      }
      return false;
    } catch (error) {
      console.error("Token validation failed:", error);

      // Try to refresh the token if we get a 401
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Try refreshing the token
        const refreshSuccessful = await refreshToken();
        if (refreshSuccessful) {
          // Try validating again with the new token
          return await checkAuthStatus();
        }

        // Token refresh failed, clear storage unless "Remember Me" is enabled
        if (localStorage.getItem(REMEMBER_ME_KEY) !== "true") {
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      }

      return false;
    }
  };

  // Check for stored user data on initial load
  useEffect(() => {
    const initAuth = async () => {
      // First check if "Remember Me" was enabled
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true";
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUserJSON = localStorage.getItem(USER_STORAGE_KEY);

      // If we have a token and (remember me is on or we have stored user data)
      if (token && (rememberMe || storedUserJSON)) {
        if (storedUserJSON) {
          try {
            const storedUser = JSON.parse(storedUserJSON);
            setUser(storedUser);

            // Even if we restored from storage, validate the token with the server
            // This ensures we catch expired tokens and get fresh user data
            await checkAuthStatus();
          } catch (error) {
            console.error("Failed to parse stored user data:", error);
            localStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
          }
        } else {
          // No stored user but we have a token, try to validate
          const isValid = await checkAuthStatus();
          if (!isValid) {
            setUser(null);
            if (!rememberMe) {
              localStorage.removeItem(TOKEN_STORAGE_KEY);
              localStorage.removeItem(REFRESH_TOKEN_KEY);
            }
          }
        }
      } else {
        // No token or remember me is off and no user data
        setUser(null);
      }

      setIsInitialized(true);
    };

    initAuth();
  }, []);

  // Set user status to active when logged in, inactive when component unmounts
  useEffect(() => {
    // Set status to active when user is logged in
    if (isLoggedIn && user) {
      updateUserStatus("active");
    }

    // Set status to inactive when component unmounts
    return () => {
      if (isLoggedIn && user) {
        updateUserStatus("inactive");
      }
    };
  }, [isLoggedIn, user]);

  // Updated login to handle tokens directly
  const login = (
    user: User,
    token: string,
    refreshToken: string,
    rememberMe: boolean = false
  ) => {
    // Set user status to active
    const userWithStatus: User = {
      ...user,
      status: "active" as const,
    };

    setUser(userWithStatus);

    // Always store user data and tokens
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithStatus));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Set remember me preference
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? "true" : "false");
  };

  const logout = () => {
    // Set user status to inactive before logging out
    if (user) {
      updateUserStatus("inactive");
    }

    // Call logout API if user is logged in
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && user) {
      try {
        axios
          .post(
            `${API_URL}/auth/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .catch((error) => {
            console.error("Error during logout API call:", error);
          });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    setUser(null);

    // Clear stored data
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);

    // Redirect to login page is handled by the component that calls logout
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        checkAuthStatus,
        refreshToken,
        isInitialized,
        getToken,
        updateUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
