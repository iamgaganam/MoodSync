// src/pages/admin/AdminDashboard.tsx
import React from "react";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Stethoscope,
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
  { name: "Jan", users: 40, alerts: 24 },
  { name: "Feb", users: 45, alerts: 18 },
  { name: "Mar", users: 65, alerts: 35 },
  { name: "Apr", users: 90, alerts: 40 },
  { name: "May", users: 120, alerts: 45 },
  { name: "Jun", users: 130, alerts: 50 },
  { name: "Jul", users: 150, alerts: 30 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="bg-white border border-gray-300 text-gray-700 rounded-md p-2 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>This year</option>
          </select>
          <button className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-800">3,721</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-green-500 ml-1">
              +12% from last month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Alerts</p>
              <p className="text-2xl font-semibold text-gray-800">42</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium text-red-500 ml-1">
              +8% from last week
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Stethoscope className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Professionals
              </p>
              <p className="text-2xl font-semibold text-gray-800">85</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-green-500 ml-1">
              +5 new this month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Sessions
              </p>
              <p className="text-2xl font-semibold text-gray-800">12,543</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-green-500 ml-1">
              +18% from last month
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              User Growth & Alerts
            </h2>
            <select className="bg-white border border-gray-300 text-gray-700 rounded-md p-1 text-sm">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Alerts
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    User ID: 4{item}69{item}
                  </p>
                  <p className="text-xs text-gray-500">
                    High risk indicators detected
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">
                      View Details
                    </button>
                    <button className="text-xs text-gray-600 hover:text-gray-800">
                      Assign
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {item}h ago
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-800">
              View All Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
