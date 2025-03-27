import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { FaPaperPlane } from "react-icons/fa";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface CommonChatProps {
  roomId: string;
  userType: "doctor" | "patient";
  initialMessages?: Message[];
}

const CommonChat: React.FC<CommonChatProps> = ({
  roomId,
  userType,
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Retrieve token from localStorage or use a default for testing.
    const token =
      localStorage.getItem("token") ||
      (userType === "doctor" ? "doctor" : "patient");
    // Connect to the FastAPI WebSocket endpoint with token.
    const websocket = new WebSocket(
      `ws://127.0.0.1:8000/api/ws/${roomId}?token=${token}`
    );
    setWs(websocket);

    websocket.onopen = () => {
      console.log("Connected to chat room:", roomId);
    };

    websocket.onmessage = (event) => {
      // Parse the incoming JSON message
      const receivedData = JSON.parse(event.data);
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: receivedData.sender,
        content: receivedData.content,
        timestamp: receivedData.timestamp,
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    websocket.onclose = () => {
      console.log("Disconnected from chat room:", roomId);
    };

    return () => {
      websocket.close();
    };
  }, [roomId, userType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (ws && message.trim()) {
      ws.send(message);
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: userType,
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === userType ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md p-3 rounded-lg ${
                msg.sender === userType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-75 text-right">
                {format(new Date(msg.timestamp), "h:mm a")}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-sm"
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonChat;
