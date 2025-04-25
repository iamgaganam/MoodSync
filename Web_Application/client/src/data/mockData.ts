// client/src/data/mockData.ts

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastActivity: string;
  riskLevel: "low" | "medium" | "high";
  sentimentScore: number;
  lastMessage?: string;
  profilePic?: string;
}

export interface Message {
  id: string;
  sender: "doctor" | "patient";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatSession {
  patientId: string;
  patientName: string;
  messages: Message[];
  profilePic?: string;
}

export interface MoodData {
  date: string;
  sentiment: number;
  anxiety: number;
  depression: number;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: "risk" | "inactivity" | "sentiment";
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Amal Perera",
    age: 28,
    gender: "Male",
    lastActivity: "2025-03-21T09:30:00",
    riskLevel: "high",
    sentimentScore: -0.8,
    lastMessage: "I don't think I can handle this anymore...",
    profilePic:
      "https://www.sliit.lk/profile/uploads/Mr__Pramuditha_Coomasaru_21.jpg",
  },
  {
    id: "2",
    name: "Kumari Silva",
    age: 24,
    gender: "Female",
    lastActivity: "2025-03-20T18:45:00",
    riskLevel: "medium",
    sentimentScore: -0.4,
    lastMessage: "The therapy techniques helped a bit today",
    profilePic:
      "https://i.pinimg.com/280x280_RS/23/fb/52/23fb52389aeee3b345bf790120163425.jpg",
  },
  {
    id: "3",
    name: "Dinesh Fernando",
    age: 35,
    gender: "Male",
    lastActivity: "2025-03-21T11:20:00",
    riskLevel: "low",
    sentimentScore: 0.2,
    lastMessage: "I practiced the breathing exercises",
    profilePic: "https://www.gla.ac.in/images/shubham-saraswat.jpg",
  },
  {
    id: "4",
    name: "Priya Rajapakse",
    age: 19,
    gender: "Female",
    lastActivity: "2025-03-19T14:10:00",
    riskLevel: "high",
    sentimentScore: -0.7,
    lastMessage: "Everything feels pointless lately",
    profilePic:
      "https://theuniquetravel.co.uk/wp-content/uploads/2019/04/3.jpg",
  },
  {
    id: "5",
    name: "Nimal Jayasinghe",
    age: 42,
    gender: "Male",
    lastActivity: "2025-03-21T08:05:00",
    riskLevel: "medium",
    sentimentScore: -0.3,
    lastMessage: "Work stress is affecting my sleep again",
    profilePic:
      "https://nearyou.imeche.org/images/default-source/srilanka/Rem-Pas-Pic/passport-size.jpg?sfvrsn=0",
  },
];

export const mockMoodData: Record<string, MoodData[]> = {
  "1": [
    { date: "2025-03-15", sentiment: -0.9, anxiety: 8, depression: 7 },
    { date: "2025-03-16", sentiment: -0.8, anxiety: 8, depression: 8 },
    { date: "2025-03-17", sentiment: -0.7, anxiety: 7, depression: 7 },
    { date: "2025-03-18", sentiment: -0.8, anxiety: 8, depression: 8 },
    { date: "2025-03-19", sentiment: -0.9, anxiety: 9, depression: 8 },
    { date: "2025-03-20", sentiment: -0.85, anxiety: 8, depression: 7 },
    { date: "2025-03-21", sentiment: -0.8, anxiety: 8, depression: 7 },
  ],
};

export const mockChatSessions: Record<string, ChatSession> = {
  "1": {
    patientId: "1",
    patientName: "Amal Perera",
    profilePic: "/api/placeholder/40/40",
    messages: [
      {
        id: "1a",
        sender: "patient",
        content:
          "I don't think I can handle this anymore. The thoughts won't stop.",
        timestamp: "2025-03-21T09:30:00",
        read: true,
      },
      {
        id: "1b",
        sender: "doctor",
        content:
          "I understand you're going through a difficult time, Amal. Can you tell me more about these thoughts?",
        timestamp: "2025-03-21T09:32:00",
        read: true,
      },
      {
        id: "1c",
        sender: "patient",
        content:
          "They're just... dark. I keep thinking about how everyone would be better off without me.",
        timestamp: "2025-03-21T09:33:00",
        read: true,
      },
      {
        id: "1d",
        sender: "doctor",
        content:
          "I'm concerned about you, Amal. These thoughts are important to address. Remember the safety plan we developed? Have you reached out to your support person?",
        timestamp: "2025-03-21T09:34:00",
        read: true,
      },
    ],
  },
};

export const mockAlerts: Alert[] = [
  {
    id: "a1",
    patientId: "1",
    patientName: "Amal Perera",
    type: "risk",
    message: "High suicide risk detected in recent messages",
    timestamp: "2025-03-21T09:31:00",
    read: false,
  },
  {
    id: "a2",
    patientId: "4",
    patientName: "Priya Rajapakse",
    type: "inactivity",
    message: "No activity for 48 hours after concerning message",
    timestamp: "2025-03-21T08:10:00",
    read: false,
  },
  {
    id: "a3",
    patientId: "2",
    patientName: "Kumari Silva",
    type: "sentiment",
    message: "Sentiment score dropped 30% over 24 hours",
    timestamp: "2025-03-20T19:00:00",
    read: true,
  },
];
