// client/src/features/settings/SettingsView.tsx
import React from "react";

const SettingsView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your preferences and notification settings
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Profile Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                defaultValue="Dr. Nalini Jayawardena"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                defaultValue="nalini.j@mentalhealthapp.lk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                defaultValue="Clinical Psychologist"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                defaultValue="SL-CP-2025-143"
              />
            </div>
          </div>
        </div>
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
          <div className="space-y-4">
            {/* Repeat similar blocks for each notification setting */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  High Risk Patient Alerts
                </p>
                <p className="text-xs text-gray-500">
                  Receive immediate notifications for high-risk patients
                </p>
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </label>
              </div>
            </div>
            {/* You can add more similar blocks for other settings */}
          </div>
        </div>
        {/* System Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">System Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Threshold for Sentiment Score
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="-0.3">Very Negative (-0.3)</option>
                <option value="-0.5">Negative (-0.5)</option>
                <option value="-0.7" selected>
                  Severely Negative (-0.7)
                </option>
                <option value="-0.8">Extremely Negative (-0.8)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Language for ML Analysis
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="en" selected>
                  English
                </option>
                <option value="si">Sinhala</option>
                <option value="ta">Tamil</option>
                <option value="auto">Auto-detect</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="Asia/Colombo" selected>
                  Asia/Colombo (GMT+5:30)
                </option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t flex justify-end space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
