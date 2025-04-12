// src/components/Home.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";
import { FaUserCircle } from "react-icons/fa";
import SideBar from "./SideBar";

const Home = () => {
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSideBarOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      navigate("/user-chat", { state: { initialMessage: message } });
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="upper flex justify-between items-center p-4 bg-white shadow-md">
        <div className="left relative">
          <Hamburger toggled={isSideBarOpen} toggle={toggleSideBar} />
          {isSideBarOpen && (
            <div className="absolute left-0 top-12 z-50">
              <SideBar />
            </div>
          )}
        </div>
        <div className="right">
          <FaUserCircle className="text-2xl" />
        </div>
      </div>

      <div className="main flex flex-col justify-center items-center h-[calc(100vh-64px)]">
        <h2 className="text-2xl mb-8">Hello! How can I help you today?</h2>

        <form onSubmit={handleSendMessage} className="input flex gap-2 w-full max-w-2xl px-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here...."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;