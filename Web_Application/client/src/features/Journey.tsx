// File: client/src/features/profile/MyJourney.tsx (continued)
import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

const MyJourney: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState("March");

  // Sample data - would come from your API in a real app
  const journeyData = {
    milestones: [
      {
        id: 1,
        date: "January 15, 2025",
        title: "Started Mental Health Journey",
        description: "Downloaded MoodSync app and completed initial assessment",
      },
      {
        id: 2,
        date: "February 2, 2025",
        title: "First Therapy Session",
        description: "Connected with Dr. Perera through the platform",
      },
      {
        id: 3,
        date: "February 20, 2025",
        title: "Completed CBT Module",
        description:
          "Finished the cognitive behavioral therapy learning module",
      },
      {
        id: 4,
        date: "March 1, 2025",
        title: "30 Day Streak",
        description: "Completed mood tracking every day for a month",
      },
    ],
    journals: [
      {
        id: 1,
        date: "March 1, 2025",
        mood: "Happy",
        title: "Great progress today",
        content:
          "I felt much better after implementing the breathing techniques...",
      },
      {
        id: 2,
        date: "February 25, 2025",
        mood: "Anxious",
        title: "Stressful work meeting",
        content:
          "Had a difficult meeting with my boss, but used the coping strategies...",
      },
      {
        id: 3,
        date: "February 20, 2025",
        mood: "Peaceful",
        title: "Meditation session",
        content:
          "Tried the new guided meditation and felt very calm afterward...",
      },
    ],
    months: ["January", "February", "March", "April"],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Journey</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Journal Entry
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Your Wellness Timeline
          </h3>
        </div>

        <div className="px-6 py-6">
          <ol className="relative border-l border-gray-200">
            {journeyData.milestones.map((milestone) => (
              <li key={milestone.id} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                  {milestone.title}
                  {milestone.id === journeyData.milestones.length && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                      Latest
                    </span>
                  )}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                  {milestone.date}
                </time>
                <p className="mb-4 text-base font-normal text-gray-600">
                  {milestone.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Journal Entries</h3>
        </div>

        {/* Month Selector */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="px-6 py-2 flex space-x-4 overflow-x-auto">
            {journeyData.months.map((month) => (
              <button
                key={month}
                className={`py-2 px-3 text-sm font-medium rounded-md ${
                  activeMonth === month
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setActiveMonth(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Journal List */}
        <div className="divide-y divide-gray-200">
          {journeyData.journals.length > 0 ? (
            journeyData.journals.map((journal) => (
              <div key={journal.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-lg font-medium text-gray-900">
                        {journal.title}
                      </h4>
                      <span
                        className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          journal.mood === "Happy"
                            ? "bg-green-100 text-green-800"
                            : journal.mood === "Anxious"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {journal.mood}
                      </span>
                    </div>
                    <time className="block mt-1 text-sm text-gray-500">
                      {journal.date}
                    </time>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-500">
                    Read More
                  </button>
                </div>
                <p className="mt-3 text-gray-600 line-clamp-2">
                  {journal.content}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                No journal entries for {activeMonth}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJourney;
