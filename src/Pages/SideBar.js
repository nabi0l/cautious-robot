import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaPlus, FaTrash, FaBars, FaTimes } from "react-icons/fa";
import { useTheme } from "../Context/ThemeContext";
import ThemeToggle from "../Componets/ThemeToggle";
import useMediaQuery from "../hooks/useMediaQuery";

const SideBar = () => {
  const { theme } = useTheme();
  const [chatSummaries, setChatSummaries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
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

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
    if (!isMobile) setCollapsed(true);
  };

  const handleNewChat = () => {
    navigate("/user-chat", { state: { messages: [] } });
    if (!isMobile) setCollapsed(true);
  };

  const handleClearChatHistory = () => {
    localStorage.removeItem("chatSummaries");
    setChatSummaries([]);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && !event.target.closest(".sidebar-content") && !event.target.closest(".mobile-toggle")) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  return (
    <>
      {/* Mobile Toggle Button - Simple hamburger icon */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 text-[#1A2A3A] dark:text-[#F2F9FF] focus:outline-none"
        >
          <FaBars className="text-xl" />
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        } bg-[#1A2A3A] dark:bg-[#F2F9FF]`}>
          <div className="flex flex-col h-full p-2 overflow-y-auto">
            {/* Toggle button */}
            <button
              onClick={toggleSidebar}
              className="text-gray-300 dark:text-[#1A2A3A] p-2 rounded-md hover:bg-[#2D4356] dark:hover:bg-blue-100 mb-4 self-start"
            >
              {collapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
            </button>
            
            {/* Home */}
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2D4356] hover:text-white dark:text-[#1A2A3A] dark:hover:bg-blue-100 rounded transition-colors duration-200"
            >
              <FaHome className="text-lg" />
              {!collapsed && <span>Home</span>}
            </button>

            {/* New Chat */}
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2D4356] hover:text-white dark:text-[#1A2A3A] dark:hover:bg-blue-100 rounded transition-colors duration-200"
            >
              <FaPlus className="text-lg" />
              {!collapsed && <span>New Chat</span>}
            </button>

            {/* Chat History - only shows when expanded */}
            {!collapsed && (
              <div className="flex-grow overflow-y-auto mt-2">
                <h2 className="text-lg font-semibold mb-2 px-2 text-white dark:text-[#1A2A3A]">
                  Chat History
                </h2>
                {chatSummaries.length === 0 ? (
                  <p className="px-2 text-gray-400 dark:text-gray-500">
                    No chats yet
                  </p>
                ) : (
                  chatSummaries.map((summary, index) => (
                    <div
                      key={index}
                      onClick={() => handleNavigation("/user-chat", { state: { messages: summary.messages, fromHistory: true } })}
                      className="p-2 hover:bg-[#2D4356] dark:hover:bg-blue-100 cursor-pointer rounded text-sm text-justify truncate transition-colors duration-200"
                      title={summary.title || summary.messages[0]?.text.substring(0, 30)}
                    >
                      <div className="font-medium text-white dark:text-[#1A2A3A]">
                        {summary.title || `Chat ${index + 1}`}
                      </div>
                      <div className="text-xs text-gray-300 dark:text-gray-500 truncate">
                        {summary.messages[summary.messages.length - 1]?.text.substring(0, 50)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="mt-auto space-y-2">
              <button
                onClick={handleClearChatHistory}
                className="flex items-center gap-2 p-2 text-red-300 hover:bg-red-900 hover:text-white dark:text-red-500 dark:hover:bg-red-100 dark:hover:text-red-700 rounded transition-colors duration-200 w-full"
              >
                <FaTrash />
                {!collapsed && <span>Clear Chat</span>}
              </button>
              <button
                onClick={() => handleNavigation("/settings")}
                className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2D4356] hover:text-white dark:text-[#1A2A3A] dark:hover:bg-blue-100 dark:hover:text-[#1A2A3A] rounded transition-colors duration-200 w-full"
              >
                <FaCog />
                {!collapsed && <span>Settings</span>}
              </button>
              <div className="flex justify-center p-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          <div 
            className={`fixed top-0 left-0 z-40 w-64 h-full bg-[#1A2A3A] dark:bg-[#F2F9FF] shadow-lg transition-all duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Close button inside sidebar header */}
            <div className="flex justify-end p-4 border-b border-[#2D4356] dark:border-[#053B50]">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-300 dark:text-[#1A2A3A] p-2 rounded-md hover:bg-[#2D4356] dark:hover:bg-blue-100 transition-colors duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex flex-col h-[calc(100%-64px)] p-2 overflow-y-auto">
              <div className="flex flex-col space-y-2 mb-4 mt-2">
                <button
                  onClick={() => handleNavigation("/")}
                  className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2D4356] hover:text-white dark:text-[#1A2A3A] dark:hover:bg-blue-100 rounded transition-colors duration-200"
                >
                  <FaHome className="text-lg" />
                  <span>Home</span>
                </button>
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2D4356] hover:text-white dark:text-[#1A2A3A] dark:hover:bg-blue-100 rounded transition-colors duration-200"
                >
                  <FaPlus className="text-lg" />
                  <span>New Chat</span>
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2 px-2 text-white dark:text-[#1A2A3A]">
                  Chat History
                </h2>
                {chatSummaries.length === 0 ? (
                  <p className="px-2 text-gray-400 dark:text-gray-500">
                    No chats yet
                  </p>
                ) : (
                  chatSummaries.map((summary, index) => (
                    <div
                      key={index}
                      onClick={() => handleNavigation("/user-chat", { state: { messages: summary.messages, fromHistory: true } })}
                      className="p-2 hover:bg-[#2D4356] dark:hover:bg-blue-100 cursor-pointer rounded text-sm text-justify truncate transition-colors duration-200"
                      title={summary.title || summary.messages[0]?.text.substring(0, 30)}
                    >
                      <div className="font-medium text-white dark:text-[#1A2A3A]">
                        {summary.title || `Chat ${index + 1}`}
                      </div>
                      <div className="text-xs text-gray-300 dark:text-gray-500 truncate">
                        {summary.messages[summary.messages.length - 1]?.text.substring(0, 50)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto space-y-2 p-2">
                <button
                  onClick={handleClearChatHistory}
                  className="flex items-center gap-2 p-2 text-red-300 hover:bg-red-900 hover:text-white dark:text-red-500 dark:hover:bg-red-100 dark:hover:text-red-700 rounded transition-colors duration-200 w-full"
                >
                  <FaTrash />
                  <span>Clear Chat</span>
                </button>
                <button
                  onClick={() => handleNavigation("/settings")}
                  className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2D4356] hover:text-white dark:text-[#1A2A3A] dark:hover:bg-blue-100 dark:hover:text-[#1A2A3A] rounded transition-colors duration-200 w-full"
                >
                  <FaCog />
                  <span>Settings</span>
                </button>
                <div className="flex justify-center p-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
          
          {/* Overlay when sidebar is open */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30" 
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default SideBar;