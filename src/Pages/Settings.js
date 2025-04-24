import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Auth/FireBase";
import { useTheme } from "../Context/ThemeContext";
import { FaBars, FaSave, FaUndo } from "react-icons/fa";
import UserAvatar from "../Componets/UserAvatar";
import SideBar from "./SideBar";
import { toast } from "react-toastify";

const Settings = () => {
  const { theme } = useTheme();
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const storedSettings = JSON.parse(localStorage.getItem("settings")) || {};
    
    // If user is logged in, use their info
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
    } else {
      setUsername(storedSettings.username || "");
      setEmail(storedSettings.email || "");
    }
    
    setNotificationsEnabled(storedSettings.notificationsEnabled ?? true);
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    const newSettings = {
      username,
      email: user?.email || email,
      notificationsEnabled,
    };
    
    localStorage.setItem("settings", JSON.stringify(newSettings));
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
    } else {
      setUsername("");
      setEmail("");
    }
    setNotificationsEnabled(true);
    toast.info("Settings reset to default");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] dark:bg-[#2D4356] text-gray-900 dark:text-gray-100 flex">
      {/* Sidebar */}
      <SideBar isMobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="p-4 flex items-center md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md focus:outline-none text-[#053B50] dark:text-white"
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="ml-4 text-xl font-semibold">Settings</h1>
        </header>

        <div className="pt-8 px-4 sm:px-8 md:px-12 flex-1">
          <form onSubmit={handleSave} className="space-y-6 mx-auto max-w-xl">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#053B50] flex items-center justify-center">
                <UserAvatar size={24} />
              </div>
              {user?.email && (
                <p className="mt-2 text-sm text-[#053B50] dark:text-[#EEEEEE]">
                  {user.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-[#2D4356] dark:border-[#053B50] rounded-md bg-white dark:bg-[#1E2A3A] text-black dark:text-white"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={user?.email || email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 border border-[#2D4356] dark:border-[#053B50] rounded-md bg-white dark:bg-[#1E2A3A] text-black dark:text-white ${
                  user?.email ? "opacity-70 cursor-not-allowed" : ""
                }`}
                placeholder="Enter your email"
                disabled={!!user?.email}
              />
            </div>

            <div className="flex items-center space-x-2 dark:text-gray-300">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-4 h-4 text-[#053B50]"
                id="notifications"
              />
              <label htmlFor="notifications">Enable Notifications</label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full sm:w-1/2 bg-[#053B50] text-white p-3 rounded-md hover:bg-[#042a3a]"
              >
                <FaSave />
                <span>Save Settings</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 w-full sm:w-1/2 bg-[#2D4356] dark:bg-[#053B50] text-white p-3 rounded-md hover:bg-[#1E2A3A] dark:hover:bg-[#042a3a]"
              >
                <FaUndo />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;