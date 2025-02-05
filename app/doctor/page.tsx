"use client";

import { useState } from "react";
import { FaUserMd, FaUsers, FaCalendarAlt, FaClipboardList, FaFileInvoiceDollar, FaComments, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import Appointments from "./components/appointment";
import { Patients } from "./components/patientManagement";
import { Prescriptions } from "./components/prescription";
import {Reports} from "./components/reports";


// Components for each section (you can create actual pages for these later)
const Dashboard = () => <div>🏥 Welcome to the Doctor's Dashboard</div>;
const Billing = () => <div>💰 Billing and Payments</div>;
const Messages = () => <div>💬 Messages and Chats</div>;

const Settings = () => <div>⚙️ Doctor Settings</div>;

export default function DoctorDashboard() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {selectedPage === "Dashboard" && <Dashboard />}
        {selectedPage === "Patients" && <Patients />}
        {selectedPage === "Appointments" && <Appointments />}
        {selectedPage === "Prescriptions" && <Prescriptions />}
        {selectedPage === "Billing" && <Billing />}
        {selectedPage === "Messages" && <Messages />}
        {selectedPage === "Reports" && <Reports />}
        {selectedPage === "Settings" && <Settings />}
      </div>
    </div>
  );
}

// Sidebar Component
interface SidebarProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}

const Sidebar = ({ selectedPage, setSelectedPage }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FaUserMd /> },
    { name: "Patients", icon: <FaUsers /> },
    { name: "Appointments", icon: <FaCalendarAlt /> },
    { name: "Prescriptions", icon: <FaClipboardList /> },
    { name: "Billing", icon: <FaFileInvoiceDollar /> },
    { name: "Messages", icon: <FaComments /> },
    { name: "Reports", icon: <FaChartBar /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-customBg text-white flex flex-col h-screen transition-all duration-300 sticky top-0 z-50 overflow-y-auto`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <h2 className={`${isOpen ? "block" : "hidden"} text-xl font-bold`}>Doctor Panel</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setSelectedPage(item.name)}
                className={`flex items-center space-x-4 p-2 rounded w-full text-left ${
                  selectedPage === item.name ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-700">
        <button className="flex items-center space-x-4 p-2 hover:bg-blue-700 rounded w-full">
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
