// src/pages/doctor/DoctorDashboard.tsx
import React from "react";
import {
  Users,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", patients: 5, messages: 12 },
  { name: "Tue", patients: 6, messages: 8 },
  { name: "Wed", patients: 8, messages: 15 },
  { name: "Thu", patients: 7, messages: 9 },
  { name: "Fri", patients: 9, messages: 14 },
  { name: "Sat", patients: 4, messages: 7 },
  { name: "Sun", patients: 2, messages: 5 },
];

// Mock patient data
const recentPatients = [
  {
    id: "P1001",
    name: "Emma Johnson",
    status: "Stable",
    lastCheck: "2 hours ago",
    sentiment: 0.75,
    risk: "Low",
  },
  {
    id: "P1002",
    name: "James Wilson",
    status: "Needs Review",
    lastCheck: "1 day ago",
    sentiment: 0.45,
    risk: "Medium",
  },
  {
    id: "P1003",
    name: "Sarah Lee",
    status: "Critical",
    lastCheck: "4 hours ago",
    sentiment: 0.25,
    risk: "High",
  },
  {
    id: "P1004",
    name: "Michael Brown",
    status: "Stable",
    lastCheck: "5 hours ago",
    sentiment: 0.65,
    risk: "Low",
  },
];

// Mock appointment data
const upcomingAppointments = [
  {
    id: "A1001",
    patient: "Emma Johnson",
    time: "10:00 AM",
    date: "2023-09-15",
    status: "Confirmed",
  },
  {
    id: "A1002",
    patient: "James Wilson",
    time: "2:30 PM",
    date: "2023-09-15",
    status: "Pending",
  },
  {
    id: "A1003",
    patient: "Sarah Lee",
    time: "11:15 AM",
    date: "2023-09-16",
    status: "Confirmed",
  },
];

const DoctorDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="bg-white border border-gray-300 text-gray-700 rounded-md p-2 text-sm">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-full">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Patients
              </p>
              <p className="text-2xl font-semibold text-gray-800">28</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="ml-1 text-sm text-gray-600">5% increase</span>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Appointments</p>
              <p className="text-2xl font-semibold text-gray-800">
                {upcomingAppointments.length}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="ml-1 text-sm text-gray-600">Upcoming</span>
          </div>
        </div>

        {/* New Messages */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Messages</p>
              <p className="text-2xl font-semibold text-gray-800">24</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="ml-1 text-sm text-gray-600">2% increase</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Alerts</p>
              <p className="text-2xl font-semibold text-gray-800">4</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">Pending Alerts</span>
          </div>
        </div>
      </div>

      {/* Weekly Overview Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Weekly Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="patients"
              stroke="#4ade80"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="messages"
              stroke="#60a5fa"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Patients and Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Patients
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 text-sm">
                <th className="pb-2">ID</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Last Check</th>
                <th className="pb-2">Sentiment</th>
                <th className="pb-2">Risk</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="py-2">{patient.id}</td>
                  <td className="py-2">{patient.name}</td>
                  <td className="py-2">{patient.status}</td>
                  <td className="py-2">{patient.lastCheck}</td>
                  <td className="py-2">
                    {Math.round(patient.sentiment * 100)}%
                  </td>
                  <td className="py-2">{patient.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Appointments
          </h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {appointment.status}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
