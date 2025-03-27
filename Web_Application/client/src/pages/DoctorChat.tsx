// client/src/pages/DoctorChat.tsx
import React from "react";
import CommonChat from "../features/chat/CommonChat";

const DoctorChat: React.FC = () => {
  // Generate a room ID based on doctor and patient IDs.
  const doctorId = "doctor_123";
  const patientId = "patient_456";
  const roomId = `room_${doctorId}_${patientId}`;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Chat</h1>
      <CommonChat roomId={roomId} userType="doctor" />
    </div>
  );
};

export default DoctorChat;
