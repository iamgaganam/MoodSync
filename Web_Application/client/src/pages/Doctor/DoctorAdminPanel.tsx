import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for demonstration
const patientMockData = [
  {
    id: 1,
    name: "Amal Perera",
    risk: "high",
    status: "Suicidal",
    lastActive: "2 hours ago",
    totalUsers: 2854,
  },
  {
    id: 2,
    name: "Malini Silva",
    risk: "medium",
    status: "Depression",
    lastActive: "1 day ago",
    totalUsers: 2960,
  },
  {
    id: 3,
    name: "Rohan Fernando",
    risk: "low",
    status: "Anxiety",
    lastActive: "5 hours ago",
    totalUsers: 3102,
  },
  {
    id: 4,
    name: "Dinesh Kumar",
    risk: "medium",
    status: "Bipolar",
    lastActive: "3 days ago",
    totalUsers: 2756,
  },
  {
    id: 5,
    name: "Priya Mendis",
    risk: "high",
    status: "Depression",
    lastActive: "1 hour ago",
    totalUsers: 2891,
  },
];

const sentimentData = [
  { date: "2025-01-01", anxiety: 65, depression: 40, stress: 35, suicidal: 10 },
  { date: "2025-01-08", anxiety: 60, depression: 45, stress: 30, suicidal: 15 },
  { date: "2025-01-15", anxiety: 55, depression: 50, stress: 35, suicidal: 20 },
  { date: "2025-01-22", anxiety: 50, depression: 55, stress: 40, suicidal: 25 },
  { date: "2025-01-29", anxiety: 45, depression: 50, stress: 45, suicidal: 20 },
  { date: "2025-02-05", anxiety: 40, depression: 45, stress: 40, suicidal: 15 },
  { date: "2025-02-12", anxiety: 35, depression: 40, stress: 35, suicidal: 10 },
];

const messagesMock = [
  {
    id: 1,
    sender: "Amal Perera",
    content: "I've been feeling very low today, not sure what to do.",
    time: "10:30 AM",
    isRead: false,
  },
  {
    id: 2,
    sender: "Malini Silva",
    content:
      "The medication seems to be helping, but I still feel anxious sometimes.",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: 3,
    sender: "System Alert",
    content:
      "URGENT: Rohan Fernando has shown signs of suicidal ideation in recent posts.",
    time: "Yesterday",
    isRead: false,
  },
];

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────

interface SentimentData {
  date: string;
  anxiety: number;
  depression: number;
  stress: number;
  suicidal: number;
}

