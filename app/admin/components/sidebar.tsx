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
  const [isClinicalOfficerMenuOpen, setClinicalOfficerMenuOpen] = useState(false); // Track Clinical Officer dropdown menu state
  const [isPharmacistMenuOpen, setPharmacistMenuOpen] = useState(false); // Track Pharmacist dropdown menu state
  const [isReceptionMenuOpen, setReceptionMenuOpen] = useState(false); // Track Reception dropdown menu state
  const [isLabTechnicianMenuOpen, setLabTechnicianMenuOpen] = useState(false); // Track Lab Technician dropdown menu state

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-customBg text-white flex flex-col h-screen transition-all duration-300 sticky top-0 z-50 overflow-y-auto`}
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

        {/* Clinical Officer Dropdown */}
        <div className="relative">
          <button
            onClick={() => setClinicalOfficerMenuOpen(!isClinicalOfficerMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <div className="flex items-center">
              <FaUserMd className="mr-4" />
              {isSidebarOpen && <span>Clinical Officer</span>}
            </div>
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  isClinicalOfficerMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </button>
          {/* Dropdown Menu */}
          {isClinicalOfficerMenuOpen && (
            <div className="pl-8 mt-1 space-y-1">
              <button
                onClick={() => onSelect("view-clinical-officer")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaEye className="mr-3" />
                {isSidebarOpen && <span>View Clinical Officer</span>}
              </button>
              <button
                onClick={() => onSelect("add-clinical-officer")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaPlus className="mr-3" />
                {isSidebarOpen && <span>Add Clinical Officer</span>}
              </button>
            </div>
          )}
        </div>

        {/* Reception Dropdown */}
        <div className="relative">
          <button
            onClick={() => setReceptionMenuOpen(!isReceptionMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <div className="flex items-center">
              <FaUserMd className="mr-4" />
              {isSidebarOpen && <span>Reception</span>}
            </div>
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  isReceptionMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </button>
          {/* Dropdown Menu */}
          {isReceptionMenuOpen && (
            <div className="pl-8 mt-1 space-y-1">
              <button
                onClick={() => onSelect("view-reception")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaEye className="mr-3" />
                {isSidebarOpen && <span>View Reception</span>}
              </button>
              <button
                onClick={() => onSelect("add-reception")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaPlus className="mr-3" />
                {isSidebarOpen && <span>Add Reception</span>}
              </button>
            </div>
          )}
        </div>

        {/* Lab Technician Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLabTechnicianMenuOpen(!isLabTechnicianMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <div className="flex items-center">
              <FaUserMd className="mr-4" />
              {isSidebarOpen && <span>Lab Technician</span>}
            </div>
            {isSidebarOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  isLabTechnicianMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </button>
          {/* Dropdown Menu */}
          {isLabTechnicianMenuOpen && (
            <div className="pl-8 mt-1 space-y-1">
              <button
                onClick={() => onSelect("view-technician")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaEye className="mr-3" />
                {isSidebarOpen && <span>View Lab Technician</span>}
              </button>
              <button
                onClick={() => onSelect("add-technician")}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
              >
                <FaPlus className="mr-3" />
                {isSidebarOpen && <span>Add Lab Technician</span>}
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
          onClick={() => onSelect("logout")}
          className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
        >
          <FaAdjust className="mr-4" />
          {isSidebarOpen && <span>Logout</span>}
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