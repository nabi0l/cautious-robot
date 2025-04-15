import React, { useState, useEffect } from "react";
import { FaCopy, FaShareAlt } from "react-icons/fa"; 
import "../CSS/output.css"; 

const BotChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

 
  const loadChatHistory = () => {
    const storedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setMessages(storedMessages);
  };


  const saveChatHistory = (newMessages) => {
    localStorage.setItem("chatHistory", JSON.stringify(newMessages));
    
    
    const chatSummary = {
      title: `Chat with ${newMessages[newMessages.length - 1].sender}`, 
      lastMessage: newMessages[newMessages.length - 1].text,
      timestamp: new Date().toISOString(), 
    };

    
    const existingSummaries = JSON.parse(localStorage.getItem("chatSummaries")) || [];
    existingSummaries.push(chatSummary);
    localStorage.setItem("chatSummaries", JSON.stringify(existingSummaries));
  };


  const generateContent = async (prompt) => {
    const response = `This is a response to your message: "${prompt}"`; 
    return response;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      const response = await generateContent(input);
      const botMessage = { text: response, sender: "bot" };

      
      const updatedMessages = [...messages, userMessage, botMessage];
      setMessages(updatedMessages);

    
      saveChatHistory(updatedMessages);

      setInput("");
    }
  };

 
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

 
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


  useEffect(() => {
    loadChatHistory();
  }, []);

  return (
    <div className="flex min-h-screen p-4 bg-gray-50 text-black">
      <div className="flex-1">
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
    </div>
  );
};

export default BotChat;