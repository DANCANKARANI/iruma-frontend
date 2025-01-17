"use client";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaCogs,
  FaAdjust,
  FaUserMd,
  FaChevronDown,
  FaPlus,
  FaEye,
} from "react-icons/fa";

export default function Sidebar({ onSelect }: { onSelect: (view: string) => void }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDoctorMenuOpen, setDoctorMenuOpen] = useState(false); // Track Doctor dropdown menu state
  const [isPharmacistMenuOpen, setPharmacistMenuOpen] = useState(false); // Track Pharmacist dropdown menu state

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-customBg text-white flex flex-col h-full transition-all duration-300`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">{isSidebarOpen ? "Iruma Dispensary" : "ID"}</h1>
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
          onClick={() => onSelect("dashboard")}
          className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
        >
          <FaTachometerAlt className="mr-4" />
          {isSidebarOpen && <span>Dashboard</span>}
        </button>

        {/* Pharmacist Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPharmacistMenuOpen(!isPharmacistMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <div className="flex items-center">
              <FaUserMd className="mr-4" />
              {isSidebarOpen && <span>Pharmacist</span>}
            </div>
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  isPharmacistMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </button>
          {/* Dropdown Menu */}
          {isPharmacistMenuOpen && (
            <div className="pl-8 mt-1 space-y-1">
              <button
                onClick={() => onSelect("view-pharmacist")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaEye className="mr-3" />
                {isSidebarOpen && <span>View Pharmacist</span>}
              </button>
              <button
                onClick={() => onSelect("add-pharmacist")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaPlus className="mr-3" />
                {isSidebarOpen && <span>Add Pharmacist</span>}
              </button>
            </div>
          )}
        </div>

        {/* Doctor Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDoctorMenuOpen(!isDoctorMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <div className="flex items-center">
              <FaUserMd className="mr-4" />
              {isSidebarOpen && <span>Doctor</span>}
            </div>
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  isDoctorMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </button>
          {/* Dropdown Menu */}
          {isDoctorMenuOpen && (
            <div className="pl-8 mt-1 space-y-1">
              <button
                onClick={() => onSelect("view-doctor")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaEye className="mr-3" />
                {isSidebarOpen && <span>View Doctor</span>}
              </button>
              <button
                onClick={() => onSelect("add-doctor")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaPlus className="mr-3" />
                {isSidebarOpen && <span>Add Doctor</span>}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => onSelect("reports")}
          className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
        >
          <FaFileAlt className="mr-4" />
          {isSidebarOpen && <span>Reports</span>}
        </button>

        <button
          onClick={() => onSelect("settings")}
          className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
        >
          <FaCogs className="mr-4" />
          {isSidebarOpen && <span>Application Settings</span>}
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
  );
}
