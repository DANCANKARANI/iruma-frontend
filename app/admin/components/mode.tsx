"use client";
import React, { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");

  // Load theme from local storage on initial render
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.add(storedTheme);
    }
  }, []);

  // Toggle theme and update local storage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Update the <html> element's class
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);

    // Save theme to local storage
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="flex justify-center items-center h-screen">
        <button
          onClick={toggleTheme}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Toggle to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </div>
  );
}
