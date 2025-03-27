// UserProfilePages.tsx
import React, { useState } from "react";
import {
  FaUser,
  FaChartLine,
  FaBrain,
  FaRoute,
  FaHeartbeat,
  FaCalendarAlt,
  FaSmile,
  FaMeh,
  FaFrown,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaPlusCircle,
  FaCheck,
  FaWater,
  FaAppleAlt,
  FaMoon,
  FaRunning,
  FaPen,
  FaEllipsisH,
} from "react-icons/fa";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar"; // Make sure the path is correct

// Sample data (in a real app, this would come from your API)
const SAMPLE_USER = {
  name: "Amal Perera",
  email: "amal.perera@gmail.com",
  joinDate: "2023-08-15",
  profileImage: "/api/placeholder/150/150",
  location: "Colombo, Sri Lanka",
  therapistName: "Dr. Nirmala Silva",
  nextAppointment: "2025-03-07T14:30:00",
  emergencyContact: "+94 77 123 4567",
};

const SAMPLE_MOOD_DATA = [
  {
    date: "2025-02-23",
    mood: "happy",
    score: 85,
    note: "Had a great day at work.",
  },
  {
    date: "2025-02-24",
    mood: "neutral",
    score: 65,
    note: "Feeling a bit tired today.",
  },
  {
    date: "2025-02-25",
    mood: "sad",
    score: 40,
    note: "Stressed about upcoming presentation.",
  },
  {
    date: "2025-02-26",
    mood: "happy",
    score: 75,
    note: "Presentation went well!",
  },
  {
    date: "2025-02-27",
    mood: "happy",
    score: 80,
    note: "Spent time with family.",
  },
  {
    date: "2025-02-28",
    mood: "neutral",
    score: 60,
    note: "Normal day, nothing special.",
  },
  {
    date: "2025-03-01",
    mood: "happy",
    score: 90,
    note: "Weekend trip to Kandy!",
  },
  { date: "2025-03-02", mood: "happy", score: 85, note: "Relaxing Sunday." },
];

const SAMPLE_SENTIMENTS = [
  { category: "Anxiety", score: 35, trend: "down", change: -8 },
  { category: "Depression", score: 28, trend: "down", change: -5 },
  { category: "Stress", score: 45, trend: "up", change: 7 },
  { category: "Social Connection", score: 72, trend: "up", change: 12 },
  { category: "Self-Esteem", score: 68, trend: "up", change: 3 },
];

const SAMPLE_WELLNESS_DATA = {
  sleep: [6.5, 7.2, 8.0, 7.5, 6.8, 7.1, 8.5],
  exercise: [30, 0, 45, 20, 0, 60, 30],
  meditation: [10, 5, 15, 10, 10, 5, 0],
  water: [5, 6, 4, 7, 5, 6, 8],
  nutrition: [70, 65, 80, 75, 60, 85, 80],
};

const SAMPLE_JOURNAL_ENTRIES = [
  {
    id: "1",
    date: "2025-03-01",
    title: "Weekend Reflection",
    content:
      "Today was a great day. I went to Kandy with friends and enjoyed the botanical gardens. Being in nature really helped clear my mind.",
    mood: "happy",
  },
  {
    id: "2",
    date: "2025-02-28",
    title: "Work Challenges",
    content:
      "Struggled with the project deadline today. Feeling overwhelmed but managed to complete most tasks. Need to practice more mindfulness.",
    mood: "neutral",
  },
  {
    id: "3",
    date: "2025-02-25",
    title: "Difficult Day",
    content:
      "Had an argument with a family member. Feeling down and anxious about the presentation tomorrow. Used breathing techniques but still feeling on edge.",
    mood: "sad",
  },
];

// NavItem Component
interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, title, active, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        active
          ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
          : "text-gray-700 hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="text-xl mr-3">{icon}</div>
      <span className="font-medium">{title}</span>
    </div>
  );
};

