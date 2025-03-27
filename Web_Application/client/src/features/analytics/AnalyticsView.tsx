// client/src/features/analytics/AnalyticsView.tsx
import React from "react";
import { XMarkIcon as XIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { formatDate, getSentimentColor } from "../../utils/Helpers";
import { Patient, MoodData } from "../../data/mockData";
import { format } from "date-fns";

interface AnalyticsViewProps {
  selectedPatient: Patient | null;
  moodData: MoodData[];
  setSelectedPatient: (patient: Patient | null) => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  selectedPatient,
  moodData,
  setSelectedPatient,
}) => {
  if (!selectedPatient) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No patient selected
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a patient to view their analytics
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => {}}
            >
              View Patients
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Patient Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {selectedPatient.profilePic ? (
              <img
                src={selectedPatient.profilePic}
                alt={selectedPatient.name}
                className="h-10 w-10 rounded-full mr-3"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                <span>{selectedPatient.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedPatient.age} years, {selectedPatient.gender}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedPatient(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">
              Current Risk Level
            </h4>
            <div className="mt-2 flex items-center">
              {/* You can render risk badge here */}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">
              Current Sentiment
            </h4>
            <div className="mt-2 flex items-center">
              <div
                className={`h-3 w-3 rounded-full ${getSentimentColor(
                  selectedPatient.sentimentScore
                )} mr-2`}
              ></div>
              <span>{selectedPatient.sentimentScore.toFixed(1)}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Last Activity</h4>
            <div className="mt-2 text-sm">
              {formatDate(selectedPatient.lastActivity)}
            </div>
          </div>
        </div>
      </div>

      {/* Mood Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Mental Health Trends (7 Days)
        </h3>
        <div className="h-64 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
          {/* This would be a chart in a real implementation */}
          <div className="text-center text-gray-500">
            <p>Chart visualization would go here</p>
            <p className="text-xs mt-2">
              Showing sentiment, anxiety and depression scores over time
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {moodData.length > 0 ? (
            <>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800">
                  Average Sentiment
                </h4>
                <p className="text-lg font-semibold mt-1">
                  {(
                    moodData.reduce((acc, item) => acc + item.sentiment, 0) /
                    moodData.length
                  ).toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-red-800">
                  Average Anxiety
                </h4>
                <p className="text-lg font-semibold mt-1">
                  {(
                    moodData.reduce((acc, item) => acc + item.anxiety, 0) /
                    moodData.length
                  ).toFixed(1)}
                  /10
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800">
                  Average Depression
                </h4>
                <p className="text-lg font-semibold mt-1">
                  {(
                    moodData.reduce((acc, item) => acc + item.depression, 0) /
                    moodData.length
                  ).toFixed(1)}
                  /10
                </p>
              </div>
            </>
          ) : (
            <div className="col-span-3 text-center py-4 text-gray-500">
              No mood data available for this patient
            </div>
          )}
        </div>
      </div>

      {/* Content Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Content Analysis</h3>
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="font-medium">Key Topics</h4>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  anxiety
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  work stress
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  sleep
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  family
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  loneliness
                </span>
              </div>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="font-medium">Sentiment Timeline</h4>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {moodData.length > 0 ? (
                  moodData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">
                        {format(new Date(item.date), "MMM d")}
                      </span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getSentimentColor(
                            item.sentiment
                          )}`}
                          style={{
                            width: `${Math.max(0, (item.sentiment + 1) * 50)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">
                        {item.sentiment.toFixed(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No sentiment data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => {}}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Chat with Patient
          </button>
          <button className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
