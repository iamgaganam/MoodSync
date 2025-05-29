import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios, { AxiosError } from "axios";
import {
  FaUser,
  FaUserSecret,
  FaRobot,
  FaBrain,
  FaHeadset,
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
  FaInfoCircle,
  FaTimes,
  FaMinus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000",
  ENDPOINTS: {
    PREDICT: "/predict/",
    WEBSOCKET: "/ws/",
  },
} as const;

const CHAT_TYPES = {
  DOCTOR: "Talk to a Doctor",
  ANONYMOUS: "Anonymous Chat",
  CHATBOT: "Chatbot",
  THERAPIST: "Virtual Therapist",
  SUPPORT: "Live Support",
} as const;

const EMERGENCY_RESOURCES = [
  {
    name: "Sri Lanka Sumithrayo",
    phone: "011-2696666",
    description: "24/7 emotional support and suicide prevention",
  },
  {
    name: "National Mental Health Helpline",
    phone: "1926",
    description: "Professional mental health crisis support",
  },
] as const;

const WEBSOCKET_ROOM_ID = "anonymous_chat_room_1";
const AUTO_SCROLL_DELAY = 100;
const TYPING_SIMULATION_DELAY = 1500;

// Types
export interface ChatMessage {
  id: string;
  sender: "user" | "system";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  active: boolean;
}

interface ChatInterfaceProps {
  headerTitle: string;
  welcomeMessage: string;
}

interface SentimentResponse {
  sentiment: string;
  confidence: number[];
}

// Utility Functions
const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 1000);
};

const generateMessageId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const createMessage = (
  sender: "user" | "system",
  content: string
): ChatMessage => ({
  id: generateMessageId(),
  sender,
  content: sanitizeInput(content),
  timestamp: new Date(),
});

// Custom Hooks
const useAutoScroll = (dependency: any[]) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, AUTO_SCROLL_DELAY);

    return () => clearTimeout(timer);
  }, dependency);

  return containerRef;
};

const useWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let websocket: WebSocket;

    try {
      websocket = new WebSocket(url);

      websocket.onopen = () => {
        setIsConnected(true);
        setWs(websocket);
      };

      websocket.onclose = () => {
        setIsConnected(false);
        setWs(null);
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }

    return () => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback(
    (message: string) => {
      if (ws && isConnected && message.trim()) {
        ws.send(sanitizeInput(message));
      }
    },
    [ws, isConnected]
  );

  return { ws, isConnected, sendMessage };
};

// Components
const ChatOption: React.FC<ChatOptionProps> = React.memo(
  ({ icon, title, description, onClick, active }) => (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
        active
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
          : "bg-white hover:bg-blue-50 text-gray-800 border border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      aria-label={`Select ${title} chat option`}
    >
      <div className="flex items-center mb-3">
        <div className={`text-2xl ${active ? "text-white" : "text-blue-600"}`}>
          {icon}
        </div>
        <h3 className="ml-3 text-lg font-semibold">{title}</h3>
      </div>
      <p className={`text-sm ${active ? "text-blue-100" : "text-gray-600"}`}>
        {description}
      </p>
    </motion.div>
  )
);

