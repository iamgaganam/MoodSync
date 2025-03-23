// client/src/features/chat/ChatView.tsx
import React from "react";
import {
  XMarkIcon as XIcon,
  ChatBubbleLeftRightIcon as ChatIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Patient, Message, ChatSession } from "../../data/mockData";
import { getSentimentColor } from "../../utils/helpers";

interface ChatViewProps {
  selectedPatient: Patient | null;
  chatSession: ChatSession;
  message: string;
  setMessage: (msg: string) => void;
  handleSendMessage: () => void;
  setCurrentView: (
    view: "dashboard" | "patients" | "chat" | "analytics" | "settings"
  ) => void;
  setSelectedPatient: (patient: Patient | null) => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  selectedPatient,
  chatSession,
  message,
  setMessage,
  handleSendMessage,
  setCurrentView,
  setSelectedPatient,
}) => {
  if (!selectedPatient) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <ChatIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No chat selected
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a patient from the list to start a conversation
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setCurrentView("patients")}
            >
              View Patients
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          {selectedPatient.profilePic ? (
            <img
              src={selectedPatient.profilePic}
              alt={selectedPatient.name}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
              <span>{selectedPatient.name.charAt(0)}</span>
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium">{selectedPatient.name}</p>
            <div className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full ${getSentimentColor(
                  selectedPatient.sentimentScore
                )} mr-1`}
              ></div>
              <p className="text-xs text-gray-500">
                Sentiment: {selectedPatient.sentimentScore.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView("analytics")}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChartBarIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setSelectedPatient(null);
              setCurrentView("patients");
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {chatSession.messages.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No previous messages. Start the conversation.
          </div>
        ) : (
          chatSession.messages.map((msg: Message) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "doctor" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg ${
                  msg.sender === "doctor"
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
          ))
        )}
      </div>
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
            Send
          </button>
        </div>
        <div className="mt-2 flex space-x-2">
          <button className="text-xs text-blue-600 hover:text-blue-800">
            Send coping strategy
          </button>
          <button className="text-xs text-blue-600 hover:text-blue-800">
            Send motivational quote
          </button>
          <button className="text-xs text-blue-600 hover:text-blue-800">
            Assign exercise
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
