import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  PieChart,
  Line,
  Area,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  MessageSquare,
  Brain,
  Download,
  PieChart as PieChartIcon,
  ChevronDown,
  Clock,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  X,
  Info,
  Search,
  Sun,
  FileText,
  Bookmark,
  ChevronRight,
  BarChart2,
  Heart,
  Smile,
  Frown,
  Meh,
  AlertOctagon,
  ArrowUp,
  ArrowDown,
  Calendar as CalendarIcon,
  MessageCircle,
  HelpCircle,
  Lightbulb,
  Book,
  PhoneCall,
  User,
  Users,
  ThumbsUp,
  RefreshCw,
  Star,
  Settings,
  Moon,
  Coffee,
  ExternalLink,
  Bell,
} from "lucide-react";
import html2pdf from "html2pdf.js";

// Import components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Custom icon components
const Eye = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const BookOpen = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

// Emotion types for better typing
type EmotionType = "happy" | "sad" | "anxious" | "calm" | "angry" | "neutral";
type SentimentType = "Positive" | "Negative" | "Neutral";

// Type for mood data
interface MoodEntry {
  date: string;
  mood: number;
  emotion: string;
  note: string;
}

// Type for sentiment data
interface SentimentEntry {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

// Type for sentiment distribution
interface SentimentDistribution {
  name: string;
  value: number;
  color: string;
}

// Type for emotion distribution
interface EmotionDistribution {
  name: string;
  value: number;
  color: string;
}

// Type for journal entries
interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  sentiment: SentimentType;
  emotions: string[];
  tags: string[];
  sentimentScore: number;
}

// Type for mental health resources
interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  icon: React.ReactNode;
}

