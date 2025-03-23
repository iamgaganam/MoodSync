import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  BarChart2,
  Bell,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Eye,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";

// -------------------------
// Helper Functions
// -------------------------
const getMoodColor = (mood: number) => {
  if (mood < 33) return "bg-red-500";
  if (mood < 66) return "bg-yellow-500";
  return "bg-green-500";
};

const getRiskColor = (risk: string) => {
  if (risk === "High") return "bg-red-100 text-red-800";
  if (risk === "Medium") return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

const getRiskLabel = (risk: string) => risk;

const getAlertTypeColor = (type: string) => {
  if (type.toLowerCase().includes("critical")) return "bg-red-50";
  return "bg-blue-50";
};

const getMoodBarColor = (label: string) => {
  // Example: adjust these conditions as needed
  if (
    label.toLowerCase().includes("excellent") ||
    label.toLowerCase().includes("happy")
  )
    return "bg-green-500";
  if (
    label.toLowerCase().includes("normal") ||
    label.toLowerCase().includes("average")
  )
    return "bg-yellow-500";
  if (
    label.toLowerCase().includes("critical") ||
    label.toLowerCase().includes("bad")
  )
    return "bg-red-500";
  return "bg-blue-500";
};

const getAlertIconBgColor = (type: string) => {
  if (type.toLowerCase().includes("critical")) return "bg-red-100";
  if (type.toLowerCase().includes("high")) return "bg-yellow-100";
  return "bg-blue-100";
};

const getAlertIconColor = (type: string) => {
  if (type.toLowerCase().includes("critical")) return "text-red-600";
  if (type.toLowerCase().includes("high")) return "text-yellow-600";
  return "text-blue-600";
};

// -------------------------
// Mock Data
// -------------------------
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "555-1234",
    location: "New York",
    active: true,
    joinDate: "2021-01-15",
    currentMood: 70,
    riskLevel: "Low",
    recentActivity: [
      { type: "Login", detail: "Logged in from web", time: "2 hours ago" },
      { type: "Update", detail: "Updated profile", time: "1 day ago" },
    ],
    lastActive: "10 minutes ago",
    assignedTo: "Dr. Smith",
  },
  // add more users as needed
];

const mockAlerts = [
  {
    id: 1,
    type: "Critical",
    description: "User reported severe distress",
    userName: "John Doe",
    userId: 1,
    userContact: "john@example.com",
    timestamp: "2023-03-15 10:30 AM",
    status: "New",
    severity: "Critical",
    triggerDetail: "Detected unusual behavior patterns",
    triggerContent: "User mentioned feeling hopeless",
    recommendedActions: [
      "Contact user immediately",
      "Escalate to professional support",
    ],
  },
  {
    id: 2,
    type: "High",
    description: "Elevated risk behavior detected",
    userName: "Jane Smith",
    userId: 2,
    userContact: "jane@example.com",
    timestamp: "2023-03-16 09:15 AM",
    status: "In Progress",
    severity: "High",
    triggerDetail: "Multiple failed login attempts detected",
    triggerContent: "",
    recommendedActions: ["Reset password", "Notify user"],
  },
  // add more alerts as needed
];

const mockProfessionals = [
  {
    id: 1,
    name: "Dr. Smith",
    email: "dr.smith@example.com",
    phone: "555-5678",
    hospital: "General Hospital",
    active: true,
    joinDate: "2020-08-20",
    verified: true,
    specialty: "Psychiatry",
    specializations: ["Psychology", "Therapy"],
    languages: ["English", "Spanish"],
    education: "PhD in Psychology",
    licenseNumber: "XYZ12345",
    currentAssignments: [
      { userName: "John Doe", status: "Active" },
      { userName: "Jane Doe", status: "Pending" },
    ],
    availabilityStatus: "Available",
    availableHours: "9 AM - 5 PM",
    nextAvailableSlot: "Tomorrow at 10 AM",
  },
  // add more professionals as needed
];

const mockAnalytics = {
  overallSentiment: 4.2,
  recentActivity: [
    {
      type: "login",
      user: "John Doe",
      action: "Logged in",
      time: "10 minutes ago",
    },
    {
      type: "assessment",
      user: "Jane Smith",
      action: "Completed assessment",
      time: "1 hour ago",
    },
    {
      type: "chat",
      user: "John Doe",
      action: "Started chat",
      time: "2 hours ago",
    },
    {
      type: "mood",
      user: "Alice",
      action: "Updated mood",
      time: "3 hours ago",
    },
    { type: "login", user: "Bob", action: "Logged in", time: "4 hours ago" },
  ],
  moodDistribution: [
    { label: "Excellent", percentage: 40 },
    { label: "Normal", percentage: 35 },
    { label: "Critical", percentage: 25 },
  ],
};

