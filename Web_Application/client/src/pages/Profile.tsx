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
} from "react-icons/fa";

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
        active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
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
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && change && (
            <p
              className={`text-sm flex items-center mt-1 ${
                trend === "up" ? "text-green-600" : "text-red-600"
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
        <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
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
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="relative mb-4 md:mb-0 md:mr-6">
          <img
            src={SAMPLE_USER.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full text-sm">
            <FaEdit />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {SAMPLE_USER.name}
              </h2>
              <p className="text-gray-600">{SAMPLE_USER.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(SAMPLE_USER.joinDate).toLocaleDateString()}
              </p>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Location</p>
            <p className="font-medium">{SAMPLE_USER.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Emergency Contact</p>
            <p className="font-medium">{SAMPLE_USER.emergencyContact}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Therapist</p>
            <p className="font-medium">{SAMPLE_USER.therapistName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Next Appointment</p>
            <p className="font-medium">
              {new Date(SAMPLE_USER.nextAppointment).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-3 border border-gray-300 rounded-lg text-left flex items-center hover:bg-gray-50">
            <FaBell className="text-gray-500 mr-3" />
            <span>Notification Preferences</span>
          </button>
          <button className="p-3 border border-gray-300 rounded-lg text-left flex items-center hover:bg-gray-50">
            <FaCog className="text-gray-500 mr-3" />
            <span>Privacy Settings</span>
          </button>
          <button className="p-3 border border-gray-300 rounded-lg text-left flex items-center hover:bg-gray-50">
            <FaEdit className="text-gray-500 mr-3" />
            <span>Change Password</span>
          </button>
          <button className="p-3 border border-red-200 rounded-lg text-left flex items-center text-red-600 hover:bg-red-50">
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
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Mood</h3>
            <button className="text-blue-600 text-sm hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {SAMPLE_MOOD_DATA.slice(-5)
              .reverse()
              .map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 border border-gray-200 rounded-lg"
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
                      className={`text-sm font-bold ${
                        entry.score >= 70
                          ? "text-green-600"
                          : entry.score >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {entry.score}/100
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Upcoming</h3>
            <button className="text-blue-600 text-sm hover:underline">
              View Calendar
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-3 border border-blue-100 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <FaCalendarAlt />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Therapy Session</p>
                  <p className="text-sm text-gray-600">
                    {new Date(SAMPLE_USER.nextAppointment).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 border border-purple-100 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600 text-white rounded-lg">
                  <FaBrain />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Mindfulness Session</p>
                  <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
                </div>
              </div>
            </div>

            <div className="p-3 border border-green-100 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 text-white rounded-lg">
                  <FaHeartbeat />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Weekly Check-in</p>
                  <p className="text-sm text-gray-600">Saturday, 9:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-4 w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Schedule New Activity
          </button>
        </div>
      </div>
    </div>
  );
};

// MentalHealthInsights Component
const MentalHealthInsights: React.FC = () => {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-6">Sentiment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {SAMPLE_SENTIMENTS.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{item.category}</h4>
                <div
                  className={`flex items-center ${
                    item.trend === "down" ? "text-green-600" : "text-red-600"
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">
                Stress Triggers
              </h4>
              <p className="text-sm text-gray-700">
                Based on your journal entries, work deadlines and family
                discussions appear to be significant stress triggers. Consider
                discussing coping strategies with your therapist.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">
                Positive Activities
              </h4>
              <p className="text-sm text-gray-700">
                Nature and outdoor activities correlate strongly with your
                positive mood entries. Consider incorporating more outdoor time
                into your weekly routine.
              </p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Sleep Impact</h4>
              <p className="text-sm text-gray-700">
                Your mood scores are typically higher on days following 7+ hours
                of sleep. Maintaining consistent sleep patterns may help
                stabilize your mood.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="flex p-4 border border-gray-200 rounded-lg">
              <div className="p-2 bg-blue-600 text-white rounded-lg mr-4">
                <FaBrain />
              </div>
              <div>
                <h4 className="font-medium mb-1">Try Mindfulness Meditation</h4>
                <p className="text-sm text-gray-600">
                  A 10-minute daily practice may help reduce your anxiety
                  levels.
                </p>
                <button className="mt-2 text-blue-600 text-sm hover:underline">
                  View Guided Sessions
                </button>
              </div>
            </div>

            <div className="flex p-4 border border-gray-200 rounded-lg">
              <div className="p-2 bg-green-600 text-white rounded-lg mr-4">
                <FaRoute />
              </div>
              <div>
                <h4 className="font-medium mb-1">Weekly Nature Walk</h4>
                <p className="text-sm text-gray-600">
                  Schedule time for outdoor activities to boost your mood.
                </p>
                <button className="mt-2 text-blue-600 text-sm hover:underline">
                  Find Nearby Parks
                </button>
              </div>
            </div>

            <div className="flex p-4 border border-gray-200 rounded-lg">
              <div className="p-2 bg-purple-600 text-white rounded-lg mr-4">
                <FaHeartbeat />
              </div>
              <div>
                <h4 className="font-medium mb-1">Sleep Hygiene Improvement</h4>
                <p className="text-sm text-gray-600">
                  Establish a consistent bedtime routine to improve sleep
                  quality.
                </p>
                <button className="mt-2 text-blue-600 text-sm hover:underline">
                  View Sleep Tips
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// MyJourney Component
const MyJourney: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Journal Entries</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            New Entry
          </button>
        </div>

        <div className="space-y-4">
          {SAMPLE_JOURNAL_ENTRIES.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <MoodIcon mood={entry.mood} size={20} />
                  <h4 className="font-medium ml-2">{entry.title}</h4>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700 mb-3">{entry.content}</p>
              <div className="flex justify-end">
                <button className="text-blue-600 text-sm hover:underline mr-4">
                  Edit
                </button>
                <button className="text-red-600 text-sm hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Progress Timeline</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-blue-200"></div>

          <div className="space-y-8">
            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-blue-600 bg-white"></div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Started Journey</h4>
                  <p className="text-sm text-gray-500">2023-08-15</p>
                </div>
                <p className="text-sm text-gray-700">
                  Joined MoodSync to track and improve mental health.
                </p>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-green-600 bg-white"></div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">First Therapy Session</h4>
                  <p className="text-sm text-gray-500">2023-09-05</p>
                </div>
                <p className="text-sm text-gray-700">
                  Connected with Dr. Nirmala Silva for professional guidance.
                </p>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-purple-600 bg-white"></div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Milestone: 30 Days Streak</h4>
                  <p className="text-sm text-gray-500">2023-10-15</p>
                </div>
                <p className="text-sm text-gray-700">
                  Consistently tracked mood and journal entries for 30 days.
                </p>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-amber-600 bg-white"></div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Anxiety Reduction</h4>
                  <p className="text-sm text-gray-500">2024-01-10</p>
                </div>
                <p className="text-sm text-gray-700">
                  Anxiety levels reduced by 30% after implementing recommended
                  coping strategies.
                </p>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-blue-600 bg-white"></div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Present Day</h4>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-gray-700">
                  Continuing journey with improved mental wellbeing and coping
                  strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// WellnessTracker Component
const WellnessTracker: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Avg. Sleep"
          value={`${(
            SAMPLE_WELLNESS_DATA.sleep.reduce((a, b) => a + b, 0) /
            SAMPLE_WELLNESS_DATA.sleep.length
          ).toFixed(1)} hrs`}
          icon={<FaCalendarAlt />}
          color="bg-blue-600"
        />
        <StatCard
          title="Exercise"
          value={`${
            SAMPLE_WELLNESS_DATA.exercise[
              SAMPLE_WELLNESS_DATA.exercise.length - 1
            ]
          } min`}
          icon={<FaHeartbeat />}
          color="bg-green-600"
        />
        <StatCard
          title="Meditation"
          value={`${
            SAMPLE_WELLNESS_DATA.meditation[
              SAMPLE_WELLNESS_DATA.meditation.length - 1
            ]
          } min`}
          icon={<FaBrain />}
          color="bg-purple-600"
        />
        <StatCard
          title="Water Intake"
          value={`${
            SAMPLE_WELLNESS_DATA.water[SAMPLE_WELLNESS_DATA.water.length - 1]
          } glasses`}
          icon={<FaRoute />}
          color="bg-cyan-600"
        />
        <StatCard
          title="Nutrition"
          value={`${
            SAMPLE_WELLNESS_DATA.nutrition[
              SAMPLE_WELLNESS_DATA.nutrition.length - 1
            ]
          }/100`}
          icon={<FaUser />}
          color="bg-amber-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Wellness Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Sleep (hrs)</th>
                <th className="py-2 px-4 text-left">Exercise (min)</th>
                <th className="py-2 px-4 text-left">Meditation (min)</th>
                <th className="py-2 px-4 text-left">Water Intake</th>
                <th className="py-2 px-4 text-left">Nutrition</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_WELLNESS_DATA.sleep.map((sleep, index) => {
                const date = new Date();
                date.setDate(
                  date.getDate() -
                    (SAMPLE_WELLNESS_DATA.sleep.length - 1 - index)
                );
                return (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{date.toLocaleDateString()}</td>
                    <td className="py-2 px-4">{sleep}</td>
                    <td className="py-2 px-4">
                      {SAMPLE_WELLNESS_DATA.exercise[index]}
                    </td>
                    <td className="py-2 px-4">
                      {SAMPLE_WELLNESS_DATA.meditation[index]}
                    </td>
                    <td className="py-2 px-4">
                      {SAMPLE_WELLNESS_DATA.water[index]}
                    </td>
                    <td className="py-2 px-4">
                      {SAMPLE_WELLNESS_DATA.nutrition[index]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main Page Component with Sidebar Navigation
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
      case "journey":
        return <MyJourney />;
      case "wellness":
        return <WellnessTracker />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">MoodSync</h2>
          </div>
          <nav className="space-y-2">
            <NavItem
              icon={<FaUser />}
              title="Profile"
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
              title="Insights"
              active={activeTab === "insights"}
              onClick={() => setActiveTab("insights")}
            />
            <NavItem
              icon={<FaRoute />}
              title="Journey"
              active={activeTab === "journey"}
              onClick={() => setActiveTab("journey")}
            />
            <NavItem
              icon={<FaHeartbeat />}
              title="Wellness"
              active={activeTab === "wellness"}
              onClick={() => setActiveTab("wellness")}
            />
          </nav>
        </aside>
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserProfilePages;
