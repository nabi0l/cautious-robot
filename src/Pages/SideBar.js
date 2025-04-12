import "../CSS/output.css";
import { Link, useNavigate } from "react-router-dom";
import {FaHome,  FaCog, FaRobot, FaUsers } from "react-icons/fa";

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar bg-white text-gray-800 w-64 rounded-lg shadow-lg p-4">
      <div className="sidebar-header mb-4">
        <h2 className="text-xl font-bold text-gray-800">ChatBot</h2>
      </div>

      <nav className="space-y-2">

      <Link to="/" className='flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg'>
                    <FaHome className='text-xl' />
                    <span>Home</span>
                </Link>

        <Link
          to="/user-chat"
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaUsers className="text-xl text-gray-600" />
          <span>New Chat</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaCog className="text-xl text-gray-600" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default SideBar;
