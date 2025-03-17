// CommunitySupportPages.tsx
import React, { useState } from "react";
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Smile,
  Search,
  Calendar,
  Filter,
} from "lucide-react";

const CommunitySupportPages: React.FC = () => {
  const [activeTab, setActiveTab] = useState("support-groups");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for community groups
  const supportGroups = [
    {
      id: 1,
      name: "Anxiety Support Circle",
      members: 234,
      meetingSchedule: "Tuesdays at 7PM",
      description:
        "A safe space for people dealing with anxiety to share experiences and coping strategies.",
      tags: ["anxiety", "stress", "coping"],
      language: "English",
      isOnline: true,
    },
    {
      id: 2,
      name: "Depression Recovery",
      members: 187,
      meetingSchedule: "Wednesdays at 6PM",
      description:
        "Support for those navigating depression and working toward recovery.",
      tags: ["depression", "recovery", "self-care"],
      language: "English",
      isOnline: true,
    },
    {
      id: 3,
      name: "සිංහල මානසික සෞඛ්‍ය කණ්ඩායම",
      members: 156,
      meetingSchedule: "Saturdays at 10AM",
      description:
        "A Sinhala-language group focused on mental health awareness and support.",
      tags: ["sinhala", "general", "awareness"],
      language: "Sinhala",
      isOnline: false,
    },
    {
      id: 4,
      name: "Young Adults Wellness",
      members: 221,
      meetingSchedule: "Fridays at 8PM",
      description:
        "For young adults (18-30) dealing with mental health challenges in today's world.",
      tags: ["young-adults", "stress", "life-skills"],
      language: "English",
      isOnline: true,
    },
  ];

  const communityPosts = [
    {
      id: 1,
      author: "Mindful_Journey",
      title: "Finding peace in small moments",
      content:
        "Today I practiced mindfulness for just 5 minutes and it made such a difference...",
      likes: 24,
      comments: 7,
      timePosted: "2 hours ago",
    },
    {
      id: 2,
      author: "HealingSteps",
      title: "My recovery milestone",
      content:
        "After 6 months of therapy, I finally feel like I'm making progress with my anxiety...",
      likes: 56,
      comments: 12,
      timePosted: "5 hours ago",
    },
    {
      id: 3,
      author: "GratitudeSeeker",
      title: "Three things I'm grateful for today",
      content:
        "Even on hard days, finding small things to be grateful for helps me stay grounded...",
      likes: 38,
      comments: 9,
      timePosted: "1 day ago",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Mindfulness Workshop",
      date: "March 15, 2025",
      time: "6:00 PM - 7:30 PM",
      host: "Dr. Samantha Perera",
      location: "Online (Zoom)",
    },
    {
      id: 2,
      title: "Art Therapy Session",
      date: "March 18, 2025",
      time: "4:00 PM - 5:30 PM",
      host: "Colombo Wellness Center",
      location: "Colombo 7, Sri Lanka",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md max-w-6xl mx-auto my-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-lg p-6 text-white">
        <h2 className="text-2xl font-bold">Community Support</h2>
        <p className="mt-1 opacity-90">
          Connect, share and grow with others on similar journeys
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "support-groups"
              ? "text-teal-600 border-b-2 border-teal-500 bg-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("support-groups")}
        >
          <Users size={18} className="mr-2" />
          Support Groups
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "peer-support"
              ? "text-teal-600 border-b-2 border-teal-500 bg-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("peer-support")}
        >
          <Heart size={18} className="mr-2" />
          Peer Support
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "community-chats"
              ? "text-teal-600 border-b-2 border-teal-500 bg-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("community-chats")}
        >
          <MessageCircle size={18} className="mr-2" />
          Community Chats
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "share-support"
              ? "text-teal-600 border-b-2 border-teal-500 bg-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("share-support")}
        >
          <Share2 size={18} className="mr-2" />
          Share & Support
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "wellness-community"
              ? "text-teal-600 border-b-2 border-teal-500 bg-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("wellness-community")}
        >
          <Smile size={18} className="mr-2" />
          Wellness Community
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <button className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium text-gray-700 flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button className="bg-teal-500 hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium text-white">
            + Join New Group
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Support Groups Tab */}
        {activeTab === "support-groups" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Available Support Groups
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportGroups.map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-lg">{group.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        group.isOnline
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {group.isOnline ? "Online" : "In-Person"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {group.description}
                  </p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    <span>{group.members} members</span>
                    <span className="mx-2">•</span>
                    <Calendar size={16} className="mr-1" />
                    <span>{group.meetingSchedule}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-500">
                      {group.language}
                    </span>
                    <button className="bg-teal-50 text-teal-700 hover:bg-teal-100 text-sm px-3 py-1 rounded-md font-medium">
                      Join Group
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Upcoming Group Sessions
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="bg-teal-100 text-teal-800 p-3 rounded-lg mr-4 text-center min-w-16">
                      <div className="text-sm font-bold">
                        {event.date.split(",")[0]}
                      </div>
                      <div className="text-xs">{event.date.split(", ")[1]}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                        {event.time} • {event.host}
                      </p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <button className="bg-white border border-teal-500 text-teal-600 hover:bg-teal-50 px-3 py-1 rounded-md text-sm">
                      RSVP
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Peer Support Tab */}
        {activeTab === "peer-support" && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                About Peer Support
              </h3>
              <p className="text-blue-700">
                Connect one-on-one with trained peer supporters who have lived
                experience with mental health challenges. All conversations are
                confidential and focused on personal recovery journeys.
              </p>
              <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Request Peer Support
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-4">
              Available Peer Supporters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Peer Supporter Cards - These would be dynamic in the actual app */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                  <Users size={24} className="text-gray-500" />
                </div>
                <h4 className="font-medium">Amal S.</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Anxiety, Depression
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supporting others for 2 years
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Languages: English, Sinhala
                </p>
                <button className="mt-3 bg-teal-50 text-teal-700 hover:bg-teal-100 w-full py-1 rounded-md text-sm font-medium">
                  Connect
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                  <Users size={24} className="text-gray-500" />
                </div>
                <h4 className="font-medium">Priya K.</h4>
                <p className="text-sm text-gray-600 mt-1">
                  PTSD, Stress Management
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supporting others for 3 years
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Languages: English, Tamil
                </p>
                <button className="mt-3 bg-teal-50 text-teal-700 hover:bg-teal-100 w-full py-1 rounded-md text-sm font-medium">
                  Connect
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                  <Users size={24} className="text-gray-500" />
                </div>
                <h4 className="font-medium">Malik J.</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Recovery, Addiction
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supporting others for 5 years
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Languages: English, Sinhala
                </p>
                <button className="mt-3 bg-teal-50 text-teal-700 hover:bg-teal-100 w-full py-1 rounded-md text-sm font-medium">
                  Connect
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Become a Peer Supporter
              </h3>
              <p className="text-gray-600 mb-3">
                Use your lived experience to help others on their mental health
                journey. We provide training and support.
              </p>
              <button className="bg-white border border-teal-500 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-md text-sm font-medium">
                Learn More About Becoming a Supporter
              </button>
            </div>
          </div>
        )}

        {/* Community Chats Tab */}
        {activeTab === "community-chats" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Active Community Chat Rooms
            </h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Daily Mindfulness</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      42 members active • Moderated by MindfulMasters
                    </p>
                  </div>
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-sm">
                    Join Chat
                  </button>
                </div>
                <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 text-sm text-gray-500">
                  <p>Today's topic: Finding calm in busy moments</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Anxiety Support</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      28 members active • Moderated by CalmCollective
                    </p>
                  </div>
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-sm">
                    Join Chat
                  </button>
                </div>
                <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 text-sm text-gray-500">
                  <p>Today's topic: Coping with social anxiety</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Young Adults (18-25)</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      36 members active • Moderated by YouthWellness
                    </p>
                  </div>
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-sm">
                    Join Chat
                  </button>
                </div>
                <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 text-sm text-gray-500">
                  <p>Today's topic: Balancing work, study, and mental health</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-purple-800">
                Community Guidelines
              </h3>
              <ul className="list-disc pl-5 text-purple-700 text-sm space-y-1">
                <li>Be respectful and kind to all community members</li>
                <li>
                  Maintain confidentiality - what's shared here stays here
                </li>
                <li>No promotional content or spam</li>
                <li>If someone is in crisis, alert a moderator immediately</li>
                <li>Focus on support, not medical advice</li>
              </ul>
              <button className="mt-3 text-purple-700 text-sm font-medium">
                Read Full Guidelines →
              </button>
            </div>
          </div>
        )}

        {/* Share & Support Tab */}
        {activeTab === "share-support" && (
          <div>
            <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Share your experience or a moment of gratitude..."
                rows={3}
              ></textarea>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700 p-1">
                    <Users size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-1">
                    <Calendar size={18} />
                  </button>
                </div>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1 rounded-md text-sm font-medium">
                  Share
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Community Shares</h3>
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-sm">{post.author}</h4>
                      <p className="text-xs text-gray-500">{post.timePosted}</p>
                    </div>
                  </div>
                  <h3 className="font-medium mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm">{post.content}</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center hover:text-teal-600">
                      <Heart size={16} className="mr-1" />
                      {post.likes} Likes
                    </button>
                    <button className="flex items-center hover:text-teal-600">
                      <MessageCircle size={16} className="mr-1" />
                      {post.comments} Comments
                    </button>
                    <button className="flex items-center hover:text-teal-600">
                      <Share2 size={16} className="mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="text-teal-600 hover:text-teal-700 font-medium">
                Load More Posts
              </button>
            </div>
          </div>
        )}

        {/* Wellness Community Tab */}
        {activeTab === "wellness-community" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                  <Calendar size={20} className="text-yellow-700" />
                </div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Wellness Events
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Join upcoming workshops and sessions
                </p>
                <button className="text-yellow-700 hover:text-yellow-800 text-sm font-medium">
                  Browse Events →
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Users size={20} className="text-green-700" />
                </div>
                <h3 className="font-semibold text-green-800 mb-1">
                  Success Stories
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  Read inspiring journeys of recovery
                </p>
                <button className="text-green-700 hover:text-green-800 text-sm font-medium">
                  Read Stories →
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Heart size={20} className="text-purple-700" />
                </div>
                <h3 className="font-semibold text-purple-800 mb-1">
                  Volunteer
                </h3>
                <p className="text-sm text-purple-700 mb-3">
                  Give back to the mental health community
                </p>
                <button className="text-purple-700 hover:text-purple-800 text-sm font-medium">
                  Learn More →
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Wellness Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium">Mental Health First Aid</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Learn how to respond when someone is experiencing a mental
                  health challenge
                </p>
                <button className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Access Resource →
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium">Meditation Guide</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Simple meditation techniques for beginners to reduce stress
                  and anxiety
                </p>
                <button className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Access Resource →
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium">Sleep Improvement</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Practical strategies to improve your sleep quality and mental
                  health
                </p>
                <button className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Access Resource →
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium">Healthy Boundaries</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Learn to establish and maintain healthy boundaries in
                  relationships
                </p>
                <button className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Access Resource →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySupportPages;
