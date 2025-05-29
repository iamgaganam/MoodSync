import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Context and Security
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";

// Protected User Pages
import ChatFeatures from "./pages/Chatfeature";
import UserProfilePages from "./pages/Profile";
import HealthInsightsDashboard from "./pages/HealthInsights";
import DoctorChannelPage from "./pages/ChannelPage";

// Protected Feature Pages
import EmergencyAlerts from "./features/Emergency";
import CommunitySupportPages from "./features/Comsup";

// Admin/Doctor Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./components/DoctorDashboard";

// Error Handling
import NotFound from "./components/Error";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes - No authentication required */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />

            {/* Protected User Routes - Authentication required */}
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

            {/* Protected Feature Routes */}
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

            {/* Protected Dashboard Routes - Role-based access */}
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

            {/* Error Handling - Must be last route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
