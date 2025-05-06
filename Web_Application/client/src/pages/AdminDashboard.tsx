// File: client/src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  BarChart2,
  Bell,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";

// -------------------------
// TypeScript Interfaces
// -------------------------
interface Activity {
  type: string;
  detail: string;
  time: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  active: boolean;
  joinDate: string;
  currentMood: number;
  riskLevel: string;
  recentActivity: Activity[];
  lastActive: string;
  assignedTo: string;
}

interface AlertData {
  id: number;
  type: string;
  description: string;
  userName: string;
  userId: number;
  userContact: string;
  timestamp: string;
  status: string;
  severity: string;
  triggerDetail: string;
  triggerContent: string;
  recommendedActions: string[];
}

interface Assignment {
  userName: string;
  status: string;
}

interface ProfessionalData {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  hospital: string;
  active: boolean;
  joinDate: string;
  verified: boolean;
  specialty: string;
  specializations: string[];
  languages: string[];
  education: string;
  licenseNumber: string;
  currentAssignments: Assignment[];
  availabilityStatus: string;
  availableHours: string;
  nextAvailableSlot: string;
}

interface ApiProfessional {
  _id: string | number;
  name: string;
  email: string;
  phone: string;
  hospital: string;
  active: boolean;
  joinDate: string;
  verified: boolean;
  specialty: string;
  specializations: string[];
  languages: string[];
  education: string;
  licenseNumber: string;
  currentAssignments: Assignment[];
  availabilityStatus: string;
  availableHours: string;
  profileImagePath: string;
  licenseCertificatePath: string;
  createdAt: string;
  createdBy: string;
}

interface UserActivity {
  type: string;
  user: string;
  action: string;
  time: string;
}

interface MoodDistribution {
  label: string;
  percentage: number;
}

interface AnalyticsData {
  overallSentiment: number;
  recentActivity: UserActivity[];
  moodDistribution: MoodDistribution[];
}

interface NotificationData {
  id: number;
  message: string;
}

// New interface for professional form data
interface ProfessionalFormData {
  name: string;
  email: string;
  phone: string;
  hospital: string;
  specialty: string;
  specializations: string[];
  languages: string[];
  education: string;
  licenseNumber: string;
  availableHours: string;
  profileImage?: File | null;
  licenseCertificate?: File | null;
}

// -------------------------
// Component Props Interfaces
// -------------------------
interface SidebarLinkProps {
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  onClick: () => void;
  collapsed: boolean;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  positive: boolean;
}

interface QuickActionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface DashboardContentProps {
  analytics: AnalyticsData | null;
  users: UserData[];
  alerts: AlertData[];
  professionals: ProfessionalData[];
}

interface UsersContentProps {
  users: UserData[];
  onUserSelect: (user: UserData) => void;
}

interface AlertsContentProps {
  alerts: AlertData[];
  onAlertSelect: (alert: AlertData) => void;
}

interface ProfessionalsContentProps {
  professionals: ProfessionalData[];
  onProfessionalSelect: (professional: ProfessionalData) => void;
  onAddProfessional: () => void;
}

interface AnalyticsContentProps {
  analytics: AnalyticsData | null;
}

interface AddProfessionalModalProps {
  onClose: () => void;
  onSave: (professional: ProfessionalFormData) => void;
}

// -------------------------
// Helper Functions
// -------------------------
const getMoodColor = (mood: number): string => {
  if (mood < 33) return "bg-red-500";
  if (mood < 66) return "bg-yellow-500";
  return "bg-green-500";
};