// Type for coping strategies
interface CopingStrategy {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

// Initialize localStorage mock data if not exists
const initializeLocalStorage = () => {
  // Check if mood data exists in localStorage
  if (!localStorage.getItem("moodData")) {
    localStorage.setItem("moodData", JSON.stringify(defaultMoodData));
  }

  // Check if sentiment data exists in localStorage
  if (!localStorage.getItem("sentimentData")) {
    localStorage.setItem("sentimentData", JSON.stringify(defaultSentimentData));
  }

  // Check if journal entries exist in localStorage
  if (!localStorage.getItem("journalEntries")) {
    localStorage.setItem(
      "journalEntries",
      JSON.stringify(defaultJournalEntries)
    );
  }

  // Check if sentiment distribution exists in localStorage
  if (!localStorage.getItem("sentimentDistribution")) {
    localStorage.setItem(
      "sentimentDistribution",
      JSON.stringify(defaultSentimentDistribution)
    );
  }

  // Check if emotion distribution exists in localStorage
  if (!localStorage.getItem("emotionDistribution")) {
    localStorage.setItem(
      "emotionDistribution",
      JSON.stringify(defaultEmotionDistribution)
    );
  }
};

// Default data
const defaultMoodData: MoodEntry[] = [
  {
    date: "2025-05-15",
    mood: 5,
    emotion: "anxious",
    note: "Worried about deadline",
  },
  { date: "2025-05-16", mood: 7, emotion: "calm", note: "Relaxed evening" },
  { date: "2025-05-17", mood: 3, emotion: "sad", note: "Missing friends" },
  { date: "2025-05-18", mood: 6, emotion: "neutral", note: "Average day" },
  {
    date: "2025-05-19",
    mood: 4,
    emotion: "angry",
    note: "Frustrated with traffic",
  },
  { date: "2025-05-20", mood: 9, emotion: "happy", note: "Got great news!" },
  {
    date: "2025-05-21",
    mood: 7,
    emotion: "calm",
    note: "Peaceful morning meditation",
  },
];

// Sample data for sentiment analysis over time
const defaultSentimentData: SentimentEntry[] = [
  { date: "2025-05-15", positive: 60, neutral: 25, negative: 15 },
  { date: "2025-05-16", positive: 65, neutral: 20, negative: 15 },
  { date: "2025-05-17", positive: 40, neutral: 30, negative: 30 },
  { date: "2025-05-18", positive: 55, neutral: 35, negative: 10 },
  { date: "2025-05-19", positive: 45, neutral: 25, negative: 30 },
  { date: "2025-05-20", positive: 85, neutral: 10, negative: 5 },
  { date: "2025-05-21", positive: 70, neutral: 20, negative: 10 },
];

// Current sentiment distribution
const defaultSentimentDistribution: SentimentDistribution[] = [
  { name: "Positive", value: 65, color: "#4ade80" },
  { name: "Neutral", value: 25, color: "#facc15" },
  { name: "Negative", value: 10, color: "#f87171" },
];

// Sample emotion distribution
const defaultEmotionDistribution: EmotionDistribution[] = [
  { name: "Happy", value: 42, color: "#4ade80" },
  { name: "Calm", value: 28, color: "#60a5fa" },
  { name: "Neutral", value: 15, color: "#d1d5db" },
  { name: "Anxious", value: 8, color: "#fbbf24" },
  { name: "Sad", value: 5, color: "#3b82f6" },
  { name: "Angry", value: 2, color: "#ef4444" },
];

// Sample journal entries
const defaultJournalEntries: JournalEntry[] = [
  {
    id: "j001",
    date: "2025-05-21",
    title: "Productive day at work",
    content:
      "Today was incredibly productive. I finished my project ahead of schedule and received positive feedback from my team lead. I'm feeling accomplished and satisfied with my work output. The weather was nice too which helped my mood.",
    sentiment: "Positive",
    emotions: ["happy", "calm"],
    tags: ["work", "accomplishment"],
    sentimentScore: 0.85,
  },
  {
    id: "j002",
    date: "2025-05-20",
    title: "Mixed feelings about upcoming event",
    content:
      "I'm both excited and nervous about the presentation tomorrow. I've prepared well, but there's always that lingering anxiety. Trying to focus on the positives and remember that I know this material well. Did some deep breathing exercises to stay centered.",
    sentiment: "Neutral",
    emotions: ["anxious", "neutral"],
    tags: ["work", "presentation", "anxiety"],
    sentimentScore: 0.55,
  },
  {
    id: "j003",
    date: "2025-05-19",
    title: "Difficult conversation with friend",
    content:
      "Had a challenging talk with my friend today about our recent misunderstanding. It was tough at first but ended up being constructive. We both expressed our feelings openly and came to a better understanding. Feeling a bit drained emotionally but also relieved.",
    sentiment: "Neutral",
    emotions: ["sad", "calm"],
    tags: ["friendship", "conflict", "resolution"],
    sentimentScore: 0.48,
  },
  {
    id: "j004",
    date: "2025-05-18",
    title: "Feeling overwhelmed with workload",
    content:
      "Today was quite stressful as deadlines are piling up. I'm struggling to manage my time effectively and feeling the pressure. Need to re-evaluate my priorities and perhaps talk to my supervisor about realistic timelines.",
    sentiment: "Negative",
    emotions: ["anxious", "angry"],
    tags: ["work", "stress", "time-management"],
    sentimentScore: 0.25,
  },
  {
    id: "j005",
    date: "2025-05-17",
    title: "Great hike with friends",
    content:
      "Spent the day hiking with friends at the local trail. The weather was perfect and the views were breathtaking. These moments of connection with nature and friends are so rejuvenating. Feeling grateful and refreshed.",
    sentiment: "Positive",
    emotions: ["happy", "calm"],
    tags: ["friends", "nature", "exercise"],
    sentimentScore: 0.92,
  },
];

// Mental health resources
const mentalHealthResources: Resource[] = [
  {
    id: "r001",
    title: "National Institute of Mental Health",
    description:
      "Government organization providing information about mental illnesses and disorders.",
    url: "https://www.nimh.nih.gov",
    type: "Information",
    icon: <Info className="w-5 h-5" />,
  },
  {
    id: "r002",
    title: "Crisis Text Line",
    description: "Text HOME to 741741 to connect with a Crisis Counselor.",
    url: "https://www.crisistextline.org",
    type: "Crisis",
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    id: "r003",
    title: "Therapy and Counseling Finder",
    description: "Search for therapists and counselors in your area.",
    url: "https://www.psychologytoday.com/us/therapists",
    type: "Professional",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "r004",
    title: "Mindfulness Meditation App",
    description: "Practice mindfulness and meditation with guided sessions.",
    url: "https://www.headspace.com",
    type: "Self-Help",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: "r005",
    title: "Mental Health Support Groups",
    description: "Find support groups for various mental health issues.",
    url: "https://www.nami.org/Support-Education/Support-Groups",
    type: "Support",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "r006",
    title: "National Suicide Prevention Lifeline",
    description: "Call 988 for 24/7 support if you're in crisis.",
    url: "https://988lifeline.org",
    type: "Crisis",
    icon: <PhoneCall className="w-5 h-5" />,
  },
];

// Coping strategies
const copingStrategies: CopingStrategy[] = [
  {
    id: "cs001",
    title: "Deep Breathing",
    description:
      "Inhale deeply through your nose for 4 counts, hold for 7, exhale through mouth for 8.",
    icon: <Sun className="w-6 h-6 text-blue-500" />,
    category: "Relaxation",
  },
  {
    id: "cs002",
    title: "5-4-3-2-1 Grounding",
    description:
      "Acknowledge 5 things you see, 4 you touch, 3 you hear, 2 you smell, and 1 you taste.",
    icon: <Bookmark className="w-6 h-6 text-green-500" />,
    category: "Anxiety Relief",
  },
  {
    id: "cs003",
    title: "Progressive Muscle Relaxation",
    description:
      "Tense and then relax each muscle group, starting from toes and moving upward.",
    icon: <Moon className="w-6 h-6 text-purple-500" />,
    category: "Relaxation",
  },
  {
    id: "cs004",
    title: "Journaling",
    description:
      "Write down your thoughts, feelings, and experiences without judgment.",
    icon: <Book className="w-6 h-6 text-yellow-500" />,
    category: "Emotional Processing",
  },
  {
    id: "cs005",
    title: "Physical Exercise",
    description: "Even a short walk can help reduce stress and improve mood.",
    icon: <Heart className="w-6 h-6 text-red-500" />,
    category: "Physical",
  },
  {
    id: "cs006",
    title: "Positive Affirmations",
    description:
      "Repeat encouraging statements like 'I am capable' or 'This will pass'.",
    icon: <ThumbsUp className="w-6 h-6 text-blue-500" />,
    category: "Mindset",
  },
  {
    id: "cs007",
    title: "Mindful Observation",
    description:
      "Focus completely on one object, noticing every detail without judgment.",
    icon: <Eye className="w-6 h-6 text-indigo-500" />,
    category: "Mindfulness",
  },
  {
    id: "cs008",
    title: "Gratitude Practice",
    description: "List three things you're grateful for, no matter how small.",
    icon: <Star className="w-6 h-6 text-yellow-500" />,
    category: "Positivity",
  },
];

// Interface for sentiment analysis result
interface SentimentAnalysisResult {
  sentiment: SentimentType;
  score: number;
  confidence: number;
  emotions: string[];
  keyPhrases: string[];
  entities: string[];
}

// Function to analyze sentiment from text input
const analyzeSentiment = (text: string): SentimentAnalysisResult | null => {
  if (!text.trim()) return null;

  // List of positive, negative, and neutral words for basic sentiment analysis
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "happy",
    "joy",
    "joyful",
    "love",
    "loved",
    "like",
    "positive",
    "beautiful",
    "excited",
    "exciting",
    "accomplished",
    "achievement",
    "success",
    "successful",
    "win",
    "won",
    "grateful",
    "thankful",
    "appreciate",
    "appreciated",
    "perfect",
    "glad",
    "fantastic",
    "awesome",
    "brilliant",
    "delighted",
    "enjoy",
    "enjoyed",
    "hope",
    "hopeful",
    "peaceful",
    "calm",
    "relaxed",
    "relaxing",
    "satisfied",
  ];

  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "sad",
    "unhappy",
    "angry",
    "mad",
    "upset",
    "disappointed",
    "disappointing",
    "hate",
    "dislike",
    "negative",
    "anxious",
    "anxiety",
    "worried",
    "worry",
    "fear",
    "scared",
    "afraid",
    "stressed",
    "stress",
    "frustrating",
    "frustrated",
    "annoyed",
    "annoying",
    "exhausted",
    "tired",
    "pain",
    "painful",
    "hurt",
    "fail",
    "failed",
    "failure",
    "problem",
    "difficult",
    "hard",
    "trouble",
    "struggle",
    "struggling",
    "unfortunate",
    "unfortunate",
    "depressed",
    "depression",
    "lonely",
    "alone",
  ];

  const neutralWords = [
    "ok",
    "okay",
    "fine",
    "alright",
    "so-so",
    "average",
    "normal",
    "neutral",
    "moderate",
    "medium",
    "common",
    "usual",
    "regular",
    "standard",
    "ordinary",
    "typical",
    "expected",
    "routine",
    "everyday",
    "common",
    "balanced",
  ];

  // Tokenize the input text
  const tokens = text.toLowerCase().match(/\b(\w+)\b/g) || [];

  // Count occurrences of positive, negative, and neutral words
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  const foundPositive: string[] = [];
  const foundNegative: string[] = [];
  const foundNeutral: string[] = [];

  tokens.forEach((token) => {
    if (positiveWords.includes(token)) {
      positiveCount++;
      if (!foundPositive.includes(token)) foundPositive.push(token);
    } else if (negativeWords.includes(token)) {
      negativeCount++;
      if (!foundNegative.includes(token)) foundNegative.push(token);
    } else if (neutralWords.includes(token)) {
      neutralCount++;
      if (!foundNeutral.includes(token)) foundNeutral.push(token);
    }
  });

  // Calculate total sentiment words
  const totalSentimentWords = positiveCount + negativeCount + neutralCount;

  // If no sentiment words found, return neutral
  if (totalSentimentWords === 0) {
    return {
      sentiment: "Neutral",
      score: 0.5,
      confidence: 0.3, // Lower confidence since no sentiment words found
      emotions: ["neutral"],
      keyPhrases: [],
      entities: extractEntities(text),
    };
  }

  // Calculate percentages
  const positivePercentage = positiveCount / totalSentimentWords;
  const negativePercentage = negativeCount / totalSentimentWords;
  const neutralPercentage = neutralCount / totalSentimentWords;

  // Determine overall sentiment
  let sentiment: SentimentType;
  let score: number;
  let confidence: number;
  let emotions: string[] = [];

  // Logic for sentiment determination
  if (positivePercentage > 0.6) {
    sentiment = "Positive";
    score = 0.5 + positivePercentage / 2; // Scale to 0.5-1.0
    confidence = 0.5 + positivePercentage / 2;
    emotions = ["happy", "calm"];
  } else if (negativePercentage > 0.6) {
    sentiment = "Negative";
    score = 0.5 - negativePercentage / 2; // Scale to 0.0-0.5
    confidence = 0.5 + negativePercentage / 2;
    emotions = ["sad", "anxious"];
  } else {
    sentiment = "Neutral";
    score = 0.5;
    confidence = Math.max(neutralPercentage, 0.4); // At least 0.4 confidence
    emotions = ["neutral"];

    // Add secondary emotion if there's some positive or negative
    if (positivePercentage > negativePercentage && positivePercentage > 0.3) {
      emotions.push("happy");
    } else if (
      negativePercentage > positivePercentage &&
      negativePercentage > 0.3
    ) {
      emotions.push("anxious");
    }
  }

  // Extract key phrases (simplified version)
  const keyPhrases = [
    ...foundPositive,
    ...foundNegative,
    ...foundNeutral,
  ].slice(0, 5);

  return {
    sentiment,
    score,
    confidence,
    emotions,
    keyPhrases,
    entities: extractEntities(text),
  };
};

