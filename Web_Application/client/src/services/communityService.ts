import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Type definitions
export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  meetingSchedule: string;
  members: number;
  tags: string[];
  language: string;
  isOnline: boolean;
  isJoined: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  host: string;
  location: string;
  attendees: number;
  isRsvp: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timePosted: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timePosted: string;
  commentsList?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PeerSupporter {
  id: string;
  name: string;
  specialties: string;
  experience: string;
  languages: string;
  isConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  moderator: string;
  topic: string;
  activeMembers: number;
  isJoined: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data for development/fallback purposes (in case of my thing not working, delete the section in final submission)
const getMockSupportGroups = (): SupportGroup[] => [
  {
    id: "1",
    name: "Anxiety Support Circle",
    members: 234,
    meetingSchedule: "Tuesdays at 7PM",
    description:
      "A safe space for people dealing with anxiety to share experiences and coping strategies.",
    tags: ["anxiety", "stress", "coping"],
    language: "English",
    isOnline: true,
    isJoined: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Depression Recovery",
    members: 187,
    meetingSchedule: "Wednesdays at 6PM",
    description:
      "Support for those navigating depression and working toward recovery.",
    tags: ["depression", "recovery", "self-care"],
    language: "English",
    isOnline: true,
    isJoined: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const getMockEvents = (): Event[] => [
  {
    id: "1",
    title: "Mindfulness Workshop",
    date: "June 15, 2025",
    time: "6:00 PM - 7:30 PM",
    host: "Dr. Samantha Perera",
    location: "Online (Zoom)",
    attendees: 18,
    isRsvp: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const getMockPosts = (): Post[] => [
  {
    id: "1",
    author: "Mindful_Journey",
    title: "Finding peace in small moments",
    content:
      "Today I practiced mindfulness for just 5 minutes and it made such a difference...",
    likes: 24,
    comments: 7,
    isLiked: false,
    timePosted: "2 hours ago",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const getMockPeerSupporters = (): PeerSupporter[] => [
  {
    id: "1",
    name: "Amal S.",
    specialties: "Anxiety, Depression",
    experience: "Supporting others for 2 years",
    languages: "Languages: English, Sinhala",
    isConnected: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const getMockChatRooms = (): ChatRoom[] => [
  {
    id: "1",
    name: "Daily Mindfulness",
    activeMembers: 42,
    moderator: "MindfulMasters",
    topic: "Finding calm in busy moments",
    isJoined: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Community service API functions
 */
export const communityService = {
  // Support Groups
  getSupportGroups: async (
    language?: string,
    isOnline?: boolean,
    tag?: string,
    search?: string
  ): Promise<SupportGroup[]> => {
    try {
      const params: Record<string, string | boolean> = {};
      if (language && language !== "all") params.language = language;
      if (isOnline !== undefined) params.is_online = isOnline;
      if (tag && tag !== "all") params.tag = tag;
      if (search) params.search = search;

      const response = await api.get("/community/support-groups", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching support groups:", error);
      return getMockSupportGroups();
    }
  },

  joinLeaveGroup: async (groupId: string): Promise<SupportGroup> => {
    try {
      const response = await api.post(
        `/community/support-groups/${groupId}/join`
      );
      return response.data;
    } catch (error) {
      console.error("Error joining/leaving group:", error);
      // Mock fallback
      const groups = getMockSupportGroups();
      const group = groups.find((g) => g.id === groupId);
      if (group) {
        return { ...group, isJoined: !group.isJoined };
      }
      throw new Error("Group not found");
    }
  },

  // Events
  getEvents: async (search?: string): Promise<Event[]> => {
    try {
      const params = search ? { search } : {};
      const response = await api.get("/community/events", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      return getMockEvents();
    }
  },

  rsvpToEvent: async (eventId: string): Promise<Event> => {
    try {
      const response = await api.post(`/community/events/${eventId}/rsvp`);
      return response.data;
    } catch (error) {
      console.error("Error RSVP to event:", error);
      const events = getMockEvents();
      const event = events.find((e) => e.id === eventId);
      if (event) {
        return { ...event, isRsvp: !event.isRsvp };
      }
      throw new Error("Event not found");
    }
  },

  // Posts & Comments
  getPosts: async (
    search?: string,
    limit: number = 10,
    skip: number = 0
  ): Promise<Post[]> => {
    try {
      const params: Record<string, string | number> = { limit, skip };
      if (search) params.search = search;

      const response = await api.get("/community/posts", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return getMockPosts();
    }
  },

  createPost: async (postData: {
    title: string;
    content: string;
    author?: string;
  }): Promise<Post> => {
    try {
      const response = await api.post("/community/posts", postData);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      return {
        id: `temp-${Date.now()}`,
        author: postData.author || "You",
        title: postData.title,
        content: postData.content,
        likes: 0,
        comments: 0,
        isLiked: false,
        timePosted: "Just now",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  likeUnlikePost: async (postId: string): Promise<Post> => {
    try {
      const response = await api.post(`/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      const posts = getMockPosts();
      const post = posts.find((p) => p.id === postId);
      if (post) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      throw new Error("Post not found");
    }
  },

  getPostComments: async (postId: string): Promise<Comment[]> => {
    try {
      const response = await api.get(`/community/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post comments:", error);
      return [];
    }
  },

  addComment: async (
    postId: string,
    commentData: { text: string; author?: string }
  ): Promise<Comment> => {
    try {
      const response = await api.post(
        `/community/posts/${postId}/comments`,
        commentData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      return {
        id: `temp-${Date.now()}`,
        author: commentData.author || "You",
        text: commentData.text,
        timePosted: "Just now",
        createdAt: new Date().toISOString(),
      };
    }
  },

  // Peer Supporters
  getPeerSupporters: async (search?: string): Promise<PeerSupporter[]> => {
    try {
      const params = search ? { search } : {};
      const response = await api.get("/community/peer-supporters", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching peer supporters:", error);
      return getMockPeerSupporters();
    }
  },

  connectDisconnectSupporter: async (
    supporterId: string
  ): Promise<PeerSupporter> => {
    try {
      const response = await api.post(
        `/community/peer-supporters/${supporterId}/connect`
      );
      return response.data;
    } catch (error) {
      console.error("Error connecting/disconnecting supporter:", error);
      const supporters = getMockPeerSupporters();
      const supporter = supporters.find((s) => s.id === supporterId);
      if (supporter) {
        return { ...supporter, isConnected: !supporter.isConnected };
      }
      throw new Error("Supporter not found");
    }
  },

  // Chat Rooms
  getChatRooms: async (search?: string): Promise<ChatRoom[]> => {
    try {
      const params = search ? { search } : {};
      const response = await api.get("/community/chat-rooms", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      return getMockChatRooms();
    }
  },

  joinLeaveChatRoom: async (roomId: string): Promise<ChatRoom> => {
    try {
      const response = await api.post(`/community/chat-rooms/${roomId}/join`);
      return response.data;
    } catch (error) {
      console.error("Error joining/leaving chat room:", error);
      const rooms = getMockChatRooms();
      const room = rooms.find((r) => r.id === roomId);
      if (room) {
        return { ...room, isJoined: !room.isJoined };
      }
      throw new Error("Chat room not found");
    }
  },

  /**
   * Handles API errors and returns user-friendly error messages
   */
  handleApiError: (error: any): string => {
    if (error.response) {
      return error.response.data?.detail || "An error occurred";
    } else if (error.request) {
      return "Network error. Please check your connection.";
    } else {
      return "An unexpected error occurred.";
    }
  },
};

export default communityService;