const ChatHeader: React.FC<{
  title: string;
  onMinimize?: () => void;
  onClose?: () => void;
}> = ({ title, onMinimize, onClose }) => {
  const getIcon = () => {
    switch (title) {
      case CHAT_TYPES.DOCTOR:
        return <FaUser className="mr-2" />;
      case CHAT_TYPES.ANONYMOUS:
        return <FaUserSecret className="mr-2" />;
      case CHAT_TYPES.CHATBOT:
        return <FaRobot className="mr-2" />;
      case CHAT_TYPES.THERAPIST:
        return <FaBrain className="mr-2" />;
      case CHAT_TYPES.SUPPORT:
        return <FaHeadset className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 flex items-center">
      <div className="flex items-center">
        {getIcon()}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="ml-auto flex space-x-2">
        {onMinimize && (
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            onClick={onMinimize}
            aria-label="Minimize chat"
          >
            <FaMinus className="h-4 w-4" />
          </button>
        )}
        {onClose && (
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close chat"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: ChatMessage }> = React.memo(
  ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
          message.sender === "user"
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none"
            : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            message.sender === "user" ? "text-blue-200" : "text-gray-500"
          }`}
        >
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
);

const TypingIndicator: React.FC = () => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-tl-none p-3 max-w-[80%]">
        <div className="flex space-x-1">
          {[0, 150, 300].map((delay, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
);

const ChatInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type your message...",
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center">
        <button
          className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          aria-label="Attach file"
        >
          <FaPaperclip className="h-5 w-5" />
        </button>
        <button
          className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          aria-label="Add emoji"
        >
          <FaSmile className="h-5 w-5" />
        </button>
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          maxLength={1000}
        />
        <button
          className={`p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
          }`}
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <FaPaperPlane className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Chat Interfaces
const BaseChatInterface: React.FC<ChatInterfaceProps> = ({
  headerTitle,
  welcomeMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("system", welcomeMessage),
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesContainerRef = useAutoScroll([messages]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const userMessage = createMessage("user", inputText);
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responseMessage = createMessage(
        "system",
        `Thank you for your message. A ${headerTitle.toLowerCase()} representative will respond shortly.`
      );
      setMessages((prev) => [...prev, responseMessage]);
    }, TYPING_SIMULATION_DELAY);
  }, [inputText, headerTitle]);

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <ChatHeader title={headerTitle} />

      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-white"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <ChatInput
        value={inputText}
        onChange={setInputText}
        onSubmit={handleSendMessage}
      />
    </div>
  );
};

const ChatbotChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "system",
      "Hello! I'm your AI assistant. How can I help analyze your mood today?"
    ),
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useAutoScroll([messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return;

    const userMessage = createMessage("user", inputText);
    setMessages((prev) => [...prev, userMessage]);

    const textToSend = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post<SentimentResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PREDICT}`,
        { statement: textToSend },
        { timeout: 10000 }
      );

      const { sentiment, confidence } = response.data;

      const sentimentMessage = createMessage(
        "system",
        `Sentiment Analysis: ${sentiment}`
      );
      const confidenceMessage = createMessage(
        "system",
        `Confidence Scores: ${confidence
          .map((score) => score.toFixed(2))
          .join(", ")}`
      );

      setMessages((prev) => [...prev, sentimentMessage, confidenceMessage]);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);

      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          "Unable to analyze sentiment at the moment"
        : "Connection error. Please try again later.";

      const systemErrorMessage = createMessage(
        "system",
        `Error: ${errorMessage}`
      );
      setMessages((prev) => [...prev, systemErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <ChatHeader title="Chatbot" />

      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-white"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      <ChatInput
        value={inputText}
        onChange={setInputText}
        onSubmit={handleSendMessage}
        disabled={isLoading}
        placeholder="Describe how you're feeling..."
      />
    </div>
  );
};

const AnonymousChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const messagesContainerRef = useAutoScroll([messages]);
  const { ws, isConnected, sendMessage } = useWebSocket(
    `ws://${API_CONFIG.BASE_URL.replace("http://", "")}${
      API_CONFIG.ENDPOINTS.WEBSOCKET
    }${WEBSOCKET_ROOM_ID}`
  );

  useEffect(() => {
    if (isConnected) {
      const welcomeMessage = createMessage(
        "system",
        "Connected to anonymous chat. Your identity is completely protected."
      );
      setMessages((prev) => [...prev, welcomeMessage]);
    } else {
      const disconnectMessage = createMessage(
        "system",
        "Disconnected from chat. Please refresh to reconnect."
      );
      setMessages((prev) => [...prev, disconnectMessage]);
    }
  }, [isConnected]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const incomingMessage = createMessage("system", event.data);
        setMessages((prev) => [...prev, incomingMessage]);
      };
    }
  }, [ws]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() || !isConnected) return;

    const userMessage = createMessage("user", inputText);
    setMessages((prev) => [...prev, userMessage]);

    sendMessage(inputText);
    setInputText("");
  }, [inputText, isConnected, sendMessage]);

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 flex items-center">
        <div className="flex items-center">
          <FaUserSecret className="mr-2" />
          <h2 className="text-xl font-semibold">Anonymous Chat</h2>
          <span
            className={`ml-3 h-2 w-2 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span className="ml-1 text-xs">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-white"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FaUserSecret className="mx-auto mb-2 text-4xl text-blue-400" />
              <p>Your conversation is completely anonymous.</p>
              <p className="text-sm">Start chatting to connect with someone.</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <ChatInput
        value={inputText}
        onChange={setInputText}
        onSubmit={handleSendMessage}
        disabled={!isConnected}
        placeholder={isConnected ? "Type your message..." : "Disconnected..."}
      />
    </div>
  );
};

const EmergencyResourcesCard: React.FC = () => (
  <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 shadow-md">
    <h3 className="text-xl font-semibold text-blue-800 mb-4">
      Emergency Mental Health Resources
    </h3>
    <p className="text-gray-700 mb-6">
      If you're experiencing a mental health emergency, please contact one of
      these resources immediately:
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {EMERGENCY_RESOURCES.map((resource) => (
        <div
          key={resource.phone}
          className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <h4 className="font-bold text-red-600">{resource.name}</h4>
          <p className="mt-2 text-gray-700">Hotline: {resource.phone}</p>
          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
        </div>
      ))}
    </div>
  </div>
);

// Main Component
const ChatFeatures: React.FC = () => {
  const [activeChatType, setActiveChatType] = useState(CHAT_TYPES.DOCTOR);
  const [showInfoCard, setShowInfoCard] = useState(true);

  const chatOptions = useMemo(
    () => [
      {
        icon: <FaUser />,
        title: CHAT_TYPES.DOCTOR,
        description:
          "Connect with licensed medical professionals for mental health consultations.",
      },
      {
        icon: <FaUserSecret />,
        title: CHAT_TYPES.ANONYMOUS,
        description:
          "Discuss your concerns privately without revealing your identity.",
      },
      {
        icon: <FaRobot />,
        title: CHAT_TYPES.CHATBOT,
        description:
          "Get instant responses and guidance from our AI assistant.",
      },
      {
        icon: <FaBrain />,
        title: CHAT_TYPES.THERAPIST,
        description:
          "Experience therapy sessions with our specialized mental health professionals.",
      },
      {
        icon: <FaHeadset />,
        title: CHAT_TYPES.SUPPORT,
        description: "24/7 assistance for urgent concerns and immediate help.",
      },
    ],
    []
  );

  const renderChatInterface = useCallback(() => {
    switch (activeChatType) {
      case CHAT_TYPES.DOCTOR:
        return (
          <BaseChatInterface
            headerTitle={CHAT_TYPES.DOCTOR}
            welcomeMessage="Welcome to Talk to a Doctor. How can we help you today?"
          />
        );
      case CHAT_TYPES.ANONYMOUS:
        return <AnonymousChat />;
      case CHAT_TYPES.CHATBOT:
        return <ChatbotChat />;
      case CHAT_TYPES.THERAPIST:
        return (
          <BaseChatInterface
            headerTitle={CHAT_TYPES.THERAPIST}
            welcomeMessage="Welcome to your therapy session. How are you feeling today?"
          />
        );
      case CHAT_TYPES.SUPPORT:
        return (
          <BaseChatInterface
            headerTitle={CHAT_TYPES.SUPPORT}
            welcomeMessage="Live Support connected. How can we assist you right away?"
          />
        );
      default:
        return null;
    }
  }, [activeChatType]);

  return (
    <>
      <Navbar />
      <div className="pt-20 container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mental Health Support Services
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Connect with mental health professionals, get support, or use our
            AI-powered tools for guidance. All conversations are secure and
            confidential.
          </p>
        </div>

        {showInfoCard && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-lg shadow-md relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowInfoCard(false)}
              aria-label="Close information card"
            >
              <FaTimes />
            </button>
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-500 text-xl mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-blue-800">
                  Welcome to our chat support platform
                </h3>
                <p className="text-blue-700 mt-1">
                  Choose from any of our specialized chat services below to get
                  the support you need. All conversations are encrypted and
                  confidential.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {chatOptions.map((option) => (
            <ChatOption
              key={option.title}
              icon={option.icon}
              title={option.title}
              description={option.description}
              onClick={() => setActiveChatType(option.title)}
              active={activeChatType === option.title}
            />
          ))}
        </div>

        {renderChatInterface()}
        <EmergencyResourcesCard />
      </div>
      <Footer />
    </>
  );
};

export default ChatFeatures;
