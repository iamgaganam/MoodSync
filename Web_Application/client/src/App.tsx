// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/userprofile"
              element={
                <ProtectedRoute>
                  <UserProfilePages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatFeatures />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency"
              element={
                <ProtectedRoute>
                  <EmergencyAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunitySupportPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/health"
              element={
                <ProtectedRoute>
                  <HealthInsightsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/channel"
              element={
                <ProtectedRoute>
                  <DoctorChannelPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doc"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Make 404 route the last route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
