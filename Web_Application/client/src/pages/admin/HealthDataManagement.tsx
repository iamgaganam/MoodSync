// src/pages/admin/HealthDataManagement.tsx
import React, { useState } from "react";
import { Download, Search, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { LineChart } from "recharts";
// Mock health data
const mockHealthData = [
  {
    id: 1,
    userId: "U1001",
    date: "2023-09-01",
    sentiment: 0.75,
    anxiety: 0.3,
    depression: 0.2,
    sleep: 7.5,
  },
  {
    id: 2,
    userId: "U1001",
    date: "2023-09-02",
    sentiment: 0.65,
    anxiety: 0.4,
    depression: 0.3,
    sleep: 7.0,
  },
  {
    id: 3,
    userId: "U1001",
    date: "2023-09-03",
    sentiment: 0.8,
    anxiety: 0.2,
    depression: 0.1,
    sleep: 8.0,
  },
  {
    id: 4,
    userId: "U1002",
    date: "2023-09-01",
    sentiment: 0.45,
    anxiety: 0.6,
    depression: 0.5,
    sleep: 5.5,
  },
  {
    id: 5,
    userId: "U1002",
    date: "2023-09-02",
    sentiment: 0.4,
    anxiety: 0.7,
    depression: 0.6,
    sleep: 5.0,
  },
  {
    id: 6,
    userId: "U1002",
    date: "2023-09-03",
    sentiment: 0.5,
    anxiety: 0.5,
    depression: 0.4,
    sleep: 6.0,
  },
  {
    id: 7,
    userId: "U1003",
    date: "2023-09-01",
    sentiment: 0.85,
    anxiety: 0.1,
    depression: 0.1,
    sleep: 8.5,
  },
  {
    id: 8,
    userId: "U1003",
    date: "2023-09-02",
    sentiment: 0.8,
    anxiety: 0.2,
    depression: 0.2,
    sleep: 8.0,
  },
  {
    id: 9,
    userId: "U1003",
    date: "2023-09-03",
    sentiment: 0.9,
    anxiety: 0.1,
    depression: 0.1,
    sleep: 9.0,
  },
];

const HealthDataManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");

  // Mock data for charts
  const chartData = [
    { date: "Mon", sentiment: 0.65, anxiety: 0.35, depression: 0.25 },
    { date: "Tue", sentiment: 0.7, anxiety: 0.3, depression: 0.2 },
    { date: "Wed", sentiment: 0.6, anxiety: 0.4, depression: 0.3 },
    { date: "Thu", sentiment: 0.75, anxiety: 0.25, depression: 0.15 },
    { date: "Fri", sentiment: 0.8, anxiety: 0.2, depression: 0.1 },
    { date: "Sat", sentiment: 0.85, anxiety: 0.15, depression: 0.05 },
    { date: "Sun", sentiment: 0.75, anxiety: 0.25, depression: 0.15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Health Data Management
        </h1>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md text-sm text-gray-700 px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "sentiments"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("sentiments")}
            >
              Sentiment Analysis
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "mental"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("mental")}
            >
              Mental Health Metrics
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "reports"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Overall Sentiment
                    </h3>
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900">76%</p>
                  <p className="text-sm text-gray-500">
                    Positive sentiment across all users
                  </p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: "76%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Anxiety Levels
                    </h3>
                    <div className="p-2 bg-red-100 rounded-full">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900">28%</p>
                  <p className="text-sm text-gray-500">
                    Average anxiety indicators
                  </p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Depression Risk
                    </h3>
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingDown className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900">19%</p>
                  <p className="text-sm text-gray-500">
                    Average depression indicators
                  </p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: "19%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Mental Health Trends
                  </h3>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="sentiment"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Positive Sentiment"
                        />
                        <Line
                          type="monotone"
                          dataKey="anxiety"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="Anxiety"
                        />
                        <Line
                          type="monotone"
                          dataKey="depression"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Depression"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recent Health Data
                  </h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User ID
                        </th>
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
                          Sentiment
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Anxiety
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Depression
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Sleep (hrs)
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
                      {mockHealthData.map((data) => (
                        <tr key={data.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {data.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(data.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  data.sentiment > 0.7
                                    ? "bg-green-500"
                                    : data.sentiment > 0.4
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span className="text-sm text-gray-700">
                                {(data.sentiment * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  data.anxiety < 0.3
                                    ? "bg-green-500"
                                    : data.anxiety < 0.6
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span className="text-sm text-gray-700">
                                {(data.anxiety * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  data.depression < 0.2
                                    ? "bg-green-500"
                                    : data.depression < 0.5
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span className="text-sm text-gray-700">
                                {(data.depression * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  data.sleep > 7
                                    ? "bg-green-500"
                                    : data.sleep > 5
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span className="text-sm text-gray-700">
                                {data.sleep} hrs
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">9</span> of{" "}
                      <span className="font-medium">245</span> records
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "overview" && (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-500">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content
                will be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDataManagement;