// Simple entity extraction function
const extractEntities = (text: string): string[] => {
  // In a real implementation, this would use NER models
  // This is a very simplified version that looks for capitalized words
  const potentialEntities = text.match(/\b[A-Z][a-z]*\b/g) || [];
  return [...new Set(potentialEntities)].slice(0, 5); // Get unique entities
};

// Update local data after sentiment analysis
const updateLocalDataAfterAnalysis = (
  analysisResult: SentimentAnalysisResult | null
): void => {
  // Only update if we have valid analysis results
  if (!analysisResult) return;

  try {
    // Update sentiment distribution
    const currentDistribution = JSON.parse(
      localStorage.getItem("sentimentDistribution") || "[]"
    ) as SentimentDistribution[];
    const updatedDistribution = [...currentDistribution];

    // Find and update the sentiment that matches the analysis result
    const sentimentIndex = updatedDistribution.findIndex(
      (item) => item.name === analysisResult.sentiment
    );
    if (sentimentIndex !== -1) {
      // Increase the matching sentiment by a small random amount
      const currentValue = updatedDistribution[sentimentIndex].value;
      const increase = Math.floor(Math.random() * 5) + 2; // Random increase between 2-6%

      // Calculate how much to decrease the other sentiments
      const totalOthers = updatedDistribution.length - 1;
      const decreasePerOther = Math.floor(increase / totalOthers);

      // Update the values
      updatedDistribution.forEach((item, index) => {
        if (index === sentimentIndex) {
          item.value = Math.min(currentValue + increase, 100); // Cap at 100%
        } else {
          item.value = Math.max(item.value - decreasePerOther, 0); // Don't go below 0
        }
      });

      // Normalize to ensure total is 100%
      const total = updatedDistribution.reduce(
        (sum, item) => sum + item.value,
        0
      );
      if (total !== 100) {
        const factor = 100 / total;
        updatedDistribution.forEach((item) => {
          item.value = Math.round(item.value * factor);
        });
      }

      // Save updated distribution
      localStorage.setItem(
        "sentimentDistribution",
        JSON.stringify(updatedDistribution)
      );
    }

    // Update sentiment trend data
    const currentSentimentData = JSON.parse(
      localStorage.getItem("sentimentData") || "[]"
    ) as SentimentEntry[];
    const lastDataPoint = {
      ...currentSentimentData[currentSentimentData.length - 1],
    };

    // Simulate a new data point with slight changes based on analysis
    const newDataPoint: SentimentEntry = {
      date: new Date().toISOString().split("T")[0], // Today's date
      positive: lastDataPoint.positive,
      neutral: lastDataPoint.neutral,
      negative: lastDataPoint.negative,
    };

    // Adjust sentiment values based on analysis
    if (analysisResult.sentiment === "Positive") {
      newDataPoint.positive = Math.min(lastDataPoint.positive + 5, 100);
      newDataPoint.negative = Math.max(lastDataPoint.negative - 3, 0);
      newDataPoint.neutral =
        100 - newDataPoint.positive - newDataPoint.negative;
    } else if (analysisResult.sentiment === "Negative") {
      newDataPoint.negative = Math.min(lastDataPoint.negative + 5, 100);
      newDataPoint.positive = Math.max(lastDataPoint.positive - 3, 0);
      newDataPoint.neutral =
        100 - newDataPoint.positive - newDataPoint.negative;
    } else {
      newDataPoint.neutral = Math.min(lastDataPoint.neutral + 5, 100);
      const remaining = 100 - newDataPoint.neutral;
      newDataPoint.positive = Math.round(remaining * 0.7);
      newDataPoint.negative =
        100 - newDataPoint.neutral - newDataPoint.positive;
    }

    // Add new data point to the trend
    const updatedSentimentData = [
      ...currentSentimentData.slice(1),
      newDataPoint,
    ];
    localStorage.setItem("sentimentData", JSON.stringify(updatedSentimentData));

    // Update emotion distribution
    const currentEmotionDistribution = JSON.parse(
      localStorage.getItem("emotionDistribution") || "[]"
    ) as EmotionDistribution[];
    const updatedEmotionDistribution = [...currentEmotionDistribution];

    // Update emotion values based on detected emotions
    analysisResult.emotions.forEach((emotion: string) => {
      const emotionName = emotion.charAt(0).toUpperCase() + emotion.slice(1);
      const emotionIndex = updatedEmotionDistribution.findIndex(
        (item) => item.name === emotionName
      );
      if (emotionIndex !== -1) {
        // Increase this emotion
        updatedEmotionDistribution[emotionIndex].value +=
          Math.floor(Math.random() * 3) + 2;

        // Decrease others slightly
        updatedEmotionDistribution.forEach((item, idx) => {
          if (idx !== emotionIndex) {
            item.value = Math.max(item.value - 1, 0);
          }
        });
      }
    });

    // Normalize emotion distribution to 100%
    const totalEmotions = updatedEmotionDistribution.reduce(
      (sum, item) => sum + item.value,
      0
    );
    if (totalEmotions !== 100) {
      const factor = 100 / totalEmotions;
      updatedEmotionDistribution.forEach((item) => {
        item.value = Math.round(item.value * factor);
      });
    }

    localStorage.setItem(
      "emotionDistribution",
      JSON.stringify(updatedEmotionDistribution)
    );
  } catch (error) {
    console.error("Error updating local data after analysis:", error);
  }
};

