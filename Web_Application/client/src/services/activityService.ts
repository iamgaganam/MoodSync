// client/src/services/activityService.ts
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

export const createActivity = async (
  activityData: ActivityData
): Promise<Activity> => {
  const response = await axios.post(API_URL, activityData);
  return response.data;
};

export const getActivities = async (
  startDate?: Date,
  endDate?: Date
): Promise<Activity[]> => {
  let url = API_URL;

  if (startDate || endDate) {
    url += "?";
    if (startDate) {
      url += `startDate=${startDate.toISOString()}`;
    }
    if (endDate) {
      url += startDate
        ? `&endDate=${endDate.toISOString()}`
        : `endDate=${endDate.toISOString()}`;
    }
  }

  const response = await axios.get(url);
  return response.data;
};

export const updateActivity = async (
  activityId: string,
  activityData: Partial<ActivityData>
): Promise<Activity> => {
  const response = await axios.put(`${API_URL}/${activityId}`, activityData);
  return response.data;
};

export const deleteActivity = async (activityId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${activityId}`);
};
