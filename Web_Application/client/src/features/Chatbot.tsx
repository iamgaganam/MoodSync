import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Chatbot.module.css";

interface Message {
  text: string;
  isUser: boolean;
}

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

      setInputText("");
    }
  };

  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles["chat-container"]}>
        {/* Header Section */}
        <div className={styles["chat-header"]}>
          <h1 className={styles["chat-title"]}>Gemini</h1>
          <span className={styles["chat-subtitle"]}>1.5 Flash</span>
        </div>

        {/* Chat Messages */}
        <div className={styles["chat-messages"]}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.isUser ? styles["message-user"] : styles["message-bot"]
              }`}
            >
              <div className={styles["message-bubble"]}>{msg.text}</div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className={styles["input-container"]}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className={styles["input-box"]}
          />
          <button onClick={handleSend} className={styles["send-button"]}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
