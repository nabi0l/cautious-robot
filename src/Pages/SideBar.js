import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaPlus, FaTrash } from "react-icons/fa";
import { useTheme } from "../Context/ThemeContext";
import ThemeToggle from "../Componets/ThemeToggle";

import '../CSS/output.css';

const SideBar = ({ isOpen, onToggle }) => {
  const { theme } = useTheme();
  const [chatSummaries, setChatSummaries] = useState([]);
  const navigate = useNavigate();

  const loadChatSummaries = () => {
    const summaries = JSON.parse(localStorage.getItem("chatSummaries")) || [];
    setChatSummaries(summaries);
  };

  useEffect(() => {
    loadChatSummaries();
    const handleStorageChange = () => loadChatSummaries();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(loadChatSummaries, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChatHistoryClick = (messages) => {
    navigate("/user-chat", { state: { messages, fromHistory: true } });
    onToggle();
  };

  const handleClearChatHistory = () => {
    localStorage.removeItem("chatSummaries");
    setChatSummaries([]);
  };

  const handleNewChat = () => {
    navigate("/user-chat", { state: { messages: [] } });
    onToggle();
  };

  return (
    <aside
      className={`bg-[#EEEEEE] dark:bg-[#1E2A3A]
  transition-all duration-300 ease-in-out
  ${isOpen ? 'w-64' : 'w-16'}
  fixed top-0 left-0 h-full z-40
`}>
      <div className="flex flex-col h-full p-2 border-r border-[#2D4356] dark:border-[#053B50]">
        <div className="flex flex-col space-y-2 mb-4">
          <Link
            to="/"
            onClick={onToggle}
            className="flex items-center gap-2 p-2 hover:bg-[#EEEEEE] dark:hover:bg-[#053B50] rounded transition-colors duration-200"
          >
            <FaHome className="text-lg text-[#053B50] dark:text-white" />
            {isOpen && <span>Home</span>}
          </Link>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 p-2 hover:bg-[#EEEEEE] dark:hover:bg-[#053B50] rounded transition-colors duration-200 text-[#053B50] dark:text-white"
          >
            <FaPlus className="text-lg" />
            {isOpen && <span>New Chat</span>}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <h2
            className={`text-xl font-semibold mb-2 ${!isOpen ? "sr-only" : ""}`}
          >
            Chat History
          </h2>
          {chatSummaries.length === 0 ? (
            <p className={`${!isOpen ? "sr-only" : ""}`}>No chats yet</p>
          ) : (
            chatSummaries.map((summary, index) => (
              <div
                key={index}
                onClick={() => handleChatHistoryClick(summary.messages)}
                className="p-2 hover:bg-[#EFF3EA] dark:hover:bg-[#053B50] cursor-pointer rounded text-sm text-justify truncate transition-colors duration-200"
                title={
                  summary.title || summary.messages[0]?.text.substring(0, 30)
                }
              >
                {isOpen ? (
                  <>
                    <div className="font-medium text-[#053B50] dark:text-white">
                      {summary.title || `Chat ${index + 1}`}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300 truncate">
                      {summary.messages[
                        summary.messages.length - 1
                      ]?.text.substring(0, 50)}
                    </div>
                  </>
                ) : (
                  <span className="text-[#053B50] dark:text-white">💬</span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-auto space-y-2 p-2">
          <button
            onClick={handleClearChatHistory}
            className="flex items-center gap-2 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 rounded transition-colors duration-200 w-full"
          >
            <FaTrash />
            {isOpen && <span>Clear Chat</span>}
          </button>
          <Link
            to="/settings"
            onClick={onToggle}
            className="flex items-center gap-2 p-2 hover:bg-[#EFF3EA] dark:hover:bg-[#053B50] rounded transition-colors duration-200 w-full"
          >
            <FaCog className="text-[#053B50] dark:text-white" />
            {isOpen && <span>Settings</span>}
          </Link>
          <div className="flex justify-center p-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