const getRiskColor = (risk: string): string => {
  if (risk === "High") return "bg-red-100 text-red-800";
  if (risk === "Medium") return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

const getRiskLabel = (risk: string): string => risk;

const getAlertTypeColor = (type: string): string => {
  if (type.toLowerCase().includes("critical")) return "bg-red-50";
  return "bg-blue-50";
};

// -------------------------
// Mock Data (Updated for Sri Lanka)
// -------------------------
const mockUsers: UserData[] = [
  {
    id: 1,
    name: "Sahan Perera",
    email: "sahan@gmail.com",
    phone: "077-123-4567",
    location: "Colombo",
    active: true,
    joinDate: "2021-01-15",
    currentMood: 70,
    riskLevel: "Low",
    recentActivity: [
      { type: "Login", detail: "Logged in from mobile", time: "2 hours ago" },
      { type: "Update", detail: "Updated profile", time: "1 day ago" },
    ],
    lastActive: "10 minutes ago",
    assignedTo: "Dr. Fernando",
  },
  {
    id: 2,
    name: "Dilshan Silva",
    email: "dilshan@gmail.com",
    phone: "071-234-5678",
    location: "Kandy",
    active: true,
    joinDate: "2022-03-10",
    currentMood: 45,
    riskLevel: "Medium",
    recentActivity: [
      {
        type: "Assessment",
        detail: "Completed weekly check-in",
        time: "5 hours ago",
      },
      { type: "Chat", detail: "Messaged counselor", time: "2 days ago" },
    ],
    lastActive: "5 hours ago",
    assignedTo: "Dr. Gunawardena",
  },
  {
    id: 3,
    name: "Amali Jayawardena",
    email: "amali@gmail.com",
    phone: "075-345-6789",
    location: "Galle",
    active: false,
    joinDate: "2021-11-22",
    currentMood: 25,
    riskLevel: "High",
    recentActivity: [
      { type: "Mood", detail: "Reported low mood", time: "3 days ago" },
      {
        type: "Assessment",
        detail: "Missed scheduled assessment",
        time: "1 week ago",
      },
    ],
    lastActive: "3 days ago",
    assignedTo: "Dr. Fernando",
  },
];

const mockAlerts: AlertData[] = [
  {
    id: 1,
    type: "Critical",
    description: "User reported severe distress",
    userName: "Amali Jayawardena",
    userId: 3,
    userContact: "amali@gmail.com",
    timestamp: "2023-03-15 10:30 AM",
    status: "New",
    severity: "Critical",
    triggerDetail: "Detected unusual behavior patterns",
    triggerContent: "User mentioned feeling hopeless",
    recommendedActions: [
      "Contact user immediately",
      "Escalate to professional support",
    ],
  },
  {
    id: 2,
    type: "High",
    description: "Elevated risk behavior detected",
    userName: "Dilshan Silva",
    userId: 2,
    userContact: "dilshan@gmail.com",
    timestamp: "2023-03-16 09:15 AM",
    status: "In Progress",
    severity: "High",
    triggerDetail: "Multiple failed login attempts detected",
    triggerContent: "",
    recommendedActions: ["Reset password", "Notify user"],
  },
  {
    id: 3,
    type: "Medium",
    description: "Missed scheduled sessions",
    userName: "Kumari Fernando",
    userId: 4,
    userContact: "kumari@gmail.com",
    timestamp: "2023-03-17 14:20 PM",
    status: "Resolved",
    severity: "Medium",
    triggerDetail: "User has missed 3 consecutive appointments",
    triggerContent: "",
    recommendedActions: ["Contact user", "Reschedule appointment"],
  },
];

const mockProfessionals: ProfessionalData[] = [
  {
    id: 1,
    name: "Dr. Lasith Fernando",
    email: "dr.fernando@nationalhospital.lk",
    phone: "071-567-8901",
    hospital: "National Hospital of Sri Lanka",
    active: true,
    joinDate: "2020-08-20",
    verified: true,
    specialty: "Psychiatry",
    specializations: ["Clinical Psychology", "Cognitive Behavioral Therapy"],
    languages: ["Sinhala", "English", "Tamil"],
    education: "MD in Psychiatry, University of Colombo",
    licenseNumber: "SLMC-12345",
    currentAssignments: [
      { userName: "Sahan Perera", status: "Active" },
      { userName: "Amali Jayawardena", status: "Pending" },
    ],
    availabilityStatus: "Available",
    availableHours: "9 AM - 5 PM",
    nextAvailableSlot: "Tomorrow at 10 AM",
  },
  {
    id: 2,
    name: "Dr. Rashmi Gunawardena",
    email: "dr.gunawardena@kandy.hospital",
    phone: "077-678-9012",
    hospital: "Kandy General Hospital",
    active: true,
    joinDate: "2019-05-15",
    verified: true,
    specialty: "Clinical Psychology",
    specializations: ["Depression", "Anxiety Disorders"],
    languages: ["Sinhala", "English"],
    education: "PhD in Psychology, University of Peradeniya",
    licenseNumber: "SLMC-23456",
    currentAssignments: [{ userName: "Dilshan Silva", status: "Active" }],
    availabilityStatus: "Busy",
    availableHours: "10 AM - 6 PM",
    nextAvailableSlot: "Friday at 2 PM",
  },
  {
    id: 3,
    name: "Dr. Anura Dissanayake",
    email: "dr.dissanayake@lady-ridgeway.lk",
    phone: "070-789-0123",
    hospital: "Lady Ridgeway Hospital",
    active: true,
    joinDate: "2021-02-10",
    verified: true,
    specialty: "Child Psychology",
    specializations: ["Childhood Trauma", "Developmental Disorders"],
    languages: ["Sinhala", "English", "Tamil"],
    education: "MD in Child Psychiatry, University of Colombo",
    licenseNumber: "SLMC-34567",
    currentAssignments: [],
    availabilityStatus: "Available",
    availableHours: "8 AM - 4 PM",
    nextAvailableSlot: "Today at 3 PM",
  },
];

const mockAnalytics: AnalyticsData = {
  overallSentiment: 4.2,
  recentActivity: [
    {
      type: "login",
      user: "Sahan Perera",
      action: "Logged in",
      time: "10 minutes ago",
    },
    {
      type: "assessment",
      user: "Kesha Perera",
      action: "Completed assessment",
      time: "1 hour ago",
    },
    {
      type: "chat",
      user: "Dilshan Silva",
      action: "Started chat",
      time: "2 hours ago",
    },
    {
      type: "mood",
      user: "Amali Jayawardena",
      action: "Updated mood",
      time: "3 hours ago",
    },
    {
      type: "login",
      user: "Kumari Fernando",
      action: "Logged in",
      time: "4 hours ago",
    },
  ],
  moodDistribution: [
    { label: "Excellent", percentage: 40 },
    { label: "Normal", percentage: 35 },
    { label: "Critical", percentage: 25 },
  ],
};

const mockNotifications: NotificationData[] = [
  { id: 1, message: "New user registered from Colombo" },
  { id: 2, message: "Alert: User distress detected in Kandy" },
];

// -------------------------
// Component Implementations
// -------------------------

// SidebarLink Component
const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  title,
  isActive,
  onClick,
  collapsed,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 transition-colors ${
        isActive
          ? "bg-indigo-700 text-white"
          : "text-indigo-100 hover:bg-indigo-700"
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3 text-sm">{title}</span>}
    </button>
  );
};

