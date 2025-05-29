import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

const refreshAccessToken = async (): Promise<string | null> => {
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

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor with typing
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor with typing
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // Clear storage on refresh failure
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("moodSync_user");

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

interface AuthCredentials {
  email: string;
  password: string;
}

interface UserData {
  name?: string;
  email?: string;
  mobileNumber?: string;
  emergencyContact?: string;
  [key: string]: any;
}

export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: UserData) => api.put("/users/profile", data),
  uploadProfileImage: (formData: FormData) =>
    api.post("/users/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export const authAPI = {
  login: (credentials: AuthCredentials) => api.post("/auth/login", credentials),
  register: (userData: UserData) => api.post("/auth/register", userData),
  refreshToken: (refreshToken: string) =>
    api.post("/auth/refresh-token", { refreshToken }),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
};

export default api;
