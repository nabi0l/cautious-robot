import React from "react";
import { useTheme } from "../Context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[#EEEEEE] dark:bg-[#1E2A3A] border border-[#2D4356] dark:border-[#053B50] focus:outline-none"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <span className="text-[#053B50]">🌙</span>
      ) : (
        <span className="text-[#EEEEEE]">☀️</span>
      )}
    </button>
  );
};

export default ThemeToggle;