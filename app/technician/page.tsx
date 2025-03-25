"use client";

import { useEffect, useState } from "react";
import { FaUsers, FaClipboardList, FaSignOutAlt, FaChartBar } from "react-icons/fa";
import Navbar from "../admin/components/navbar";
import Cookies from "js-cookie";
import { Patients } from "../doctor/components/patientManagement";
import LabTestRequests from "./components/labTest";
import TechnicianReports from "./components/technicianReports";

// Components for each section
const Dashboard = () => <div>🔬 Welcome to the Lab Technician&apos;s Dashboard</div>;

export default function LabTechnician() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [labTechName, setLabTechName] = useState("");

  // Fetch lab technician's full name
  useEffect(() => {
    const fetchLabTechName = async () => {
      try {
        const token = Cookies.get("Authorization") || Cookies.get("token"); // Check both possible cookie names
        if (!token) {
          throw new Error("No authentication token found");
        }

        // First try to get name from JWT token
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          if (decodedToken.full_name) {
            setLabTechName(decodedToken.full_name);
            return;
          } else if (decodedToken.name) {
            setLabTechName(decodedToken.name);
            return;
          }
        } catch (e) {
          console.log("Name not in JWT, fetching from API");
        }

        // If not in JWT, fetch from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/doctor`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch lab technician details");
        }

        const data = await response.json();
        if (data.full_name) {
          setLabTechName(data.full_name);
        } else if (data.name) {
          setLabTechName(data.name);
        } else {
          throw new Error("Name not found in response");
        }
      } catch (error) {
        console.error("Error fetching lab technician name:", error);
        setLabTechName("Lab Technician"); // Default fallback
      }
    };

    fetchLabTechName();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Navbar with lab technician's name */}
        <Navbar name={labTechName} />

        {/* Page Content */}
        <div className="p-6">
          {selectedPage === "Dashboard" && <Dashboard />}
          {selectedPage === "Patients" && <Patients />}
          {selectedPage === "LabTestRequests" && <LabTestRequests />}
          {selectedPage === "Reports" && <TechnicianReports />}
        </div>
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
    { name: "Dashboard", icon: <FaUsers /> },
    { name: "Patients", icon: <FaUsers /> },
    { name: "LabTestRequests", icon: <FaClipboardList /> },
    { name: "Reports", icon: <FaChartBar /> },
  ];

  return (
    <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-gray-900 text-white flex flex-col transition-all duration-300 sticky top-0 z-50 overflow-y-auto`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className={`${isOpen ? "block" : "hidden"} text-xl font-bold`}>Lab Technician</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setSelectedPage(item.name)}
                className={`flex items-center space-x-4 p-3 rounded w-full text-left transition-all ${
                  selectedPage === item.name ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
              >
                {item.icon}
                {isOpen && <span className="text-gray-300 hover:text-white">{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded w-full">
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};