const mockNotifications = [
  { id: 1, message: "New user registered" },
  { id: 2, message: "Alert: User distress detected" },
];

const mockChatSessions = [
  {
    id: 1,
    participants: ["John Doe", "Dr. Smith"],
    lastMessage: "Please help me with my assessment.",
    time: "5 minutes ago",
    flagged: true,
  },
  {
    id: 2,
    participants: ["Jane Smith", "Dr. Smith"],
    lastMessage: "I have some concerns about my treatment.",
    time: "20 minutes ago",
    flagged: false,
  },
  // add more chat sessions as needed
];

// -------------------------
// Main Admin Dashboard Component
// -------------------------
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);

  // Simulate API calls
  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setAlerts(mockAlerts);
      setProfessionals(mockProfessionals);
      setAnalytics(mockAnalytics);
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredProfessionals = professionals.filter((professional) =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleAlertSelect = (alert: any) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const handleProfessionalSelect = (professional: any) => {
    setSelectedProfessional(professional);
    setShowProfessionalModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-indigo-800 text-white transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="text-xl font-bold">MindfulTrack</h2>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
        </div>
        <nav className="mt-6">
          <SidebarLink
            icon={<Home size={20} />}
            title="Dashboard"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<Users size={20} />}
            title="Users"
            isActive={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<AlertCircle size={20} />}
            title="Alerts"
            isActive={activeTab === "alerts"}
            onClick={() => setActiveTab("alerts")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<User size={20} />}
            title="Professionals"
            isActive={activeTab === "professionals"}
            onClick={() => setActiveTab("professionals")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<MessageSquare size={20} />}
            title="Chat Monitor"
            isActive={activeTab === "chats"}
            onClick={() => setActiveTab("chats")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<FileText size={20} />}
            title="Content"
            isActive={activeTab === "content"}
            onClick={() => setActiveTab("content")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<BarChart2 size={20} />}
            title="Analytics"
            isActive={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
            collapsed={sidebarCollapsed}
          />
          <SidebarLink
            icon={<Settings size={20} />}
            title="Settings"
            isActive={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            collapsed={sidebarCollapsed}
          />
          <div className="mt-auto">
            <SidebarLink
              icon={<HelpCircle size={20} />}
              title="Help"
              isActive={activeTab === "help"}
              onClick={() => setActiveTab("help")}
              collapsed={sidebarCollapsed}
            />
            <SidebarLink
              icon={<LogOut size={20} />}
              title="Logout"
              isActive={false}
              onClick={() => console.log("Logout clicked")}
              collapsed={sidebarCollapsed}
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "users" && "User Management"}
              {activeTab === "alerts" && "Alert Management"}
              {activeTab === "professionals" && "Professional Management"}
              {activeTab === "chats" && "Chat Monitoring"}
              {activeTab === "content" && "Content Management"}
              {activeTab === "analytics" && "Analytics & Reports"}
              {activeTab === "settings" && "System Settings"}
              {activeTab === "help" && "Help & Documentation"}
            </h1>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Notification Dropdown */}
              <div className="relative">
                <button className="relative p-1 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none">
                  <Bell size={20} className="text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs text-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Admin Profile */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  A
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardContent
                  analytics={analytics}
                  users={users}
                  alerts={alerts}
                  professionals={professionals}
                />
              )}

              {activeTab === "users" && (
                <UsersContent
                  users={filteredUsers}
                  onUserSelect={handleUserSelect}
                />
              )}

              {activeTab === "alerts" && (
                <AlertsContent
                  alerts={filteredAlerts}
                  onAlertSelect={handleAlertSelect}
                />
              )}

              {activeTab === "professionals" && (
                <ProfessionalsContent
                  professionals={filteredProfessionals}
                  onProfessionalSelect={handleProfessionalSelect}
                />
              )}

              {activeTab === "chats" && <ChatsContent />}
              {activeTab === "content" && <ContentManagementContent />}
              {activeTab === "analytics" && (
                <AnalyticsContent analytics={analytics} />
              )}
              {activeTab === "settings" && <SettingsContent />}
              {activeTab === "help" && <HelpContent />}
            </>
          )}
        </main>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <Modal title="User Details" onClose={() => setShowUserModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Contact Info</h4>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {selectedUser.phone}
                </p>
                <p>
                  <span className="text-gray-500">Location:</span>{" "}
                  {selectedUser.location}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Account Info</h4>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedUser.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser.active ? "Active" : "Inactive"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Member Since:</span>{" "}
                  {selectedUser.joinDate}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Mental Health Status
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Current Mood</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getMoodColor(
                        selectedUser.currentMood
                      )}`}
                      style={{ width: `${selectedUser.currentMood}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Critical</span>
                    <span>Normal</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Risk Assessment</p>
                  <div className="flex items-center mt-1">
                    <div
                      className={`px-2 py-1 rounded text-xs ${getRiskColor(
                        selectedUser.riskLevel
                      )}`}
                    >
                      {getRiskLabel(selectedUser.riskLevel)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Recent Activity
              </h4>
              <div className="space-y-3">
                {selectedUser.recentActivity.map(
                  (activity: any, idx: number) => (
                    <div key={idx} className="flex items-start">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.detail}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View Full Profile
              </button>
              <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Contact User
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Alert Detail Modal */}
      {showAlertModal && selectedAlert && (
        <Modal title="Alert Details" onClose={() => setShowAlertModal(false)}>
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${getAlertTypeColor(
                selectedAlert.type
              )}`}
            >
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-medium">
                  {selectedAlert.type} Alert
                </h3>
              </div>
              <p className="mt-1">{selectedAlert.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">
                  User Information
                </h4>
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  {selectedAlert.userName}
                </p>
                <p>
                  <span className="text-gray-500">ID:</span>{" "}
                  {selectedAlert.userId}
                </p>
                <p>
                  <span className="text-gray-500">Contact:</span>{" "}
                  {selectedAlert.userContact}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">
                  Alert Information
                </h4>
                <p>
                  <span className="text-gray-500">Detected:</span>{" "}
                  {selectedAlert.timestamp}
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedAlert.status === "New"
                        ? "bg-red-100 text-red-800"
                        : selectedAlert.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedAlert.status}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Severity:</span>{" "}
                  {selectedAlert.severity}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Trigger Details
              </h4>
              <p className="text-sm">{selectedAlert.triggerDetail}</p>
              {selectedAlert.triggerContent && (
                <div className="mt-2 p-3 bg-gray-100 rounded text-sm">
                  <p className="italic">"{selectedAlert.triggerContent}"</p>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Recommended Actions
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedAlert.recommendedActions.map(
                  (action: string, idx: number) => (
                    <li key={idx} className="text-sm">
                      {action}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Dismiss Alert
              </button>
              <button className="px-4 py-2 bg-yellow-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                Assign to Professional
              </button>
              <button className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Emergency Response
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Professional Detail Modal */}
      {showProfessionalModal && selectedProfessional && (
        <Modal
          title="Professional Details"
          onClose={() => setShowProfessionalModal(false)}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {selectedProfessional.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {selectedProfessional.name}
                </h3>
                <p className="text-gray-500">
                  {selectedProfessional.specialty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Contact Info</h4>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  {selectedProfessional.email}
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {selectedProfessional.phone}
                </p>
                <p>
                  <span className="text-gray-500">Hospital:</span>{" "}
                  {selectedProfessional.hospital}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Account Info</h4>
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedProfessional.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedProfessional.active ? "Active" : "Inactive"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Member Since:</span>{" "}
                  {selectedProfessional.joinDate}
                </p>
                <p>
                  <span className="text-gray-500">Verified:</span>{" "}
                  {selectedProfessional.verified ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Professional Information
              </h4>
              <p>
                <span className="text-gray-500">Specializations:</span>{" "}
                {selectedProfessional.specializations.join(", ")}
              </p>
              <p>
                <span className="text-gray-500">Languages:</span>{" "}
                {selectedProfessional.languages.join(", ")}
              </p>
              <p>
                <span className="text-gray-500">Education:</span>{" "}
                {selectedProfessional.education}
              </p>
              <p>
                <span className="text-gray-500">License Number:</span>{" "}
                {selectedProfessional.licenseNumber}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">
                Current Assignments
              </h4>
              <div className="space-y-2">
                {selectedProfessional.currentAssignments.map(
                  (assignment: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{assignment.userName}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          assignment.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : assignment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">Availability</h4>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedProfessional.availabilityStatus === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedProfessional.availabilityStatus}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Available Hours:</span>{" "}
                  {selectedProfessional.availableHours}
                </p>
                <p>
                  <span className="text-gray-500">Next Available:</span>{" "}
                  {selectedProfessional.nextAvailableSlot}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Edit Details
              </button>
              <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Message Professional
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// -------------------------
// Reusable Components
// -------------------------
const SidebarLink: React.FC<{
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  onClick: () => void;
  collapsed: boolean;
}> = ({ icon, title, isActive, onClick, collapsed }) => {
  return (
    <a
      href="#"
      className={`flex items-center px-4 py-3 ${
        isActive
          ? "bg-indigo-700 text-white"
          : "text-indigo-100 hover:bg-indigo-700"
      } transition-colors rounded-md mx-2 my-1`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <span className="mr-3">{icon}</span>
      {!collapsed && <span>{title}</span>}
    </a>
  );
};

const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-130px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  positive: boolean;
}> = ({ title, value, change, icon, positive }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="bg-indigo-50 p-2 rounded">{icon}</div>
      </div>
      <div className="mt-4">
        <span className="text-2xl font-bold">{value}</span>
        <span
          className={`ml-2 text-sm font-medium ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};

const QuickActionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, icon, onClick }) => {
  return (
    <button
      className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
      onClick={onClick}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm font-medium text-indigo-700">{title}</span>
    </button>
  );
};

// -------------------------
// Tab Components
// -------------------------
const DashboardContent: React.FC<{
  analytics: any;
  users: any[];
  alerts: any[];
  professionals: any[];
}> = ({ analytics, users, alerts, professionals }) => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          change="+12%"
          icon={<Users size={20} className="text-blue-500" />}
          positive={true}
        />
        <StatCard
          title="Active Alerts"
          value={alerts
            .filter(
              (a: any) => a.status === "New" || a.status === "In Progress"
            )
            .length.toString()}
          change="-5%"
          icon={<AlertCircle size={20} className="text-red-500" />}
          positive={false}
        />
        <StatCard
          title="Professionals"
          value={professionals.length.toString()}
          change="+3%"
          icon={<User size={20} className="text-green-500" />}
          positive={true}
        />
        <StatCard
          title="Sentiment Index"
          value={analytics ? analytics.overallSentiment.toFixed(1) : "0"}
          change="+0.2"
          icon={<TrendingUp size={20} className="text-purple-500" />}
          positive={true}
        />
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Recent Alerts</h2>
        <div className="space-y-4">
          {alerts
            .filter(
              (alert: any) =>
                alert.severity === "Critical" || alert.severity === "High"
            )
            .slice(0, 5)
            .map((alert: any, idx: number) => (
              <div key={idx} className="flex">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle size={16} className="text-red-600" />
                  </div>
                </div>
                <div className="flex-1 ml-4">
                  <h3 className="text-sm font-medium text-red-800">
                    {alert.type} Alert for {alert.userName}
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {alert.description}
                  </p>
                  <div className="mt-2 flex space-x-3">
                    <button className="text-xs font-medium text-red-800 hover:text-red-900">
                      View Details
                    </button>
                    <button className="text-xs font-medium text-red-800 hover:text-red-900">
                      Assign
                    </button>
                    <button className="text-xs font-medium text-red-800 hover:text-red-900">
                      Respond
                    </button>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                  <span className="text-xs text-red-700">
                    {alert.timestamp}
                  </span>
                  <span className="mt-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-4">
          <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
            View All Alerts →
          </button>
        </div>
      </div>

      {/* Activity & Sentiment Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Recent User Activity</h2>
            <div className="space-y-4">
              {analytics &&
                analytics.recentActivity
                  .slice(0, 5)
                  .map((activity: any, idx: number) => (
                    <div key={idx} className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          {activity.type === "login" && (
                            <User size={16} className="text-indigo-600" />
                          )}
                          {activity.type === "assessment" && (
                            <FileText size={16} className="text-indigo-600" />
                          )}
                          {activity.type === "chat" && (
                            <MessageSquare
                              size={16}
                              className="text-indigo-600"
                            />
                          )}
                          {activity.type === "mood" && (
                            <TrendingUp size={16} className="text-indigo-600" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.user}</p>
                        <p className="text-sm text-gray-500">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
            <div className="mt-4">
              <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                View All Activity →
              </button>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">User Mood Distribution</h2>
            <div className="space-y-3">
              {analytics &&
                analytics.moodDistribution.map((mood: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {mood.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {mood.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getMoodBarColor(
                          mood.label
                        )}`}
                        style={{ width: `${mood.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              title="Add Professional"
              icon={<User size={24} className="text-indigo-600" />}
              onClick={() => console.log("Add Professional")}
            />
            <QuickActionCard
              title="Manage Content"
              icon={<FileText size={24} className="text-indigo-600" />}
              onClick={() => console.log("Manage Content")}
            />
            <QuickActionCard
              title="Generate Report"
              icon={<BarChart2 size={24} className="text-indigo-600" />}
              onClick={() => console.log("Generate Report")}
            />
            <QuickActionCard
              title="System Settings"
              icon={<Settings size={24} className="text-indigo-600" />}
              onClick={() => console.log("System Settings")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersContent: React.FC<{
  users: any[];
  onUserSelect: (user: any) => void;
}> = ({ users, onUserSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">User Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center">
          <Plus size={16} className="mr-2" /> Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">All Users</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Filter
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getRiskColor(
                        user.riskLevel
                      )}`}
                    >
                      {getRiskLabel(user.riskLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.assignedTo || "Not Assigned"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => onUserSelect(user)}
                    >
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white border border-indigo-600 rounded-md text-sm hover:bg-indigo-700">
              1
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertsContent: React.FC<{
  alerts: any[];
  onAlertSelect: (alert: any) => void;
}> = ({ alerts, onAlertSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Alert Management</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Filter
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Critical Alerts
            </h3>
            <p className="text-2xl font-bold text-red-800 mt-1">
              {alerts.filter((a) => a.severity === "Critical").length}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-yellow-800">High Alerts</h3>
            <p className="text-2xl font-bold text-yellow-800 mt-1">
              {alerts.filter((a) => a.severity === "High").length}
            </p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-blue-800">Medium Alerts</h3>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              {alerts.filter((a) => a.severity === "Medium").length}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alert Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map((alert, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getAlertIconBgColor(
                          alert.type
                        )}`}
                      >
                        <AlertCircle
                          className={`h-4 w-4 ${getAlertIconColor(alert.type)}`}
                        />
                      </div>
                      <div className="ml-3 text-sm font-medium text-gray-900">
                        {alert.type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alert.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        alert.severity === "Critical"
                          ? "bg-red-100 text-red-800"
                          : alert.severity === "High"
                          ? "bg-yellow-100 text-yellow-800"
                          : alert.severity === "Medium"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        alert.status === "New"
                          ? "bg-red-100 text-red-800"
                          : alert.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alert.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => onAlertSelect(alert)}
                    >
                      <Eye size={16} />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                      <User size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Bell size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">{alerts.length}</span> alerts
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white border border-indigo-600 rounded-md text-sm hover:bg-indigo-50">
              1
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessionalsContent: React.FC<{
  professionals: any[];
  onProfessionalSelect: (professional: any) => void;
}> = ({ professionals, onProfessionalSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Professional Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center">
          <Plus size={16} className="mr-2" /> Add New Professional
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">All Professionals</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Filter
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Users
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professionals.map((professional, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {professional.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {professional.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {professional.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {professional.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        professional.availabilityStatus === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {professional.availabilityStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {professional.hospital}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {professional.currentAssignments.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => onProfessionalSelect(professional)}
                    >
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{professionals.length}</span> of{" "}
            <span className="font-medium">{professionals.length}</span>{" "}
            professionals
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white border border-indigo-600 rounded-md text-sm hover:bg-gray-50">
              1
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Chat Monitoring</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Filter
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Export Logs
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Recent Chats</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 flex items-center">
                <AlertCircle size={14} className="mr-1" /> Flagged Only
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center">
                <Clock size={14} className="mr-1" /> Last 24 Hours
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {mockChatSessions.map((session, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User size={16} className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {session.participants.join(" & ")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{session.time}</p>
                  {session.flagged && (
                    <span className="mt-1 inline-block px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      Flagged
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContentManagementContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Content Management</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Content management tools will be available here...</p>
      </div>
    </div>
  );
};

const AnalyticsContent: React.FC<{ analytics: any }> = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Analytics & Reports</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Overall Sentiment: {analytics ? analytics.overallSentiment : 0}</p>
        <p>More analytics coming soon...</p>
      </div>
    </div>
  );
};

const SettingsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">System Settings</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Settings and configurations can be adjusted here.</p>
      </div>
    </div>
  );
};

const HelpContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Help & Documentation</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Find help and documentation about the system here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
