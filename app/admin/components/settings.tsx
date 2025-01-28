"use client";
import { useEffect, useState } from "react";

export default function ApplicationSettings() {
  // State for toggles and dropdowns
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("UTC");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("Weekly");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme; // Set the initial theme
  }, []);

  // Update the theme when the user switches modes
  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    document.documentElement.className = selectedTheme; // Dynamically change the class on the <html> tag
    localStorage.setItem("app-theme", selectedTheme); // Persist the theme
  };


   <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Theme Settings</h2>
        <div className="space-y-4">
          {/* Theme Selector */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Theme Mode</label>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </div>
      </div>
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Application Settings</h1>

      {/* General Settings */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          {/* Theme Selector */}
          <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Theme Settings</h2>
        <div className="space-y-4">
          {/* Theme Selector */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Theme Mode</label>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </div>
      </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="English">English</option>
              <option value="Swahili">Swahili</option>
            </select>
          </div>

          {/* Time Zone Selector */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Time Zone</label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="UTC">UTC</option>
              <option value="GMT+3">GMT+3 (Kenya)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
        <div className="space-y-4">
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Two-Factor Authentication (2FA)</label>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          {/* Password Policy */}
          <div>
            <label className="text-sm font-medium">Password Policy</label>
            <p className="text-sm text-gray-600">Minimum password length: 8 characters.</p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Enable Notifications</label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Backup and Maintenance */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Backup and Maintenance</h2>
        <div className="space-y-4">
          {/* Backup Frequency */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Backup Frequency</label>
            <select
              value={backupFrequency}
              onChange={(e) => setBackupFrequency(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* Manual Backup */}
          <button
            onClick={() => alert("Backup initiated!")}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Initiate Backup
          </button>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Maintenance Mode</label>
            <button
              onClick={() => alert("Maintenance mode activated!")}
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
            >
              Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

