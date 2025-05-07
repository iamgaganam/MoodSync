import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { format, subDays } from "date-fns";
import {
  Bell,
  Calendar,
  User,
  MessageSquare,
  Home,
  Users,
  Settings,
  LogOut,
  Search,
  AlertCircle,
  Check,
  Activity,
  Clock,
  ArrowUp,
  FileText,
  ChevronRight,
  ChevronLeft,
  Filter,
  ThumbsUp,
  X,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Types
interface Doctor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  hospital: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  lastActivity: string;
  riskLevel: "low" | "medium" | "high";
  sentimentScore: number;
  diagnosis?: string;
  status: "active" | "inactive";
  contact: {
    email: string;
    phone: string;
  };
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isDoctor: boolean;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  type: "virtual" | "in-person";
  notes?: string;
}

interface SentimentData {
  date: string;
  score: number;
}

interface MoodData {
  date: string;
  mood: "very_negative" | "negative" | "neutral" | "positive" | "very_positive";
  score: number;
}

interface PatientDetail extends Patient {
  sentimentHistory: SentimentData[];
  moodHistory: MoodData[];
  notes: {
    id: string;
    content: string;
    date: string;
  }[];
  activities: {
    id: string;
    type: string;
    description: string;
    date: string;
  }[];
}

// Mock data - In real application, this would come from API
const mockCurrentDoctor: Doctor = {
  id: "d1",
  name: "Dr. Nimal Fernando",
  email: "nimal.fernando@hospital.lk",
  avatar: "/api/placeholder/150/150",
  specialization: "Psychiatrist",
  hospital: "Colombo General Hospital",
};

const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Kasun Perera",
    age: 28,
    gender: "Male",
    avatar: "/api/placeholder/150/150",
    lastActivity: "10 minutes ago",
    riskLevel: "high",
    sentimentScore: 0.3,
    diagnosis: "Depression",
    status: "active",
    contact: {
      email: "kasun@email.com",
      phone: "+94 77 123 4567",
    },
  },
  {
    id: "p2",
    name: "Malini Silva",
    age: 34,
    gender: "Female",
    avatar: "/api/placeholder/150/150",
    lastActivity: "3 hours ago",
    riskLevel: "medium",
    sentimentScore: 0.5,
    diagnosis: "Anxiety",
    status: "active",
    contact: {
      email: "malini@email.com",
      phone: "+94 77 234 5678",
    },
  },
  {
    id: "p3",
    name: "Ashan Bandara",
    age: 22,
    gender: "Male",
    avatar: "/api/placeholder/150/150",
    lastActivity: "1 day ago",
    riskLevel: "low",
    sentimentScore: 0.7,
    diagnosis: "Stress",
    status: "active",
    contact: {
      email: "ashan@email.com",
      phone: "+94 77 345 6789",
    },
  },
  {
    id: "p4",
    name: "Priyanka Jayawardena",
    age: 41,
    gender: "Female",
    avatar: "/api/placeholder/150/150",
    lastActivity: "15 minutes ago",
    riskLevel: "high",
    sentimentScore: 0.2,
    diagnosis: "PTSD",
    status: "active",
    contact: {
      email: "priyanka@email.com",
      phone: "+94 77 456 7890",
    },
  },
  {
    id: "p5",
    name: "Dinesh Kumar",
    age: 19,
    gender: "Male",
    avatar: "/api/placeholder/150/150",
    lastActivity: "2 days ago",
    riskLevel: "medium",
    sentimentScore: 0.6,
    status: "inactive",
    contact: {
      email: "dinesh@email.com",
      phone: "+94 77 567 8901",
    },
  },
];

const mockAppointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    patientName: "Kasun Perera",
    date: "2025-05-08",
    time: "10:00 AM",
    status: "scheduled",
    type: "virtual",
    notes: "Follow-up on medication",
  },
  {
    id: "a2",
    patientId: "p4",
    patientName: "Priyanka Jayawardena",
    date: "2025-05-07",
    time: "2:30 PM",
    status: "scheduled",
    type: "in-person",
  },
  {
    id: "a3",
    patientId: "p2",
    patientName: "Malini Silva",
    date: "2025-05-10",
    time: "11:45 AM",
    status: "scheduled",
    type: "virtual",
    notes: "Therapy session",
  },
];

