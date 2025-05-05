// File: client/src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
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
// TypeScript Interfaces
// -------------------------
interface Activity {
  type: string;
  detail: string;
  time: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  active: boolean;
  joinDate: string;
  currentMood: number;
  riskLevel: string;
  recentActivity: Activity[];
  lastActive: string;
  assignedTo: string;
}

interface AlertData {
  id: number;
  type: string;
  description: string;
  userName: string;
  userId: number;
  userContact: string;
  timestamp: string;
  status: string;
  severity: string;
  triggerDetail: string;
  triggerContent: string;
  recommendedActions: string[];
}

interface Assignment {
  userName: string;
  status: string;
}

interface ProfessionalData {
  id: number;
  name: string;
  email: string;
  phone: string;
  hospital: string;
  active: boolean;
  joinDate: string;
  verified: boolean;
  specialty: string;
  specializations: string[];
  languages: string[];
  education: string;
  licenseNumber: string;
  currentAssignments: Assignment[];
  availabilityStatus: string;
  availableHours: string;
  nextAvailableSlot: string;
}

interface UserActivity {
  type: string;
  user: string;
  action: string;
  time: string;
}

interface MoodDistribution {
  label: string;
  percentage: number;
}

interface AnalyticsData {
  overallSentiment: number;
  recentActivity: UserActivity[];
  moodDistribution: MoodDistribution[];
}

interface NotificationData {
  id: number;
  message: string;
}

interface ChatSessionData {
  id: number;
  participants: string[];
  lastMessage: string;
  time: string;
  flagged: boolean;
}

// New interface for professional form data
interface ProfessionalFormData {
  name: string;
  email: string;
  phone: string;
  hospital: string;
  specialty: string;
  specializations: string[];
  languages: string[];
  education: string;
  licenseNumber: string;
  availableHours: string;
  profileImage?: File | null;
  licenseCertificate?: File | null;
}

// -------------------------
// Helper Functions
// -------------------------
const getMoodColor = (mood: number): string => {
  if (mood < 33) return "bg-red-500";
  if (mood < 66) return "bg-yellow-500";
  return "bg-green-500";
};

