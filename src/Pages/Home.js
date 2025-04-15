import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";
import { FaUserCircle } from "react-icons/fa";
import SideBar from "./SideBar";
import '../CSS/output.css';
const Home = () => {
   const [message, setMessage] = useState("");
  const navigate = useNavigate();

 

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      navigate("/user-chat", { state: { initialMessage: message } });
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 pt-20 text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6">
          Hello! How can I help you today?
        </h2>

        <form
          onSubmit={handleSendMessage}
          className="flex flex-col sm:flex-row items-center w-full max-w-2xl gap-4 sm:gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-base"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
