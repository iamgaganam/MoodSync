import axios from "axios";

const API_URL = "/api/activities";

export interface ActivityData {
  title: string;
  description?: string;
  date: Date;
  time: string;
  category?: "therapy" | "mindfulness" | "checkup" | "other";
  isCompleted?: boolean;
}

export interface Activity extends ActivityData {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Creates a new activity
 */
export const createActivity = async (
  activityData: ActivityData
): Promise<Activity> => {
  const response = await axios.post(API_URL, activityData);
  return response.data;
};

/**
 * Retrieves activities with optional date filtering
 */
export const getActivities = async (
  startDate?: Date,
  endDate?: Date
): Promise<Activity[]> => {
  let url = API_URL;
  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate.toISOString());
  }
  if (endDate) {
    params.append("endDate", endDate.toISOString());
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await axios.get(url);
  return response.data;
};

/**
 * Updates an existing activity
 */
export const updateActivity = async (
  activityId: string,
  activityData: Partial<ActivityData>
): Promise<Activity> => {
  const response = await axios.put(`${API_URL}/${activityId}`, activityData);
  return response.data;
};

/**
 * Deletes an activity
 */
export const deleteActivity = async (activityId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${activityId}`);
};
