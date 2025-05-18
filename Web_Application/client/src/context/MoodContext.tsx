// client/src/context/MoodContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getMoodEntries,
  createMoodEntry,
  getMoodStats,
  MoodEntry,
  MoodStats,
} from "../services/moodService";

interface MoodContextProps {
  moodEntries: MoodEntry[];
  isLoading: boolean;
  error: string | null;
  stats: MoodStats | null;
  refreshMoodData: () => Promise<void>;
  logMood: (mood: string, score: number, note: string) => Promise<void>;
}

const MoodContext = createContext<MoodContextProps | undefined>(undefined);

export const MoodProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MoodStats | null>(null);

  const refreshMoodData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch mood entries and stats in parallel
      const [entries, moodStats] = await Promise.all([
        getMoodEntries(),
        getMoodStats(),
      ]);

      setMoodEntries(entries);
      setStats(moodStats);
    } catch (err) {
      setError("Failed to fetch mood data. Please try again.");
      console.error("Error in refreshMoodData:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logMood = async (mood: string, score: number, note: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { recentEntries } = await createMoodEntry({ mood, score, note });

      // Update state with new entries and refresh stats
      setMoodEntries(recentEntries);

      // Get updated stats after logging mood
      const moodStats = await getMoodStats();
      setStats(moodStats);

      return Promise.resolve();
    } catch (err) {
      setError("Failed to log mood. Please try again.");
      console.error("Error in logMood:", err);
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    refreshMoodData();
  }, []);

  return (
    <MoodContext.Provider
      value={{
        moodEntries,
        isLoading,
        error,
        stats,
        refreshMoodData,
        logMood,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
};
