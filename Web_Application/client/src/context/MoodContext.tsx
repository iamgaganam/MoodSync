import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  getMoodEntries,
  createMoodEntry,
  getMoodStats,
  MoodEntry,
  MoodStats,
} from "../services/moodService";

// Error messages constants
const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch mood data. Please try again.",
  LOG_FAILED: "Failed to log mood. Please try again.",
  PROVIDER_ERROR: "useMood must be used within a MoodProvider",
} as const;

interface MoodContextProps {
  moodEntries: MoodEntry[];
  isLoading: boolean;
  error: string | null;
  stats: MoodStats | null;
  refreshMoodData: () => Promise<void>;
  logMood: (mood: string, score: number, note: string) => Promise<void>;
  clearError: () => void;
}

const MoodContext = createContext<MoodContextProps | undefined>(undefined);

export const MoodProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MoodStats | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshMoodData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const [entries, moodStats] = await Promise.all([
        getMoodEntries(),
        getMoodStats(),
      ]);

      setMoodEntries(entries);
      setStats(moodStats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.FETCH_FAILED;
      setError(errorMessage);
      console.error("Error refreshing mood data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logMood = useCallback(
    async (mood: string, score: number, note: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const { recentEntries } = await createMoodEntry({ mood, score, note });
        setMoodEntries(recentEntries);

        const updatedStats = await getMoodStats();
        setStats(updatedStats);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : ERROR_MESSAGES.LOG_FAILED;
        setError(errorMessage);
        console.error("Error logging mood:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Load initial data on mount
  useEffect(() => {
    refreshMoodData();
  }, [refreshMoodData]);

  const contextValue: MoodContextProps = {
    moodEntries,
    isLoading,
    error,
    stats,
    refreshMoodData,
    logMood,
    clearError,
  };

  return (
    <MoodContext.Provider value={contextValue}>{children}</MoodContext.Provider>
  );
};

export const useMood = (): MoodContextProps => {
  const context = useContext(MoodContext);

  if (context === undefined) {
    throw new Error(ERROR_MESSAGES.PROVIDER_ERROR);
  }

  return context;
};
