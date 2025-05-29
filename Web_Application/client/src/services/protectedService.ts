import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Fetches protected data requiring authentication
 * @returns Promise with protected data
 * @throws Error if not authenticated or request fails
 */
export async function getProtectedData() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch protected data:", error);
    throw error;
  }
}