// Modal Component
const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  positive,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <div className="bg-indigo-100 p-2 rounded-md text-indigo-600">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <div className="flex items-center mt-2">
        <span
          className={`text-xs ${positive ? "text-green-600" : "text-red-600"}`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};

// QuickActionCard Component
const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-shadow flex flex-col items-center text-center"
    >
      <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 mb-3">
        {icon}
      </div>
      <h3 className="font-medium">{title}</h3>
    </button>
  );
};

// DashboardContent Component
const DashboardContent: React.FC<DashboardContentProps> = ({
  analytics,
  users,
  alerts,
  professionals,
}) => {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Users"
          value={`${users.filter((u) => u.active).length}`}
          change="+5% from last week"
          icon={<Users size={20} />}
          positive={true}
        />
        <StatCard
          title="Active Professionals"
          value={`${professionals.filter((p) => p.active).length}`}
          change="+2% from last week"
          icon={<User size={20} />}
          positive={true}
        />
        <StatCard
          title="Alerts"
          value={`${alerts.filter((a) => a.status === "New").length} new`}
          change="-8% from last week"
          icon={<AlertCircle size={20} />}
          positive={true}
        />
        <StatCard
          title="Overall Mood"
          value={analytics ? `${analytics.overallSentiment}/5` : "N/A"}
          change="+0.3 from last week"
          icon={<BarChart2 size={20} />}
          positive={true}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="View Active Users"
            icon={<Users size={20} />}
            onClick={() => console.log("View users clicked")}
          />
          <QuickActionCard
            title="Manage Alerts"
            icon={<AlertCircle size={20} />}
            onClick={() => console.log("Manage alerts clicked")}
          />
          <QuickActionCard
            title="Add Professional"
            icon={<User size={20} />}
            onClick={() => console.log("Add professional clicked")}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {analytics &&
            analytics.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.type === "login"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "mood"
                      ? "bg-green-100 text-green-600"
                      : activity.type === "assessment"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {activity.type.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">
                    {activity.user} - {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg ${getAlertTypeColor(alert.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {alert.type} Alert: {alert.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {alert.userName} - {alert.timestamp}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      alert.status === "New"
                        ? "bg-red-100 text-red-800"
                        : alert.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// UsersContent Component
const UsersContent: React.FC<UsersContentProps> = ({ users, onUserSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">User Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mood
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getMoodColor(
                        user.currentMood
                      )}`}
                      style={{ width: `${user.currentMood}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(
                      user.riskLevel
                    )}`}
                  >
                    {getRiskLabel(user.riskLevel)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onUserSelect(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Contact
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

// AlertsContent Component
const AlertsContent: React.FC<AlertsContentProps> = ({
  alerts,
  onAlertSelect,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Alert Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-red-600 text-xl font-bold">
            {alerts.filter((a) => a.status === "New").length}
          </div>
          <div className="text-gray-500">New Alerts</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-yellow-600 text-xl font-bold">
            {alerts.filter((a) => a.status === "In Progress").length}
          </div>
          <div className="text-gray-500">In Progress</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-green-600 text-xl font-bold">
            {alerts.filter((a) => a.status === "Resolved").length}
          </div>
          <div className="text-gray-500">Resolved</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alert.type === "Critical"
                        ? "bg-red-100 text-red-800"
                        : alert.type === "High"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {alert.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {alert.userName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {alert.userContact}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {alert.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alert.status === "New"
                        ? "bg-red-100 text-red-800"
                        : alert.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onAlertSelect(alert)}
                    className="text-indigo-600 hover:text-indigo-900"
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

// ProfessionalsContent Component
const ProfessionalsContent: React.FC<ProfessionalsContentProps> = ({
  professionals,
  onProfessionalSelect,
  onAddProfessional,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Professional Management</h2>
        <button
          onClick={onAddProfessional}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New Professional
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Professional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {professionals.map((professional) => (
              <tr key={professional.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      {professional.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {professional.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {professional.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {professional.specialty}
                  </div>
                  <div className="text-sm text-gray-500">
                    {professional.hospital}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      professional.availabilityStatus === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {professional.availabilityStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {professional.currentAssignments.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      professional.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {professional.verified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onProfessionalSelect(professional)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Profile
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

// ChatsContent Component
const ChatsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Chat Monitoring</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">
          Chat monitoring functionality will be implemented soon.
        </p>
      </div>
    </div>
  );
};

// ContentManagementContent Component
const ContentManagementContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Content Management</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">
          Content management functionality will be implemented soon.
        </p>
      </div>
    </div>
  );
};

// AnalyticsContent Component
const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Analytics & Reports</h2>

      {analytics ? (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-md font-medium mb-4">Overall Sentiment</h3>
            <div className="flex items-end space-x-2">
              <div className="text-3xl font-bold">
                {analytics.overallSentiment}
              </div>
              <div className="text-sm text-gray-500">/5</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-md font-medium mb-4">Mood Distribution</h3>
            <div className="space-y-4">
              {analytics.moodDistribution.map((mood, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm">
                    <span>{mood.label}</span>
                    <span>{mood.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        mood.label === "Excellent"
                          ? "bg-green-500"
                          : mood.label === "Normal"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${mood.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-md font-medium mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === "login"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "mood"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "assessment"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {activity.type.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">
                      {activity.user} - {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      )}
    </div>
  );
};

// SettingsContent Component
const SettingsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">System Settings</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">
          Settings functionality will be implemented soon.
        </p>
      </div>
    </div>
  );
};

// HelpContent Component
const HelpContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Help & Documentation</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">
          Help and documentation will be available soon.
        </p>
      </div>
    </div>
  );
};

// AddProfessionalModal Component
const AddProfessionalModal: React.FC<AddProfessionalModalProps> = ({
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProfessionalFormData>({
    name: "",
    email: "",
    phone: "",
    hospital: "",
    specialty: "",
    specializations: [],
    languages: [],
    education: "",
    licenseNumber: "",
    availableHours: "",
    profileImage: null,
    licenseCertificate: null,
  });

  const [specializationInput, setSpecializationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const addSpecialization = () => {
    if (specializationInput.trim()) {
      setFormData({
        ...formData,
        specializations: [
          ...formData.specializations,
          specializationInput.trim(),
        ],
      });
      setSpecializationInput("");
    }
  };

  const removeSpecialization = (index: number) => {
    const updated = [...formData.specializations];
    updated.splice(index, 1);
    setFormData({ ...formData, specializations: updated });
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()],
      });
      setLanguageInput("");
    }
  };

  const removeLanguage = (index: number) => {
    const updated = [...formData.languages];
    updated.splice(index, 1);
    setFormData({ ...formData, languages: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal title="Add New Professional" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name*
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email*
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number*
            </label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hospital/Clinic*
            </label>
            <input
              type="text"
              name="hospital"
              required
              value={formData.hospital}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Specialty*
            </label>
            <input
              type="text"
              name="specialty"
              required
              value={formData.specialty}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              License Number*
            </label>
            <input
              type="text"
              name="licenseNumber"
              required
              value={formData.licenseNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Specializations
          </label>
          <div className="flex space-x-2 mt-1">
            <input
              type="text"
              value={specializationInput}
              onChange={(e) => setSpecializationInput(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="E.g., Cognitive Behavioral Therapy"
            />
            <button
              type="button"
              onClick={addSpecialization}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.specializations.map((spec, index) => (
              <div
                key={index}
                className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => removeSpecialization(index)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Languages
          </label>
          <div className="flex space-x-2 mt-1">
            <input
              type="text"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="E.g., English"
            />
            <button
              type="button"
              onClick={addLanguage}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.languages.map((lang, index) => (
              <div
                key={index}
                className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                <span>{lang}</span>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education*
          </label>
          <textarea
            name="education"
            required
            value={formData.education}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="E.g., MD in Psychiatry, University of Colombo"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Available Hours*
          </label>
          <input
            type="text"
            name="availableHours"
            required
            value={formData.availableHours}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="E.g., 9 AM - 5 PM, Monday to Friday"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <input
              type="file"
              name="profileImage"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              accept="image/*"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              License Certificate
            </label>
            <input
              type="file"
              name="licenseCertificate"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Professional
          </button>
        </div>
      </form>
    </Modal>
  );
};

// -------------------------
// Main Admin Dashboard Component
// -------------------------
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<ProfessionalData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // New state for add professional modal
  const [showAddProfessionalModal, setShowAddProfessionalModal] =
    useState(false);

  // Updated to fetch real professionals from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch professionals from API
        const professionalsResponse = await fetch(
          "http://localhost:8000/api/professionals/"
        );

        if (!professionalsResponse.ok) {
          throw new Error(
            `Failed to fetch professionals: ${professionalsResponse.status}`
          );
        }

        const professionalsData = await professionalsResponse.json();

        // Map API data to ProfessionalData interface
        const mappedProfessionals: ProfessionalData[] = professionalsData.map(
          (prof: ApiProfessional) => ({
            id:
              typeof prof._id === "string"
                ? parseInt(prof._id.replace(/\D/g, ""), 10) || prof._id
                : prof._id,
            name: prof.name,
            email: prof.email,
            phone: prof.phone || "",
            hospital: prof.hospital || "",
            active: prof.active !== undefined ? prof.active : true,
            joinDate: prof.joinDate || new Date().toISOString().split("T")[0],
            verified: prof.verified !== undefined ? prof.verified : false,
            specialty: prof.specialty || "",
            specializations: prof.specializations || [],
            languages: prof.languages || [],
            education: prof.education || "",
            licenseNumber: prof.licenseNumber || "",
            currentAssignments: prof.currentAssignments || [],
            availabilityStatus: prof.availabilityStatus || "Available",
            availableHours: prof.availableHours || "9 AM - 5 PM",
            nextAvailableSlot: "",
          })
        );

        setProfessionals(mappedProfessionals);

        // For completeness, still fetch other data
        setUsers(mockUsers);
        setAlerts(mockAlerts);
        setAnalytics(mockAnalytics);
        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data in case of error
        setProfessionals(mockProfessionals);
        setUsers(mockUsers);
        setAlerts(mockAlerts);
        setAnalytics(mockAnalytics);
        setNotifications(mockNotifications);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle adding a new professional with improved error handling
  const handleAddProfessional = async (
    professionalData: ProfessionalFormData
  ) => {
    try {
      setLoading(true);

      // Create FormData for the API request
      const formData = new FormData();

      // Add text fields
      formData.append("name", professionalData.name);
      formData.append("email", professionalData.email);
      formData.append("phone", professionalData.phone);
      formData.append("hospital", professionalData.hospital);
      formData.append("specialty", professionalData.specialty);
      formData.append(
        "specializations",
        JSON.stringify(professionalData.specializations)
      );
      formData.append("languages", JSON.stringify(professionalData.languages));
      formData.append("education", professionalData.education);
      formData.append("licenseNumber", professionalData.licenseNumber);
      formData.append("availableHours", professionalData.availableHours);

      // Add default values
      formData.append("active", "true");
      formData.append("verified", "false");
      formData.append("joinDate", new Date().toISOString().split("T")[0]);
      formData.append("availabilityStatus", "Available");

      // Add files
      if (professionalData.profileImage) {
        formData.append("profileImage", professionalData.profileImage);
      }

      if (professionalData.licenseCertificate) {
        formData.append(
          "licenseCertificate",
          professionalData.licenseCertificate
        );
      }

      // To this:
      const response = await fetch("http://localhost:8000/api/professionals/", {
        method: "POST",
        body: formData,
      });

      // Handle response with better error checking
      const responseText = await response.text();
      let result;

      try {
        // Only try to parse as JSON if there's actual content
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse response:", responseText, e);
        throw new Error("Server returned invalid JSON response");
      }

      if (!response.ok) {
        throw new Error(result.detail || `Server error: ${response.status}`);
      }

      // After successful creation, refetch the professionals list to get updated data
      const refreshResponse = await fetch(
        "http://localhost:8000/api/professionals/"
      );
      if (!refreshResponse.ok) {
        throw new Error(
          `Failed to fetch professionals: ${refreshResponse.status}`
        );
      }

      const refreshData = await refreshResponse.json();

      // Map API data to ProfessionalData interface
      const mappedProfessionals: ProfessionalData[] = refreshData.map(
        (prof: ApiProfessional) => ({
          id:
            typeof prof._id === "string"
              ? parseInt(prof._id.replace(/\D/g, ""), 10) || prof._id
              : prof._id,
          name: prof.name,
          email: prof.email,
          phone: prof.phone || "",
          hospital: prof.hospital || "",
          active: prof.active !== undefined ? prof.active : true,
          joinDate: prof.joinDate || new Date().toISOString().split("T")[0],
          verified: prof.verified !== undefined ? prof.verified : false,
          specialty: prof.specialty || "",
          specializations: prof.specializations || [],
          languages: prof.languages || [],
          education: prof.education || "",
          licenseNumber: prof.licenseNumber || "",
          currentAssignments: prof.currentAssignments || [],
          availabilityStatus: prof.availabilityStatus || "Available",
          availableHours: prof.availableHours || "9 AM - 5 PM",
          nextAvailableSlot: "",
        })
      );

      setProfessionals(mappedProfessionals);
      setShowAddProfessionalModal(false);

      // Show success message
      alert("Professional added successfully!");
    } catch (error) {
      console.error("Error adding professional:", error);
      alert(
        `Failed to add professional: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfessionals = professionals.filter((professional) =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user: UserData) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleAlertSelect = (alert: AlertData) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const handleProfessionalSelect = (professional: ProfessionalData) => {
    setSelectedProfessional(professional);
    setShowProfessionalModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-indigo-800 text-white transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {!sidebarCollapsed && <h2 className="text-xl font-bold">MoodSync</h2>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
        </div>
        <nav className="mt-6">
          <SidebarLink
            icon={<Home size={20} />}
            title="Dashboard"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<Users size={20} />}
            title="Users"
            isActive={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<AlertCircle size={20} />}
            title="Alerts"
            isActive={activeTab === "alerts"}
            onClick={() => setActiveTab("alerts")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<User size={20} />}
            title="Professionals"
            isActive={activeTab === "professionals"}
            onClick={() => setActiveTab("professionals")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<MessageSquare size={20} />}
            title="Chat Monitor"
            isActive={activeTab === "chats"}
            onClick={() => setActiveTab("chats")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<FileText size={20} />}
            title="Content"
            isActive={activeTab === "content"}
            onClick={() => setActiveTab("content")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<BarChart2 size={20} />}
            title="Analytics"
            isActive={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<Settings size={20} />}
            title="Settings"
            isActive={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            collapsed={sidebarCollapsed}
          />
          <div className="mt-auto">
            <SidebarLink
              icon={<HelpCircle size={20} />}
              title="Help"
              isActive={activeTab === "help"}
              onClick={() => setActiveTab("help")}
              collapsed={sidebarCollapsed}
            />
            <SidebarLink
              icon={<LogOut size={20} />}
              title="Logout"
              isActive={false}
              onClick={() => console.log("Logout clicked")}
              collapsed={sidebarCollapsed}
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "users" && "User Management"}
              {activeTab === "alerts" && "Alert Management"}
              {activeTab === "professionals" && "Professional Management"}
              {activeTab === "chats" && "Chat Monitoring"}
              {activeTab === "content" && "Content Management"}
              {activeTab === "analytics" && "Analytics & Reports"}
              {activeTab === "settings" && "System Settings"}
              {activeTab === "help" && "Help & Documentation"}
            </h1>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Notification Dropdown */}
              <div className="relative">
                <button className="relative p-1 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none">
                  <Bell size={20} className="text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs text-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Admin Profile */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  A
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardContent
                  analytics={analytics}
                  users={users}
                  alerts={alerts}
                  professionals={professionals}
                />
              )}

              {activeTab === "users" && (
                <UsersContent
                  users={filteredUsers}
                  onUserSelect={handleUserSelect}
                />
              )}

              {activeTab === "alerts" && (
                <AlertsContent
                  alerts={filteredAlerts}
                  onAlertSelect={handleAlertSelect}
                />
              )}

              {activeTab === "professionals" && (
                <ProfessionalsContent
                  professionals={filteredProfessionals}
                  onProfessionalSelect={handleProfessionalSelect}
                  onAddProfessional={() => setShowAddProfessionalModal(true)}
                />
              )}

              {activeTab === "chats" && <ChatsContent />}
              {activeTab === "content" && <ContentManagementContent />}
              {activeTab === "analytics" && (
                <AnalyticsContent analytics={analytics} />
              )}
              {activeTab === "settings" && <SettingsContent />}
              {activeTab === "help" && <HelpContent />}
            </>
          )}
        </main>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <Modal title="User Details" onClose={() => setShowUserModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Contact Info</h4>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {selectedUser.phone}
                </p>
                <p>
                  <span className="text-gray-500">Location:</span>{" "}
                  {selectedUser.location}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Account Info</h4>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedUser.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser.active ? "Active" : "Inactive"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Member Since:</span>{" "}
                  {selectedUser.joinDate}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Mental Health Status
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Current Mood</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getMoodColor(
                        selectedUser.currentMood
                      )}`}
                      style={{ width: `${selectedUser.currentMood}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Critical</span>
                    <span>Normal</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Risk Assessment</p>
                  <div className="flex items-center mt-1">
                    <div
                      className={`px-2 py-1 rounded text-xs ${getRiskColor(
                        selectedUser.riskLevel
                      )}`}
                    >
                      {getRiskLabel(selectedUser.riskLevel)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Recent Activity
              </h4>
              <div className="space-y-3">
                {selectedUser.recentActivity.map(
                  (activity: Activity, idx: number) => (
                    <div key={idx} className="flex items-start">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.detail}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View Full Profile
              </button>
              <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Contact User
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Alert Detail Modal */}
      {showAlertModal && selectedAlert && (
        <Modal title="Alert Details" onClose={() => setShowAlertModal(false)}>
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${getAlertTypeColor(
                selectedAlert.type
              )}`}
            >
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-medium">
                  {selectedAlert.type} Alert
                </h3>
              </div>
              <p className="mt-1">{selectedAlert.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">
                  User Information
                </h4>
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  {selectedAlert.userName}
                </p>
                <p>
                  <span className="text-gray-500">ID:</span>{" "}
                  {selectedAlert.userId}
                </p>
                <p>
                  <span className="text-gray-500">Contact:</span>{" "}
                  {selectedAlert.userContact}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">
                  Alert Information
                </h4>
                <p>
                  <span className="text-gray-500">Detected:</span>{" "}
                  {selectedAlert.timestamp}
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedAlert.status === "New"
                        ? "bg-red-100 text-red-800"
                        : selectedAlert.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedAlert.status}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Severity:</span>{" "}
                  {selectedAlert.severity}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Trigger Details
              </h4>
              <p className="text-sm">{selectedAlert.triggerDetail}</p>
              {selectedAlert.triggerContent && (
                <div className="mt-2 p-3 bg-gray-100 rounded text-sm">
                  <p className="italic">"{selectedAlert.triggerContent}"</p>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Recommended Actions
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedAlert.recommendedActions.map(
                  (action: string, idx: number) => (
                    <li key={idx} className="text-sm">
                      {action}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Dismiss Alert
              </button>
              <button className="px-4 py-2 bg-yellow-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                Assign to Professional
              </button>
              <button className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Emergency Response
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Professional Detail Modal */}
      {showProfessionalModal && selectedProfessional && (
        <Modal
          title="Professional Details"
          onClose={() => setShowProfessionalModal(false)}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {selectedProfessional.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {selectedProfessional.name}
                </h3>
                <p className="text-gray-500">
                  {selectedProfessional.specialty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Contact Info</h4>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  {selectedProfessional.email}
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {selectedProfessional.phone}
                </p>
                <p>
                  <span className="text-gray-500">Hospital:</span>{" "}
                  {selectedProfessional.hospital}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Account Info</h4>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedProfessional.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedProfessional.active ? "Active" : "Inactive"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Member Since:</span>{" "}
                  {selectedProfessional.joinDate}
                </p>
                <p>
                  <span className="text-gray-500">Verified:</span>{" "}
                  {selectedProfessional.verified ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Professional Information
              </h4>
              <p>
                <span className="text-gray-500">Specializations:</span>{" "}
                {selectedProfessional.specializations.join(", ")}
              </p>
              <p>
                <span className="text-gray-500">Languages:</span>{" "}
                {selectedProfessional.languages.join(", ")}
              </p>
              <p>
                <span className="text-gray-500">Education:</span>{" "}
                {selectedProfessional.education}
              </p>
              <p>
                <span className="text-gray-500">License Number:</span>{" "}
                {selectedProfessional.licenseNumber}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Current Assignments
              </h4>
              <div className="space-y-2">
                {selectedProfessional.currentAssignments.length > 0 ? (
                  selectedProfessional.currentAssignments.map(
                    (assignment: Assignment, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>{assignment.userName}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            assignment.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : assignment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    No current assignments
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">Availability</h4>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedProfessional.availabilityStatus === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedProfessional.availabilityStatus}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Available Hours:</span>{" "}
                  {selectedProfessional.availableHours}
                </p>
                {selectedProfessional.nextAvailableSlot && (
                  <p>
                    <span className="text-gray-500">Next Available:</span>{" "}
                    {selectedProfessional.nextAvailableSlot}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Edit Details
              </button>
              <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Message Professional
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Professional Modal */}
      {showAddProfessionalModal && (
        <AddProfessionalModal
          onClose={() => setShowAddProfessionalModal(false)}
          onSave={handleAddProfessional}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
