// client/src/services/protectedService.ts

import axios from "axios";

export async function getProtectedData() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const response = await axios.get("http://127.0.0.1:8000/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Protected data:", response.data);
  } catch (err) {
    console.error("Failed to fetch protected data", err);
  }
}
