// File: client/src/features/profile/WellnessTracker.tsx
import React, { useState } from "react";
import { CalendarIcon, PlusIcon } from "@heroicons/react/24/outline";

const WellnessTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("Today");

  // Sample data - would come from your API in a real app
  const moodData = [
    {
      day: "Today",
      mood: "Happy",
      score: 85,
      note: "Had a productive day at work",
    },
    {
      day: "Yesterday",
      mood: "Calm",
      score: 75,
      note: "Practiced meditation for 20 minutes",
    },
    {
      day: "Mon, Mar 3",
      mood: "Anxious",
      score: 55,
      note: "Project deadline approaching",
    },
    { day: "Sun, Mar 2", mood: "Neutral", score: 65, note: "Relaxed at home" },
    {
      day: "Sat, Mar 1",
      mood: "Energetic",
      score: 90,
      note: "Went hiking with friends",
    },
  ];

  const trackerCategories = [
    {
      id: "sleep",
      name: "Sleep",
      icon: "😴",
      unit: "hours",
      current: 7,
      target: 8,
      streak: 5,
    },
    {
      id: "exercise",
      name: "Exercise",
      icon: "🏃",
      unit: "minutes",
      current: 30,
      target: 30,
      streak: 3,
    },
    {
      id: "meditation",
      name: "Meditation",
      icon: "🧘",
      unit: "minutes",
      current: 10,
      target: 15,
      streak: 7,
    },
    {
      id: "water",
      name: "Water",
      icon: "💧",
      unit: "glasses",
      current: 6,
      target: 8,
      streak: 4,
    },
  ];

  const getCurrentMood = () => {
    return moodData.find((item) => item.day === selectedDate) || moodData[0];
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Wellness Tracker</h2>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            Calendar View
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-5 w-5 mr-2" />
            Log Wellness
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-3 overflow-x-auto">
            {moodData.map((item) => (
              <button
                key={item.day}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  selectedDate === item.day
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedDate(item.day)}
              >
                {item.day}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Card */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Mood</h3>

          <div className="bg-gray-50 rounded-lg p-6 flex items-center space-x-6">
            {/* Mood Emoji */}
            <div className="flex-shrink-0 bg-white h-16 w-16 rounded-full flex items-center justify-center shadow-sm text-3xl">
              {getCurrentMood().mood === "Happy"
                ? "😊"
                : getCurrentMood().mood === "Calm"
                ? "😌"
                : getCurrentMood().mood === "Anxious"
                ? "😰"
                : getCurrentMood().mood === "Energetic"
                ? "🤩"
                : "😐"}
            </div>

            {/* Mood Details */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium text-gray-900">
                  {getCurrentMood().mood}
                </h4>
                <span className="text-2xl font-bold text-blue-600">
                  {getCurrentMood().score}/100
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div
                  className={`h-2.5 rounded-full ${
                    getCurrentMood().score >= 80
                      ? "bg-green-500"
                      : getCurrentMood().score >= 60
                      ? "bg-blue-500"
                      : getCurrentMood().score >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${getCurrentMood().score}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600">{getCurrentMood().note}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Categories */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Wellness Habits</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {trackerCategories.map((category) => (
            <div key={category.id} className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center text-2xl">
                  {category.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {category.name}
                    </h4>
                    <div className="text-sm font-medium text-gray-500">
                      🔥 {category.streak} day streak
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-500">
                      {category.current} / {category.target} {category.unit}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round((category.current / category.target) * 100)}%
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((category.current / category.target) * 100)
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-500">
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Weekly Summary</h3>
        </div>

        <div className="p-6">
          <div className="h-64 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
            <p className="text-gray-500">
              Weekly trends chart will be rendered here
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Weekly Wellness Score
              </h4>
              <div className="flex items-end space-x-2">
                <div className="text-3xl font-bold text-gray-900">74%</div>
                <div className="text-sm text-green-600 pb-1">↑ 5%</div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Based on your mood and habit tracking
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Top Wellness Factors
              </h4>
              <ol className="mt-2 text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="mr-2">1.</span>
                  <span>Regular meditation practice</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">2.</span>
                  <span>Improved sleep quality</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">3.</span>
                  <span>Outdoor activities</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessTracker;
