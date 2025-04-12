import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Hamburger from "hamburger-react";
import SideBar from "./SideBar"; // Adjust path if needed

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState("light");
  const [profileImage, setProfileImage] = useState(null);
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("settings"));
    if (storedSettings) {
      setUsername(storedSettings.username || "");
      setEmail(storedSettings.email || "");
      setNotificationsEnabled(storedSettings.notificationsEnabled ?? true);
      setTheme(storedSettings.theme || "light");
      setProfileImage(storedSettings.profileImage || null);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const newSettings = {
      username,
      email,
      notificationsEnabled,
      theme,
      profileImage,
    };
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const handleReset = () => {
    setUsername("");
    setEmail("");
    setNotificationsEnabled(true);
    setTheme("light");
    setProfileImage(null);
    localStorage.removeItem("settings");
  };

  const toggleSideBar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      } flex flex-col`}
    >
      <div className="flex justify-between items-center p-4 bg-white shadow-md fixed w-full top-0 z-40">
        <div className="relative z-50 ">
          <Hamburger toggled={isSideBarOpen} toggle={toggleSideBar} />
          {isSideBarOpen && (
            <div className="absolute left-0 top-12">
              <SideBar />
            </div>
          )}
        </div>
        <FaUserCircle className="text-3xl text-gray-700" />
      </div>

      <div className="pt-24 px-4 sm:px-8 md:px-12">
        <form
          onSubmit={handleSave}
          className="space-y-6 mx-auto max-w-xl px-4 sm:px-8 md:px-12"
        >
          {/* Profile Picture */}
          <div className="text-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 flex items-center justify-center">
                <FaUserCircle className="text-4xl text-white" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-sm"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Enter your email"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="w-4 h-4"
            />
            <label>Enable Notifications</label>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-1/2 bg-red-500 text-white p-3 rounded-md hover:bg-red-600"
            >
              Reset Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