// Load data from localStorage
const loadLocalData = () => {
  try {
    return {
      moodData: JSON.parse(
        localStorage.getItem("moodData") || JSON.stringify(defaultMoodData)
      ) as MoodEntry[],
      sentimentData: JSON.parse(
        localStorage.getItem("sentimentData") ||
          JSON.stringify(defaultSentimentData)
      ) as SentimentEntry[],
      journalEntries: JSON.parse(
        localStorage.getItem("journalEntries") ||
          JSON.stringify(defaultJournalEntries)
      ) as JournalEntry[],
      sentimentDistribution: JSON.parse(
        localStorage.getItem("sentimentDistribution") ||
          JSON.stringify(defaultSentimentDistribution)
      ) as SentimentDistribution[],
      emotionDistribution: JSON.parse(
        localStorage.getItem("emotionDistribution") ||
          JSON.stringify(defaultEmotionDistribution)
      ) as EmotionDistribution[],
    };
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return {
      moodData: defaultMoodData,
      sentimentData: defaultSentimentData,
      journalEntries: defaultJournalEntries,
      sentimentDistribution: defaultSentimentDistribution,
      emotionDistribution: defaultEmotionDistribution,
    };
  }
};

// Sentiment and emotion color mapping function
const getSentimentColor = (sentiment: SentimentType): string => {
  switch (sentiment) {
    case "Positive":
      return "#4ade80";
    case "Negative":
      return "#f87171";
    case "Neutral":
      return "#facc15";
    default:
      return "#d1d5db";
  }
};

const getEmotionIcon = (emotion: EmotionType): React.ReactNode => {
  switch (emotion) {
    case "happy":
      return <Smile className="w-5 h-5 text-green-500" />;
    case "sad":
      return <Frown className="w-5 h-5 text-blue-500" />;
    case "anxious":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "calm":
      return <Sun className="w-5 h-5 text-blue-400" />;
    case "angry":
      return <AlertOctagon className="w-5 h-5 text-red-500" />;
    case "neutral":
      return <Meh className="w-5 h-5 text-gray-500" />;
    default:
      return <Meh className="w-5 h-5 text-gray-500" />;
  }
};

// Date formatter
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Custom tooltip for mood chart
const CustomMoodTooltip = ({ active, payload }: any): React.ReactNode => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{formatDate(data.date)}</p>
        <p className="text-sm">
          Mood: <span className="font-medium">{data.mood}/10</span>
        </p>
        <div className="flex items-center mt-1">
          <span className="mr-2">Feeling:</span>
          {getEmotionIcon(data.emotion as EmotionType)}
          <span className="ml-1 capitalize">{data.emotion}</span>
        </div>
        {data.note && (
          <p className="text-sm mt-2 text-gray-600">
            <span className="font-medium">Note:</span> {data.note}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Function to export chart as PDF
const exportToPDF = (elementId: string, filename: string): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  const opt = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
  };

  html2pdf().set(opt).from(element).save();
};