// Generate random sentiment data for the past 30 days
const generateSentimentData = (): SentimentData[] => {
  const data: SentimentData[] = [];
  for (let i = 30; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    // Generate a random score between 0.1 and 0.9
    const score = 0.1 + Math.random() * 0.8;
    data.push({ date, score });
  }
  return data;
};

// Generate random mood data for the past 30 days
const generateMoodData = (): MoodData[] => {
  const moods: (
    | "very_negative"
    | "negative"
    | "neutral"
    | "positive"
    | "very_positive"
  )[] = ["very_negative", "negative", "neutral", "positive", "very_positive"];
  const data: MoodData[] = [];

  for (let i = 30; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    const moodIndex = Math.floor(Math.random() * 5);
    const mood = moods[moodIndex];
    const score = (moodIndex + 1) * 2; // Convert mood to a 1-10 scale
    data.push({ date, mood, score });
  }

  return data;
};

// Mock patient details
const generatePatientDetail = (patient: Patient): PatientDetail => {
  return {
    ...patient,
    sentimentHistory: generateSentimentData(),
    moodHistory: generateMoodData(),
    notes: [
      {
        id: "n1",
        content: "Patient reported difficulty sleeping and loss of appetite.",
        date: "2025-04-30",
      },
      {
        id: "n2",
        content: "Started on new medication, will follow up in two weeks.",
        date: "2025-04-23",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "journal",
        description: "Submitted a journal entry about daily thoughts",
        date: "2025-05-06",
      },
      {
        id: "a2",
        type: "social",
        description: "Social media analysis detected negative sentiment",
        date: "2025-05-05",
      },
      {
        id: "a3",
        type: "meditation",
        description: "Completed a guided meditation session",
        date: "2025-05-04",
      },
    ],
  };
};

