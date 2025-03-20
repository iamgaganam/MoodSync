import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  FiUsers,
  FiMessageSquare,
  FiAlertTriangle,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import {
  BsPeopleFill,
  BsFileEarmarkText,
  BsClipboardData,
  BsCalendarCheck,
} from "react-icons/bs";
import {
  MdOutlineDashboard,
  MdOutlineNotifications,
  MdOutlineHealthAndSafety,
} from "react-icons/md";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: "active" | "inactive" | "blocked";
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  patients: number;
  availableSlots: number;
  status: "available" | "busy" | "offline";
}

interface Alert {
  id: string;
  userId: string;
  userName: string;
  type: "critical" | "warning" | "info";
  message: string;
  date: string;
  status: "new" | "acknowledged" | "resolved";
}

interface HealthMetric {
  month: string;
  newUsers: number;
  activeSessions: number;
  averageMoodScore: number;
  criticalAlerts: number;
}

const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showDoctorModal, setShowDoctorModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Mock data loading
  useEffect(() => {
    // Simulating API calls
    const fetchData = async () => {
      // In a real app, these would be API calls
      setUsers([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          lastActive: "2025-03-17",
          status: "active",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          lastActive: "2025-03-16",
          status: "active",
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "user",
          lastActive: "2025-03-10",
          status: "inactive",
        },
        {
          id: "4",
          name: "Alice Brown",
          email: "alice@example.com",
          role: "user",
          lastActive: "2025-03-15",
          status: "active",
        },
        {
          id: "5",
          name: "Charlie Wilson",
          email: "charlie@example.com",
          role: "user",
          lastActive: "2025-03-01",
          status: "blocked",
        },
      ]);

      setDoctors([
        {
          id: "1",
          name: "Dr. Sarah Lee",
          specialization: "Psychiatrist",
          patients: 28,
          availableSlots: 5,
          status: "available",
        },
        {
          id: "2",
          name: "Dr. Michael Chen",
          specialization: "Psychologist",
          patients: 35,
          availableSlots: 0,
          status: "busy",
        },
        {
          id: "3",
          name: "Dr. Emily Taylor",
          specialization: "Therapist",
          patients: 22,
          availableSlots: 3,
          status: "available",
        },
        {
          id: "4",
          name: "Dr. David Rodriguez",
          specialization: "Counselor",
          patients: 19,
          availableSlots: 4,
          status: "available",
        },
        {
          id: "5",
          name: "Dr. Lisa Patel",
          specialization: "Psychiatrist",
          patients: 31,
          availableSlots: 2,
          status: "offline",
        },
      ]);

      setAlerts([
        {
          id: "1",
          userId: "1",
          userName: "John Doe",
          type: "critical",
          message: "Expressed suicidal thoughts",
          date: "2025-03-18 09:30",
          status: "new",
        },
        {
          id: "2",
          userId: "2",
          userName: "Jane Smith",
          type: "warning",
          message: "Declining mood patterns detected",
          date: "2025-03-17 15:45",
          status: "acknowledged",
        },
        {
          id: "3",
          userId: "4",
          userName: "Alice Brown",
          type: "info",
          message: "Multiple canceled therapy sessions",
          date: "2025-03-16 11:20",
          status: "resolved",
        },
        {
          id: "4",
          userId: "3",
          userName: "Bob Johnson",
          type: "warning",
          message: "Increased anxiety indicators",
          date: "2025-03-18 07:15",
          status: "new",
        },
        {
          id: "5",
          userId: "5",
          userName: "Charlie Wilson",
          type: "critical",
          message: "Self-harm references detected",
          date: "2025-03-18 10:05",
          status: "new",
        },
      ]);

      setHealthMetrics([
        {
          month: "Jan",
          newUsers: 120,
          activeSessions: 450,
          averageMoodScore: 6.8,
          criticalAlerts: 12,
        },
        {
          month: "Feb",
          newUsers: 150,
          activeSessions: 520,
          averageMoodScore: 6.5,
          criticalAlerts: 15,
        },
        {
          month: "Mar",
          newUsers: 200,
          activeSessions: 650,
          averageMoodScore: 6.7,
          criticalAlerts: 18,
        },
        {
          month: "Apr",
          newUsers: 180,
          activeSessions: 600,
          averageMoodScore: 7.0,
          criticalAlerts: 14,
        },
        {
          month: "May",
          newUsers: 210,
          activeSessions: 700,
          averageMoodScore: 7.2,
          criticalAlerts: 10,
        },
        {
          month: "Jun",
          newUsers: 250,
          activeSessions: 800,
          averageMoodScore: 7.5,
          criticalAlerts: 8,
        },
      ]);
    };

    fetchData();
  }, []);

  // Chart configurations
  const userActivityData = {
    labels: healthMetrics.map((metric) => metric.month),
    datasets: [
      {
        label: "New Users",
        data: healthMetrics.map((metric) => metric.newUsers),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Active Sessions",
        data: healthMetrics.map((metric) => metric.activeSessions),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const moodScoreData = {
    labels: healthMetrics.map((metric) => metric.month),
    datasets: [
      {
        label: "Average Mood Score",
        data: healthMetrics.map((metric) => metric.averageMoodScore),
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderWidth: 2,
      },
    ],
  };

  const alertsData = {
    labels: healthMetrics.map((metric) => metric.month),
    datasets: [
      {
        label: "Critical Alerts",
        data: healthMetrics.map((metric) => metric.criticalAlerts),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
    ],
  };

  const userStatusData = {
    labels: ["Active", "Inactive", "Blocked"],
    datasets: [
      {
        data: [
          users.filter((user) => user.status === "active").length,
          users.filter((user) => user.status === "inactive").length,
          users.filter((user) => user.status === "blocked").length,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(255, 99, 132, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Helper functions for filtering and modals
  const filterUsers = () => {
    if (!searchQuery) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterDoctors = () => {
    if (!searchQuery) return doctors;
    return doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterAlerts = () => {
    if (!searchQuery) return alerts;
    return alerts.filter(
      (alert) =>
        alert.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const openUserModal = (user: User | null = null) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const openDoctorModal = (doctor: Doctor | null = null) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const closeModals = () => {
    setShowUserModal(false);
    setShowDoctorModal(false);
    setSelectedUser(null);
    setSelectedDoctor(null);
  };

  // UI Components

  // User Modal for Adding/Editing Users
  const UserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {selectedUser ? "Edit User" : "Add New User"}
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              defaultValue={selectedUser?.name || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-2"
              defaultValue={selectedUser?.email || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              defaultValue={selectedUser?.role || "user"}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              defaultValue={selectedUser?.status || "active"}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={closeModals}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={closeModals}
            >
              {selectedUser ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Doctor Modal for Adding/Editing Doctors
  const DoctorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              defaultValue={selectedDoctor?.name || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Specialization</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              defaultValue={selectedDoctor?.specialization || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Available Slots</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md p-2"
              defaultValue={selectedDoctor?.availableSlots || 0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              defaultValue={selectedDoctor?.status || "available"}
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={closeModals}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={closeModals}
            >
              {selectedDoctor ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Navbar Component
  const Navbar = () => (
    <div className="bg-white shadow-md h-16 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <MdOutlineHealthAndSafety className="text-blue-600 text-3xl mr-2" />
        <h1 className="text-xl font-bold">MoodSync Admin</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <MdOutlineNotifications className="text-2xl text-gray-600 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-500 rounded-full text-white flex items-center justify-center">
            A
          </div>
          <span className="font-medium">Admin</span>
        </div>
      </div>
    </div>
  );

  // Sidebar Component
  const Sidebar = () => (
    <div className="bg-gray-800 text-white w-64 flex flex-col h-screen">
      <div className="p-4">
        <div className="flex items-center justify-center mb-6">
          <MdOutlineHealthAndSafety className="text-3xl mr-2" />
          <h2 className="text-lg font-semibold">MoodSync</h2>
        </div>
        <nav className="space-y-1">
          <button
            className={`flex items-center space-x-3 ${
              activeTab === "dashboard" ? "bg-blue-600" : "hover:bg-gray-700"
            } w-full px-4 py-3 rounded-md transition-colors`}
            onClick={() => setActiveTab("dashboard")}
          >
            <MdOutlineDashboard />
            <span>Dashboard</span>
          </button>
          <button
            className={`flex items-center space-x-3 ${
              activeTab === "users" ? "bg-blue-600" : "hover:bg-gray-700"
            } w-full px-4 py-3 rounded-md transition-colors`}
            onClick={() => setActiveTab("users")}
          >
            <FiUsers />
            <span>Users</span>
          </button>
          <button
            className={`flex items-center space-x-3 ${
              activeTab === "doctors" ? "bg-blue-600" : "hover:bg-gray-700"
            } w-full px-4 py-3 rounded-md transition-colors`}
            onClick={() => setActiveTab("doctors")}
          >
            <BsPeopleFill />
            <span>Doctors</span>
          </button>
          <button
            className={`flex items-center space-x-3 ${
              activeTab === "alerts" ? "bg-blue-600" : "hover:bg-gray-700"
            } w-full px-4 py-3 rounded-md transition-colors`}
            onClick={() => setActiveTab("alerts")}
          >
            <FiAlertTriangle />
            <span>Alerts</span>
          </button>
          <button
            className={`flex items-center space-x-3 ${
              activeTab === "content" ? "bg-blue-600" : "hover:bg-gray-700"
            } w-full px-4 py-3 rounded-md transition-colors`}
            onClick={() => setActiveTab("content")}
          >
            <BsFileEarmarkText />
            <span>Content</span>
          </button>
          <button
            className={`flex items-center space-x-3 ${
              activeTab === "reports" ? "bg-blue-600" : "hover:bg-gray-700"
            } w-full px-4 py-3 rounded-md transition-colors`}
            onClick={() => setActiveTab("reports")}
          >
            <BsClipboardData />
            <span>Reports</span>
          </button>
          <button
            className={`flex items-center space-x-3 ${
              activeTab === "settings" ? "bg-blue-600" : "hover:bg-gray-700"
            } w-full px-4 py-3 rounded-md transition-colors`}
            onClick={() => setActiveTab("settings")}
          >
            <FiSettings />
            <span>Settings</span>
          </button>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <button className="flex items-center space-x-3 hover:bg-gray-700 w-full px-4 py-3 rounded-md transition-colors">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`rounded-full ${color} p-4 mr-4`}>{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          icon={<FiUsers className="text-white text-xl" />}
          color="bg-blue-600"
        />
        <StatCard
          title="Mental Health Professionals"
          value={doctors.length.toString()}
          icon={<BsPeopleFill className="text-white text-xl" />}
          color="bg-green-600"
        />
        <StatCard
          title="Active Alerts"
          value={alerts.filter((a) => a.status === "new").length.toString()}
          icon={<FiAlertTriangle className="text-white text-xl" />}
          color="bg-red-600"
        />
        <StatCard
          title="Sessions Today"
          value="42"
          icon={<BsCalendarCheck className="text-white text-xl" />}
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">User Activity</h2>
          <div className="h-64">
            <Line
              data={userActivityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Average Mood Score</h2>
          <div className="h-64">
            <Line
              data={moodScoreData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: false, min: 5, max: 10 },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">User Status</h2>
          <div className="h-64 flex items-center justify-center">
            <Pie
              data={userStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Critical Alerts</h2>
          <div className="h-64">
            <Bar
              data={alertsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.slice(0, 5).map((alert) => (
                <tr key={alert.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {alert.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alert.type === "critical"
                          ? "bg-red-100 text-red-800"
                          : alert.type === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {alert.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alert.status === "new"
                          ? "bg-red-100 text-red-800"
                          : alert.status === "acknowledged"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Users Management View
  const UsersView = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Users Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => openUserModal()}
          >
            <FiPlus className="mr-1" /> Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filterUsers().map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "inactive"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openUserModal(user)}
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <FiMessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{filterUsers().length}</span> of{" "}
          <span className="font-medium">{users.length}</span> users
        </div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 rounded-md px-3 py-1 disabled:opacity-50">
            Previous
          </button>
          <button className="border border-gray-300 rounded-md px-3 py-1">
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Doctors Management View
  const DoctorsView = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Mental Health Professionals</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => openDoctorModal()}
          >
            <FiPlus className="mr-1" /> Add Doctor
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available Slots
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filterDoctors().map((doctor) => (
              <tr key={doctor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{doctor.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doctor.specialization}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doctor.patients}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doctor.availableSlots}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      doctor.status === "available"
                        ? "bg-green-100 text-green-800"
                        : doctor.status === "busy"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {doctor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openDoctorModal(doctor)}
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <FiMessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{filterDoctors().length}</span> of{" "}
          <span className="font-medium">{doctors.length}</span> professionals
        </div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 rounded-md px-3 py-1 disabled:opacity-50">
            Previous
          </button>
          <button className="border border-gray-300 rounded-md px-3 py-1">
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Alerts View
  const AlertsView = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Mental Health Alerts</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="border border-gray-300 rounded-md px-3 py-2">
            <option value="">All Types</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filterAlerts().map((alert) => (
              <tr key={alert.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {alert.userName}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {alert.userId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alert.type === "critical"
                        ? "bg-red-100 text-red-800"
                        : alert.type === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {alert.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alert.status === "new"
                        ? "bg-red-100 text-red-800"
                        : alert.status === "acknowledged"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <FiMessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{filterAlerts().length}</span> of{" "}
          <span className="font-medium">{alerts.length}</span> alerts
        </div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 rounded-md px-3 py-1 disabled:opacity-50">
            Previous
          </button>
          <button className="border border-gray-300 rounded-md px-3 py-1">
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Content Management View
  const ContentView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Motivational Quotes</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <FiPlus className="mr-1" /> Add Quote
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  The greatest glory in living lies not in never falling, but in
                  rising every time we fall.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Nelson Mandela
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Resilience
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Your mental health is a priority. Your happiness is essential.
                  Your self-care is a necessity.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Unknown
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Self-care
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Mental Health Resources</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <FiPlus className="mr-1" /> Add Resource
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    Mindfulness Techniques for Anxiety
                  </div>
                  <div className="text-sm text-gray-500">
                    A guide to managing anxiety through mindfulness
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Article
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Anxiety
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Published
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    Understanding Depression
                  </div>
                  <div className="text-sm text-gray-500">
                    Comprehensive guide to depression symptoms and treatment
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Guide
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Depression
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Published
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Chatbot Configurations</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Edit Configurations
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Response Templates</h3>
            <p className="text-sm text-gray-500 mb-2">
              Pre-configured responses for common user inputs
            </p>
            <div className="flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Manage Templates
              </button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">
              Crisis Detection Keywords
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Keywords that trigger crisis protocols
            </p>
            <div className="flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Edit Keywords
              </button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">
              Sentiment Analysis Settings
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Configure sentiment thresholds and actions
            </p>
            <div className="flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Adjust Settings
              </button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Training Data</h3>
            <p className="text-sm text-gray-500 mb-2">
              Manage ML model training data
            </p>
            <div className="flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                View Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Reports View
  const ReportsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">User Activity Report</h3>
            <p className="text-sm text-gray-500 mb-4">
              User engagement, sessions, and interaction data
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
              Generate
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">Mental Health Trends</h3>
            <p className="text-sm text-gray-500 mb-4">
              Aggregate mood scores and sentiment analysis over time
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
              Generate
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">Crisis Intervention Report</h3>
            <p className="text-sm text-gray-500 mb-4">
              Summary of alerts, interventions, and outcomes
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
              Generate
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">
              Healthcare Provider Performance
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Response times, patient ratings, and session metrics
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
              Generate
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">Content Effectiveness</h3>
            <p className="text-sm text-gray-500 mb-4">
              Engagement with resources, articles, and recommendations
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
              Generate
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">Custom Report</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create a report with custom metrics and parameters
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Reports</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option value="">All Report Types</option>
              <option value="activity">User Activity</option>
              <option value="trends">Mental Health Trends</option>
              <option value="crisis">Crisis Intervention</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    Monthly User Activity Summary
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  User Activity
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Admin
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2025-03-01
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <BsFileEarmarkText className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    Q1 Mental Health Trends
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Mental Health Trends
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Admin
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2025-02-15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <BsFileEarmarkText className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Settings View
  const SettingsView = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-6">System Settings</h2>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Site Title
          </label>
          <input
            type="text"
            defaultValue="MoodSync Admin"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enable Notifications
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Maintenance Mode
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="off">Off</option>
            <option value="on">On</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "users" && <UsersView />}
          {activeTab === "doctors" && <DoctorsView />}
          {activeTab === "alerts" && <AlertsView />}
          {activeTab === "content" && <ContentView />}
          {activeTab === "reports" && <ReportsView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
      {showUserModal && <UserModal />}
      {showDoctorModal && <DoctorModal />}
    </div>
  );
};

export default AdminDashboard;
