import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  UserCircleIcon,
  ChartBarIcon,
  HeartIcon,
  MapIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const ProfileLayout: React.FC = () => {
  const navItems = [
    {
      name: "My Profile",
      path: "/profile",
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
    {
      name: "Dashboard",
      path: "/profile/dashboard",
      icon: <ChartBarIcon className="w-5 h-5" />,
    },
    {
      name: "Mental Health Insights",
      path: "/profile/insights",
      icon: <HeartIcon className="w-5 h-5" />,
    },
    {
      name: "My Journey",
      path: "/profile/journey",
      icon: <MapIcon className="w-5 h-5" />,
    },
    {
      name: "Wellness Tracker",
      path: "/profile/tracker",
      icon: <ClockIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Your Wellness Space</h1>
          <p className="text-blue-100">
            Track, monitor, and improve your mental wellbeing
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="md:w-64 bg-gray-50 p-4 border-r border-gray-200">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
