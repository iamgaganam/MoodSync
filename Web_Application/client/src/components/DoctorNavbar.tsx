// client/src/components/Navbar.tsx
import React from "react";
import { BellIcon, MinusIcon } from "@heroicons/react/24/outline";

interface NavbarProps {
  currentView: "dashboard" | "patients" | "chat" | "analytics" | "settings";
  setSidebarOpen: (open: boolean) => void;
  setAlertsOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setSidebarOpen,
  setAlertsOpen,
}) => {
  const titleMap: Record<typeof currentView, string> = {
    dashboard: "Dashboard",
    patients: "Patient Management",
    chat: "Patient Communications",
    analytics: "Patient Analytics",
    settings: "Settings",
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MinusIcon className="h-6 w-6" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {titleMap[currentView]}
          </h1>
        </div>
        <div className="ml-4 flex items-center">
          <button
            onClick={() => setAlertsOpen(true)}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <BellIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
