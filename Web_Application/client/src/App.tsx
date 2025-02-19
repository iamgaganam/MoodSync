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
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/res" element={<Resources />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
