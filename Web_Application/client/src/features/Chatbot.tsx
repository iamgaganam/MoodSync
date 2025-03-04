import React, { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi"; // Import send icon
import "tailwindcss/tailwind.css";

type Message = {
  text: string;
  isUser: boolean;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const handleSend = async () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }]);

      try {
        const response = await axios.post("http://127.0.0.1:8000/predict/", {
          statement: inputText,
        });

        const sentiment = response.data.sentiment;
        const confidence = response.data.confidence;

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Sentiment: ${sentiment}`, isUser: false },
          {
            text: `Confidence Scores: ${confidence
              .map((score: number) => score.toFixed(2))
              .join(", ")}`,
            isUser: false,
          },
        ]);
      } catch (error) {
        console.error("Error with the API request:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Error: Unable to analyze sentiment.", isUser: false },
        ]);
      }

      setInputText("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col w-full max-w-3xl h-[90vh] bg-white text-black rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 py-4 px-6 border-b border-gray-300">
          <h1 className="text-xl font-bold">Chat</h1>
          <p className="text-sm text-gray-500">Your mental health assistant</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-md text-sm ${
                  msg.isUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-gray-100 p-4 border-t border-gray-300">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-200 text-black rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="flex items-center px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
