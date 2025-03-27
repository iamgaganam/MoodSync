// client/src/pages/PatientChat.tsx
import React from "react";
import CommonChat from "../features/chat/CommonChat";

const PatientChat: React.FC = () => {
  // Use the same room ID as the doctor chat for a two‑way session.
  const roomId = "room_doctor_123_patient_456";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Chat</h1>
      <CommonChat roomId={roomId} userType="patient" />
    </div>
  );
};

export default PatientChat;
