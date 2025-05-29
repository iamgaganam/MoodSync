import axios from "axios";

/**
 * Sets up global axios interceptors for authentication and error handling
 */
const setupAxiosInterceptors = (): void => {
  // Request interceptor - adds auth token to all requests
  axios.interceptors.request.use(
    (config) => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handles authentication errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear tokens and redirect to login on unauthorized access
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
