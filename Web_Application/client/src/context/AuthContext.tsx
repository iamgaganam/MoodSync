// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User, rememberMe?: boolean) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  isInitialized: boolean; // Added to track if initial auth check is complete
}

// Keys for localStorage
const USER_STORAGE_KEY = "moodSync_user";
const TOKEN_STORAGE_KEY = "access_token";
const REMEMBER_ME_KEY = "moodSync_rememberMe";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isLoggedIn = Boolean(user);

  // Function to check if the stored token is valid
  const checkAuthStatus = async (): Promise<boolean> => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      return false;
    }

    try {
      // You can create an endpoint in your backend to validate tokens
      // This is a simple example - adjust according to your API
      const response = await axios.get("http://127.0.0.1:8000/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If the request is successful, the token is valid
      if (response.status === 200) {
        // If we have stored user data, restore it
        const storedUserJSON = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUserJSON) {
          try {
            const storedUser = JSON.parse(storedUserJSON);
            setUser(storedUser);
          } catch (error) {
            console.error("Failed to parse stored user data:", error);
            // Clear invalid data
            localStorage.removeItem(USER_STORAGE_KEY);
            return false;
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token validation failed:", error);
      // If the token is invalid or expired, clear it
      if (localStorage.getItem(REMEMBER_ME_KEY) !== "true") {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
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

      // If we have a token and remember me is on, or if we have a token and valid user data
      if (token && (rememberMe || storedUserJSON)) {
        if (storedUserJSON) {
          try {
            const storedUser = JSON.parse(storedUserJSON);
            setUser(storedUser);
            // Skip token validation if we have good user data and remember me
            if (rememberMe) {
              setIsInitialized(true);
              return;
            }
          } catch (error) {
            console.error("Failed to parse stored user data:", error);
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        }

        // Validate token if needed
        try {
          const isValid = await checkAuthStatus();
          if (!isValid) {
            setUser(null);
            if (!rememberMe) {
              localStorage.removeItem(TOKEN_STORAGE_KEY);
              localStorage.removeItem(USER_STORAGE_KEY);
            }
          }
        } catch (error) {
          console.error("Error during token validation:", error);
          setUser(null);
        }
      } else {
        // No token or remember me is off
        setUser(null);
      }

      setIsInitialized(true);
    };

    initAuth();
  }, []);

  const login = (user: User, rememberMe: boolean = false) => {
    setUser(user);

    // Store user data in localStorage if rememberMe is true
    if (rememberMe) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(REMEMBER_ME_KEY, "true");
    } else {
      // If rememberMe is false, we still keep the user data for the session
      // but we mark that we don't want to remember between browser sessions
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(REMEMBER_ME_KEY, "false");
    }
  };

  const logout = () => {
    setUser(null);

    // Clear stored data
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);

    // Redirect to login page can be handled in the component that calls logout
  };

  // Expose the isInitialized state to allow components to know when auth check is complete
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        checkAuthStatus,
        isInitialized,
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
