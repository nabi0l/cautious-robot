import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BotChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const genAI = new GoogleGenerativeAI("YOUR_API_KEY"); // Replace with your actual API key

  const generateContent = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([prompt]);
    return result.response.text();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      const response = await generateContent(input);
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
      setInput("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default BotChat;