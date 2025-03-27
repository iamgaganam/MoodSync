// client/src/pages/UserChat.tsx
import React from "react";
import CommonChat from "../features/chat/CommonChat";

const UserChat: React.FC = () => {
  // Use the same room naming strategy.
  const doctorId = "doctor_123";
  const userId = "patient_456";
  const roomId = `room_${doctorId}_${userId}`;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Chat</h1>
      <CommonChat roomId={roomId} userType="patient" />
    </div>
  );
};

export default UserChat;
