// src/services/apiService.ts
import axios from "axios";

// API base URL - can be overridden by environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create a function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create a function to refresh the token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    }

    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token
      const newToken = await refreshAccessToken();

      if (newToken) {
        // Update the header and retry the request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // If refresh failed, clear storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("moodSync_user");

      // Redirect can be handled by the component that receives the error
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// User API methods
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: any) => api.put("/users/profile", data),
  uploadProfileImage: (formData: FormData) =>
    api.post("/users/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// Auth API methods
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
  register: (userData: any) => api.post("/auth/register", userData),
  refreshToken: (refreshToken: string) =>
    api.post("/auth/refresh-token", { refreshToken }),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
};

export default api;
