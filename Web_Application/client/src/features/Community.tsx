// CommunitySupportPages.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Smile,
  Search,
  Calendar,
  Filter,
  X,
  Bell,
  Send,
  ThumbsUp,
  User,
  Info,
  AlertTriangle,
  Loader,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import communityService, {
  SupportGroup,
  Event,
  Post,
  PeerSupporter,
  ChatRoom,
  Comment,
} from "../services/communityService";

const CommunitySupportPages: React.FC = () => {
  // States for UI and functionality
  const [activeTab, setActiveTab] = useState("support-groups");
  const [searchQuery, setSearchQuery] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSupporter, setSelectedSupporter] =
    useState<PeerSupporter | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState({
    language: "all",
    type: "all",
    tags: [] as string[],
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: string; text: string; time: string }>
  >([
    {
      sender: "System",
      text: "Welcome to the chat! Please be respectful to all members.",
      time: "Just now",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");

  // State for data
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [peerSupporters, setPeerSupporters] = useState<PeerSupporter[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState({
    groups: false,
    events: false,
    posts: false,
    supporters: false,
    chatRooms: false,
    comments: false,
    action: false,
  });

  // Error states
  const [error, setError] = useState({
    groups: "",
    events: "",
    posts: "",
    supporters: "",
    chatRooms: "",
    comments: "",
    action: "",
  });

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      switch (activeTab) {
        case "support-groups":
          await fetchSupportGroups();
          await fetchEvents();
          break;
        case "peer-support":
          await fetchPeerSupporters();
          break;
        case "community-chats":
          await fetchChatRooms();
          break;
        case "share-support":
          await fetchPosts();
          break;
      }
    };

    fetchData();
  }, [activeTab]);

  // Data fetching functions
  const fetchSupportGroups = async () => {
    setIsLoading((prev) => ({ ...prev, groups: true }));
    setError((prev) => ({ ...prev, groups: "" }));

    try {
      // Only apply filters if filterActive is true
      const language = filterActive ? filtersApplied.language : undefined;
      const isOnline =
        filterActive && filtersApplied.type !== "all"
          ? filtersApplied.type === "online"
          : undefined;
      const tag =
        filterActive && filtersApplied.tags.length > 0
          ? filtersApplied.tags[0] // API only supports one tag filter, so we use the first one
          : undefined;

      const data = await communityService.getSupportGroups(
        language,
        isOnline,
        tag,
        searchQuery || undefined
      );
      setSupportGroups(data);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, groups: errorMessage }));
    } finally {
      setIsLoading((prev) => ({ ...prev, groups: false }));
    }
  };

  const fetchEvents = async () => {
    setIsLoading((prev) => ({ ...prev, events: true }));
    setError((prev) => ({ ...prev, events: "" }));

    try {
      const data = await communityService.getEvents(searchQuery || undefined);
      setEvents(data);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, events: errorMessage }));
    } finally {
      setIsLoading((prev) => ({ ...prev, events: false }));
    }
  };

  const fetchPosts = async () => {
    setIsLoading((prev) => ({ ...prev, posts: true }));
    setError((prev) => ({ ...prev, posts: "" }));

    try {
      const data = await communityService.getPosts(searchQuery || undefined);
      setPosts(data);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, posts: errorMessage }));
    } finally {
      setIsLoading((prev) => ({ ...prev, posts: false }));
    }
  };

  const fetchPeerSupporters = async () => {
    setIsLoading((prev) => ({ ...prev, supporters: true }));
    setError((prev) => ({ ...prev, supporters: "" }));

    try {
      const data = await communityService.getPeerSupporters(
        searchQuery || undefined
      );
      setPeerSupporters(data);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, supporters: errorMessage }));
    } finally {
      setIsLoading((prev) => ({ ...prev, supporters: false }));
    }
  };

  const fetchChatRooms = async () => {
    setIsLoading((prev) => ({ ...prev, chatRooms: true }));
    setError((prev) => ({ ...prev, chatRooms: "" }));

    try {
      const data = await communityService.getChatRooms(
        searchQuery || undefined
      );
      setChatRooms(data);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, chatRooms: errorMessage }));
    } finally {
      setIsLoading((prev) => ({ ...prev, chatRooms: false }));
    }
  };

  const fetchComments = async (postId: string) => {
    setIsLoading((prev) => ({ ...prev, comments: true }));
    setError((prev) => ({ ...prev, comments: "" }));

    try {
      const data = await communityService.getPostComments(postId);
      setComments(data);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, comments: errorMessage }));
    } finally {
      setIsLoading((prev) => ({ ...prev, comments: false }));
    }
  };

  // Handler for search
  const handleSearch = () => {
    switch (activeTab) {
      case "support-groups":
        fetchSupportGroups();
        break;
      case "peer-support":
        fetchPeerSupporters();
        break;
      case "community-chats":
        fetchChatRooms();
        break;
      case "share-support":
        fetchPosts();
        break;
    }
  };

  // Handlers for user interactions with API integration
  const handleJoinGroup = (group: SupportGroup) => {
    setSelectedGroup(group);
    setShowJoinModal(true);
  };

  const confirmJoinGroup = async () => {
    if (!selectedGroup) return;

    setIsLoading((prev) => ({ ...prev, action: true }));
    setError((prev) => ({ ...prev, action: "" }));

    try {
      // Call API to join/leave group
      const updatedGroup = await communityService.joinLeaveGroup(
        selectedGroup.id
      );

      // Update local state
      setSupportGroups(
        supportGroups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        )
      );

      // Show success alert
      setAlertMessage(
        updatedGroup.isJoined
          ? `You have joined the "${updatedGroup.name}" group!`
          : `You have left the "${updatedGroup.name}" group`
      );
      setShowAlert(true);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, action: errorMessage }));
      setAlertMessage(`Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }));
      setShowJoinModal(false);
    }
  };

  const handleRsvpEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowRsvpModal(true);
  };

  const confirmRsvpEvent = async () => {
    if (!selectedEvent) return;

    setIsLoading((prev) => ({ ...prev, action: true }));
    setError((prev) => ({ ...prev, action: "" }));

    try {
      // Call API to RSVP
      const updatedEvent = await communityService.rsvpToEvent(selectedEvent.id);

      // Update local state
      setEvents(
        events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );

      setAlertMessage(
        updatedEvent.isRsvp
          ? `You have RSVP'd for "${updatedEvent.title}"!`
          : `You have canceled your RSVP for "${updatedEvent.title}"`
      );
      setShowAlert(true);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, action: errorMessage }));
      setAlertMessage(`Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }));
      setShowRsvpModal(false);
    }
  };

  const handleConnectSupporter = (supporter: PeerSupporter) => {
    setSelectedSupporter(supporter);
    setShowConnectModal(true);
  };

  const confirmConnectSupporter = async () => {
    if (!selectedSupporter) return;

    setIsLoading((prev) => ({ ...prev, action: true }));
    setError((prev) => ({ ...prev, action: "" }));

    try {
      // Call API to connect/disconnect with supporter
      const updatedSupporter =
        await communityService.connectDisconnectSupporter(selectedSupporter.id);

      // Update local state
      setPeerSupporters(
        peerSupporters.map((supporter) =>
          supporter.id === updatedSupporter.id ? updatedSupporter : supporter
        )
      );

      setAlertMessage(
        updatedSupporter.isConnected
          ? `You have connected with ${updatedSupporter.name}!`
          : `You have disconnected from ${updatedSupporter.name}`
      );
      setShowAlert(true);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, action: errorMessage }));
      setAlertMessage(`Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }));
      setShowConnectModal(false);
    }
  };

  const handleJoinChat = (chatRoom: ChatRoom) => {
    setSelectedChat(chatRoom);
    setShowChatModal(true);
  };

  const confirmJoinChat = async () => {
    if (!selectedChat) return;

    setIsLoading((prev) => ({ ...prev, action: true }));
    setError((prev) => ({ ...prev, action: "" }));

    try {
      // Call API to join/leave chat room
      const updatedChatRoom = await communityService.joinLeaveChatRoom(
        selectedChat.id
      );

      // Update local state
      setChatRooms(
        chatRooms.map((room) =>
          room.id === updatedChatRoom.id ? updatedChatRoom : room
        )
      );

      setAlertMessage(
        updatedChatRoom.isJoined
          ? `You have joined the "${updatedChatRoom.name}" chat!`
          : `You have left the "${updatedChatRoom.name}" chat`
      );
      setShowAlert(true);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, action: errorMessage }));
      setAlertMessage(`Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }));
      setShowChatModal(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    setIsLoading((prev) => ({ ...prev, action: true }));
    setError((prev) => ({ ...prev, action: "" }));

    try {
      const postTitle = newPost.split("\n")[0] || "My thoughts";
      const postContent = newPost;

      // Call API to create post
      const createdPost = await communityService.createPost({
        title: postTitle,
        content: postContent,
        author: "You", // In a real app, this would come from the user profile
      });

      // Update local state
      setPosts([createdPost, ...posts]);

      setNewPost("");
      setAlertMessage("Your post has been shared with the community!");
      setShowAlert(true);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, action: errorMessage }));
      setAlertMessage(`Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleLikePost = async (postId: string) => {
    setIsLoading((prev) => ({ ...prev, action: true }));
    setError((prev) => ({ ...prev, action: "" }));

    try {
      // Call API to like/unlike post
      const updatedPost = await communityService.likeUnlikePost(postId);

      // Update local state
      setPosts(
        posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, action: errorMessage }));
      setAlertMessage(`Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleViewComments = (post: Post) => {
    setSelectedPost(post);

    // Fetch comments for this post
    fetchComments(post.id);

    setShowComments(true);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost) return;

    setIsLoading((prev) => ({ ...prev, action: true }));
    setError((prev) => ({ ...prev, action: "" }));

    try {
      // Call API to add comment
      const newComment = await communityService.addComment(selectedPost.id, {
        text: commentText,
        author: "You", // In a real app, this would come from the user profile
      });

      // Update comments list
      setComments([...comments, newComment]);

      // Update post comment count
      setPosts(
        posts.map((post) =>
          post.id === selectedPost.id
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );

      setCommentText("");
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, action: errorMessage }));
      setAlertMessage(`Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setIsLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleLoadMorePosts = async () => {
    setIsLoading((prev) => ({ ...prev, posts: true }));
    setError((prev) => ({ ...prev, posts: "" }));

    try {
      // Call API to get more posts
      const morePosts = await communityService.getPosts(
        searchQuery || undefined,
        10,
        posts.length
      );

      if (morePosts.length > 0) {
        // Update posts list
        setPosts([...posts, ...morePosts]);
        setAlertMessage("More posts loaded!");
      } else {
        setAlertMessage("No more posts to load");
      }

      setShowAlert(true);
    } catch (err) {
      const errorMessage = communityService.handleApiError(err);
      setError((prev) => ({ ...prev, posts: errorMessage }));
      setAlertMessage(`Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setIsLoading((prev) => ({ ...prev, posts: false }));
    }
  };

  const handleSendChatMessage = () => {
    if (!currentMessage.trim() || !selectedChat) return;

    const newMessage = {
      sender: "You",
      text: currentMessage,
      time: "Just now",
    };

    setChatMessages([...chatMessages, newMessage]);
    setCurrentMessage("");

    // Simulate response after 1 second
    setTimeout(() => {
      const responseMessage = {
        sender: "MindfulMember",
        text: "Thanks for sharing! Has anyone else had a similar experience?",
        time: "Just now",
      };

      setChatMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);
  };

  const handleApplyFilters = () => {
    setFilterActive(true);
    fetchSupportGroups(); // Refetch with filters
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFiltersApplied({
      language: "all",
      type: "all",
      tags: [],
    });
    setFilterActive(false);
    fetchSupportGroups(); // Refetch without filters
    setShowFilterModal(false);
  };

  // Helper function for loading indicators
  const renderLoading = (section: string) => (
    <div className="flex justify-center items-center py-8">
      <Loader className="w-8 h-8 text-teal-500 animate-spin" />
      <span className="ml-2 text-teal-600">Loading {section}...</span>
    </div>
  );

  // Close alert after 3 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar positioned at the top */}
      <Navbar />

      {/* Main content container with appropriate spacing */}
      <div className="pt-16 px-4 flex-grow">
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
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                className={`${
                  filterActive
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                onClick={() => setShowFilterModal(true)}
              >
                <Filter size={16} className="mr-2" />
                Filter {filterActive && "(Active)"}
              </button>
              {activeTab === "support-groups" && (
                <button
                  className="bg-teal-500 hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium text-white"
                  onClick={() => {
                    setAlertMessage(
                      "New group creation would be implemented here!"
                    );
                    setShowAlert(true);
                  }}
                >
                  + Join New Group
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Support Groups Tab */}
            {activeTab === "support-groups" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Available Support Groups{" "}
                  {filterActive && (
                    <span className="text-sm font-normal text-gray-500">
                      (Filtered results)
                    </span>
                  )}
                </h3>

                {/* Error Message */}
                {error.groups && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                    <AlertTriangle
                      size={20}
                      className="mr-2 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium">
                        Error loading support groups
                      </p>
                      <p className="text-sm">{error.groups}</p>
                      <p className="text-sm mt-1">
                        Using cached data for demonstration purposes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading.groups ? (
                  renderLoading("support groups")
                ) : supportGroups.length > 0 ? (
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
                          <button
                            className={`${
                              group.isJoined
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                            } text-sm px-3 py-1 rounded-md font-medium`}
                            onClick={() => handleJoinGroup(group)}
                          >
                            {group.isJoined ? "Leave Group" : "Join Group"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Search size={48} className="mx-auto" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700">
                      No groups found
                    </h4>
                    <p className="text-gray-500">
                      Try adjusting your search or filters
                    </p>
                    {filterActive && (
                      <button
                        className="mt-3 text-teal-600 font-medium"
                        onClick={handleResetFilters}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Upcoming Group Sessions
                  </h3>

                  {/* Error Message */}
                  {error.events && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                      <AlertTriangle
                        size={20}
                        className="mr-2 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium">Error loading events</p>
                        <p className="text-sm">{error.events}</p>
                        <p className="text-sm mt-1">
                          Using cached data for demonstration purposes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading.events ? (
                    renderLoading("events")
                  ) : events.length > 0 ? (
                    <div className="space-y-3">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="bg-teal-100 text-teal-800 p-3 rounded-lg mr-4 text-center min-w-16">
                            <div className="text-sm font-bold">
                              {event.date.split(",")[0]}
                            </div>
                            <div className="text-xs">
                              {event.date.split(", ")[1] || "2025"}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              {event.time} • {event.host}
                            </p>
                            <p className="text-sm text-gray-500">
                              {event.location} • {event.attendees} attending
                            </p>
                          </div>
                          <button
                            className={`${
                              event.isRsvp
                                ? "bg-red-50 border border-red-300 text-red-600 hover:bg-red-100"
                                : "bg-white border border-teal-500 text-teal-600 hover:bg-teal-50"
                            } px-3 py-1 rounded-md text-sm`}
                            onClick={() => handleRsvpEvent(event)}
                          >
                            {event.isRsvp ? "Cancel RSVP" : "RSVP"}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <Calendar size={48} className="mx-auto" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-700">
                        No upcoming events found
                      </h4>
                      <p className="text-gray-500">
                        Check back later for new events
                      </p>
                    </div>
                  )}
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
                    Connect one-on-one with trained peer supporters who have
                    lived experience with mental health challenges. All
                    conversations are confidential and focused on personal
                    recovery journeys.
                  </p>
                  <button
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    onClick={() => {
                      setAlertMessage(
                        "Peer support request form would open here!"
                      );
                      setShowAlert(true);
                    }}
                  >
                    Request Peer Support
                  </button>
                </div>

                <h3 className="text-lg font-semibold mb-4">
                  Available Peer Supporters
                </h3>

                {/* Error Message */}
                {error.supporters && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                    <AlertTriangle
                      size={20}
                      className="mr-2 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium">
                        Error loading peer supporters
                      </p>
                      <p className="text-sm">{error.supporters}</p>
                      <p className="text-sm mt-1">
                        Using cached data for demonstration purposes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading.supporters ? (
                  renderLoading("peer supporters")
                ) : peerSupporters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {peerSupporters.map((supporter) => (
                      <div
                        key={supporter.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
                      >
                        <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                          <Users size={24} className="text-gray-500" />
                        </div>
                        <h4 className="font-medium">{supporter.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {supporter.specialties}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {supporter.experience}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {supporter.languages}
                        </p>
                        <button
                          className={`mt-3 ${
                            supporter.isConnected
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                          } w-full py-1 rounded-md text-sm font-medium`}
                          onClick={() => handleConnectSupporter(supporter)}
                        >
                          {supporter.isConnected ? "Message" : "Connect"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Users size={48} className="mx-auto" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700">
                      No peer supporters found
                    </h4>
                    <p className="text-gray-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Become a Peer Supporter
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Use your lived experience to help others on their mental
                    health journey. We provide training and support.
                  </p>
                  <button
                    className="bg-white border border-teal-500 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-md text-sm font-medium"
                    onClick={() => {
                      setAlertMessage(
                        "Peer supporter application form would open here!"
                      );
                      setShowAlert(true);
                    }}
                  >
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

                {/* Error Message */}
                {error.chatRooms && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                    <AlertTriangle
                      size={20}
                      className="mr-2 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium">Error loading chat rooms</p>
                      <p className="text-sm">{error.chatRooms}</p>
                      <p className="text-sm mt-1">
                        Using cached data for demonstration purposes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading.chatRooms ? (
                  renderLoading("chat rooms")
                ) : chatRooms.length > 0 ? (
                  <div className="space-y-3">
                    {chatRooms.map((room) => (
                      <div
                        key={room.id}
                        className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{room.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {room.activeMembers} members active • Moderated by{" "}
                              {room.moderator}
                            </p>
                          </div>
                          <button
                            className={`${
                              room.isJoined
                                ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                                : "bg-teal-500 hover:bg-teal-600 text-white"
                            } px-3 py-1 rounded-md text-sm`}
                            onClick={() => handleJoinChat(room)}
                          >
                            {room.isJoined ? "Open Chat" : "Join Chat"}
                          </button>
                        </div>
                        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 text-sm text-gray-500">
                          <p>Today's topic: {room.topic}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <MessageCircle size={48} className="mx-auto" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700">
                      No chat rooms found
                    </h4>
                    <p className="text-gray-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}

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
                    <li>
                      If someone is in crisis, alert a moderator immediately
                    </li>
                    <li>Focus on support, not medical advice</li>
                  </ul>
                  <button
                    className="mt-3 text-purple-700 text-sm font-medium"
                    onClick={() => {
                      setAlertMessage(
                        "Full community guidelines would open here!"
                      );
                      setShowAlert(true);
                    }}
                  >
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
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
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
                    <button
                      className={`${
                        !newPost.trim() || isLoading.action
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-teal-500 hover:bg-teal-600 text-white"
                      } px-4 py-1 rounded-md text-sm font-medium flex items-center`}
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() || isLoading.action}
                    >
                      {isLoading.action && (
                        <Loader size={16} className="animate-spin mr-2" />
                      )}
                      Share
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">Community Shares</h3>

                {/* Error Message */}
                {error.posts && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                    <AlertTriangle
                      size={20}
                      className="mr-2 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium">Error loading posts</p>
                      <p className="text-sm">{error.posts}</p>
                      <p className="text-sm mt-1">
                        Using cached data for demonstration purposes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading.posts ? (
                  renderLoading("posts")
                ) : posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users size={16} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-sm">
                              {post.author}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {post.timePosted}
                            </p>
                          </div>
                        </div>
                        <h3 className="font-medium mb-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm">{post.content}</p>
                        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                          <button
                            className={`flex items-center ${
                              post.isLiked
                                ? "text-red-500"
                                : "hover:text-teal-600"
                            }`}
                            onClick={() => handleLikePost(post.id)}
                            disabled={isLoading.action}
                          >
                            {isLoading.action ? (
                              <Loader size={16} className="animate-spin mr-1" />
                            ) : (
                              <Heart
                                size={16}
                                className={`mr-1 ${
                                  post.isLiked ? "fill-current" : ""
                                }`}
                              />
                            )}
                            {post.likes} Likes
                          </button>
                          <button
                            className="flex items-center hover:text-teal-600"
                            onClick={() => handleViewComments(post)}
                          >
                            <MessageCircle size={16} className="mr-1" />
                            {post.comments} Comments
                          </button>
                          <button
                            className="flex items-center hover:text-teal-600"
                            onClick={() => {
                              setAlertMessage(
                                "Sharing options would open here!"
                              );
                              setShowAlert(true);
                            }}
                          >
                            <Share2 size={16} className="mr-1" />
                            Share
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Search size={48} className="mx-auto" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700">
                      No posts found
                    </h4>
                    <p className="text-gray-500">
                      Try adjusting your search or create a new post
                    </p>
                  </div>
                )}

                {posts.length > 0 && (
                  <div className="mt-6 text-center">
                    <button
                      className={`text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center mx-auto ${
                        isLoading.posts ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handleLoadMorePosts}
                      disabled={isLoading.posts}
                    >
                      {isLoading.posts ? (
                        <>
                          <Loader size={16} className="animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Load More Posts"
                      )}
                    </button>
                  </div>
                )}
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
                    <button
                      className="text-yellow-700 hover:text-yellow-800 text-sm font-medium"
                      onClick={() => {
                        setActiveTab("support-groups");
                        setAlertMessage("Viewing upcoming events");
                        setShowAlert(true);
                      }}
                    >
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
                    <button
                      className="text-green-700 hover:text-green-800 text-sm font-medium"
                      onClick={() => {
                        setActiveTab("share-support");
                        setAlertMessage("Viewing success stories");
                        setShowAlert(true);
                      }}
                    >
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
                    <button
                      className="text-purple-700 hover:text-purple-800 text-sm font-medium"
                      onClick={() => {
                        setActiveTab("peer-support");
                        setAlertMessage("Viewing volunteer opportunities");
                        setShowAlert(true);
                      }}
                    >
                      Learn More →
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">
                  Wellness Resources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 1,
                      title: "Mental Health First Aid",
                      description:
                        "Learn how to respond when someone is experiencing a mental health challenge",
                    },
                    {
                      id: 2,
                      title: "Meditation Guide",
                      description:
                        "Simple meditation techniques for beginners to reduce stress and anxiety",
                    },
                    {
                      id: 3,
                      title: "Sleep Improvement",
                      description:
                        "Practical strategies to improve your sleep quality and mental health",
                    },
                    {
                      id: 4,
                      title: "Healthy Boundaries",
                      description:
                        "Learn to establish and maintain healthy boundaries in relationships",
                    },
                  ].map((resource) => (
                    <div
                      key={resource.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {resource.description}
                      </p>
                      <button
                        className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
                        onClick={() => {
                          setAlertMessage(
                            `Accessing resource: ${resource.title}`
                          );
                          setShowAlert(true);
                        }}
                      >
                        Access Resource →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Modals */}
      {/* Join Group Modal */}
      {showJoinModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">
                  {selectedGroup.isJoined ? "Leave Group" : "Join Group"}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowJoinModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mb-6">
                {selectedGroup.isJoined
                  ? `Are you sure you want to leave "${selectedGroup.name}"? You can rejoin at any time.`
                  : `You're about to join "${
                      selectedGroup.name
                    }". This group meets ${selectedGroup.meetingSchedule.toLowerCase()}.`}
              </p>

              {!selectedGroup.isJoined && (
                <div className="bg-blue-50 p-3 rounded-md mb-6 text-sm text-blue-700">
                  <div className="flex items-start">
                    <Info size={16} className="mt-0.5 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium">What to expect:</p>
                      <ul className="list-disc ml-5 mt-1 space-y-1">
                        <li>
                          Supportive environment focused on{" "}
                          {selectedGroup.tags.join(", ")}
                        </li>
                        <li>
                          Meetings are{" "}
                          {selectedGroup.isOnline
                            ? "online via video chat"
                            : "in-person"}
                        </li>
                        <li>All members follow our community guidelines</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowJoinModal(false)}
                  disabled={isLoading.action}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-md flex items-center ${
                    selectedGroup.isJoined
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  } ${isLoading.action ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={confirmJoinGroup}
                  disabled={isLoading.action}
                >
                  {isLoading.action && (
                    <Loader size={16} className="animate-spin mr-2" />
                  )}
                  {selectedGroup.isJoined ? "Leave Group" : "Join Group"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {showRsvpModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">
                  {selectedEvent.isRsvp ? "Cancel Attendance" : "RSVP to Event"}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowRsvpModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h4 className="font-medium text-lg">{selectedEvent.title}</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center mb-1">
                    <Calendar size={16} className="mr-2" />
                    {selectedEvent.date} • {selectedEvent.time}
                  </div>
                  <div className="flex items-center mb-1">
                    <User size={16} className="mr-2" />
                    Hosted by: {selectedEvent.host}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    {selectedEvent.attendees}{" "}
                    {selectedEvent.isRsvp
                      ? "others attending"
                      : "currently attending"}
                  </div>
                </div>
              </div>

              <p className="mb-6">
                {selectedEvent.isRsvp
                  ? "Are you sure you want to cancel your RSVP? You can always RSVP again if your plans change."
                  : "Would you like to RSVP to this event? You'll receive reminders and updates when event details change."}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowRsvpModal(false)}
                  disabled={isLoading.action}
                >
                  Go Back
                </button>
                <button
                  className={`px-4 py-2 rounded-md flex items-center ${
                    selectedEvent.isRsvp
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  } ${isLoading.action ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={confirmRsvpEvent}
                  disabled={isLoading.action}
                >
                  {isLoading.action && (
                    <Loader size={16} className="animate-spin mr-2" />
                  )}
                  {selectedEvent.isRsvp ? "Cancel RSVP" : "Confirm RSVP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect with Peer Supporter Modal */}
      {showConnectModal && selectedSupporter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">
                  {selectedSupporter.isConnected
                    ? "Currently Connected"
                    : "Connect with Peer Supporter"}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConnectModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-gray-500" />
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">{selectedSupporter.name}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedSupporter.specialties}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedSupporter.experience}
                  </p>
                </div>
              </div>

              {selectedSupporter.isConnected ? (
                <div className="bg-green-50 p-4 rounded-md mb-6 text-sm">
                  <p className="text-green-700 font-medium">
                    You're already connected with {selectedSupporter.name}.
                    Would you like to send a message or end this connection?
                  </p>
                </div>
              ) : (
                <div>
                  <p className="mb-4">
                    By connecting with {selectedSupporter.name}, you'll be able
                    to message them directly to discuss your mental health
                    journey in a safe, confidential environment.
                  </p>

                  <div className="bg-blue-50 p-3 rounded-md mb-6 text-sm text-blue-700">
                    <div className="flex items-start">
                      <Info size={16} className="mt-0.5 mr-2 text-blue-500" />
                      <div>
                        <p className="font-medium">About Peer Support:</p>
                        <ul className="list-disc ml-5 mt-1 space-y-1">
                          <li>
                            All conversations are private and confidential
                          </li>
                          <li>
                            Peer supporters provide emotional support, not
                            medical advice
                          </li>
                          <li>You can end the connection at any time</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowConnectModal(false)}
                  disabled={isLoading.action}
                >
                  {selectedSupporter.isConnected ? "Close" : "Cancel"}
                </button>
                {selectedSupporter.isConnected ? (
                  <>
                    <button
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      onClick={() => {
                        setShowConnectModal(false);
                        setAlertMessage(
                          `Opening chat with ${selectedSupporter.name}`
                        );
                        setShowAlert(true);
                      }}
                      disabled={isLoading.action}
                    >
                      Message
                    </button>
                    <button
                      className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center ${
                        isLoading.action ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      onClick={confirmConnectSupporter}
                      disabled={isLoading.action}
                    >
                      {isLoading.action && (
                        <Loader size={16} className="animate-spin mr-2" />
                      )}
                      End Connection
                    </button>
                  </>
                ) : (
                  <button
                    className={`px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center ${
                      isLoading.action ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={confirmConnectSupporter}
                    disabled={isLoading.action}
                  >
                    {isLoading.action && (
                      <Loader size={16} className="animate-spin mr-2" />
                    )}
                    Connect Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Chat Modal */}
      {showChatModal && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {selectedChat.isJoined ? (
            // Chat Room Interface
            <div className="bg-white rounded-lg w-full max-w-4xl h-4/5 flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.activeMembers} active • Moderated by{" "}
                    {selectedChat.moderator}
                  </p>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowChatModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-gray-50 p-3 border-b">
                <p className="text-sm font-medium">
                  Today's Topic: {selectedChat.topic}
                </p>
              </div>

              <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "You" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                          msg.sender === "You"
                            ? "bg-teal-100 text-teal-900"
                            : msg.sender === "System"
                            ? "bg-blue-50 text-blue-800 border border-blue-100"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {msg.sender !== "You" && (
                          <p className="font-medium text-xs mb-1">
                            {msg.sender}
                          </p>
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs text-right mt-1 opacity-70">
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Type your message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendChatMessage();
                    }}
                  />
                  <button
                    className={`p-2 rounded-md ${
                      !currentMessage.trim()
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    }`}
                    onClick={handleSendChatMessage}
                    disabled={!currentMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Join Chat Modal
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">Join Chat Room</h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowChatModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-lg">{selectedChat.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedChat.activeMembers} members active • Moderated by{" "}
                    {selectedChat.moderator}
                  </p>
                  <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm">
                    <p className="font-medium">Today's Topic:</p>
                    <p>{selectedChat.topic}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-700">
                  <div className="flex items-start">
                    <Info size={16} className="mt-0.5 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium">Chat Guidelines:</p>
                      <ul className="list-disc ml-5 mt-1 space-y-1">
                        <li>Be respectful and supportive of others</li>
                        <li>Maintain privacy - don't share personal details</li>
                        <li>
                          This is a peer support space, not professional therapy
                        </li>
                        <li>Moderators may reach out privately if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowChatModal(false)}
                    disabled={isLoading.action}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center ${
                      isLoading.action ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={confirmJoinChat}
                    disabled={isLoading.action}
                  >
                    {isLoading.action && (
                      <Loader size={16} className="animate-spin mr-2" />
                    )}
                    Join Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments Modal */}
      {showComments && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">
                Comments on "{selectedPost.title}"
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowComments(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Message */}
            {error.comments && (
              <div className="m-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
                <AlertTriangle
                  size={20}
                  className="mr-2 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="font-medium">Error loading comments</p>
                  <p className="text-sm">{error.comments}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading.comments ? (
              <div className="flex-grow flex justify-center items-center p-4">
                <Loader className="w-8 h-8 text-teal-500 animate-spin" />
                <span className="ml-2 text-teal-600">Loading comments...</span>
              </div>
            ) : (
              <div className="flex-grow p-4 overflow-y-auto">
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users size={14} className="text-gray-500" />
                          </div>
                          <div className="ml-2">
                            <p className="text-sm font-medium">
                              {comment.author}
                            </p>
                            <p className="text-xs text-gray-500">
                              {comment.timePosted}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle
                      size={32}
                      className="mx-auto mb-2 text-gray-400"
                    />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddComment();
                  }}
                  disabled={isLoading.action}
                />
                <button
                  className={`px-3 py-2 rounded-md flex items-center ${
                    !commentText.trim() || isLoading.action
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || isLoading.action}
                >
                  {isLoading.action ? (
                    <Loader size={16} className="animate-spin mr-2" />
                  ) : null}
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Filter Options</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowFilterModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={filtersApplied.language}
                    onChange={(e) =>
                      setFiltersApplied({
                        ...filtersApplied,
                        language: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Languages</option>
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={filtersApplied.type}
                    onChange={(e) =>
                      setFiltersApplied({
                        ...filtersApplied,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Types</option>
                    <option value="online">Online Only</option>
                    <option value="in-person">In-Person Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topics
                  </label>
                  <div className="space-y-2">
                    {[
                      "anxiety",
                      "depression",
                      "stress",
                      "recovery",
                      "self-care",
                      "young-adults",
                    ].map((tag) => (
                      <label key={tag} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                          checked={filtersApplied.tags.includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFiltersApplied({
                                ...filtersApplied,
                                tags: [...filtersApplied.tags, tag],
                              });
                            } else {
                              setFiltersApplied({
                                ...filtersApplied,
                                tags: filtersApplied.tags.filter(
                                  (t) => t !== tag
                                ),
                              });
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          #{tag}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
                <button
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Toast */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-3 flex items-center z-50 border-l-4 border-teal-500 animate-fade-in">
          <div className="mr-3 text-teal-500">
            <Bell size={20} />
          </div>
          <p className="text-gray-700">{alertMessage}</p>
        </div>
      )}
    </div>
  );
};

export default CommunitySupportPages;
