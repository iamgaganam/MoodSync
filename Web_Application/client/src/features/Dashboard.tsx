// File: client/src/features/profile/Dashboard.tsx
import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

const MoodChart = () => {
  // In a real app, you would use a library like Recharts or Chart.js
  return (
    <div className="h-64 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
      <p className="text-gray-500">Mood trend chart will be rendered here</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // Sample data - would come from your API in a real app
  const stats = [
    {
      name: "Current Mood",
      value: "Moderate",
      change: "improved",
      changeValue: "+15%",
    },
    {
      name: "Weekly Check-ins",
      value: "5/7",
      change: "steady",
      changeValue: "0%",
    },
    {
      name: "Stress Level",
      value: "Low",
      change: "improved",
      changeValue: "-20%",
    },
    {
      name: "Sleep Quality",
      value: "Good",
      change: "declined",
      changeValue: "-5%",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Mood Log",
      time: "2 hours ago",
      description: 'Recorded mood as "Happy"',
    },
    {
      id: 2,
      type: "Journal",
      time: "Yesterday",
      description: "Wrote about work progress",
    },
    {
      id: 3,
      type: "Social Media",
      time: "2 days ago",
      description: "Connected Twitter account",
    },
    {
      id: 4,
      type: "Chatbot",
      time: "3 days ago",
      description: "Chatted about stress management",
    },
  ];

  const resources = [
    { id: 1, title: "Managing Workplace Anxiety", type: "Article" },
    { id: 2, title: "Deep Breathing Exercises", type: "Technique" },
    { id: 3, title: "Understanding Depression", type: "Video" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow px-4 py-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {stat.name}
            </dt>
            <dd className="mt-1 text-xl font-semibold text-gray-900">
              {stat.value}
            </dd>
            <div
              className={`mt-2 flex items-center text-sm ${
                stat.change === "improved"
                  ? "text-green-600"
                  : stat.change === "declined"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {stat.change === "improved" ? (
                <ArrowUpIcon className="h-4 w-4 flex-shrink-0 mr-1" />
              ) : stat.change === "declined" ? (
                <ArrowDownIcon className="h-4 w-4 flex-shrink-0 mr-1" />
              ) : null}
              <span>{stat.changeValue} from last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mood Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Your Mood Trends
        </h3>
        <MoodChart />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900">
                    {activity.type}
                  </h4>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all activity
            </a>
          </div>
        </div>

        {/* Recommended Resources */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recommended Resources
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {resources.map((resource) => (
              <div key={resource.id} className="p-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900">
                    {resource.title}
                  </h4>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {resource.type}
                  </span>
                </div>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Resource
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Browse all resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
