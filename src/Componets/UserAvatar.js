// src/components/UserAvatar.js
import { FaUserCircle } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Auth/FireBase";

const UserAvatar = ({ size = 8 }) => {
  const [user] = useAuthState(auth);

  // Map size numbers to actual Tailwind classes
  const sizeClasses = {
    4: 'w-4 h-4',
    6: 'w-6 h-6',
    8: 'w-8 h-8',
    10: 'w-10 h-10',
    12: 'w-12 h-12',
  };

  // Default to size 8 if invalid size is provided
  const avatarSize = sizeClasses[size] || sizeClasses[8];

  return (
    <div className={`${avatarSize} rounded-full flex items-center justify-center ${user ? 'bg-blue-500' : 'bg-gray-400'} text-white overflow-hidden`}>
      {user?.photoURL ? (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-lg font-medium flex items-center justify-center w-full h-full">
          {user?.email ? (
            <span className="flex items-center justify-center w-full h-full">
              {user.email.charAt(0).toUpperCase()}
            </span>
          ) : (
            <FaUserCircle className="w-full h-full" />
          )}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;