const HealthInsightsDashboard: React.FC = () => {
  // Initialize localStorage on component mount
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  // State management
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [timeRange, setTimeRange] = useState<string>("week");
  const [showEntrySidebar, setShowEntrySidebar] = useState<boolean>(false);
  const [currentJournalEntry, setCurrentJournalEntry] =
    useState<JournalEntry | null>(null);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [textToAnalyze, setTextToAnalyze] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] =
    useState<SentimentAnalysisResult | null>(null);
  const [showUpdateNotification, setShowUpdateNotification] =
    useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string>("");

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Local data state
  const [localData, setLocalData] = useState(() => loadLocalData());

  // Date range options
  const timeRangeOptions = [
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
    { value: "quarter", label: "Last 3 Months" },
    { value: "year", label: "Last Year" },
  ];

  // Function to reload data from localStorage
  const reloadLocalData = () => {
    setLocalData(loadLocalData());
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInputValue);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchInputValue]);

  // Function to open journal entry sidebar
  const openJournalEntry = (entry: JournalEntry) => {
    setCurrentJournalEntry(entry);
    setShowEntrySidebar(true);
  };

  // Function to close journal entry sidebar
  const closeJournalEntry = () => {
    setShowEntrySidebar(false);
    setCurrentJournalEntry(null);
  };

  // Calculate summary statistics
  const calculateAverageMood = (): string => {
    const sum = localData.moodData.reduce(
      (total: number, entry: MoodEntry) => total + entry.mood,
      0
    );
    return (sum / localData.moodData.length).toFixed(1);
  };

  // Find mood trend (up or down)
  const getMoodTrend = ():
    | { direction: "up" | "down"; percentage: string }
    | undefined => {
    if (localData.moodData.length < 2) return undefined;

    const recentMoods = [...localData.moodData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    const olderMoods = [...localData.moodData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(3, 6);

    if (olderMoods.length === 0) return undefined;

    const recentAvg =
      recentMoods.reduce((total, entry) => total + entry.mood, 0) /
      recentMoods.length;
    const olderAvg =
      olderMoods.reduce((total, entry) => total + entry.mood, 0) /
      olderMoods.length;

    const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;

    return {
      direction: percentChange >= 0 ? "up" : "down",
      percentage: Math.abs(percentChange).toFixed(1),
    };
  };

  // Get primary emotion
  const getPrimaryEmotion = (): string => {
    const emotionCounts: Record<string, number> = {};

    localData.moodData.forEach((entry: MoodEntry) => {
      const emotion = entry.emotion;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    let maxCount = 0;
    let primaryEmotion = "neutral";

    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        primaryEmotion = emotion;
      }
    });

    // Capitalize first letter
    return primaryEmotion.charAt(0).toUpperCase() + primaryEmotion.slice(1);
  };

  // Handle PDF export of a chart
  const handleExportChart = (chartId: string, filename: string) => {
    exportToPDF(chartId, filename);
  };

  // Perform sentiment analysis
  const performSentimentAnalysis = () => {
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = analyzeSentiment(textToAnalyze);
      setAnalysisResult(result);

      // Update local data and show notification
      updateLocalDataAfterAnalysis(result);
      setUpdateMessage("Sentiment data updated based on analysis");
      setShowUpdateNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowUpdateNotification(false);
      }, 3000);

      // Reload data to show changes
      reloadLocalData();

      setIsAnalyzing(false);
    }, 800);
  };

  const moodTrend = getMoodTrend();
  const primaryEmotion = getPrimaryEmotion();

  // Filter journal entries based on search query and active filter
  const getFilteredJournalEntries = (
    query: string,
    filter: string = "all"
  ): JournalEntry[] => {
    return localData.journalEntries
      .filter((entry: JournalEntry) => {
        // Apply search filter
        if (!query) return true;

        const queryLower = query.toLowerCase();
        return (
          entry.title.toLowerCase().includes(queryLower) ||
          entry.content.toLowerCase().includes(queryLower) ||
          entry.tags.some((tag: string) =>
            tag.toLowerCase().includes(queryLower)
          )
        );
      })
      .filter((entry: JournalEntry) => {
        // Apply sentiment filter
        if (filter === "all") return true;
        return entry.sentiment.toLowerCase() === filter.toLowerCase();
      });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "mood":
        return <MoodTracking />;
      case "sentiment":
        return <SentimentAnalysis />;
      case "journal":
        return <JournalEntries />;
      case "resources":
        return <MentalHealthResourcesView />;
      default:
        return <DashboardOverview />;
    }
  };

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Mental Health Dashboard
        </h2>
        <div className="flex items-center mt-3 md:mt-0">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
          <button className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button
            className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={reloadLocalData}
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Avg. Mood"
          value={`${calculateAverageMood()}/10`}
          icon={<Heart className="w-5 h-5" />}
          color="#3b82f6"
          trend={moodTrend}
        />
        <SummaryCard
          title="Primary Emotion"
          value={primaryEmotion}
          icon={
            primaryEmotion === "Happy" ? (
              <Smile className="w-5 h-5" />
            ) : primaryEmotion === "Sad" ? (
              <Frown className="w-5 h-5" />
            ) : primaryEmotion === "Anxious" ? (
              <AlertCircle className="w-5 h-5" />
            ) : primaryEmotion === "Calm" ? (
              <Sun className="w-5 h-5" />
            ) : primaryEmotion === "Angry" ? (
              <AlertOctagon className="w-5 h-5" />
            ) : (
              <Meh className="w-5 h-5" />
            )
          }
          color="#10b981"
        />
        <SummaryCard
          title="Sentiment Score"
          value="72%"
          icon={<Brain className="w-5 h-5" />}
          color="#8b5cf6"
          trend={{ direction: "up", percentage: "8.5" }}
        />
        <SummaryCard
          title="Journal Entries"
          value={localData.journalEntries.length.toString()}
          icon={<FileText className="w-5 h-5" />}
          color="#f59e0b"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Mood Trend Chart */}
        <div
          id="mood-trend-chart"
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Mood Trend</h3>
            <div className="flex items-center">
              <div className="flex items-center text-sm text-gray-500 mr-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>Last 7 Days</span>
              </div>
              <button
                onClick={() =>
                  handleExportChart("mood-trend-chart", "mood_trend")
                }
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Export as PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={localData.moodData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis domain={[0, 10]} />
                <Tooltip content={<CustomMoodTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="mood"
                  fill="#bfdbfe"
                  fillOpacity={0.6}
                  stroke="#3b82f6"
                  name="Mood"
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    r: 6,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "#ffffff",
                  }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: "#ffffff" }}
                  name="Mood"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Analysis Chart */}
        <div
          id="sentiment-distribution-chart"
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Sentiment Analysis
            </h3>
            <div className="flex items-center">
              <div className="flex items-center text-sm text-gray-500 mr-2">
                <PieChartIcon className="w-4 h-4 mr-1" />
                <span>Current Distribution</span>
              </div>
              <button
                onClick={() =>
                  handleExportChart(
                    "sentiment-distribution-chart",
                    "sentiment_distribution"
                  )
                }
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Export as PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 h-64">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={localData.sentimentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {localData.sentimentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center">
              {localData.sentimentDistribution.map(
                (item: SentimentDistribution) => (
                  <div key={item.name} className="flex items-center mb-3">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-800">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}%</span>
                  </div>
                )
              )}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Sentiment Score</span>
                  <span className="font-medium">72/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "72%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Journal Entries */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Recent Journal Entries
          </h3>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
            onClick={() => setActiveTab("journal")}
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sentiment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tags
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {localData.journalEntries
                .slice(0, 3)
                .map((entry: JournalEntry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[250px]">
                        {entry.content.substring(0, 60)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          entry.sentiment === "Positive"
                            ? "bg-green-100 text-green-800"
                            : entry.sentiment === "Negative"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {entry.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {entry.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            +{entry.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => openJournalEntry(entry)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emotion Distribution */}
      <div
        id="emotion-distribution-chart"
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Emotion Distribution
          </h3>
          <div className="flex items-center">
            <div className="flex items-center text-sm text-gray-500 mr-2">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>Last 7 Days</span>
            </div>
            <button
              onClick={() =>
                handleExportChart(
                  "emotion-distribution-chart",
                  "emotion_distribution"
                )
              }
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Export as PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {localData.emotionDistribution.map((emotion: EmotionDistribution) => (
            <div
              key={emotion.name}
              className="bg-gray-50 rounded-lg p-3 text-center transition-transform hover:scale-105 hover:shadow-md"
            >
              <div
                className="w-12 h-12 flex items-center justify-center mx-auto mb-2 rounded-full transition-all duration-300 hover:shadow-inner"
                style={{ backgroundColor: `${emotion.color}20` }}
              >
                {emotion.name === "Happy" && (
                  <Smile className="w-6 h-6" style={{ color: emotion.color }} />
                )}
                {emotion.name === "Sad" && (
                  <Frown className="w-6 h-6" style={{ color: emotion.color }} />
                )}
                {emotion.name === "Anxious" && (
                  <AlertCircle
                    className="w-6 h-6"
                    style={{ color: emotion.color }}
                  />
                )}
                {emotion.name === "Calm" && (
                  <Sun className="w-6 h-6" style={{ color: emotion.color }} />
                )}
                {emotion.name === "Angry" && (
                  <AlertOctagon
                    className="w-6 h-6"
                    style={{ color: emotion.color }}
                  />
                )}
                {emotion.name === "Neutral" && (
                  <Meh className="w-6 h-6" style={{ color: emotion.color }} />
                )}
              </div>
              <h4 className="font-medium text-gray-800">{emotion.name}</h4>
              <p
                className="text-2xl font-bold"
                style={{ color: emotion.color }}
              >
                {emotion.value}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Mood Tracking Component
  const MoodTracking = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Mood Tracking
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Trend Chart */}
          <div
            id="mood-trends-extended"
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm lg:col-span-3"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Mood Trends</h3>
              <div className="flex items-center gap-2">
                <select
                  className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  {timeRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    handleExportChart(
                      "mood-trends-extended",
                      "detailed_mood_trends"
                    )
                  }
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Export as PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={localData.moodData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip content={<CustomMoodTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    fill="#bfdbfe"
                    fillOpacity={0.6}
                    stroke="#3b82f6"
                    name="Mood"
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{
                      r: 6,
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      stroke: "#ffffff",
                    }}
                    activeDot={{ r: 8, strokeWidth: 2, stroke: "#ffffff" }}
                    name="Mood"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Recent Mood Entries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[240px] overflow-y-auto pr-2">
                {localData.moodData.map((entry: MoodEntry, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-md flex items-center hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: "#e0f2fe" }}
                    >
                      <span className="text-blue-600 font-bold">
                        {entry.mood}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-800">
                          {formatDate(entry.date)}
                        </span>
                        <div className="flex items-center ml-2">
                          {getEmotionIcon(entry.emotion as EmotionType)}
                          <span className="text-xs text-gray-600 ml-1 capitalize">
                            {entry.emotion}
                          </span>
                        </div>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emotion Distribution */}
          <div
            id="emotion-distribution-detail"
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm lg:col-span-3"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Emotion Distribution
              </h3>
              <button
                onClick={() =>
                  handleExportChart(
                    "emotion-distribution-detail",
                    "emotion_distribution_detail"
                  )
                }
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Export as PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={300} height={300}>
                  <PieChart>
                    <Pie
                      data={localData.emotionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {localData.emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Emotion Breakdown</h4>

                {localData.emotionDistribution.map(
                  (emotion: EmotionDistribution) => (
                    <div key={emotion.name} className="mb-3">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: emotion.color }}
                        ></div>
                        <span className="text-sm">{emotion.name}</span>
                        <span className="text-sm font-medium ml-auto">
                          {emotion.value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${emotion.value}%`,
                            backgroundColor: emotion.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}

                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500" />
                      <span>
                        You've been feeling predominantly{" "}
                        {primaryEmotion.toLowerCase()} this week
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-0.5 text-blue-500" />
                      <span>
                        Your anxiety levels have decreased compared to last week
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sentiment Analysis Component
  const SentimentAnalysis = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Sentiment Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Input */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Analyze Text
            </h3>

            <div className="space-y-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={6}
                placeholder="Enter text to analyze sentiment..."
                value={textToAnalyze}
                onChange={(e) => setTextToAnalyze(e.target.value)}
              />

              <button
                className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center ${
                  isAnalyzing ? "opacity-75 cursor-not-allowed" : ""
                }`}
                onClick={performSentimentAnalysis}
                disabled={isAnalyzing || !textToAnalyze.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Sentiment
                  </>
                )}
              </button>

              {analysisResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Analysis Results
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">
                          Overall Sentiment:
                        </span>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            analysisResult.sentiment === "Positive"
                              ? "bg-green-100 text-green-800"
                              : analysisResult.sentiment === "Negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {analysisResult.sentiment}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">
                        Sentiment Score:
                      </span>
                      <div className="mt-1 relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                              {Math.round(analysisResult.score * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex h-2 overflow-hidden text-xs bg-blue-200 rounded">
                          <div
                            style={{ width: `${analysisResult.score * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-sm text-gray-600">
                          Detected Emotions:
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {analysisResult.emotions.map(
                            (emotion: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full capitalize"
                              >
                                {emotion}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-gray-600">
                          Key Phrases:
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {analysisResult.keyPhrases.map(
                            (phrase: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                              >
                                {phrase}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Confidence: </span>
                      <span>
                        {Math.round(analysisResult.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sentiment Trends */}
          <div
            id="sentiment-trend-chart"
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Sentiment Trends
              </h3>
              <div className="flex items-center gap-2">
                <select
                  className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  {timeRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    handleExportChart(
                      "sentiment-trend-chart",
                      "sentiment_trends"
                    )
                  }
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Export as PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={localData.sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke="#4ade80"
                    fill="#4ade80"
                    name="Positive"
                  />
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    stackId="1"
                    stroke="#facc15"
                    fill="#facc15"
                    name="Neutral"
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    stackId="1"
                    stroke="#f87171"
                    fill="#f87171"
                    name="Negative"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Sentiment Insights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-green-500" />
                  <span>
                    Your positive sentiment has increased by 15% in the last
                    week
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowDown className="w-4 h-4 mr-2 mt-0.5 text-red-500" />
                  <span>
                    Negative expressions have decreased by 8% compared to last
                    month
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Current Sentiment Distribution */}
          <div
            id="sentiment-pie-chart"
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Current Sentiment Distribution
              </h3>
              <button
                onClick={() =>
                  handleExportChart(
                    "sentiment-pie-chart",
                    "sentiment_distribution_detail"
                  )
                }
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Export as PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={250} height={250}>
                  <PieChart>
                    <Pie
                      data={localData.sentimentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {localData.sentimentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Overall Sentiment Score
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full flex items-center justify-center text-xs text-white font-medium transition-all"
                      style={{ width: "72%" }}
                    >
                      72%
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    What does this mean?
                  </h4>
                  <p className="text-sm text-blue-700">
                    Your sentiment analysis shows a predominantly positive
                    outlook. The system uses machine learning to analyze your
                    journal entries and text inputs to determine sentiment
                    patterns over time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coping Strategies */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Coping Strategies
            </h3>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                <h4 className="text-sm font-medium">Recommended Strategies</h4>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                Based on your mood and sentiment analysis, here are some
                strategies that may help:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {copingStrategies
                  .slice(0, 4)
                  .map((strategy: CopingStrategy) => (
                    <div
                      key={strategy.id}
                      className="p-3 bg-white rounded-md border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center mb-2">
                        {strategy.icon}
                        <h5 className="font-medium text-gray-800 ml-2">
                          {strategy.title}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600">
                        {strategy.description}
                      </p>
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {strategy.category}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
                onClick={() => setActiveTab("resources")}
              >
                View All Strategies
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center mb-3">
                <Coffee className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="text-sm font-medium text-blue-800">
                  Self-Care Reminder
                </h4>
              </div>

              <p className="text-sm text-blue-700 mb-3">
                Remember that managing your mental health is an ongoing process.
                Be kind to yourself and celebrate small victories.
              </p>

              <div className="bg-white p-3 rounded-md border border-blue-100">
                <h5 className="text-sm font-medium text-gray-800 mb-2">
                  Today's Affirmation:
                </h5>
                <p className="text-sm text-gray-700 italic">
                  "I am doing my best, and that is enough. Each day is a new
                  opportunity to grow and heal."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Journal Entries Component with working search
  const JournalEntries = () => {
    const [activeJournalFilter, setActiveJournalFilter] =
      useState<string>("all");

    // Get filtered entries based on current search and filter
    const displayEntries = getFilteredJournalEntries(
      searchQuery,
      activeJournalFilter
    );

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Journal Entries
        </h2>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
              My Journal Entries
            </h3>

            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full p-2 pl-9 pr-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  placeholder="Search entries..."
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              </div>

              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={activeJournalFilter}
                onChange={(e) => setActiveJournalFilter(e.target.value)}
              >
                <option value="all">All Entries</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          {displayEntries.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {displayEntries.map((entry: JournalEntry) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => openJournalEntry(entry)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {entry.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        entry.sentiment === "Positive"
                          ? "bg-green-100 text-green-800"
                          : entry.sentiment === "Negative"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {entry.sentiment}
                    </span>
                  </div>

                  <p className="text-gray-600 line-clamp-2 mb-2">
                    {entry.content}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.emotions.map((emotion: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center text-xs text-gray-500"
                      >
                        {getEmotionIcon(emotion as EmotionType)}
                        <span className="ml-1 capitalize">{emotion}</span>
                      </div>
                    ))}
                  </div>

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Search className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-1">
                No entries found
              </h4>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try adjusting your search or filters."
                  : "Your journal entries will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Mental Health Resources component to replace Social Media section
  const MentalHealthResourcesView = () => {
    const [activeResourceFilter, setActiveResourceFilter] =
      useState<string>("all");

    // Filter resources by type
    const filteredResources = mentalHealthResources.filter(
      (resource: Resource) => {
        if (activeResourceFilter === "all") return true;
        return (
          resource.type.toLowerCase() === activeResourceFilter.toLowerCase()
        );
      }
    );

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Mental Health Resources
        </h2>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeResourceFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveResourceFilter("all")}
            >
              All Resources
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeResourceFilter === "crisis"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveResourceFilter("crisis")}
            >
              Crisis Support
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeResourceFilter === "professional"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveResourceFilter("professional")}
            >
              Professional Help
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeResourceFilter === "self-help"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveResourceFilter("self-help")}
            >
              Self-Help
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeResourceFilter === "information"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveResourceFilter("information")}
            >
              Information
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeResourceFilter === "support"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveResourceFilter("support")}
            >
              Support Groups
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource: Resource) => (
              <div
                key={resource.id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start mb-3">
                  <div className="p-2 rounded-md bg-blue-50 mr-3">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {resource.title}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                        resource.type === "Crisis"
                          ? "bg-red-100 text-red-800"
                          : resource.type === "Professional"
                          ? "bg-purple-100 text-purple-800"
                          : resource.type === "Self-Help"
                          ? "bg-green-100 text-green-800"
                          : resource.type === "Information"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {resource.type}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {resource.description}
                </p>

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Coping Strategies Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Coping Strategies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {copingStrategies.map((strategy: CopingStrategy) => (
              <div
                key={strategy.id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-full bg-gray-50">
                    {strategy.icon}
                  </div>
                </div>

                <h3 className="font-medium text-gray-800 mb-1">
                  {strategy.title}
                </h3>
                <span className="inline-block mb-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                  {strategy.category}
                </span>

                <p className="text-sm text-gray-600">{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Local Resources Section */}
        <div className="mt-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Sri Lankan Mental Health Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <PhoneCall className="w-5 h-5 mr-2 text-blue-500" />
                Helplines
              </h3>

              <ul className="space-y-2 text-sm">
                <li className="p-2 bg-white rounded-md">
                  <span className="font-medium block">Sumithrayo</span>
                  <span className="text-gray-600">
                    011 2 682535 / 011 2 696666
                  </span>
                </li>
                <li className="p-2 bg-white rounded-md">
                  <span className="font-medium block">CCC Line</span>
                  <span className="text-gray-600">1333</span>
                </li>
                <li className="p-2 bg-white rounded-md">
                  <span className="font-medium block">
                    National Mental Health Helpline
                  </span>
                  <span className="text-gray-600">1926</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-500" />
                Professional Services
              </h3>

              <ul className="space-y-2 text-sm">
                <li className="p-2 bg-white rounded-md">
                  <span className="font-medium block">
                    National Institute of Mental Health
                  </span>
                  <span className="text-gray-600">Angoda, Colombo</span>
                </li>
                <li className="p-2 bg-white rounded-md">
                  <span className="font-medium block">
                    Sri Lanka College of Psychiatrists
                  </span>
                  <span className="text-gray-600">
                    Directory of Mental Health Professionals
                  </span>
                </li>
                <li className="p-2 bg-white rounded-md">
                  <span className="font-medium block">
                    Karapitiya Teaching Hospital
                  </span>
                  <span className="text-gray-600">
                    Mental Health Unit, Galle
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Type for the summary card component
  interface SummaryCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    trend?: {
      direction: "up" | "down";
      percentage: string;
    };
  }

  // Summary Card Component used in the dashboard
  const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon,
    color,
    trend,
  }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1" style={{ color }}>
            {value}
          </h3>
          {trend && (
            <p
              className={`text-xs mt-1 flex items-center ${
                trend.direction === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.direction === "up" ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {trend.percentage}% from last week
            </p>
          )}
        </div>
        <div
          className="p-2 rounded-full transition-transform duration-300 hover:scale-110"
          style={{ backgroundColor: `${color}20` }}
        >
          {React.cloneElement(icon as React.ReactElement, { color, size: 24 })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar />

      {/* Update Notification */}
      {showUpdateNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-md z-50 animate-fadeIn">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <p>{updateMessage}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Mental Health Insights
            </h1>
            <div className="flex items-center mt-3 md:mt-0 space-x-2">
              <button className="flex items-center text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar mb-6 bg-white p-1 rounded-lg shadow-sm">
            <button
              className={`flex items-center px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              className={`flex items-center px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "mood"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("mood")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Mood Tracking
            </button>
            <button
              className={`flex items-center px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "sentiment"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("sentiment")}
            >
              <Brain className="w-4 h-4 mr-2" />
              Sentiment Analysis
            </button>
            <button
              className={`flex items-center px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "journal"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("journal")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Journal Entries
            </button>
            <button
              className={`flex items-center px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "resources"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("resources")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Resources
            </button>
          </div>

          {/* Render Tab Content */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Journal Entry Sidebar */}
      {showEntrySidebar && currentJournalEntry && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={closeJournalEntry}
          ></div>

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md transform transition-transform duration-500 ease-in-out translate-x-0">
              <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-auto">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Journal Entry
                    </h2>
                    <div className="ml-3 h-7 flex items-center">
                      <button
                        onClick={closeJournalEntry}
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                      >
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 relative flex-1 px-4 sm:px-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-gray-900 mb-1">
                      {currentJournalEntry.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(currentJournalEntry.date)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        currentJournalEntry.sentiment === "Positive"
                          ? "bg-green-100 text-green-800"
                          : currentJournalEntry.sentiment === "Negative"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {currentJournalEntry.sentiment}
                    </span>

                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1"></div>
                      <span className="text-sm text-gray-500">
                        Sentiment Score:{" "}
                        {currentJournalEntry.sentimentScore.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Emotions Detected
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {currentJournalEntry.emotions.map(
                        (emotion: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                          >
                            {getEmotionIcon(emotion as EmotionType)}
                            <span className="ml-1 capitalize">{emotion}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Journal Content
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md text-gray-700 whitespace-pre-line">
                      {currentJournalEntry.content}
                    </div>
                  </div>

                  {currentJournalEntry.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {currentJournalEntry.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Insights & Recommendations
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 transform transition-transform hover:scale-[1.01]">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Info className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-800">
                              This entry shows a{" "}
                              {currentJournalEntry.sentiment.toLowerCase()}{" "}
                              outlook with emotions including{" "}
                              {currentJournalEntry.emotions.join(" and ")}.
                            </p>
                          </div>
                        </div>
                      </div>

                      {currentJournalEntry.sentiment === "Negative" && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 transform transition-transform hover:scale-[1.01]">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-800">
                                Consider practicing mindfulness or reaching out
                                to your support network when feeling this way.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentJournalEntry.sentiment === "Positive" && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-3 transform transition-transform hover:scale-[1.01]">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-green-800">
                                Great to see your positive outlook! This pattern
                                has been consistent over the past week.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

// Add animations to the CSS
const createStyleElement = () => {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out;
    }

    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .scale-105 {
      transform: scale(1.05);
    }

    .scale-110 {
      transform: scale(1.1);
    }

    .transition-transform {
      transition-property: transform;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }

    .transition-colors {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }

    .transition-shadow {
      transition-property: box-shadow;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }

    .transition-all {
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }
  `;
  document.head.appendChild(styleEl);
};

// Execute style injection
if (typeof window !== "undefined") {
  createStyleElement();
}

export default HealthInsightsDashboard;