// StatCard Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | null;
  change?: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  change,
  color,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && change && (
            <p
              className={`text-sm flex items-center mt-1 ${
                trend === "up"
                  ? title === "Anxiety" ||
                    title === "Depression" ||
                    title === "Stress"
                    ? "text-red-600"
                    : "text-green-600"
                  : title === "Anxiety" ||
                    title === "Depression" ||
                    title === "Stress"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {trend === "up" ? (
                <FaArrowUp size={12} className="mr-1" />
              ) : (
                <FaArrowDown size={12} className="mr-1" />
              )}
              {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} text-white shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// MoodIcon Component
const MoodIcon: React.FC<{ mood: string; size?: number }> = ({
  mood,
  size = 24,
}) => {
  switch (mood) {
    case "happy":
      return <FaSmile size={size} className="text-green-500" />;
    case "neutral":
      return <FaMeh size={size} className="text-yellow-500" />;
    case "sad":
      return <FaFrown size={size} className="text-red-500" />;
    default:
      return <FaMeh size={size} className="text-gray-500" />;
  }
};

// MyProfile Component
const MyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(SAMPLE_USER);
  const [tempData, setTempData] = useState(SAMPLE_USER);

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="relative mb-6 md:mb-0 md:mr-6 group">
          <a
            href="https://scontent.fcmb2-2.fna.fbcdn.net/v/t39.30808-6/471677757_1132452808252329_3992846703285013554_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ztZLYtME4zcQ7kNvgF_MtFR&_nc_oc=AdnsaB1SGSbtf8Ox6mQv46nmYHhm6rYnbUPKhV8gCKDE_BBVCwY9NGbReGj7NRtEsxDjVGrdzQvPB7rdNg_WMVrc&_nc_zt=23&_nc_ht=scontent.fcmb2-2.fna&_nc_gid=6c5oHNLw0hBYaxCfSgrlRg&oh=00_AYGNZMIz9cFakRKEj9vxRl1d59aazf89MF1XoZvo1WVyFA&oe=67E9716B"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://scontent.fcmb2-2.fna.fbcdn.net/v/t39.30808-6/471677757_1132452808252329_3992846703285013554_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ztZLYtME4zcQ7kNvgF_MtFR&_nc_oc=AdnsaB1SGSbtf8Ox6mQv46nmYHhm6rYnbUPKhV8gCKDE_BBVCwY9NGbReGj7NRtEsxDjVGrdzQvPB7rdNg_WMVrc&_nc_zt=23&_nc_ht=scontent.fcmb2-2.fna&_nc_gid=6c5oHNLw0hBYaxCfSgrlRg&oh=00_AYGNZMIz9cFakRKEj9vxRl1d59aazf89MF1XoZvo1WVyFA&oe=67E9716B"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 transition-all duration-300 group-hover:border-blue-300"
            />
          </a>

          <button
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full text-sm shadow-md hover:bg-blue-700 transition-colors"
            aria-label="Edit profile picture"
          >
            <FaEdit />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  className="text-2xl font-bold text-gray-800 border-b border-blue-300 mb-2 focus:outline-none focus:border-blue-600"
                  value={tempData.name}
                  onChange={(e) =>
                    setTempData({ ...tempData, name: e.target.value })
                  }
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">
                  {profileData.name}
                </h2>
              )}
              {isEditing ? (
                <input
                  type="email"
                  className="text-gray-600 border-b border-blue-300 mb-2 w-full focus:outline-none focus:border-blue-600"
                  value={tempData.email}
                  onChange={(e) =>
                    setTempData({ ...tempData, email: e.target.value })
                  }
                />
              ) : (
                <p className="text-gray-600">{profileData.email}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(profileData.joinDate).toLocaleDateString()}
              </p>
            </div>
            {isEditing ? (
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <FaCheck className="mr-2" /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm hover:shadow-md"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
            <p className="text-sm text-gray-500 mb-1">Location</p>
            {isEditing ? (
              <input
                type="text"
                className="font-medium border-b border-blue-300 w-full bg-transparent focus:outline-none focus:border-blue-600"
                value={tempData.location}
                onChange={(e) =>
                  setTempData({ ...tempData, location: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{profileData.location}</p>
            )}
          </div>
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
            <p className="text-sm text-gray-500 mb-1">Emergency Contact</p>
            {isEditing ? (
              <input
                type="text"
                className="font-medium border-b border-blue-300 w-full bg-transparent focus:outline-none focus:border-blue-600"
                value={tempData.emergencyContact}
                onChange={(e) =>
                  setTempData({ ...tempData, emergencyContact: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{profileData.emergencyContact}</p>
            )}
          </div>
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
            <p className="text-sm text-gray-500 mb-1">Current Therapist</p>
            {isEditing ? (
              <input
                type="text"
                className="font-medium border-b border-blue-300 w-full bg-transparent focus:outline-none focus:border-blue-600"
                value={tempData.therapistName}
                onChange={(e) =>
                  setTempData({ ...tempData, therapistName: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{profileData.therapistName}</p>
            )}
          </div>
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
            <p className="text-sm text-gray-500 mb-1">Next Appointment</p>
            {isEditing ? (
              <input
                type="datetime-local"
                className="font-medium border-b border-blue-300 w-full bg-transparent focus:outline-none focus:border-blue-600"
                value={new Date(tempData.nextAppointment)
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) =>
                  setTempData({ ...tempData, nextAppointment: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">
                {new Date(profileData.nextAppointment).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-3 border border-gray-300 rounded-lg text-left flex items-center hover:bg-gray-50 transition-colors shadow-sm hover:shadow">
            <FaBell className="text-blue-500 mr-3" />
            <span>Notification Preferences</span>
          </button>
          <button className="p-3 border border-gray-300 rounded-lg text-left flex items-center hover:bg-gray-50 transition-colors shadow-sm hover:shadow">
            <FaCog className="text-purple-500 mr-3" />
            <span>Privacy Settings</span>
          </button>
          <button className="p-3 border border-gray-300 rounded-lg text-left flex items-center hover:bg-gray-50 transition-colors shadow-sm hover:shadow">
            <FaEdit className="text-green-500 mr-3" />
            <span>Change Password</span>
          </button>
          <button className="p-3 border border-red-200 rounded-lg text-left flex items-center text-red-600 hover:bg-red-50 transition-colors shadow-sm hover:shadow">
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// UserDashboard Component
const UserDashboard: React.FC = () => {
  const todayMood = SAMPLE_MOOD_DATA[SAMPLE_MOOD_DATA.length - 1];
  const [newMood, setNewMood] = useState("");
  const [newMoodNote, setNewMoodNote] = useState("");
  const [showMoodForm, setShowMoodForm] = useState(false);

  const handleAddMood = () => {
    // In a real app, this would update your state or make an API call
    setShowMoodForm(false);
    setNewMood("");
    setNewMoodNote("");
    alert("Mood logged successfully!");
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Current Mood"
          value={
            todayMood.mood.charAt(0).toUpperCase() + todayMood.mood.slice(1)
          }
          icon={<MoodIcon mood={todayMood.mood} />}
          color="bg-blue-600"
        />
        <StatCard
          title="Mood Score"
          value={`${todayMood.score}/100`}
          icon={<FaChartLine />}
          trend={todayMood.score > 60 ? "up" : "down"}
          change={5}
          color="bg-purple-600"
        />
        <StatCard
          title="Journal Entries"
          value={SAMPLE_JOURNAL_ENTRIES.length}
          icon={<FaRoute />}
          color="bg-green-600"
        />
        <StatCard
          title="Streak"
          value="7 days"
          icon={<FaCalendarAlt />}
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Mood</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowMoodForm(!showMoodForm)}
                className="flex items-center text-blue-600 text-sm hover:underline hover:text-blue-800 transition-colors"
              >
                <FaPlusCircle className="mr-1" />{" "}
                {showMoodForm ? "Cancel" : "Log Mood"}
              </button>
              <button className="text-blue-600 text-sm hover:underline hover:text-blue-800 transition-colors">
                View All
              </button>
            </div>
          </div>

          {showMoodForm && (
            <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-medium mb-3">How are you feeling today?</h4>
              <div className="flex space-x-4 mb-4">
                <button
                  className={`p-3 rounded-lg flex flex-col items-center transition-colors ${
                    newMood === "happy"
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-white border border-gray-200 hover:bg-green-50"
                  }`}
                  onClick={() => setNewMood("happy")}
                >
                  <FaSmile size={24} className="text-green-500 mb-1" />
                  <span className="text-sm">Happy</span>
                </button>
                <button
                  className={`p-3 rounded-lg flex flex-col items-center transition-colors ${
                    newMood === "neutral"
                      ? "bg-yellow-100 border-2 border-yellow-500"
                      : "bg-white border border-gray-200 hover:bg-yellow-50"
                  }`}
                  onClick={() => setNewMood("neutral")}
                >
                  <FaMeh size={24} className="text-yellow-500 mb-1" />
                  <span className="text-sm">Neutral</span>
                </button>
                <button
                  className={`p-3 rounded-lg flex flex-col items-center transition-colors ${
                    newMood === "sad"
                      ? "bg-red-100 border-2 border-red-500"
                      : "bg-white border border-gray-200 hover:bg-red-50"
                  }`}
                  onClick={() => setNewMood("sad")}
                >
                  <FaFrown size={24} className="text-red-500 mb-1" />
                  <span className="text-sm">Sad</span>
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Add a note
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="How was your day? (optional)"
                  value={newMoodNote}
                  onChange={(e) => setNewMoodNote(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!newMood}
                  onClick={handleAddMood}
                >
                  Log Mood
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {SAMPLE_MOOD_DATA.slice(-5)
              .reverse()
              .map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                >
                  <MoodIcon mood={entry.mood} />
                  <div className="ml-4 flex-1">
                    <p className="font-medium">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{entry.note}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        entry.score >= 70
                          ? "bg-green-100 text-green-800"
                          : entry.score >= 50
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {entry.score}/100
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Upcoming</h3>
            <button className="text-blue-600 text-sm hover:underline hover:text-blue-800 transition-colors">
              View Calendar
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                  <FaCalendarAlt />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Therapy Session</p>
                  <p className="text-sm text-gray-600">
                    {new Date(SAMPLE_USER.nextAppointment).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-end space-x-2">
                <button className="text-xs text-blue-600 hover:underline">
                  Reschedule
                </button>
                <button className="text-xs text-gray-600 hover:underline">
                  Add to Calendar
                </button>
              </div>
            </div>

            <div className="p-4 border border-purple-100 bg-purple-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600 text-white rounded-lg shadow-sm">
                  <FaBrain />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Mindfulness Session</p>
                  <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="mt-2 flex justify-end space-x-2">
                <button className="text-xs text-blue-600 hover:underline">
                  Set Reminder
                </button>
                <button className="text-xs text-gray-600 hover:underline">
                  View Details
                </button>
              </div>
            </div>

            <div className="p-4 border border-green-100 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 text-white rounded-lg shadow-sm">
                  <FaHeartbeat />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Weekly Check-in</p>
                  <p className="text-sm text-gray-600">Saturday, 9:00 AM</p>
                </div>
              </div>
              <div className="mt-2 flex justify-end space-x-2">
                <button className="text-xs text-blue-600 hover:underline">
                  Set Reminder
                </button>
                <button className="text-xs text-gray-600 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow flex items-center justify-center">
            <FaPlusCircle className="mr-2" /> Schedule New Activity
          </button>
        </div>
      </div>
    </div>
  );
};

// MentalHealthInsights Component
const MentalHealthInsights: React.FC = () => {
  const [activeInsightTab, setActiveInsightTab] = useState<
    "sentiment" | "recommendations"
  >("sentiment");

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-semibold mb-6">Sentiment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {SAMPLE_SENTIMENTS.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{item.category}</h4>
                <div
                  className={`flex items-center ${
                    (item.trend === "down" &&
                      (item.category === "Anxiety" ||
                        item.category === "Depression" ||
                        item.category === "Stress")) ||
                    (item.trend === "up" &&
                      item.category !== "Anxiety" &&
                      item.category !== "Depression" &&
                      item.category !== "Stress")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.trend === "down" ? (
                    <FaArrowDown size={12} />
                  ) : (
                    <FaArrowUp size={12} />
                  )}
                  <span className="ml-1 text-xs">{Math.abs(item.change)}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    item.category === "Social Connection" ||
                    item.category === "Self-Esteem"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <p className="text-right mt-1 text-xs text-gray-500">
                {item.score}/100
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Insights</h3>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${
                  activeInsightTab === "sentiment"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveInsightTab("sentiment")}
              >
                Sentiment Analysis
              </button>
              <button
                className={`px-3 py-1 text-sm ${
                  activeInsightTab === "recommendations"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveInsightTab("recommendations")}
              >
                Recommendations
              </button>
            </div>
          </div>

          {activeInsightTab === "sentiment" ? (
            <div className="space-y-4">
              <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                <h4 className="font-medium text-blue-800 mb-2">
                  Weekly Summary
                </h4>
                <p className="text-sm">
                  Your anxiety and depression levels have decreased this week,
                  which is positive progress. However, your stress levels have
                  increased slightly, potentially related to your work
                  presentation.
                </p>
              </div>
              <div className="p-4 border border-green-100 rounded-lg bg-green-50">
                <h4 className="font-medium text-green-800 mb-2">
                  Positive Trends
                </h4>
                <p className="text-sm">
                  Your social connection score has improved significantly by
                  12%. Your weekend activities and family time appear to have
                  contributed positively to your mental well-being.
                </p>
              </div>
              <div className="p-4 border border-yellow-100 rounded-lg bg-yellow-50">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Areas for Attention
                </h4>
                <p className="text-sm">
                  Your stress levels have increased by 7% this week. Consider
                  implementing more stress management techniques such as deep
                  breathing exercises or short meditation sessions.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
                <h4 className="font-medium text-purple-800 mb-2">
                  Meditation Recommendation
                </h4>
                <p className="text-sm">
                  Try a 10-minute guided meditation focused on stress reduction
                  before work each morning this week.
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:underline">
                  View Guided Meditations
                </button>
              </div>
              <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                <h4 className="font-medium text-blue-800 mb-2">
                  Journal Prompt
                </h4>
                <p className="text-sm">
                  What specific work situations trigger your stress response?
                  How might you prepare for these situations differently?
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:underline">
                  Open in Journal
                </button>
              </div>
              <div className="p-4 border border-green-100 rounded-lg bg-green-50">
                <h4 className="font-medium text-green-800 mb-2">
                  Exercise Suggestion
                </h4>
                <p className="text-sm">
                  Your exercise pattern is inconsistent. Try scheduling 20-30
                  minute walks on days when you don't have longer exercise
                  sessions.
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:underline">
                  Set Exercise Reminder
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-6">
            Weekly Wellness Tracking
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center">
                  <FaMoon className="text-indigo-500 mr-2" /> Sleep
                </span>
                <span className="text-sm text-gray-500">Goal: 8 hours</span>
              </div>
              <div className="flex space-x-1">
                {SAMPLE_WELLNESS_DATA.sleep.map((hours, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors group relative"
                  >
                    <div
                      className="bg-indigo-500 rounded-lg transition-all"
                      style={{
                        height: `${(hours / 10) * 100}%`,
                        minHeight: "10px",
                      }}
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 text-center text-xs font-bold bg-white/80 rounded-b-lg transition-opacity">
                      {hours}h
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center">
                  <FaRunning className="text-green-500 mr-2" /> Exercise
                </span>
                <span className="text-sm text-gray-500">Goal: 30 min/day</span>
              </div>
              <div className="flex space-x-1">
                {SAMPLE_WELLNESS_DATA.exercise.map((minutes, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-green-100 rounded-lg hover:bg-green-200 transition-colors group relative"
                  >
                    <div
                      className="bg-green-500 rounded-lg transition-all"
                      style={{
                        height: `${(minutes / 60) * 100}%`,
                        minHeight: "10px",
                      }}
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 text-center text-xs font-bold bg-white/80 rounded-b-lg transition-opacity">
                      {minutes}m
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center">
                  <FaBrain className="text-purple-500 mr-2" /> Meditation
                </span>
                <span className="text-sm text-gray-500">Goal: 10 min/day</span>
              </div>
              <div className="flex space-x-1">
                {SAMPLE_WELLNESS_DATA.meditation.map((minutes, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors group relative"
                  >
                    <div
                      className="bg-purple-500 rounded-lg transition-all"
                      style={{
                        height: `${(minutes / 20) * 100}%`,
                        minHeight: "10px",
                      }}
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 text-center text-xs font-bold bg-white/80 rounded-b-lg transition-opacity">
                      {minutes}m
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center">
                  <FaWater className="text-blue-500 mr-2" /> Water
                </span>
                <span className="text-sm text-gray-500">Goal: 8 glasses</span>
              </div>
              <div className="flex space-x-1">
                {SAMPLE_WELLNESS_DATA.water.map((glasses, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors group relative"
                  >
                    <div
                      className="bg-blue-500 rounded-lg transition-all"
                      style={{
                        height: `${(glasses / 10) * 100}%`,
                        minHeight: "10px",
                      }}
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 text-center text-xs font-bold bg-white/80 rounded-b-lg transition-opacity">
                      {glasses}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center">
                  <FaAppleAlt className="text-red-500 mr-2" /> Nutrition
                </span>
                <span className="text-sm text-gray-500">Score /100</span>
              </div>
              <div className="flex space-x-1">
                {SAMPLE_WELLNESS_DATA.nutrition.map((score, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-red-100 rounded-lg hover:bg-red-200 transition-colors group relative"
                  >
                    <div
                      className="bg-red-500 rounded-lg transition-all"
                      style={{
                        height: `${(score / 100) * 100}%`,
                        minHeight: "10px",
                      }}
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 text-center text-xs font-bold bg-white/80 rounded-b-lg transition-opacity">
                      {score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Journal Component
const Journal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"entries" | "new">("entries");
  const [entries, setEntries] = useState(SAMPLE_JOURNAL_ENTRIES);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "neutral",
  });

  const handleAddEntry = () => {
    const today = new Date().toISOString().split("T")[0];
    const newId = (parseInt(entries[0].id) + 1).toString();

    const entry = {
      id: newId,
      date: today,
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      title: "",
      content: "",
      mood: "neutral",
    });
    setActiveTab("entries");
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="border-b">
        <div className="flex">
          <button
            className={`px-6 py-4 font-medium ${
              activeTab === "entries"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("entries")}
          >
            My Journal Entries
          </button>
          <button
            className={`px-6 py-4 font-medium ${
              activeTab === "new"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("new")}
          >
            New Entry
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "entries" ? (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{entry.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MoodIcon mood={entry.mood} size={20} />
                    <div className="dropdown relative">
                      <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                        <FaEllipsisH size={16} />
                      </button>
                      <div className="dropdown-menu absolute right-0 hidden bg-white shadow-lg rounded-lg p-2 z-10">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="whitespace-pre-line">{entry.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entry title"
                value={newEntry.title}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, title: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How are you feeling?
              </label>
              <div className="flex space-x-4">
                <button
                  className={`p-3 rounded-lg flex flex-col items-center transition-colors ${
                    newEntry.mood === "happy"
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-white border border-gray-200 hover:bg-green-50"
                  }`}
                  onClick={() => setNewEntry({ ...newEntry, mood: "happy" })}
                >
                  <FaSmile size={24} className="text-green-500 mb-1" />
                  <span className="text-sm">Happy</span>
                </button>
                <button
                  className={`p-3 rounded-lg flex flex-col items-center transition-colors ${
                    newEntry.mood === "neutral"
                      ? "bg-yellow-100 border-2 border-yellow-500"
                      : "bg-white border border-gray-200 hover:bg-yellow-50"
                  }`}
                  onClick={() => setNewEntry({ ...newEntry, mood: "neutral" })}
                >
                  <FaMeh size={24} className="text-yellow-500 mb-1" />
                  <span className="text-sm">Neutral</span>
                </button>
                <button
                  className={`p-3 rounded-lg flex flex-col items-center transition-colors ${
                    newEntry.mood === "sad"
                      ? "bg-red-100 border-2 border-red-500"
                      : "bg-white border border-gray-200 hover:bg-red-50"
                  }`}
                  onClick={() => setNewEntry({ ...newEntry, mood: "sad" })}
                >
                  <FaFrown size={24} className="text-red-500 mb-1" />
                  <span className="text-sm">Sad</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Journal Entry
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder="Write your thoughts here..."
                value={newEntry.content}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, content: e.target.value })
                }
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setNewEntry({
                    title: "",
                    content: "",
                    mood: "neutral",
                  });
                  setActiveTab("entries");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                disabled={!newEntry.title || !newEntry.content}
                onClick={handleAddEntry}
              >
                Save Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main UserProfilePages Component
const UserProfilePages: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <MyProfile />;
      case "dashboard":
        return <UserDashboard />;
      case "insights":
        return <MentalHealthInsights />;
      case "journal":
        return <Journal />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Your fixed Navbar */}
      {/* Add padding top so that content does not overlap with the fixed Navbar */}
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 space-y-2 hover:shadow-md transition-shadow duration-300">
              <NavItem
                icon={<FaUser />}
                title="My Profile"
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavItem
                icon={<FaChartLine />}
                title="Dashboard"
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
              />
              <NavItem
                icon={<FaBrain />}
                title="Mental Health Insights"
                active={activeTab === "insights"}
                onClick={() => setActiveTab("insights")}
              />
              <NavItem
                icon={<FaPen />}
                title="Journal"
                active={activeTab === "journal"}
                onClick={() => setActiveTab("journal")}
              />
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold mb-2">Need immediate support?</h3>
              <p className="text-sm mb-4 text-blue-100">
                Our professional counselors are available 24/7.
              </p>
              <button className="w-full bg-white text-blue-600 rounded-lg py-2 font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center">
              <div className="mr-4 bg-blue-600 text-white p-3 rounded-xl">
                <FaCalendarAlt />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-blue-800">
                  Your next therapy session is scheduled for{" "}
                  {new Date(SAMPLE_USER.nextAppointment).toLocaleString()}
                </h2>
                <p className="text-sm text-blue-600">with Dr. Nirmala Silva</p>
              </div>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                View Details
              </button>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfilePages;
