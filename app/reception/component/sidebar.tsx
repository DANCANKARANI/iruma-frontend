"use client";

import { useState } from "react";
import {
  FaTachometerAlt,
  FaUserAlt,
  FaFileInvoiceDollar, // Billing Icon
  FaChevronDown,
  FaPlus,
  FaEye,
  FaExchangeAlt, // Refer Patient Icon
  FaSignOutAlt, // Log Out Icon
  FaCalendarCheck, // Booked Patients Icon
} from "react-icons/fa";

export default function Sidebar({ onSelect }: { onSelect: (view: string) => void }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPatientMenuOpen, setPatientMenuOpen] = useState(false);

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
            {isPatientMenuOpen && (
              <div className="pl-8 mt-1 space-y-1">
                <button
                  onClick={() => onSelect("view-patients")}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
                >
                  <FaEye className="mr-3" />
                  {isSidebarOpen && <span>View Patients</span>}
                </button>
                <button
                  onClick={() => onSelect("register-patient")}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
                >
                  <FaPlus className="mr-3" />
                  {isSidebarOpen && <span>Register Patient</span>}
                </button>
                {/* Refer Patient Button */}
                <button
                  onClick={() => onSelect("refer-patient")}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
                >
                  <FaExchangeAlt className="mr-3" />
                  {isSidebarOpen && <span>Refer Patient</span>}
                </button>
              </div>
            )}
          </div>

          {/* Booked Patients Button */}
          <button
            onClick={() => onSelect("clinicians")}
            className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <FaCalendarCheck className="mr-4" />
            {isSidebarOpen && <span>Clinicians</span>}
          </button>

          {/* Billing Button */}
          <button
            onClick={() => onSelect("billing")}
            className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-blue-800 rounded border border-gray-600"
          >
            <FaFileInvoiceDollar className="mr-4" />
            {isSidebarOpen && <span>Billing</span>}
          </button>
        </nav>

        {/* Footer Section */}
        <div className="px-4 py-2 border-t border-gray-700">
          {/* Log Out Button */}
          <button
            onClick={() => onSelect("logout")}
            className="flex items-center justify-start w-full px-4 py-2 text-sm hover:bg-red-600 rounded border border-gray-600 text-white"
          >
            <FaSignOutAlt className="mr-4" />
            {isSidebarOpen && <span>Log Out</span>}
          </button>

          <div className="text-xs text-center mt-2">
            <p>Powered by Pentabyte © 2025</p>
            <p>v1.12</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
