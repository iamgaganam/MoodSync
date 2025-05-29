import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios, { AxiosError } from "axios";

export interface User {
  id?: string;
  name: string;
  email: string;
  role?: string;
  mobileNumber?: string;
  emergencyContact?: string;
  profileImage?: string;
  specialization?: string; // Doctor specific
  hospital?: string; // Doctor specific
  status?: "active" | "inactive";
  lastActive?: Date;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isInitialized: boolean;
  login: (
    user: User,
    token: string,
    refreshToken: string,
    rememberMe?: boolean
  ) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  getToken: () => string | null;
  updateUserStatus: (status: "active" | "inactive") => void;
}

// Storage keys constants
const STORAGE_KEYS = {
  USER: "moodSync_user",
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  REMEMBER_ME: "moodSync_rememberMe",
} as const;

// API configuration
const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
  ENDPOINTS: {
    REFRESH_TOKEN: "/auth/refresh-token",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    USER_STATUS: "/users/status",
  },
} as const;

// Error messages
const ERROR_MESSAGES = {
  CONTEXT_ERROR: "useAuth must be used within an AuthProvider",
  TOKEN_REFRESH_FAILED: "Token refresh failed",
  STATUS_UPDATE_FAILED: "Failed to update user status",
} as const;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage utility functions
const storage = {
  get: (key: string): string | null => localStorage.getItem(key),
  set: (key: string, value: string): void => localStorage.setItem(key, value),
  remove: (key: string): void => localStorage.removeItem(key),
  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isLoggedIn = Boolean(user);

  const getToken = useCallback((): string | null => {
    return storage.get(STORAGE_KEYS.TOKEN);
  }, []);

  const createAuthHeaders = useCallback(
    (token: string) => ({
      Authorization: `Bearer ${token}`,
    }),
    []
  );

  const parseStoredUser = useCallback((userJSON: string): User | null => {
    try {
      return JSON.parse(userJSON);
    } catch (error) {
      console.error("Failed to parse stored user data:", error);
      storage.remove(STORAGE_KEYS.USER);
      return null;
    }
  }, []);

  const updateUserInStorage = useCallback((userData: User): void => {
    storage.set(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const updateUserStatus = useCallback(
    async (status: "active" | "inactive"): Promise<void> => {
      if (!user) return;

      try {
        const token = getToken();
        if (!token) return;

        await axios.patch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_STATUS}`,
          { status },
          { headers: createAuthHeaders(token) }
        );

        setUser((prevUser) => (prevUser ? { ...prevUser, status } : null));
      } catch (error) {
        console.error(ERROR_MESSAGES.STATUS_UPDATE_FAILED, error);
      }
    },
    [user, getToken, createAuthHeaders]
  );

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = storage.get(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshTokenValue) {
        logout();
        return false;
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`,
        { refreshToken: refreshTokenValue }
      );

      if (response.data.success) {
        storage.set(STORAGE_KEYS.TOKEN, response.data.token);
        return true;
      }

      logout();
      return false;
    } catch (error) {
      console.error(ERROR_MESSAGES.TOKEN_REFRESH_FAILED, error);
      logout();
      return false;
    }
  }, []);

  const fetchUserProfile = useCallback(
    async (token: string): Promise<User | null> => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ME}`,
          { headers: createAuthHeaders(token) }
        );

        if (response.data.success) {
          const userData = response.data.user;
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            mobileNumber: userData.mobileNumber,
            emergencyContact: userData.emergencyContact,
            profileImage: userData.profileImage,
            specialization: userData.specialization,
            hospital: userData.hospital,
            status: userData.status || "inactive",
            lastActive: userData.lastActive,
          };
        }
        return null;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        return null;
      }
    },
    [createAuthHeaders]
  );

  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      const userData = await fetchUserProfile(token);
      if (userData) {
        updateUserInStorage(userData);
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const refreshSuccessful = await refreshToken();
        if (refreshSuccessful) {
          return checkAuthStatus(); // Retry with new token
        }
      }

      // Clear storage if "Remember Me" is not enabled
      if (storage.get(STORAGE_KEYS.REMEMBER_ME) !== "true") {
        storage.clear();
      }
      return false;
    }
  }, [getToken, fetchUserProfile, updateUserInStorage, refreshToken]);

  const login = useCallback(
    (
      userData: User,
      token: string,
      refreshTokenValue: string,
      rememberMe: boolean = false
    ): void => {
      const userWithStatus: User = { ...userData, status: "active" };

      updateUserInStorage(userWithStatus);
      storage.set(STORAGE_KEYS.TOKEN, token);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshTokenValue);
      storage.set(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
    },
    [updateUserInStorage]
  );

  const logout = useCallback((): void => {
    // Update status to inactive before logout
    if (user) {
      updateUserStatus("inactive");
    }

    // Call logout API
    const token = getToken();
    if (token) {
      axios
        .post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`,
          {},
          { headers: createAuthHeaders(token) }
        )
        .catch((error) => console.error("Logout API error:", error));
    }

    setUser(null);
    storage.clear();
  }, [user, updateUserStatus, getToken, createAuthHeaders]);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      const rememberMe = storage.get(STORAGE_KEYS.REMEMBER_ME) === "true";
      const token = getToken();
      const storedUserJSON = storage.get(STORAGE_KEYS.USER);

      if (token && (rememberMe || storedUserJSON)) {
        if (storedUserJSON) {
          const storedUser = parseStoredUser(storedUserJSON);
          if (storedUser) {
            setUser(storedUser);
            await checkAuthStatus(); // Validate and refresh user data
          }
        } else {
          const isValid = await checkAuthStatus();
          if (!isValid && !rememberMe) {
            storage.remove(STORAGE_KEYS.TOKEN);
            storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
          }
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, [getToken, parseStoredUser, checkAuthStatus]);

  // Handle user status updates
  useEffect(() => {
    if (isLoggedIn && user) {
      updateUserStatus("active");
    }

    return () => {
      if (isLoggedIn && user) {
        updateUserStatus("inactive");
      }
    };
  }, [isLoggedIn, user, updateUserStatus]);

  const contextValue: AuthContextType = {
    isLoggedIn,
    user,
    isInitialized,
    login,
    logout,
    checkAuthStatus,
    refreshToken,
    getToken,
    updateUserStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(ERROR_MESSAGES.CONTEXT_ERROR);
  }

  return context;
};

export default AuthContext;
