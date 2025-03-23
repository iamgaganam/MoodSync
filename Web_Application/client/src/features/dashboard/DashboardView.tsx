// client/src/features/dashboard/DashboardView.tsx
import React from "react";
import {
  CalendarIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/helpers";
import { Patient, Alert } from "../../data/mockData";

interface DashboardViewProps {
  patients: Patient[];
  alerts: Alert[];
  unreadAlerts: number;
  setAlertsOpen: (open: boolean) => void;
  handlePatientSelect: (patient: Patient) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  alerts,
  unreadAlerts,
  setAlertsOpen,
  handlePatientSelect,
}) => {
  return (
    <div className="space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">High Risk Patients</h3>
            <span className="text-2xl font-bold text-red-600">
              {patients.filter((p) => p.riskLevel === "high").length}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Patients requiring immediate attention
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Total Active Patients</h3>
            <span className="text-2xl font-bold text-blue-600">
              {patients.length}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Patients currently under your care
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pending Alerts</h3>
            <span className="text-2xl font-bold text-orange-600">
              {unreadAlerts}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Unread alerts requiring review
          </p>
        </div>
      </div>

      {/* Recent Alerts and High Risk Patients Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.read ? "bg-gray-50" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start">
                  {!alert.read && (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{alert.patientName}</p>
                      <span className="text-xs text-gray-500">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            onClick={() => setAlertsOpen(true)}
          >
            View all alerts
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">High Risk Patients</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {patients
              .filter((p) => p.riskLevel === "high")
              .map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 rounded-lg border border-red-200 bg-red-50 cursor-pointer hover:bg-red-100"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="flex items-center">
                    {patient.profilePic ? (
                      <img
                        src={patient.profilePic}
                        alt={patient.name}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                        <span>{patient.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{patient.name}</p>
                        <span className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-0.5">
                          High Risk
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 truncate">
                        {patient.lastMessage || "No recent messages"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <button
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            onClick={() => {
              // You might navigate to a full patient list view here.
            }}
          >
            View all patients
          </button>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Schedule Today</h3>
        <div className="space-y-3">
          <div className="flex p-3 rounded-lg bg-blue-50">
            <CalendarIcon className="h-5 w-5 text-blue-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium">
                  Team Meeting - Crisis Protocol Review
                </p>
                <span className="text-sm text-gray-500">
                  10:00 AM - 11:00 AM
                </span>
              </div>
            </div>
          </div>
          <div className="flex p-3 rounded-lg bg-purple-50">
            <CalendarIcon className="h-5 w-5 text-purple-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium">Virtual Session - Amal Perera</p>
                <span className="text-sm text-gray-500">1:00 PM - 2:00 PM</span>
              </div>
            </div>
          </div>
          <div className="flex p-3 rounded-lg bg-green-50">
            <CalendarIcon className="h-5 w-5 text-green-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium">Training - New Assessment Tools</p>
                <span className="text-sm text-gray-500">3:30 PM - 4:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
