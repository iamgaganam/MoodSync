// client/src/services/moodService.ts
import axios from "axios";

const API_URL = "/api/moods";

export interface MoodData {
  mood: "happy" | "neutral" | "sad";
  score?: number;
  note?: string;
  date?: Date;
}

export interface MoodEntry extends MoodData {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodStats {
  totalEntries: number;
  averageScore: number;
  moodCounts: {
    happy: number;
    neutral: number;
    sad: number;
  };
  trend: "up" | "down" | "neutral";
}

export const createMoodEntry = async (
  moodData: MoodData
): Promise<MoodEntry> => {
  const response = await axios.post(API_URL, moodData);
  return response.data;
};

export const getMoodEntries = async (
  limit: number = 10
): Promise<MoodEntry[]> => {
  const response = await axios.get(`${API_URL}?limit=${limit}`);
  return response.data;
};

export const getMoodStatistics = async (): Promise<MoodStats> => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};
