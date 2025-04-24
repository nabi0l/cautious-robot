import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCog,
  FaPlus,
  FaTrash,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useTheme } from "../Context/ThemeContext";
import ThemeToggle from "../Componets/ThemeToggle";
import useMediaQuery from "../hooks/useMediaQuery";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../Auth/FireBase";
import UserAvatar from "../Componets/UserAvatar";
import { deleteSingleChat } from "../utilis/chatHistory";

const SideBar = () => {
  const { theme } = useTheme();
  const [chatSummaries, setChatSummaries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const [user, loading, authError] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

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

  // Reset sidebar states on auth changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setCollapsed(true);
    }
  }, [user, isMobile]);

  const handleNavigation = (path, state) => {
    navigate(path, { state });
    if (isMobile) setSidebarOpen(false);
    if (!isMobile) setCollapsed(true);
  };

  const handleNewChat = () => {
    navigate("/user-chat", { state: { newChat: true } });
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

  const handleLogout = async () => {
    try {
      const success = await signOut();
      if (success) {
        if (isMobile) setSidebarOpen(false);
        if (!isMobile) setCollapsed(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarOpen &&
        !event.target.closest(".sidebar-content") &&
        !event.target.closest(".mobile-toggle")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-16 h-screen bg-[#1A2A3A] dark:bg-[#F2F9FF]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 text-[#1A2A3A] dark:text-[#F2F9FF] focus:outline-none mobile-toggle"
        >
          <FaBars className="text-xl" />
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ${
            collapsed ? "w-16" : "w-64"
          } bg-[#1A2A3A] dark:bg-[#F2F9FF] shadow-lg`}
        >
          <div className="flex flex-col h-full p-2 overflow-y-auto sidebar-content">
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
                      className="group relative p-2 hover:bg-[#2D4356] dark:hover:bg-blue-100 cursor-pointer rounded text-sm text-justify truncate transition-colors duration-200"
                    >
                      <div
                        onClick={() =>
                          handleNavigation("/user-chat", {
                            state: {
                              messages: summary.messages,
                              fromHistory: true,
                            },
                          })
                        }
                        className="pr-6"
                      >
                        <div className="font-medium text-white dark:text-[#1A2A3A]">
                          {summary.title || `Chat ${index + 1}`}
                        </div>
                        <div className="text-xs text-gray-300 dark:text-gray-500 truncate">
                          {summary.messages[
                            summary.messages.length - 1
                          ]?.text.substring(0, 50)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSingleChat(summary.messages[0]?.id);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-300 hover:text-red-500 dark:text-red-500 dark:hover:text-red-700 transition-opacity duration-200"
                        title="Delete chat"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
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

              {/* User Section */}
              {!collapsed && (
                <div className="p-2 border-t border-[#2D4356] dark:border-[#053B50]">
                  {user ? (
                    <div className="flex items-center gap-3">
                      <UserAvatar size={8} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white dark:text-[#1A2A3A] truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2 text-gray-300 hover:text-white dark:text-[#1A2A3A] dark:hover:text-[#053B50]"
                        title="Logout"
                      >
                        <FaSignOutAlt />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2D4356] hover:text-white dark:text-[#1A2A3A] dark:hover:bg-blue-100 rounded transition-colors duration-200 w-full"
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          <div
            className={`fixed top-0 left-0 z-40 w-64 h-full bg-[#1A2A3A] dark:bg-[#F2F9FF] shadow-lg transition-all duration-300 sidebar-content ${
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
                      className="group relative p-2 hover:bg-[#2D4356] dark:hover:bg-blue-100 cursor-pointer rounded text-sm text-justify truncate transition-colors duration-200"
                    >
                      <div
                        onClick={() =>
                          handleNavigation("/user-chat", {
                            state: {
                              messages: summary.messages,
                              fromHistory: true,
                            },
                          })
                        }
                        className="p-2 hover:bg-[#2D4356] dark:hover:bg-blue-100 cursor-pointer rounded text-sm text-justify truncate transition-colors duration-200"
                        title={
                          summary.title ||
                          summary.messages[0]?.text.substring(0, 30)
                        }
                      >
                        <div className="font-medium text-white dark:text-[#1A2A3A]">
                          {summary.title || `Chat ${index + 1}`}
                        </div>
                        <div className="text-xs text-gray-300 dark:text-gray-500 truncate">
                          {summary.messages[
                            summary.messages.length - 1
                          ]?.text.substring(0, 50)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSingleChat(summary.messages[0]?.id);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-300 hover:text-red-500 dark:text-red-500 dark:hover:text-red-700 transition-opacity duration-200"
                        title="Delete chat"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
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

                {/* User Section */}
                <div className="p-2 border-t border-[#2D4356] dark:border-[#053B50]">
                  {user ? (
                    <div className="flex items-center gap-3">
                      <UserAvatar size={8} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white dark:text-[#1A2A3A] truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2 text-gray-300 hover:text-white dark:text-[#1A2A3A] dark:hover:text-[#053B50]"
                        title="Logout"
                      >
                        <FaSignOutAlt />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="flex items-center gap-2 p-2 text-gray-300 hover:bg-[#2D4356] hover:text-white dark:text-[#1A2A3A] dark:hover:bg-blue-100 rounded transition-colors duration-200 w-full"
                    >
                      <FaSignInAlt />
                      <span>Login</span>
                    </button>
                  )}
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
