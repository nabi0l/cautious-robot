import React, { useState } from "react";
import { FaCopy, FaShareAlt } from "react-icons/fa"; // Import icons
import "../CSS/output.css"; // Ensure your CSS file is correctly linked

const BotChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Simulate AI response (replace with actual logic if needed)
  const generateContent = async (prompt) => {
    const response = `This is a response to your message: "${prompt}"`; // Simulate the AI response
    return response;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]); // Add user message
      const response = await generateContent(input); // Generate bot response
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]); // Add bot message
      setInput("");
    }
  };

  // Function to handle copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  // Function to handle sharing the message
  const handleShare = (text) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Chat Message",
          text: text,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this device");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 text-black">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg mb-2 ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <p>{msg.text}</p>
            {msg.sender === "bot" && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleCopy(msg.text)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer text-black"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleShare(msg.text)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer text-black"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default BotChat;
