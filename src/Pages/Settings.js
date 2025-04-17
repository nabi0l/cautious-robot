import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import SideBar from "./SideBar";
import { useTheme } from "../Context/ThemeContext";
import { FaBars } from "react-icons/fa";

import '../CSS/output.css';

const Settings = () => {
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("settings"));
    if (storedSettings) {
      setUsername(storedSettings.username || "");
      setEmail(storedSettings.email || "");
      setNotificationsEnabled(storedSettings.notificationsEnabled ?? true);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const newSettings = {
      username,
      email,
      notificationsEnabled,
    };
    localStorage.setItem("settings", JSON.stringify(newSettings));
    alert("Settings saved!");
  };

  const handleReset = () => {
    setUsername("");
    setEmail("");
    setNotificationsEnabled(true);
    alert("Settings reset!");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] dark:bg-[#2D4356] text-gray-900 dark:text-gray-100 flex">

      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="p-4 flex items-center md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md focus:outline-none text-[#053B50] dark:text-white"
          >
            <FaBars className="text-xl" />
          </button>
        </header>

        <div className="pt-8 px-4 sm:px-8 md:px-12 flex-1">
          <form onSubmit={handleSave} className="space-y-6 mx-auto max-w-xl">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#053B50] flex items-center justify-center">
                <FaUserCircle className="text-4xl text-[#EEEEEE]" />
              </div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-[#2D4356] dark:border-[#053B50] rounded-md bg-white dark:bg-[#1E2A3A] text-black dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex items-center space-x-2 dark:text-gray-300">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-4 h-4 text-[#053B50]"
              />
              <label>Enable Notifications</label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="w-full sm:w-1/2 bg-[#053B50] text-white p-3 rounded-md hover:bg-[#042a3a]"
              >
                Save Settings
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-1/2 bg-[#2D4356] dark:bg-[#053B50] text-white p-3 rounded-md hover:bg-[#1E2A3A] dark:hover:bg-[#042a3a]"
              >
                Reset Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
