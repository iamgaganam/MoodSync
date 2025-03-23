// client/src/components/Sidebar.tsx
import React from "react";
import {
  HomeIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon as ChatIcon,
  ChartBarIcon,
  Cog6ToothIcon as CogIcon,
  XMarkIcon as XIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  currentView: "dashboard" | "patients" | "chat" | "analytics" | "settings";
  setCurrentView: (
    view: "dashboard" | "patients" | "chat" | "analytics" | "settings"
  ) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navItem = (
    label: string,
    view: SidebarProps["currentView"],
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  ) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setSidebarOpen(false);
      }}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
        currentView === view
          ? "bg-gray-100 text-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`mr-3 h-5 w-5 ${
          currentView === view
            ? "text-blue-600"
            : "text-gray-400 group-hover:text-gray-500"
        }`}
      />
      {label}
    </button>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
            <h1 className="text-xl font-bold text-white">
              Mental Health Monitor
            </h1>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navItem("Dashboard", "dashboard", HomeIcon)}
            {navItem("Patients", "patients", UsersIcon)}
            {navItem("Chat", "chat", ChatIcon)}
            {navItem("Analytics", "analytics", ChartBarIcon)}
            {navItem("Settings", "settings", CogIcon)}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
              <h1 className="text-xl font-bold text-white">
                Mental Health Monitor
              </h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItem("Dashboard", "dashboard", HomeIcon)}
                {navItem("Patients", "patients", UsersIcon)}
                {navItem("Chat", "chat", ChatIcon)}
                {navItem("Analytics", "analytics", ChartBarIcon)}
                {navItem("Settings", "settings", CogIcon)}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">NJ</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Dr. Nalini Jayawardena
                    </p>
                    <p className="text-xs text-gray-500">
                      Clinical Psychologist
                    </p>
                  </div>
                </div>
                <button className="mt-4 flex items-center text-sm text-gray-600 hover:text-gray-900 w-full">
                  <LogoutIcon className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
