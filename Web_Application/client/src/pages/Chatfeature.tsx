// ChatFeatures.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaUserSecret,
  FaRobot,
  FaBrain,
  FaHeadset,
} from "react-icons/fa6";

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
    <div
      className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
        active
          ? "bg-blue-600 text-white shadow-lg transform -translate-y-1"
          : "bg-white hover:bg-blue-50 text-gray-800 border border-gray-200 hover:border-blue-300"
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
    </div>
  );
};

// Common Chat Message type
export interface ChatMessage {
  id: string;
  sender: "user" | "system";
  content: string;
  timestamp: Date;
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

    // Simulate a system response after 1 second
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "system",
        content: `Response from ${headerTitle}. This response can be customized per interface.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <h2 className="text-xl font-semibold">{headerTitle}</h2>
        <div className="ml-auto flex space-x-2">
          <button className="p-2 hover:bg-blue-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-blue-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
              }`}
            >
              <p>{message.content}</p>
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
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
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
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
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

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/", {
        statement: textToSend,
      });
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
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <h2 className="text-xl font-semibold">Chatbot</h2>
        <div className="ml-auto flex space-x-2">
          <button className="p-2 hover:bg-blue-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-blue-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 text-gray-500">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
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
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
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

  useEffect(() => {
    // Using a static room ID for demonstration.
    const roomId = "anonymous_chat_room_1";
    const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`);

    websocket.onopen = () => {
      console.log("Connected to WebSocket");
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "system",
        content: "Connected to the live anonymous chat.",
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
    };

    setWs(websocket);
    return () => {
      websocket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim() || !ws) return;

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
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <h2 className="text-xl font-semibold">Anonymous Chat</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 text-gray-500">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
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
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Chat Support Services
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
        Connect with mental health professionals, get support, or use our
        AI-powered tools for guidance. All conversations are secure and
        confidential.
      </p>

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

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Mental Health Resources
        </h3>
        <p className="text-gray-700 mb-4">
          If you're experiencing a mental health emergency, please contact:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-blue-700">
              Sri Lanka Sumithrayo
            </h4>
            <p className="text-gray-600">Hotline: 011-2696666</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-blue-700">
              National Mental Health Helpline
            </h4>
            <p className="text-gray-600">Hotline: 1926</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFeatures;
