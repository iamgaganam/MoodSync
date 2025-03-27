import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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

// Chat Option Card Component
interface ChatOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  active: boolean;
}

const ChatOption: React.FC<ChatOptionProps> = ({
  icon,
  title,
  description,
  onClick,
  active,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
        active
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
          : "bg-white hover:bg-blue-50 text-gray-800 border border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`}
      onClick={onClick}
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
  );
};

// Common Chat Message type
export interface ChatMessage {
  id: string;
  sender: "user" | "system";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

// Base Chat Interface for generic (simulated) chats
interface ChatInterfaceProps {
  headerTitle: string;
  welcomeMessage: string;
}

const BaseChatInterface: React.FC<ChatInterfaceProps> = ({
  headerTitle,
  welcomeMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "system",
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: inputText,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setInputText("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate a system response after 1-2 seconds
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "system",
        content: `Response from ${headerTitle}. This response can be customized per interface.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, Math.random() * 1000 + 1000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 flex items-center">
        <div className="flex items-center">
          {headerTitle === "Talk to a Doctor" && <FaUser className="mr-2" />}
          {headerTitle === "Anonymous Chat" && (
            <FaUserSecret className="mr-2" />
          )}
          {headerTitle === "Chatbot" && <FaRobot className="mr-2" />}
          {headerTitle === "Virtual Therapist" && <FaBrain className="mr-2" />}
          {headerTitle === "Live Support" && <FaHeadset className="mr-2" />}
          <h2 className="text-xl font-semibold">{headerTitle}</h2>
        </div>
        <div className="ml-auto flex space-x-2">
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Minimize"
          >
            <FaMinus className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Close"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-white"
      >
        {messages.map((message) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message.id}
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
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-blue-200" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start mb-4"
            >
              <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <FaPaperclip className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <FaSmile className="h-5 w-5" />
          </button>
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={handleSendMessage}
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Chatbot Chat Interface that calls the /predict endpoint
const ChatbotChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "system",
      content:
        "Hello! I'm your friendly AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: inputText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const textToSend = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/", {
        statement: textToSend,
      });
      setIsLoading(false);
      const sentiment = response.data.sentiment;
      const confidence = response.data.confidence;

      const systemMessage1: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "system",
        content: `Sentiment: ${sentiment}`,
        timestamp: new Date(),
      };
      const systemMessage2: ChatMessage = {
        id: (Date.now() + 2).toString(),
        sender: "system",
        content: `Confidence Scores: ${confidence
          .map((score: number) => score.toFixed(2))
          .join(", ")}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage1, systemMessage2]);
    } catch (error) {
      console.error("Error with API:", error);
      setIsLoading(false);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 3).toString(),
        sender: "system",
        content: "Error: Unable to analyze sentiment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 flex items-center">
        <div className="flex items-center">
          <FaRobot className="mr-2" />
          <h2 className="text-xl font-semibold">Chatbot</h2>
        </div>
        <div className="ml-auto flex space-x-2">
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Minimize"
          >
            <FaMinus className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Close"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-white"
      >
        {messages.map((message) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message.id}
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
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 text-gray-500">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start mb-4"
            >
              <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <FaPaperclip className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <FaSmile className="h-5 w-5" />
          </button>
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// "Talk to a Doctor" chat without backend connection (using BaseChatInterface)
const TalkToDoctorChat: React.FC = () => (
  <BaseChatInterface
    headerTitle="Talk to a Doctor"
    welcomeMessage="Welcome to Talk to a Doctor. How can we help you today?"
  />
);

// "Anonymous Chat" with live WebSocket connection
const AnonymousChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const roomId = "anonymous_chat_room_1";
    const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`);

    websocket.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "system",
        content:
          "Connected to the live anonymous chat. Your identity is completely protected.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, welcomeMessage]);
    };

    websocket.onmessage = (event) => {
      const incomingMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "system",
        content: event.data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, incomingMessage]);
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      const disconnectMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "system",
        content: "Disconnected from chat. Please refresh to reconnect.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, disconnectMessage]);
    };

    setWs(websocket);
    return () => {
      websocket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim() || !ws || !isConnected) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: inputText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    ws.send(inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 flex items-center">
        <div className="flex items-center">
          <FaUserSecret className="mr-2" />
          <h2 className="text-xl font-semibold">Anonymous Chat</h2>
          <span
            className={`ml-3 h-2 w-2 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          <span className="ml-1 text-xs">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="ml-auto flex space-x-2">
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Minimize"
          >
            <FaMinus className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Close"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message.id}
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
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 text-gray-500">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={
              isConnected ? "Type your message..." : "Disconnected..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            disabled={!isConnected}
          />
          <button
            className={`p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isConnected
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleSendMessage}
            disabled={!isConnected}
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const VirtualTherapistChat: React.FC = () => (
  <BaseChatInterface
    headerTitle="Virtual Therapist"
    welcomeMessage="Welcome to your therapy session. How are you feeling today?"
  />
);

const LiveSupportChat: React.FC = () => (
  <BaseChatInterface
    headerTitle="Live Support"
    welcomeMessage="Live Support connected. How can we assist you right away?"
  />
);

// Main Chat Features Component
const ChatFeatures: React.FC = () => {
  const [activeChatType, setActiveChatType] = useState("Talk to a Doctor");
  const [showInfoCard, setShowInfoCard] = useState(true);

  const chatOptions = [
    {
      icon: <FaUser />,
      title: "Talk to a Doctor",
      description:
        "Connect with licensed medical professionals for mental health consultations.",
    },
    {
      icon: <FaUserSecret />,
      title: "Anonymous Chat",
      description:
        "Discuss your concerns privately without revealing your identity.",
    },
    {
      icon: <FaRobot />,
      title: "Chatbot",
      description: "Get instant responses and guidance from our AI assistant.",
    },
    {
      icon: <FaBrain />,
      title: "Virtual Therapist",
      description:
        "Experience therapy sessions with our specialized mental health professionals.",
    },
    {
      icon: <FaHeadset />,
      title: "Live Support",
      description: "24/7 assistance for urgent concerns and immediate help.",
    },
  ];

  const renderChatInterface = () => {
    switch (activeChatType) {
      case "Talk to a Doctor":
        return <TalkToDoctorChat />;
      case "Anonymous Chat":
        return <AnonymousChat />;
      case "Chatbot":
        return <ChatbotChat />;
      case "Virtual Therapist":
        return <VirtualTherapistChat />;
      case "Live Support":
        return <LiveSupportChat />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      {/* Added top padding so the navbar doesn't overlap content */}
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

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            Emergency Mental Health Resources
          </h3>
          <p className="text-gray-700 mb-6">
            If you're experiencing a mental health emergency, please contact one
            of these resources immediately:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-red-600">Sri Lanka Sumithrayo</h4>
              <p className="mt-2 text-gray-700">Hotline: 011-2696666</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-red-600">
                National Mental Health Helpline
              </h4>
              <p className="mt-2 text-gray-700">Hotline: 1926</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatFeatures;
