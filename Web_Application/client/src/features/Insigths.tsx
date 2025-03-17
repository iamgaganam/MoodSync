// File: client/src/features/profile/MentalHealthInsights.tsx
import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const MentalHealthInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState("sentiment");

  // Sample data - would come from your API in a real app
  const sentimentData = {
    overall: 72,
    description:
      "Your sentiment analysis shows a generally positive outlook with some stress indicators.",
    breakdown: [
      { category: "Happiness", score: 78, change: "+5" },
      { category: "Anxiety", score: 35, change: "-10" },
      { category: "Stress", score: 42, change: "-3" },
      { category: "Energy", score: 68, change: "+2" },
      { category: "Social Connection", score: 65, change: "+8" },
    ],
    sources: [
      { name: "Journal Entries", percentage: 45 },
      { name: "Social Media", percentage: 30 },
      { name: "Chatbot Interactions", percentage: 25 },
    ],
  };

  const renderProgressBar = (score: number, color: string) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Mental Health Insights
      </h2>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "sentiment"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("sentiment")}
          >
            Sentiment Analysis
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "patterns"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("patterns")}
          >
            Behavior Patterns
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "predictions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("predictions")}
          >
            Predictive Insights
          </button>
        </nav>
      </div>

      {/* Sentiment Analysis Tab */}
      {activeTab === "sentiment" && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Overall Mental Wellbeing
              </h3>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  {sentimentData.overall}/100
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  sentimentData.overall >= 70
                    ? "bg-green-500"
                    : sentimentData.overall >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${sentimentData.overall}%` }}
              ></div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              {sentimentData.description}
            </div>

            <div className="mt-6 flex items-center text-sm text-gray-500">
              <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span>
                This score is based on AI analysis of your text interactions,
                social media, and self-reported moods
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Mental Health Categories
            </h3>

            <div className="space-y-6">
              {sentimentData.breakdown.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-700">
                      {category.category}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">
                        {category.score}
                      </span>
                      <span
                        className={`text-xs ${
                          category.change.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {category.change}
                      </span>
                    </div>
                  </div>

                  {renderProgressBar(
                    category.score,
                    category.category === "Anxiety" ||
                      category.category === "Stress"
                      ? category.score < 40
                        ? "bg-green-500"
                        : "bg-yellow-500"
                      : category.score > 60
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Analysis Data Sources
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sentimentData.sources.map((source) => (
                <div key={source.name} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    {source.name}
                  </h4>
                  <div className="flex items-end space-x-2">
                    <div className="text-xl font-bold text-gray-900">
                      {source.percentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      of analysis data
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Behavior Patterns Tab */}
      {activeTab === "patterns" && (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
          <p className="text-gray-500">
            Behavior patterns analysis will be displayed here
          </p>
        </div>
      )}

      {/* Predictive Insights Tab */}
      {activeTab === "predictions" && (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
          <p className="text-gray-500">
            Predictive insights will be displayed here
          </p>
        </div>
      )}
    </div>
  );
};

export default MentalHealthInsights;
