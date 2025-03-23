// client/src/components/AlertsModal.tsx
import React from "react";
import {
  XMarkIcon as XIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Alert, Patient } from "../data/mockData";
import { formatDate } from "../utils/helpers";

interface AlertsModalProps {
  alertsOpen: boolean;
  setAlertsOpen: (open: boolean) => void;
  alerts: Alert[];
  markAlertAsRead: (alertId: string) => void;
  patients: Patient[];
  setSelectedPatient: (patient: Patient | null) => void;
  setCurrentView: (
    view: "dashboard" | "patients" | "chat" | "analytics" | "settings"
  ) => void;
}

const AlertsModal: React.FC<AlertsModalProps> = ({
  alertsOpen,
  setAlertsOpen,
  alerts,
  markAlertAsRead,
  patients,
  setSelectedPatient,
  setCurrentView,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        alertsOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setAlertsOpen(false)}
        ></div>
        <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">All Alerts</h3>
            <button
              onClick={() => setAlertsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.read ? "bg-gray-50" : "bg-red-50 border-red-200"
                }`}
                onClick={() => markAlertAsRead(alert.id)}
              >
                <div className="flex items-start">
                  {!alert.read && (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{alert.patientName}</p>
                      <span className="text-xs text-gray-500">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{alert.message}</p>
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAlertAsRead(alert.id);
                          const patient = patients.find(
                            (p) => p.id === alert.patientId
                          );
                          if (patient) {
                            setSelectedPatient(patient);
                            setCurrentView("chat");
                            setAlertsOpen(false);
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Contact Patient
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAlertAsRead(alert.id);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsModal;
