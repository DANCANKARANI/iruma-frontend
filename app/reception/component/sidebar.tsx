// Make sure this file is treated as a Client Component
"use client";

import { useState } from "react";
import { FaTachometerAlt, FaUserAlt, FaFileAlt, FaCogs, FaAdjust, FaChevronDown, FaPlus, FaEye } from "react-icons/fa";

export default function Sidebar({ onSelect }: { onSelect: (view: string) => void }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPatientMenuOpen, setPatientMenuOpen] = useState(false); // Track Patient dropdown menu state
  const [isAppointmentMenuOpen, setAppointmentMenuOpen] = useState(false); // Track Appointment dropdown menu state

  return (
    <div className="flex h-screen">
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 text-white flex flex-col transition-all duration-300 sticky top-0 z-50 overflow-y-auto`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">{isSidebarOpen ? "Reception Menu" : "ID"}</h1>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {isSidebarOpen ? "Collapse" : "Expand"}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col px-2 space-y-2">
          <button
            onClick={() => onSelect("reception-dashboard")}
            className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <FaTachometerAlt className="mr-4" />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>

          {/* Patient Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPatientMenuOpen(!isPatientMenuOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
            >
              <div className="flex items-center">
                <FaUserAlt className="mr-4" />
                {isSidebarOpen && <span>Patient</span>}
              </div>
              {isSidebarOpen && (
                <FaChevronDown
                  className={`transition-transform ${isPatientMenuOpen ? "rotate-180" : "rotate-0"}`}
                />
              )}
            </button>
            {/* Dropdown Menu */}
            {isPatientMenuOpen && (
              <div className="pl-8 mt-1 space-y-1">
                <button
                  onClick={() => onSelect("view-patient")}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
                >
                  <FaEye className="mr-3" />
                  {isSidebarOpen && <span>View Patients</span>}
                </button>
                <button
                  onClick={() => onSelect("add-patient")}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
                >
                  <FaPlus className="mr-3" />
                  {isSidebarOpen && <span>Register Patient</span>}
                </button>
              </div>
            )}
          </div>

          {/* Appointment Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAppointmentMenuOpen(!isAppointmentMenuOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
            >
              <div className="flex items-center">
                <FaFileAlt className="mr-4" />
                {isSidebarOpen && <span>Appointments</span>}
              </div>
              {isSidebarOpen && (
                <FaChevronDown
                  className={`transition-transform ${isAppointmentMenuOpen ? "rotate-180" : "rotate-0"}`}
                />
              )}
            </button>
            {/* Dropdown Menu */}
            {isAppointmentMenuOpen && (
              <div className="pl-8 mt-1 space-y-1">
                <button
                  onClick={() => onSelect("view-appointments")}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
                >
                  <FaEye className="mr-3" />
                  {isSidebarOpen && <span>View Appointments</span>}
                </button>
                <button
                  onClick={() => onSelect("book-appointment")}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
                >
                  <FaPlus className="mr-3" />
                  {isSidebarOpen && <span>Book Appointment</span>}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelect("settings")}
            className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <FaCogs className="mr-4" />
            {isSidebarOpen && <span>Settings</span>}
          </button>

          <button
            onClick={() => onSelect("change-mode")}
            className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <FaAdjust className="mr-4" />
            {isSidebarOpen && <span>Change Mode</span>}
          </button>
        </nav>

        {/* Footer Section */}
        <div className="px-4 py-2 text-xs text-center border-t border-gray-700">
          <p>Powered by Pentabyte © 2025</p>
          <p>v1.12</p>
        </div>
      </aside>

      {/* Main Content */}
      
    </div>
  );
}
