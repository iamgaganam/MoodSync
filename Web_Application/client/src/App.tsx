// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";

// Import your pages
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import ChatFeatures from "./pages/Chatfeature";

import UserProfilePages from "./pages/Profile";
import EmergencyAlerts from "./features/Emergency";
import CommunitySupportPages from "./features/Comsup";
import NotFound from "./components/Error";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import HealthInsightsDashboard from "./pages/HealthInsights";
import DoctorChannelPage from "./pages/ChannelPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/" element={<Home />} />
            <Route path="/userprofile" element={<UserProfilePages />} />
            <Route path="/chat" element={<ChatFeatures />} />
            <Route path="/emergency" element={<EmergencyAlerts />} />
            <Route path="/community" element={<CommunitySupportPages />} />
            <Route path="/health" element={<HealthInsightsDashboard />} />
            <Route path="/channel" element={<DoctorChannelPage />} />

            <Route path="/doc" element={<DoctorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