const getRiskColor = (risk: string): string => {
  if (risk === "High") return "bg-red-100 text-red-800";
  if (risk === "Medium") return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

const getRiskLabel = (risk: string): string => risk;

const getAlertTypeColor = (type: string): string => {
  if (type.toLowerCase().includes("critical")) return "bg-red-50";
  return "bg-blue-50";
};

const getMoodBarColor = (label: string): string => {
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

const getAlertIconBgColor = (type: string): string => {
  if (type.toLowerCase().includes("critical")) return "bg-red-100";
  if (type.toLowerCase().includes("high")) return "bg-yellow-100";
  return "bg-blue-100";
};

const getAlertIconColor = (type: string): string => {
  if (type.toLowerCase().includes("critical")) return "text-red-600";
  if (type.toLowerCase().includes("high")) return "text-yellow-600";
  return "text-blue-600";
};

// -------------------------
// Mock Data (Updated for Sri Lanka)
// -------------------------
const mockUsers: UserData[] = [
  {
    id: 1,
    name: "Sahan Perera",
    email: "sahan@gmail.com",
    phone: "077-123-4567",
    location: "Colombo",
    active: true,
    joinDate: "2021-01-15",
    currentMood: 70,
    riskLevel: "Low",
    recentActivity: [
      { type: "Login", detail: "Logged in from mobile", time: "2 hours ago" },
      { type: "Update", detail: "Updated profile", time: "1 day ago" },
    ],
    lastActive: "10 minutes ago",
    assignedTo: "Dr. Fernando",
  },
  {
    id: 2,
    name: "Dilshan Silva",
    email: "dilshan@gmail.com",
    phone: "071-234-5678",
    location: "Kandy",
    active: true,
    joinDate: "2022-03-10",
    currentMood: 45,
    riskLevel: "Medium",
    recentActivity: [
      {
        type: "Assessment",
        detail: "Completed weekly check-in",
        time: "5 hours ago",
      },
      { type: "Chat", detail: "Messaged counselor", time: "2 days ago" },
    ],
    lastActive: "5 hours ago",
    assignedTo: "Dr. Gunawardena",
  },
  {
    id: 3,
    name: "Amali Jayawardena",
    email: "amali@gmail.com",
    phone: "075-345-6789",
    location: "Galle",
    active: false,
    joinDate: "2021-11-22",
    currentMood: 25,
    riskLevel: "High",
    recentActivity: [
      { type: "Mood", detail: "Reported low mood", time: "3 days ago" },
      {
        type: "Assessment",
        detail: "Missed scheduled assessment",
        time: "1 week ago",
      },
    ],
    lastActive: "3 days ago",
    assignedTo: "Dr. Fernando",
  },
];

const mockAlerts: AlertData[] = [
  {
    id: 1,
    type: "Critical",
    description: "User reported severe distress",
    userName: "Amali Jayawardena",
    userId: 3,
    userContact: "amali@gmail.com",
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
    userName: "Dilshan Silva",
    userId: 2,
    userContact: "dilshan@gmail.com",
    timestamp: "2023-03-16 09:15 AM",
    status: "In Progress",
    severity: "High",
    triggerDetail: "Multiple failed login attempts detected",
    triggerContent: "",
    recommendedActions: ["Reset password", "Notify user"],
  },
  {
    id: 3,
    type: "Medium",
    description: "Missed scheduled sessions",
    userName: "Kumari Fernando",
    userId: 4,
    userContact: "kumari@gmail.com",
    timestamp: "2023-03-17 14:20 PM",
    status: "Resolved",
    severity: "Medium",
    triggerDetail: "User has missed 3 consecutive appointments",
    triggerContent: "",
    recommendedActions: ["Contact user", "Reschedule appointment"],
  },
];

const mockProfessionals: ProfessionalData[] = [
  {
    id: 1,
    name: "Dr. Lasith Fernando",
    email: "dr.fernando@nationalhospital.lk",
    phone: "071-567-8901",
    hospital: "National Hospital of Sri Lanka",
    active: true,
    joinDate: "2020-08-20",
    verified: true,
    specialty: "Psychiatry",
    specializations: ["Clinical Psychology", "Cognitive Behavioral Therapy"],
    languages: ["Sinhala", "English", "Tamil"],
    education: "MD in Psychiatry, University of Colombo",
    licenseNumber: "SLMC-12345",
    currentAssignments: [
      { userName: "Sahan Perera", status: "Active" },
      { userName: "Amali Jayawardena", status: "Pending" },
    ],
    availabilityStatus: "Available",
    availableHours: "9 AM - 5 PM",
    nextAvailableSlot: "Tomorrow at 10 AM",
  },
  {
    id: 2,
    name: "Dr. Rashmi Gunawardena",
    email: "dr.gunawardena@kandy.hospital",
    phone: "077-678-9012",
    hospital: "Kandy General Hospital",
    active: true,
    joinDate: "2019-05-15",
    verified: true,
    specialty: "Clinical Psychology",
    specializations: ["Depression", "Anxiety Disorders"],
    languages: ["Sinhala", "English"],
    education: "PhD in Psychology, University of Peradeniya",
    licenseNumber: "SLMC-23456",
    currentAssignments: [{ userName: "Dilshan Silva", status: "Active" }],
    availabilityStatus: "Busy",
    availableHours: "10 AM - 6 PM",
    nextAvailableSlot: "Friday at 2 PM",
  },
  {
    id: 3,
    name: "Dr. Anura Dissanayake",
    email: "dr.dissanayake@lady-ridgeway.lk",
    phone: "070-789-0123",
    hospital: "Lady Ridgeway Hospital",
    active: true,
    joinDate: "2021-02-10",
    verified: true,
    specialty: "Child Psychology",
    specializations: ["Childhood Trauma", "Developmental Disorders"],
    languages: ["Sinhala", "English", "Tamil"],
    education: "MD in Child Psychiatry, University of Colombo",
    licenseNumber: "SLMC-34567",
    currentAssignments: [],
    availabilityStatus: "Available",
    availableHours: "8 AM - 4 PM",
    nextAvailableSlot: "Today at 3 PM",
  },
];

const mockAnalytics: AnalyticsData = {
  overallSentiment: 4.2,
  recentActivity: [
    {
      type: "login",
      user: "Sahan Perera",
      action: "Logged in",
      time: "10 minutes ago",
    },
    {
      type: "assessment",
      user: "Kesha Perera",
      action: "Completed assessment",
      time: "1 hour ago",
    },
    {
      type: "chat",
      user: "Dilshan Silva",
      action: "Started chat",
      time: "2 hours ago",
    },
    {
      type: "mood",
      user: "Amali Jayawardena",
      action: "Updated mood",
      time: "3 hours ago",
    },
    {
      type: "login",
      user: "Kumari Fernando",
      action: "Logged in",
      time: "4 hours ago",
    },
  ],
  moodDistribution: [
    { label: "Excellent", percentage: 40 },
    { label: "Normal", percentage: 35 },
    { label: "Critical", percentage: 25 },
  ],
};

const mockNotifications: NotificationData[] = [
  { id: 1, message: "New user registered from Colombo" },
  { id: 2, message: "Alert: User distress detected in Kandy" },
];

const mockChatSessions: ChatSessionData[] = [
  {
    id: 1,
    participants: ["Sahan Perera", "Dr. Fernando"],
    lastMessage: "I'll try the meditation exercises you recommended.",
    time: "5 minutes ago",
    flagged: false,
  },
  {
    id: 2,
    participants: ["Dilshan Silva", "Dr. Gunawardena"],
    lastMessage: "I have some concerns about my medication.",
    time: "20 minutes ago",
    flagged: true,
  },
  {
    id: 3,
    participants: ["Amali Jayawardena", "Dr. Fernando"],
    lastMessage: "I've been feeling much worse this week.",
    time: "1 hour ago",
    flagged: true,
  },
];

// -------------------------
// Component Props Interfaces
// -------------------------
interface SidebarLinkProps {
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  onClick: () => void;
  collapsed: boolean;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  positive: boolean;
}

interface QuickActionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface DashboardContentProps {
  analytics: AnalyticsData | null;
  users: UserData[];
  alerts: AlertData[];
  professionals: ProfessionalData[];
}

interface UsersContentProps {
  users: UserData[];
  onUserSelect: (user: UserData) => void;
}

interface AlertsContentProps {
  alerts: AlertData[];
  onAlertSelect: (alert: AlertData) => void;
}

interface ProfessionalsContentProps {
  professionals: ProfessionalData[];
  onProfessionalSelect: (professional: ProfessionalData) => void;
  onAddProfessional: () => void; // New prop
}

interface AnalyticsContentProps {
  analytics: AnalyticsData | null;
}

interface AddProfessionalModalProps {
  onClose: () => void;
  onSave: (professional: ProfessionalFormData) => void;
}

// -------------------------
// Main Admin Dashboard Component
// -------------------------
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<ProfessionalData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // New state for add professional modal
  const [showAddProfessionalModal, setShowAddProfessionalModal] =
    useState(false);

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

  // Function to handle adding a new professional with improved error handling
  const handleAddProfessional = async (
    professionalData: ProfessionalFormData
  ) => {
    try {
      setLoading(true);

      // Create FormData for the API request
      const formData = new FormData();

      // Add text fields
      formData.append("name", professionalData.name);
      formData.append("email", professionalData.email);
      formData.append("phone", professionalData.phone);
      formData.append("hospital", professionalData.hospital);
      formData.append("specialty", professionalData.specialty);
      formData.append(
        "specializations",
        JSON.stringify(professionalData.specializations)
      );
      formData.append("languages", JSON.stringify(professionalData.languages));
      formData.append("education", professionalData.education);
      formData.append("licenseNumber", professionalData.licenseNumber);
      formData.append("availableHours", professionalData.availableHours);

      // Add default values
      formData.append("active", "true");
      formData.append("verified", "false");
      formData.append("joinDate", new Date().toISOString().split("T")[0]);
      formData.append("availabilityStatus", "Available");

      // Add files
      if (professionalData.profileImage) {
        formData.append("profileImage", professionalData.profileImage);
      }

      if (professionalData.licenseCertificate) {
        formData.append(
          "licenseCertificate",
          professionalData.licenseCertificate
        );
      }

      // To this:
      const response = await fetch("http://localhost:8000/api/professionals/", {
        method: "POST",
        body: formData,
      });

      // Handle response with better error checking
      const responseText = await response.text();
      let result;

      try {
        // Only try to parse as JSON if there's actual content
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse response:", responseText, e);
        throw new Error("Server returned invalid JSON response");
      }

      if (!response.ok) {
        throw new Error(result.detail || `Server error: ${response.status}`);
      }

      // Create new professional object
      const newProfessionalId =
        professionals.length > 0
          ? Math.max(...professionals.map((p) => p.id)) + 1
          : 1;

      // Add the new professional to the list
      const newProfessional: ProfessionalData = {
        id: newProfessionalId,
        name: professionalData.name,
        email: professionalData.email,
        phone: professionalData.phone,
        hospital: professionalData.hospital,
        active: true,
        joinDate: new Date().toISOString().split("T")[0],
        verified: false,
        specialty: professionalData.specialty,
        specializations: professionalData.specializations,
        languages: professionalData.languages,
        education: professionalData.education,
        licenseNumber: professionalData.licenseNumber,
        currentAssignments: [],
        availabilityStatus: "Available",
        availableHours: professionalData.availableHours,
        nextAvailableSlot: "",
      };

      // Update professionals state
      setProfessionals([...professionals, newProfessional]);
      setShowAddProfessionalModal(false);

      // Show success message
      alert("Professional added successfully!");
    } catch (error) {
      console.error("Error adding professional:", error);
      alert(
        `Failed to add professional: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleUserSelect = (user: UserData) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleAlertSelect = (alert: AlertData) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const handleProfessionalSelect = (professional: ProfessionalData) => {
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
          {!sidebarCollapsed && <h2 className="text-xl font-bold">MoodSync</h2>}
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
                  onAddProfessional={() => setShowAddProfessionalModal(true)}
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
                  (activity: Activity, idx: number) => (
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
                  (assignment: Assignment, idx: number) => (
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

      {/* Add Professional Modal */}
      {showAddProfessionalModal && (
        <AddProfessionalModal
          onClose={() => setShowAddProfessionalModal(false)}
          onSave={handleAddProfessional}
        />
      )}
    </div>
  );
};

// -------------------------
// Reusable Components
// -------------------------
const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  title,
  isActive,
  onClick,
  collapsed,
}) => {
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

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
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

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  positive,
}) => {
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

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  icon,
  onClick,
}) => {
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
const DashboardContent: React.FC<DashboardContentProps> = ({
  analytics,
  users,
  alerts,
  professionals,
}) => {
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
            .filter((a) => a.status === "New" || a.status === "In Progress")
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
              (alert) =>
                alert.severity === "Critical" || alert.severity === "High"
            )
            .slice(0, 5)
            .map((alert, idx) => (
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
                analytics.recentActivity.slice(0, 5).map((activity, idx) => (
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
                      <p className="text-sm text-gray-500">{activity.action}</p>
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
                analytics.moodDistribution.map((mood, idx) => (
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

const UsersContent: React.FC<UsersContentProps> = ({ users, onUserSelect }) => {
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

const AlertsContent: React.FC<AlertsContentProps> = ({
  alerts,
  onAlertSelect,
}) => {
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
            <button className="px-3 py-1 bg-indigo-600 text-white border border-indigo-600 rounded-md text-sm hover:bg-gray-50">
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

const ProfessionalsContent: React.FC<ProfessionalsContentProps> = ({
  professionals,
  onProfessionalSelect,
  onAddProfessional,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Professional Management</h2>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          onClick={onAddProfessional}
        >
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

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ analytics }) => {
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

// New Add Professional Modal Component
const AddProfessionalModal: React.FC<AddProfessionalModalProps> = ({
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProfessionalFormData>({
    name: "",
    email: "",
    phone: "",
    hospital: "",
    specialty: "",
    specializations: [],
    languages: [],
    education: "",
    licenseNumber: "",
    availableHours: "",
    profileImage: null,
    licenseCertificate: null,
  });

  const [specialization, setSpecialization] = useState("");
  const [language, setLanguage] = useState("");
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ProfessionalFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileImageRef = useRef<HTMLInputElement>(null);
  const licenseCertificateRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (formErrors[name as keyof ProfessionalFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));

      // Clear error when field is edited
      if (formErrors[name as keyof ProfessionalFormData]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const addSpecialization = () => {
    if (specialization.trim()) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, specialization.trim()],
      }));
      setSpecialization("");
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }));
  };

  const addLanguage = () => {
    if (language.trim()) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, language.trim()],
      }));
      setLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProfessionalFormData, string>> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errors.email = "Email is invalid";

    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.hospital.trim()) errors.hospital = "Hospital is required";
    if (!formData.specialty.trim()) errors.specialty = "Specialty is required";
    if (!formData.education.trim()) errors.education = "Education is required";
    if (!formData.licenseNumber.trim())
      errors.licenseNumber = "License number is required";
    if (!formData.availableHours.trim())
      errors.availableHours = "Available hours are required";

    if (formData.specializations.length === 0)
      errors.specializations = "At least one specialization is required";
    if (formData.languages.length === 0)
      errors.languages = "At least one language is required";

    if (!formData.profileImage)
      errors.profileImage = "Profile image is required";
    if (!formData.licenseCertificate)
      errors.licenseCertificate = "License certificate is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving professional:", error);
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Add New Professional" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Dr. Full Name"
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="doctor@hospital.lk"
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="077-123-4567"
            />
            {formErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hospital/Clinic*
            </label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.hospital ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="National Hospital of Sri Lanka"
            />
            {formErrors.hospital && (
              <p className="mt-1 text-xs text-red-500">{formErrors.hospital}</p>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-3">Professional Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Specialty*
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.specialty ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Psychiatry"
              />
              {formErrors.specialty && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.specialty}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number (SLMC)*
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.licenseNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="SLMC-12345"
              />
              {formErrors.licenseNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.licenseNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education/Qualifications*
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.education ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="MD in Psychiatry, University of Colombo"
              />
              {formErrors.education && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.education}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Hours*
              </label>
              <input
                type="text"
                name="availableHours"
                value={formData.availableHours}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.availableHours
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="9 AM - 5 PM"
              />
              {formErrors.availableHours && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.availableHours}
                </p>
              )}
            </div>
          </div>

          {/* Specializations */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specializations/Focus Areas*
            </label>
            <div className="flex">
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="Add a specialization (e.g., Depression, CBT)"
              />
              <button
                type="button"
                onClick={addSpecialization}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            {formErrors.specializations && (
              <p className="mt-1 text-xs text-red-500">
                {formErrors.specializations}
              </p>
            )}

            {formData.specializations.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.specializations.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-indigo-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-indigo-800 text-sm">{spec}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Languages Spoken*
            </label>
            <div className="flex">
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="Add a language (e.g., Sinhala, English)"
              />
              <button
                type="button"
                onClick={addLanguage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            {formErrors.languages && (
              <p className="mt-1 text-xs text-red-500">
                {formErrors.languages}
              </p>
            )}

            {formData.languages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-indigo-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-indigo-800 text-sm">{lang}</span>
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Document Uploads */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-3">Document Uploads</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image*
              </label>
              <input
                type="file"
                ref={profileImageRef}
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                  formErrors.profileImage ? "border-red-500" : "border-gray-300"
                }`}
                onClick={() => profileImageRef.current?.click()}
              >
                {formData.profileImage ? (
                  <div className="flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="Profile preview"
                      className="h-32 w-32 object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <User size={32} className="mx-auto mb-2" />
                    <p>Click to upload profile image</p>
                    <p className="text-xs mt-1">JPG, PNG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
              {formErrors.profileImage && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.profileImage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Certificate*
              </label>
              <input
                type="file"
                ref={licenseCertificateRef}
                name="licenseCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                  formErrors.licenseCertificate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                onClick={() => licenseCertificateRef.current?.click()}
              >
                {formData.licenseCertificate ? (
                  <div className="text-green-600">
                    <FileText size={32} className="mx-auto mb-2" />
                    <p>{formData.licenseCertificate.name}</p>
                    <p className="text-xs mt-1">
                      {(formData.licenseCertificate.size / 1024 / 1024).toFixed(
                        2
                      )}{" "}
                      MB
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <FileText size={32} className="mx-auto mb-2" />
                    <p>Click to upload license certificate</p>
                    <p className="text-xs mt-1">PDF, JPG, PNG up to 5MB</p>
                  </div>
                )}
              </div>
              {formErrors.licenseCertificate && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.licenseCertificate}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Professional"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminDashboard;
