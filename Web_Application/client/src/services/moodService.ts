import axios from "axios";

const API_URL = "/api/mood";

export interface MoodEntry {
  _id?: string;
  userId?: string;
  mood: string;
  score: number;
  note: string;
  date: Date | string;
  createdAt?: Date | string;
}

export interface MoodStats {
  currentMood: MoodEntry | null;
  streak: number;
  avgScore: number;
  scoreChange: number;
}

/**
 * Retrieves mood entries for the current user
 * @param limit
 */
export const getMoodEntries = async (limit?: number): Promise<MoodEntry[]> => {
  try {
    const params = limit ? { limit } : {};
    const response = await axios.get(`${API_URL}/entries`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    throw error;
  }
};

/**
 * Creates a new mood entry
 */
export const createMoodEntry = async (moodData: {
  mood: string;
  score: number;
  note: string;
}): Promise<{ moodEntry: MoodEntry; recentEntries: MoodEntry[] }> => {
  try {
    const response = await axios.post(`${API_URL}/entries`, moodData);
    return response.data;
  } catch (error) {
    console.error("Error creating mood entry:", error);
    throw error;
  }
};

/**
 * Retrieves mood statistics for the current user
 */
export const getMoodStats = async (): Promise<MoodStats> => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching mood stats:", error);
    throw error;
  }
};

/**
 * Updates an existing mood entry
 */
export const updateMoodEntry = async (
  id: string,
  moodData: { mood: string; score: number; note: string }
): Promise<MoodEntry> => {
  try {
    const response = await axios.put(`${API_URL}/entries/${id}`, moodData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating mood entry:", error);
    throw error;
  }
};

/**
 * Deletes a mood entry
 */
export const deleteMoodEntry = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/entries/${id}`);
  } catch (error) {
    console.error("Error deleting mood entry:", error);
    throw error;
  }
};

export default {
  getMoodEntries,
  createMoodEntry,
  getMoodStats,
  updateMoodEntry,
  deleteMoodEntry,
};
