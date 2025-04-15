import { FaBars, FaUserCircle } from "react-icons/fa";
import SideBar from "../Pages/SideBar";
import { useState } from "react";

const Header = () => {
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isLoggedIn = true; // change based on your auth state

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSideBarOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    // your logout logic here
    console.log("Logging out...");
  };

  const handleLogin = () => {
    // your login logic here
    console.log("Redirecting to login...");
  };

  return (
    <>
      {/* Fixed header */}
      <div className="flex justify-between items-center p-4 shadow-md fixed w-full top-0 z-40 bg-white">
        <FaBars
          onClick={toggleSideBar}
          className="text-3xl cursor-pointer z-50"
        />

        <div className="relative">
          <FaUserCircle
            onClick={toggleUserMenu}
            className="text-3xl text-gray-700 cursor-pointer"
          />

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <SideBar isOpen={isSideBarOpen} />
    </>
  );
};

export default Header;