const SentimentChart = ({ data }: { data: SentimentData[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="anxiety" stroke="#8884d8" />
      <Line type="monotone" dataKey="depression" stroke="#82ca9d" />
      <Line type="monotone" dataKey="stress" stroke="#ffc658" />
      <Line type="monotone" dataKey="suicidal" stroke="#ff8042" />
    </LineChart>
  </ResponsiveContainer>
);

const RiskBar = ({
  label,
  percentage,
  barColor,
}: {
  label: string;
  percentage: number;
  barColor: string;
}) => (
  <div className="flex items-center space-x-2 mb-4">
    <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
      <div
        className={`h-6 rounded-full ${barColor}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
    <span className="text-sm font-medium text-gray-700 dark:text-white">
      {label} ({percentage}%)
    </span>
  </div>
);

interface SummaryCardProps {
  title: string;
  count: string;
  description: string;
  countColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  count,
  description,
  countColor,
}) => (
  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className={`text-3xl font-bold ${countColor}`}>{count}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

// ─── DASHBOARD COMPONENT ─────────────────────────────────────────────

interface DashboardProps {
  sentimentData: SentimentData[];
}

const Dashboard: React.FC<DashboardProps> = ({ sentimentData }) => (
  <div className="space-y-6">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        title="High Risk Patients"
        count="2"
        description="Requiring immediate attention"
        countColor="text-red-600 dark:text-red-400"
      />
      <SummaryCard
        title="Active Patients"
        count="15"
        description="Currently being monitored"
        countColor="text-blue-600 dark:text-blue-400"
      />
      <SummaryCard
        title="Unread Messages"
        count="3"
        description="Requiring response"
        countColor="text-yellow-600 dark:text-yellow-400"
      />
    </div>

    {/* Sentiment Trends Chart */}
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Overall Sentiment Trends
      </h3>
      <div className="h-96">
        <SentimentChart data={sentimentData} />
      </div>
    </div>

    {/* Recent Activity */}
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-3">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  New patient registration
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  Priya Mendis registered in the system
                </p>
              </div>
              <div className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                1 hour ago
              </div>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  High risk alert
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  Amal Perera's sentiment analysis indicated suicidal thoughts
                </p>
              </div>
              <div className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                2 hours ago
              </div>
            </div>
          </li>
          <li className="py-3">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  Session completed
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  Chat session with Rohan Fernando completed
                </p>
              </div>
              <div className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                5 hours ago
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

// ─── PATIENT MANAGEMENT COMPONENT ─────────────────────────────────────

interface Patient {
  id: number;
  name: string;
  risk: string;
  status: string;
  lastActive: string;
  totalUsers: number;
}

interface PatientManagementProps {
  patients: Patient[];
  onSelectPatient: (id: number) => void;
  getRiskColor: (risk: string) => string;
}

const PatientManagement: React.FC<PatientManagementProps> = ({
  patients,
  onSelectPatient,
  getRiskColor,
}) => (
  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Patient Management
      </h2>
      <div className="relative">
        <input
          type="text"
          className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Search patients..."
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Risk Level
            </th>
            <th scope="col" className="px-6 py-3">
              Last Active
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {patient.name}
              </td>
              <td className="px-6 py-4">{patient.status}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(
                    patient.risk
                  )}`}
                >
                  {patient.risk.charAt(0).toUpperCase() + patient.risk.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">{patient.lastActive}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelectPatient(patient.id)}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                >
                  View
                </button>
                <button className="font-medium text-green-600 dark:text-green-500 hover:underline mr-2">
                  Message
                </button>
                <button className="font-medium text-red-600 dark:text-red-500 hover:underline">
                  Alert
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── MESSAGE CENTER COMPONENT ─────────────────────────────────────────

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isRead: boolean;
}

interface MessageCenterProps {
  messages: Message[];
}

const MessageCenter: React.FC<MessageCenterProps> = ({ messages }) => (
  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Message Center
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 pr-6">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search messages..."
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                !message.isRead ? "bg-blue-50 dark:bg-blue-900" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {message.sender}
                    {!message.isRead && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {message.time}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-2">
        {/* Static example conversation */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Amal Perera
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Today, 10:30 AM
            </div>
          </div>
          <p className="text-gray-800 dark:text-gray-200">
            I've been feeling very low today, not sure what to do.
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4 ml-auto max-w-lg">
          <p className="text-blue-800 dark:text-blue-200">
            I understand how you're feeling, Amal. Let's talk about what's been
            happening today. Can you tell me more about what's troubling you?
          </p>
          <div className="text-right text-xs text-blue-600 dark:text-blue-300 mt-1">
            10:35 AM
          </div>
        </div>
        <div className="mt-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Type your message..."
            rows={3}
          />
          <div className="flex justify-between mt-2">
            <div>
              <button className="p-2 text-gray-500 rounded hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1 1 0 01-3 0V6a1 1 0 012 0v1.5A3.5 3.5 0 014.5 11V6a5 5 0 0110 0v4a1 1 0 11-2 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="p-2 text-gray-500 rounded hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                    clipRule="evenodd"
                  />
                  <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                </svg>
              </button>
            </div>
            <div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center space-x-2">
                <span>Send</span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── TRENDS COMPONENT ───────────────────────────────────────────────

const Trends = ({ sentimentData }: { sentimentData: SentimentData[] }) => (
  <div className="space-y-6">
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Mental Health Trends
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Overall Sentiment Distribution
          </h3>
          <div className="h-80">
            <SentimentChart data={sentimentData} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Risk Level Distribution
          </h3>
          <div className="h-80">
            <RiskBar label="High Risk" percentage={25} barColor="bg-red-600" />
            <RiskBar
              label="Medium Risk"
              percentage={40}
              barColor="bg-yellow-500"
            />
            <RiskBar label="Low Risk" percentage={35} barColor="bg-green-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── DOCTOR ADMIN PANEL (MAIN COMPONENT) ─────────────────────────────

const DoctorAdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  // Risk level color mapping for badges
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  // Patient details view
  const renderPatientDetails = () => {
    const patient = patientMockData.find((p) => p.id === selectedPatient);
    if (!patient) return null;

    return (
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Patient Details
          </h2>
          <button
            onClick={() => setSelectedPatient(null)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Patient Information
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {patient.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {patient.id}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last Active: {patient.lastActive}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Status
              </h3>
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getRiskColor(
                  patient.risk
                )}`}
              >
                {patient.status} -{" "}
                {patient.risk.charAt(0).toUpperCase() + patient.risk.slice(1)}{" "}
                Risk
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </h3>
              <div className="flex space-x-2 mt-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Message
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                  Schedule Call
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
                  Alert Emergency
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Sentiment History
            </h3>
            <div className="h-64">
              <SentimentChart data={sentimentData} />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Notes
              </h3>
              <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add clinical notes here..."
              />
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render main content based on tab or if a patient is selected
  const renderMainContent = () => {
    if (selectedPatient) return renderPatientDetails();

    switch (activeTab) {
      case "dashboard":
        return <Dashboard sentimentData={sentimentData} />;
      case "users":
        return (
          <PatientManagement
            patients={patientMockData}
            onSelectPatient={setSelectedPatient}
            getRiskColor={getRiskColor}
          />
        );
      case "inbox":
        return <MessageCenter messages={messagesMock} />;
      case "trends":
        return <Trends sentimentData={sentimentData} />;
      default:
        return <Dashboard sentimentData={sentimentData} />;
    }
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Flowbite
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  </button>
                </div>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      Neil Sims
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setSelectedPatient(null);
                }}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("users");
                  setSelectedPatient(null);
                }}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <svg
                  className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Patients</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("inbox");
                  setSelectedPatient(null);
                }}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("trends");
                  setSelectedPatient(null);
                }}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <svg
                  className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Trends</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 sm:ml-64 pt-20">{renderMainContent()}</div>
    </div>
  );
};

export default DoctorAdminPanel;
