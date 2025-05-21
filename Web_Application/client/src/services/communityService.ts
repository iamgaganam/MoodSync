// client/src/services/communityService.ts
import axios from "axios";

// Update this line in communityService.ts
const API_URL = "http://localhost:8000/api"; // This is correct

// Create axios instance
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

// Mock data for fallback if API fails
const mockSupportGroups: SupportGroup[] = [
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
  {
    id: "3",
    name: "සිංහල මානසික සෞඛ්‍ය කණ්ඩායම",
    members: 156,
    meetingSchedule: "Saturdays at 10AM",
    description:
      "A Sinhala-language group focused on mental health awareness and support.",
    tags: ["sinhala", "general", "awareness"],
    language: "Sinhala",
    isOnline: false,
    isJoined: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Young Adults Wellness",
    members: 221,
    meetingSchedule: "Fridays at 8PM",
    description:
      "For young adults (18-30) dealing with mental health challenges in today's world.",
    tags: ["young-adults", "stress", "life-skills"],
    language: "English",
    isOnline: true,
    isJoined: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockEvents: Event[] = [
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
  {
    id: "2",
    title: "Art Therapy Session",
    date: "June 18, 2025",
    time: "4:00 PM - 5:30 PM",
    host: "Colombo Wellness Center",
    location: "Colombo 7, Sri Lanka",
    attendees: 12,
    isRsvp: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Mindful_Journey",
    title: "Finding peace in small moments",
    content:
      "Today I practiced mindfulness for just 5 minutes and it made such a difference... I noticed how much calmer I felt afterward. It's amazing how taking just a small break to breathe and center yourself can change your whole outlook.",
    likes: 24,
    comments: 7,
    isLiked: false,
    timePosted: "2 hours ago",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commentsList: [
      {
        id: "1",
        author: "HealingSteps",
        text: "This is so true! I've been doing the same.",
        timePosted: "1 hour ago",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        author: "PeacefulMind",
        text: "What mindfulness technique do you use?",
        timePosted: "30 minutes ago",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    author: "HealingSteps",
    title: "My recovery milestone",
    content:
      "After 6 months of therapy, I finally feel like I'm making progress with my anxiety... It hasn't been easy, but having this community has helped me stay committed to the process. I can now go to social events without the overwhelming fear I used to experience.",
    likes: 56,
    comments: 12,
    isLiked: false,
    timePosted: "5 hours ago",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commentsList: [
      {
        id: "1",
        author: "RecoveryRoad",
        text: "So proud of you! Keep going!",
        timePosted: "4 hours ago",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        author: "JourneyToWell",
        text: "This gives me so much hope",
        timePosted: "3 hours ago",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        author: "MindfulMatters",
        text: "What type of therapy worked best for you?",
        timePosted: "2 hours ago",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "3",
    author: "GratitudeSeeker",
    title: "Three things I'm grateful for today",
    content:
      "Even on hard days, finding small things to be grateful for helps me stay grounded... Today I'm grateful for: 1) My morning cup of tea, 2) The supportive message from a friend, 3) Finding this community where I can express myself freely.",
    likes: 38,
    comments: 9,
    isLiked: false,
    timePosted: "1 day ago",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commentsList: [
      {
        id: "1",
        author: "ThankfulHeart",
        text: "I love this practice! I'll try it too.",
        timePosted: "20 hours ago",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        author: "MindfulJourney",
        text: "Beautiful way to shift perspective ❤️",
        timePosted: "15 hours ago",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

const mockPeerSupporters: PeerSupporter[] = [
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
  {
    id: "2",
    name: "Priya K.",
    specialties: "PTSD, Stress Management",
    experience: "Supporting others for 3 years",
    languages: "Languages: English, Tamil",
    isConnected: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Malik J.",
    specialties: "Recovery, Addiction",
    experience: "Supporting others for 5 years",
    languages: "Languages: English, Sinhala",
    isConnected: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockChatRooms: ChatRoom[] = [
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
  {
    id: "2",
    name: "Anxiety Support",
    activeMembers: 28,
    moderator: "CalmCollective",
    topic: "Coping with social anxiety",
    isJoined: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Young Adults (18-25)",
    activeMembers: 36,
    moderator: "YouthWellness",
    topic: "Balancing work, study, and mental health",
    isJoined: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// API service functions
export const communityService = {
  // Support Groups
  getSupportGroups: async (
    language?: string,
    isOnline?: boolean,
    tag?: string,
    search?: string
  ): Promise<SupportGroup[]> => {
    try {
      const url = "/community/support-groups";
      const params: Record<string, string | boolean> = {};

      if (language && language !== "all") params.language = language;
      if (isOnline !== undefined) params.is_online = isOnline;
      if (tag && tag !== "all") params.tag = tag;
      if (search) params.search = search;

      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching support groups:", error);
      // Return mock data as fallback
      return mockSupportGroups;
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
      // Return a modified version of the mock data
      const group = mockSupportGroups.find((g) => g.id === groupId);
      if (group) {
        const updatedGroup = {
          ...group,
          isJoined: !group.isJoined,
          members: group.isJoined ? group.members - 1 : group.members + 1,
        };
        // Update mock data for consistency
        const index = mockSupportGroups.findIndex((g) => g.id === groupId);
        if (index !== -1) {
          mockSupportGroups[index] = updatedGroup;
        }
        return updatedGroup;
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
      return mockEvents;
    }
  },

  rsvpToEvent: async (eventId: string): Promise<Event> => {
    try {
      const response = await api.post(`/community/events/${eventId}/rsvp`);
      return response.data;
    } catch (error) {
      console.error("Error RSVP to event:", error);
      const event = mockEvents.find((e) => e.id === eventId);
      if (event) {
        const updatedEvent = {
          ...event,
          isRsvp: !event.isRsvp,
          attendees: event.isRsvp ? event.attendees - 1 : event.attendees + 1,
        };
        const index = mockEvents.findIndex((e) => e.id === eventId);
        if (index !== -1) {
          mockEvents[index] = updatedEvent;
        }
        return updatedEvent;
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
      return mockPosts;
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
      const newPost: Post = {
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
      mockPosts.unshift(newPost);
      return newPost;
    }
  },

  likeUnlikePost: async (postId: string): Promise<Post> => {
    try {
      const response = await api.post(`/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      const post = mockPosts.find((p) => p.id === postId);
      if (post) {
        const updatedPost = {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
        const index = mockPosts.findIndex((p) => p.id === postId);
        if (index !== -1) {
          mockPosts[index] = updatedPost;
        }
        return updatedPost;
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
      const post = mockPosts.find((p) => p.id === postId);
      return post?.commentsList || [];
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
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        author: commentData.author || "You",
        text: commentData.text,
        timePosted: "Just now",
        createdAt: new Date().toISOString(),
      };

      // Update mock posts for consistency
      const post = mockPosts.find((p) => p.id === postId);
      if (post) {
        post.comments += 1;
        if (!post.commentsList) post.commentsList = [];
        post.commentsList.push(newComment);
      }

      return newComment;
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
      return mockPeerSupporters;
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
      const supporter = mockPeerSupporters.find((s) => s.id === supporterId);
      if (supporter) {
        const updatedSupporter = {
          ...supporter,
          isConnected: !supporter.isConnected,
        };
        const index = mockPeerSupporters.findIndex((s) => s.id === supporterId);
        if (index !== -1) {
          mockPeerSupporters[index] = updatedSupporter;
        }
        return updatedSupporter;
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
      return mockChatRooms;
    }
  },

  joinLeaveChatRoom: async (roomId: string): Promise<ChatRoom> => {
    try {
      const response = await api.post(`/community/chat-rooms/${roomId}/join`);
      return response.data;
    } catch (error) {
      console.error("Error joining/leaving chat room:", error);
      const room = mockChatRooms.find((r) => r.id === roomId);
      if (room) {
        const updatedRoom = {
          ...room,
          isJoined: !room.isJoined,
          activeMembers: room.isJoined
            ? room.activeMembers - 1
            : room.activeMembers + 1,
        };
        const index = mockChatRooms.findIndex((r) => r.id === roomId);
        if (index !== -1) {
          mockChatRooms[index] = updatedRoom;
        }
        return updatedRoom;
      }
      throw new Error("Chat room not found");
    }
  },

  // Error handling wrapper
  handleApiError: (error: any): string => {
    if (error.response) {
      // Server responded with a status other than 200 range
      const message = error.response.data?.detail || "An error occurred";
      console.error("API Error:", message);
      return message;
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
      return "Network error. Please check your connection.";
    } else {
      // Something happened in setting up the request
      console.error("Error:", error.message);
      return "An unexpected error occurred.";
    }
  },
};

export default communityService;
