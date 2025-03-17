import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import your pages
import Chatbot from "./features/Chatbot";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Alert from "./pages/Alerts";
import Dashboard from "../src/features/Dashboard";
import Resources from "./pages/Resources";
import Auth from "./pages/Auth";
import DoctorAdminPanel from "./pages/doctor/DoctorAdminPanel";
import HealthInsightsDashboard from "./pages/doctor/HealthInsightsDashboard";
import ChatFeatures from "./pages/Chatfeature";
import ProfileLayout from "../src/features/ProfileLayout";
import MentalHealthInsights from "./features/Insigths";
import MyJourney from "./features/Journey";
import WellnessTracker from "./features/Tracker";
import UserProfilePages from "./pages/Profile";
import EmergencyAlerts from "./features/Emergency";
import CommunitySupportPages from "./features/Comsup";
import AdminLayout from "./components/layout/AdminLayout";
import DoctorLayout from "./components/layout/DoctorLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import HealthDataManagement from "./pages/admin/HealthDataManagement";
import DoctorDashboard from "./pages/doctor/DocDash";
import NotFound from "./components/Error";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/res" element={<Resources />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<UserProfilePages />} />
          <Route path="/doc" element={<DoctorAdminPanel />} />
          <Route path="/health" element={<HealthInsightsDashboard />} />
          <Route path="/cc" element={<ChatFeatures />} />
          <Route path="/pp" element={<ProfileLayout />} />

          <Route path="/insi" element={<MentalHealthInsights />} />
          <Route path="/jor" element={<MyJourney />} />
          <Route path="/trac" element={<WellnessTracker />} />
          <Route path="/emer" element={<EmergencyAlerts />} />
          <Route path="/com" element={<CommunitySupportPages />} />

          <Route path="/ahh" element={<AdminLayout />} />
          <Route path="/doo" element={<DoctorLayout />} />
          <Route path="/ahdah" element={<AdminDashboard />} />
          <Route path="/um" element={<UserManagement />} />
          <Route path="/heas" element={<HealthDataManagement />} />
          <Route path="/dodash" element={<DoctorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
