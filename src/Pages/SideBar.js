import { Link } from "react-router-dom";
import { FaHome, FaCog, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";

const SideBar = ({ isOpen, onChatHistoryClick, onClearChatHistory }) => {
  const [chatSummaries, setChatSummaries] = useState([]);

  const loadChatSummaries = () => {
    const summaries = JSON.parse(localStorage.getItem("chatSummaries")) || [];
    setChatSummaries(summaries);
  };

  useEffect(() => {
    loadChatSummaries();
  }, []);


  const handleClearChatHistory=()=>{
    onClearChatHistory();
    localStorage.removeItem('chatSummaries');
    setChatSummaries([]);
  }

  const handleChatHistoryClick=(messages)=>{
    onChatHistoryClick(messages);
    
  }

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white text-gray-800 shadow-lg p-4 transform transition-transform duration-700 ease-in-out z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top icons in a row */}
        <div className="flex justify-end gap-4 items-center space-x-2 mb-6">
          <SidebarIcon to="/" icon={<FaHome />} label="Home" />
          <SidebarIcon to="/user-chat" icon={<FaPlus />} label="New Chat" />
        </div>

        <div className="flex-grow mt-4 overflow-y-auto">
          <h3 className="text-xs text-gray-500 text-center mb-2">
            Chat History
          </h3>
          <div className="space-y-2 mt-2 text-sm text-justify max-h-[60vh] overflow-y-auto">
            {chatSummaries.length===0&&(
              <p className="text-gray-400 text-center">No chat history</p>
            )}

            {chatSummaries.map((summary, index) => (
              <div
                key={index}
                className="text-gray-700 cursor-pointer border border-gray-200 rounded p-2 hover:bg-gray-100"
                onClick={()=>handleChatHistoryClick(summary.messages)}
              >
                <strong>{summary.title}</strong>
                <p className="truncate"> {summary.lastMessage}</p>
                <small className="text-gray-400">{new Date(summary.timeStamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
          {chatSummaries.length>0 &&(
            <button onClick={handleClearChatHistory} className="mt-4 w-full bg-gray-500 py-2 rounded transition"> Clear </button>
          )
          }
        </div>

        <div className="mt-auto flex justify-start">
          <SidebarIcon to="/settings" icon={<FaCog />} label="Settings" />
        </div>
      </div>
    </div>
  );
};

const SidebarIcon = ({ to, icon, label }) => {
  return (
    <Link to={to} className="group flex flex-col items-center relative">
      <div className="text-2xl">{icon}</div>
      <span className="absolute top-10 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </span>
    </Link>
  );
};

export default SideBar;
