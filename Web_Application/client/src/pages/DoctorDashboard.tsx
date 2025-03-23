// client/src/pages/DoctorDashboard.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/DoctorNavbar";
import AlertsModal from "../components/AlertsModal";
import DashboardView from "../features/dashboard/DashboardView";
import PatientsView from "../features/patients/PatientsView";
import ChatView from "../features/chat/ChatView";
import AnalyticsView from "../features/analytics/AnalyticsView";
import SettingsView from "../features/settings/SettingsView";

import {
  Patient,
  mockPatients,
  mockMoodData,
  mockChatSessions,
  mockAlerts,
} from "../data/mockData";

interface Message {
  id: string;
  sender: "doctor" | "patient";
  content: string;
  timestamp: string;
  read: boolean;
}

const DoctorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "patients" | "chat" | "analytics" | "settings"
  >("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(
    mockAlerts.filter((a) => !a.read).length
  );
  const [message, setMessage] = useState("");
  const [filteredPatients, setFilteredPatients] =
    useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  // Update filtered patients based on search query and risk filter
  useEffect(() => {
    let result = mockPatients;
    if (searchQuery) {
      result = result.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (riskFilter !== "all") {
      result = result.filter((patient) => patient.riskLevel === riskFilter);
    }
    setFilteredPatients(result);
  }, [searchQuery, riskFilter]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView("chat");
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedPatient) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "doctor",
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    console.log("Sending message:", newMessage);
    if (mockChatSessions[selectedPatient.id]) {
      mockChatSessions[selectedPatient.id].messages.push(newMessage);
    } else {
      mockChatSessions[selectedPatient.id] = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        profilePic: selectedPatient.profilePic,
        messages: [newMessage],
      };
    }
    setMessage("");
  };

  const markAlertAsRead = (alertId: string) => {
    const alertIndex = mockAlerts.findIndex((a) => a.id === alertId);
    if (alertIndex !== -1) {
      mockAlerts[alertIndex].read = true;
      setUnreadAlerts(mockAlerts.filter((a) => !a.read).length);
    }
  };

  // Get the current chat session for the selected patient
  const currentChatSession = selectedPatient
    ? mockChatSessions[selectedPatient.id] || {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        messages: [],
        profilePic: selectedPatient.profilePic,
      }
    : { patientId: "", patientName: "", messages: [], profilePic: "" };

  // Get mood data for analytics view
  const moodData = selectedPatient
    ? mockMoodData[selectedPatient.id] || []
    : [];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Navbar
          currentView={currentView}
          setSidebarOpen={setSidebarOpen}
          setAlertsOpen={setAlertsOpen}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === "dashboard" && (
            <DashboardView
              patients={mockPatients}
              alerts={mockAlerts}
              unreadAlerts={unreadAlerts}
              setAlertsOpen={setAlertsOpen}
              handlePatientSelect={handlePatientSelect}
            />
          )}
          {currentView === "patients" && (
            <PatientsView
              filteredPatients={filteredPatients}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              riskFilter={riskFilter}
              setRiskFilter={setRiskFilter}
              handlePatientSelect={handlePatientSelect}
            />
          )}
          {currentView === "chat" && (
            <ChatView
              selectedPatient={selectedPatient}
              chatSession={currentChatSession}
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              setCurrentView={setCurrentView}
              setSelectedPatient={setSelectedPatient}
            />
          )}
          {currentView === "analytics" && (
            <AnalyticsView
              selectedPatient={selectedPatient}
              moodData={moodData}
              setSelectedPatient={setSelectedPatient}
            />
          )}
          {currentView === "settings" && <SettingsView />}
        </main>
      </div>
      <AlertsModal
        alertsOpen={alertsOpen}
        setAlertsOpen={setAlertsOpen}
        alerts={mockAlerts}
        markAlertAsRead={markAlertAsRead}
        patients={mockPatients}
        setSelectedPatient={setSelectedPatient}
        setCurrentView={setCurrentView}
      />
    </div>
  );
};

export default DoctorDashboard;
