import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import your pages
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import ChatFeatures from "./pages/Chatfeature";
import MentalHealthInsights from "./features/Insigths";
import MyJourney from "./features/Journey";
import WellnessTracker from "./features/Tracker";
import UserProfilePages from "./pages/Profile";
import EmergencyAlerts from "./features/Emergency";
import CommunitySupportPages from "./features/Comsup";
import NotFound from "./components/Error";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfilePages />} />
          <Route path="/cc" element={<ChatFeatures />} />

          <Route path="/insi" element={<MentalHealthInsights />} />
          <Route path="/jor" element={<MyJourney />} />
          <Route path="/trac" element={<WellnessTracker />} />
          <Route path="/emer" element={<EmergencyAlerts />} />
          <Route path="/com" element={<CommunitySupportPages />} />

          <Route path="/doh" element={<DoctorDashboard />} />
          <Route path="/ahh" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
