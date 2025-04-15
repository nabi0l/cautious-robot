import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChatHistory = () => {
  const { id } = useParams();
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(storedChats[id] || []);
  }, [id]);

  return (
    <div>
      <h2>Chat History</h2>
      <div>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "bot" ? "bot-message" : "user-message"}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