// Sidebar component
const Sidebar: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="p-4 flex items-center justify-center border-b">
            <img src="/api/placeholder/40/40" alt="Logo" className="h-8 mr-3" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              MindfulCare
            </span>
          </div>
          <div className="px-3 py-5 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    activeTab === "dashboard"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Home className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    activeTab === "patients"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={() => setActiveTab("patients")}
                >
                  <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">Patients</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    activeTab === "messages"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">Messages</span>
                  <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    5
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    activeTab === "appointments"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={() => setActiveTab("appointments")}
                >
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">Appointments</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    activeTab === "alerts" ? "bg-blue-100 dark:bg-blue-900" : ""
                  }`}
                  onClick={() => setActiveTab("alerts")}
                >
                  <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">Alerts</span>
                  <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-white bg-red-500 rounded-full">
                    3
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              className="w-10 h-10 rounded-full"
              src={mockCurrentDoctor.avatar}
              alt="Doctor avatar"
            />
            <div className="font-medium dark:text-white">
              <div>{mockCurrentDoctor.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {mockCurrentDoctor.specialization}
              </div>
            </div>
          </div>
          <button className="mt-4 flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="ms-3">Settings</span>
          </button>
          <button className="mt-2 flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="ms-3">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// Header component
const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="bg-white shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-gray-700">
                <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  3
                </span>
                <Bell className="h-6 w-6" />
              </button>
            </div>
            <div className="relative hidden sm:block">
              <div className="flex items-center">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Dashboard overview component
const DashboardOverview: React.FC = () => {
  // Calculate statistics
  const totalPatients = mockPatients.length;
  const activePatients = mockPatients.filter(
    (p) => p.status === "active"
  ).length;
  const highRiskPatients = mockPatients.filter(
    (p) => p.riskLevel === "high"
  ).length;
  const appointmentsToday = mockAppointments.filter(
    (a) => a.date === format(new Date(), "yyyy-MM-dd")
  ).length;

  // Chart data for patient sentiment overview
  const sentimentChartData = {
    labels: [
      "Very Negative",
      "Negative",
      "Neutral",
      "Positive",
      "Very Positive",
    ],
    datasets: [
      {
        label: "Patient Sentiment Distribution",
        data: [1, 2, 4, 5, 3], // Mock data
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Activity chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    return format(subDays(new Date(), 6 - i), "MMM dd");
  });

  const activityChartData = {
    labels: last7Days,
    datasets: [
      {
        label: "Patient Activities",
        data: [12, 19, 15, 22, 18, 25, 30],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <Users className="h-5 w-5 text-blue-500 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Patients
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalPatients}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-500">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>2% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <User className="h-5 w-5 text-green-500 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Patients
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activePatients}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-500">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>5% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                High Risk Patients
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {highRiskPatients}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-red-500">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>+1 from last week</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Today's Appointments
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {appointmentsToday}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-purple-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Next in 2 hours</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Patient Sentiment Overview
          </h3>
          <div className="h-64">
            <Doughnut
              data={sentimentChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Patient Activity (Last 7 Days)
          </h3>
          <div className="h-64">
            <Bar
              data={activityChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent activity and high risk patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Patient Activity
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </button>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 5 }).map((_, index) => (
                <li key={index} className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src="/api/placeholder/150/150"
                        alt="Patient"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {mockPatients[index % mockPatients.length].name}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Submitted a journal entry
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {["10m", "25m", "1h", "3h", "5h"][index]} ago
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              High Risk Patients
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </button>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockPatients
                .filter((p) => p.riskLevel === "high")
                .map((patient) => (
                  <li key={patient.id} className="py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={patient.avatar}
                          alt={patient.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {patient.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {patient.diagnosis || "No diagnosis"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          High Risk
                        </span>
                        <button className="ml-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                          <MessageSquare className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Patient list component
const PatientList: React.FC<{
  onSelectPatient: (patient: Patient) => void;
}> = ({ onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<string>("all");

  // Filter patients based on search term and risk filter
  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.diagnosis || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRisk =
      selectedRisk === "all" || patient.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Patient List
          </h2>
          <button className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800">
            <User className="w-4 h-4 mr-2" />
            Add New Patient
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Age
              </th>
              <th scope="col" className="px-6 py-3">
                Diagnosis
              </th>
              <th scope="col" className="px-6 py-3">
                Risk Level
              </th>
              <th scope="col" className="px-6 py-3">
                Last Activity
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => onSelectPatient(patient)}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={patient.avatar}
                    alt={patient.name}
                  />
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      {patient.name}
                    </div>
                    <div className="font-normal text-gray-500">
                      {patient.contact.email}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{patient.age}</td>
                <td className="px-6 py-4">
                  {patient.diagnosis || "Not diagnosed"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${
                      patient.riskLevel === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : patient.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {patient.riskLevel === "high" ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : patient.riskLevel === "medium" ? (
                      <Clock className="w-3 h-3 mr-1" />
                    ) : (
                      <Check className="w-3 h-3 mr-1" />
                    )}
                    {patient.riskLevel.charAt(0).toUpperCase() +
                      patient.riskLevel.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">{patient.lastActivity}</td>
                <td className="px-6 py-4">
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPatient(patient);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Patient detail component
const PatientDetail: React.FC<{
  patient: Patient | null;
  onBack: () => void;
}> = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!patient) {
    return null;
  }

  // Generate detailed patient data
  const patientDetail = generatePatientDetail(patient);

  // Prepare chart data for sentiment history
  const sentimentChartData = {
    labels: patientDetail.sentimentHistory
      .slice(-14)
      .map((item) => format(new Date(item.date), "MMM dd")),
    datasets: [
      {
        label: "Sentiment Score",
        data: patientDetail.sentimentHistory
          .slice(-14)
          .map((item) => item.score),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Prepare chart data for mood history
  const moodChartData = {
    labels: patientDetail.moodHistory
      .slice(-14)
      .map((item) => format(new Date(item.date), "MMM dd")),
    datasets: [
      {
        label: "Mood Score",
        data: patientDetail.moodHistory.slice(-14).map((item) => item.score),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-4">
      <button
        className="mb-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
        onClick={onBack}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Patient List
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Patient header */}
        <div className="p-6 sm:p-8 bg-blue-50 dark:bg-gray-700">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:items-center">
              <img
                className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800"
                src={patient.avatar}
                alt={patient.name}
              />
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {patient.name}
                </h2>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">
                    {patient.age} years, {patient.gender}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${
                      patient.riskLevel === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : patient.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {patient.riskLevel === "high" ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : patient.riskLevel === "medium" ? (
                      <Clock className="w-3 h-3 mr-1" />
                    ) : (
                      <Check className="w-3 h-3 mr-1" />
                    )}
                    {patient.riskLevel.charAt(0).toUpperCase() +
                      patient.riskLevel.slice(1)}{" "}
                    Risk
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {patient.diagnosis
                    ? `Diagnosis: ${patient.diagnosis}`
                    : "No diagnosis"}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="mr-2">
              <button
                className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                  activeTab === "overview"
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <Activity className="w-4 h-4 mr-2" />
                Overview
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                  activeTab === "trends"
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("trends")}
              >
                <Activity className="w-4 h-4 mr-2" />
                Mental Health Trends
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                  activeTab === "notes"
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("notes")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Notes & Records
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                  activeTab === "activity"
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("activity")}
              >
                <Clock className="w-4 h-4 mr-2" />
                Recent Activity
              </button>
            </li>
          </ul>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Patient Information
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Contact:
                    </span>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {patient.contact.email}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {patient.contact.phone}
                      </p>
                    </div>
                  </li>
                  {patient.emergencyContact && (
                    <li className="flex items-start">
                      <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Emergency Contact:
                      </span>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {patient.emergencyContact.name}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {patient.emergencyContact.relation}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {patient.emergencyContact.phone}
                        </p>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start">
                    <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        patient.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {patient.status.charAt(0).toUpperCase() +
                        patient.status.slice(1)}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Activity:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {patient.lastActivity}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Current Assessment
                </h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sentiment Score
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className={`h-2.5 rounded-full ${
                        patient.sentimentScore < 0.4
                          ? "bg-red-600"
                          : patient.sentimentScore < 0.6
                          ? "bg-yellow-400"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${patient.sentimentScore * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Negative</span>
                    <span>Neutral</span>
                    <span>Positive</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Risk Assessment
                  </h4>
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3
                        ${
                          patient.riskLevel === "high"
                            ? "bg-red-100 dark:bg-red-900"
                            : patient.riskLevel === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-900"
                            : "bg-green-100 dark:bg-green-900"
                        }`}
                      >
                        <AlertCircle
                          className={`w-5 h-5
                          ${
                            patient.riskLevel === "high"
                              ? "text-red-700 dark:text-red-300"
                              : patient.riskLevel === "medium"
                              ? "text-yellow-700 dark:text-yellow-300"
                              : "text-green-700 dark:text-green-300"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.riskLevel === "high"
                            ? "High Risk - Immediate Attention Needed"
                            : patient.riskLevel === "medium"
                            ? "Medium Risk - Regular Monitoring Required"
                            : "Low Risk - Continue Regular Support"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Last updated: 2 days ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Schedule follow-up appointment
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Review medication effectiveness
                      </span>
                    </li>
                    {patient.riskLevel === "high" && (
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          Consider crisis intervention plan
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Sentiment Analysis (Last 14 Days)
                </h3>
                <div className="h-64">
                  <Line
                    data={sentimentChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 1,
                          title: {
                            display: true,
                            text: "Sentiment Score",
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "Date",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Analysis Summary
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The patient's sentiment shows moderate fluctuations with an
                    overall downward trend in the past week, indicating
                    potential deterioration in mental well-being that requires
                    attention.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Mood Tracking (Last 14 Days)
                </h3>
                <div className="h-64">
                  <Line
                    data={moodChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 10,
                          title: {
                            display: true,
                            text: "Mood Score",
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "Date",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Analysis Summary
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The patient's self-reported mood has been consistently below
                    average with some improvement over the weekend. Correlation
                    with life events and therapy sessions should be examined.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Doctor's Notes
                </h3>
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800">
                  <FileText className="w-4 h-4 mr-1" />
                  Add Note
                </button>
              </div>

              <div className="space-y-4">
                {patientDetail.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {note.content}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(note.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Treatment Plan
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Medications
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">
                          Sertraline 50mg
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Daily, morning
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">
                          Lorazepam 0.5mg
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          As needed for anxiety
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Therapy Schedule
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">
                          Cognitive Behavioral Therapy
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Weekly, Wednesdays
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">
                          Group Support Session
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Bi-weekly, Fridays
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activities
              </h3>

              <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
                {patientDetail.activities.map((activity) => (
                  <div key={activity.id} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-blue-900">
                      <Activity className="w-3 h-3 text-blue-800 dark:text-blue-300" />
                    </span>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <time className="text-xs font-normal text-gray-500 dark:text-gray-400">
                          {format(new Date(activity.date), "MMM dd, yyyy")}
                        </time>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                          {activity.type.charAt(0).toUpperCase() +
                            activity.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Messages component
const Messages: React.FC = () => {
  // Mock messages for demonstration
  const [conversations] = useState([
    {
      id: "c1",
      patient: mockPatients[0],
      unreadCount: 2,
      lastMessage: "I'm feeling anxious today...",
      lastMessageTime: "10:25 AM",
    },
    {
      id: "c2",
      patient: mockPatients[1],
      unreadCount: 0,
      lastMessage: "Thank you for the advice",
      lastMessageTime: "Yesterday",
    },
    {
      id: "c3",
      patient: mockPatients[2],
      unreadCount: 0,
      lastMessage: "I'll try the new techniques",
      lastMessageTime: "May 5",
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messageText, setMessageText] = useState("");

  // Mock messages for the selected conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      senderId: "p1",
      receiverId: "d1",
      content:
        "Hi Dr. Fernando, I've been feeling more anxious than usual today.",
      timestamp: "2025-05-07T10:20:00",
      read: true,
      isDoctor: false,
    },
    {
      id: "m2",
      senderId: "d1",
      receiverId: "p1",
      content:
        "I'm sorry to hear that. Can you tell me more about what's causing your anxiety?",
      timestamp: "2025-05-07T10:22:00",
      read: true,
      isDoctor: true,
    },
    {
      id: "m3",
      senderId: "p1",
      receiverId: "d1",
      content:
        "I'm having trouble sleeping and my thoughts keep racing. I'm worried about my upcoming job interview.",
      timestamp: "2025-05-07T10:25:00",
      read: false,
      isDoctor: false,
    },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId: "d1",
      receiverId: selectedConversation.replace("c", "p"),
      content: messageText,
      timestamp: new Date().toISOString(),
      read: true,
      isDoctor: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  return (
    <div className="p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversation list */}
          <div className="border-r border-gray-200 dark:border-gray-700 h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Messages
              </h2>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search conversations..."
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedConversation === conversation.id
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={conversation.patient.avatar}
                        alt={conversation.patient.name}
                      />
                      {conversation.patient.status === "active" && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {conversation.patient.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conversation.lastMessageTime}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full dark:bg-blue-500">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="col-span-2 flex flex-col h-full">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full mr-3"
                      src={
                        conversations.find((c) => c.id === selectedConversation)
                          ?.patient.avatar
                      }
                      alt=""
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.patient.name
                        }
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conversations.find(
                          (c) => c.id === selectedConversation
                        )?.patient.status === "active"
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                      <User className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isDoctor ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                            message.isDoctor
                              ? "bg-blue-100 text-blue-900 dark:bg-blue-700 dark:text-white"
                              : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block text-right mt-1">
                            {format(new Date(message.timestamp), "h:mm a")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <form
                    className="flex items-center space-x-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <input
                      type="text"
                      className="flex-1 p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="inline-flex justify-center p-2.5 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
                    >
                      <svg
                        className="w-5 h-5 rotate-90"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    No conversation selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Select a conversation from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Appointment component
const Appointments: React.FC = () => {
  const appointments = mockAppointments;
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Filter appointments for the selected date
  const appointmentsToday = appointments.filter(
    (app) => app.date === format(currentDate, "yyyy-MM-dd")
  );

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, -1));
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Appointment Schedule
          </h2>
          <button className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800">
            <Calendar className="w-4 h-4 mr-2" />
            Create New Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Calendar
              </h3>
              <div className="flex space-x-1">
                <button
                  className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={handlePrevDay}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={handleNextDay}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {format(currentDate, "d")}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {format(currentDate, "EEEE")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Today's Overview
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Total Appointments
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {appointmentsToday.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-300">
                    Virtual
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {
                      appointmentsToday.filter((a) => a.type === "virtual")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-300">
                    In-person
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {
                      appointmentsToday.filter((a) => a.type === "in-person")
                        .length
                    }
                  </span>
                </div>
              </div>

              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Upcoming Days
                </h4>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const date = subDays(currentDate, -1 * (index + 1));
                    const appsCount = appointments.filter(
                      (app) => app.date === format(date, "yyyy-MM-dd")
                    ).length;

                    return (
                      <button
                        key={index}
                        className="flex items-center justify-between w-full p-2 text-sm text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => setCurrentDate(date)}
                      >
                        <span>{format(date, "EEE, MMM d")}</span>
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full dark:bg-blue-500">
                          {appsCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments for the day */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appointments for {format(currentDate, "MMMM d, yyyy")}
            </h3>

            {appointmentsToday.length > 0 ? (
              <div className="space-y-4">
                {appointmentsToday.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full mr-4"
                          src="/api/placeholder/150/150"
                          alt={appointment.patientName}
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.patientName}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {appointment.type === "virtual"
                              ? "Virtual Consultation"
                              : "In-person Visit"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center">
                        <div className="mr-4 text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Time
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.time}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${
                              appointment.status === "scheduled"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : appointment.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Notes:</span>{" "}
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex space-x-2">
                      {appointment.status === "scheduled" && (
                        <>
                          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none dark:focus:ring-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Start Session
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            <Calendar className="w-3 h-3 mr-1" />
                            Reschedule
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  No appointments scheduled
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  There are no appointments scheduled for this day.
                </p>
                <button className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Alerts component
const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState([
    {
      id: "a1",
      patient: mockPatients[0],
      type: "emergency",
      message: "Expressed suicidal thoughts in recent journal entry",
      timestamp: "10 minutes ago",
      read: false,
    },
    {
      id: "a2",
      patient: mockPatients[3],
      type: "high_risk",
      message: "Sentiment analysis detected severe depression indicators",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "a3",
      patient: mockPatients[1],
      type: "medium_risk",
      message:
        "Reported symptoms of anxiety and insomnia for 3 consecutive days",
      timestamp: "5 hours ago",
      read: true,
    },
  ]);

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Patient Alerts
          </h2>
          <div className="mt-3 sm:mt-0">
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 mr-2">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </button>
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-700 dark:bg-blue-800 dark:text-blue-400 dark:border-blue-600 dark:hover:text-white dark:hover:bg-blue-700">
              <Check className="w-4 h-4 mr-1" />
              Mark All as Read
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Critical alerts that require your attention
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 border rounded-lg ${
              alert.read
                ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                : "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700"
            }`}
          >
            <div className="sm:flex sm:items-start">
              <div
                className={`p-2 rounded-full mr-4 ${
                  alert.type === "emergency"
                    ? "bg-red-100 dark:bg-red-900"
                    : alert.type === "high_risk"
                    ? "bg-orange-100 dark:bg-orange-900"
                    : "bg-yellow-100 dark:bg-yellow-900"
                }`}
              >
                <AlertCircle
                  className={`w-6 h-6 ${
                    alert.type === "emergency"
                      ? "text-red-700 dark:text-red-300"
                      : alert.type === "high_risk"
                      ? "text-orange-700 dark:text-orange-300"
                      : "text-yellow-700 dark:text-yellow-300"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.type === "emergency"
                        ? "Emergency Alert"
                        : alert.type === "high_risk"
                        ? "High Risk Alert"
                        : "Medium Risk Alert"}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {alert.patient.name}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {alert.message}
                </p>
                <div className="mt-3 flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact Patient
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={() => handleMarkAsRead(alert.id)}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark as Read
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-red-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No Active Alerts
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            There are no active alerts that require your attention at this time.
          </p>
        </div>
      )}
    </div>
  );
};

// Main Doctor Dashboard Component
export default function DoctorDashboard(): JSX.Element {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Header title based on active tab
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "patients":
        return selectedPatient
          ? `Patient: ${selectedPatient.name}`
          : "Patients";
      case "messages":
        return "Messages";
      case "appointments":
        return "Appointments";
      case "alerts":
        return "Alerts";
      default:
        return "Dashboard";
    }
  };

  // Handle patient selection
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  // Handle back to patient list
  const handleBackToPatientList = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-0 sm:ml-64">
        <Header title={getHeaderTitle()} />

        <main>
          {activeTab === "dashboard" && <DashboardOverview />}

          {activeTab === "patients" && !selectedPatient && (
            <PatientList onSelectPatient={handleSelectPatient} />
          )}

          {activeTab === "patients" && selectedPatient && (
            <PatientDetail
              patient={selectedPatient}
              onBack={handleBackToPatientList}
            />
          )}

          {activeTab === "messages" && <Messages />}

          {activeTab === "appointments" && <Appointments />}

          {activeTab === "alerts" && <Alerts />}
        </main>
      </div>
    </div>
  );
}
