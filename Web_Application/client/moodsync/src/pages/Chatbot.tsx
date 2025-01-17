import React, { useState } from "react";
import axios from "axios";

interface Message {
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const handleSend = async () => {
    if (inputText.trim()) {
      // Display the user message
      setMessages([...messages, { text: inputText, isUser: true }]);

      try {
        // Send the user's input to the backend for prediction
        const response = await axios.post("http://127.0.0.1:8000/predict/", {
          statement: inputText,
        });

        // Extract sentiment and confidence scores
        const sentiment = response.data.sentiment;
        const confidence = response.data.confidence;

        // Display the response from the backend
        setMessages([
          ...messages,
          { text: inputText, isUser: true },
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
        setMessages([
          ...messages,
          { text: "Error: Unable to analyze sentiment.", isUser: false },
        ]);
      }

      // Clear the input field
      setInputText("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.isUser ? "right" : "left" }}>
            <p
              style={{
                display: "inline-block",
                padding: "10px",
                backgroundColor: msg.isUser ? "#f1f1f1" : "#d9fdd3",
                borderRadius: "10px",
              }}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          style={{ padding: "10px", width: "80%" }}
        />
        <button
          onClick={handleSend}
          style={{ padding: "10px", marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
