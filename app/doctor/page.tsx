"use client";

import { useEffect, useState } from "react";
import {
  FaUserMd,
  FaUsers,
  FaClipboardList,
  FaComments,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaFlask,
  FaFileMedical,
  FaStickyNote
} from "react-icons/fa";
import { Patients } from "./components/patientManagement";
import { Prescriptions } from "./components/prescription";
import { Reports } from "./components/reports";
import Navbar from "../admin/components/navbar";
import Cookies from "js-cookie";
import Messages from "./components/chat";
import RequestLabTest from "./components/requestTest";
import ReferPatient from "../reception/component/referPatient";
import ViewLabTests from "./components/viewLabTests";
import AddNotes from "./components/notes";

// Components for each section
const Dashboard = () => <div>🏥 Welcome to the Clinical Officer&apos;s Dashboard</div>;
const Billing = () => <div>💰 Billing and Payments</div>;

export default function DoctorDashboard() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [doctorName, setDoctorName] = useState("");

  // Fetch doctor's full name
  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const token = Cookies.get("Authorization");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // First try to get name from JWT token
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          if (decodedToken.full_name) {
            setDoctorName(decodedToken.full_name);
            return;
          }
        } catch (e) {
          console.log("Name not in JWT, fetching from API",e);
        }

        // If not in JWT, fetch from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/doctor/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch doctor details");
        }

        const data = await response.json();
        if (data.full_name) {
          setDoctorName(data.full_name);
        } else {
          throw new Error("Full name not found in response");
        }
      } catch (error) {
        console.error("Error fetching doctor name:", error);
        setDoctorName("Doctor"); // Default fallback
      }
    };

    fetchDoctorName();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Navbar with doctor's full name */}
        <Navbar name={doctorName} />

        {/* Page Content */}
        <div className="p-6">
          {selectedPage === "Dashboard" && <Dashboard />}
          {selectedPage === "Patients" && <Patients />}
          {selectedPage === "Request Lab Test" && <RequestLabTest />}
          {selectedPage === "View Lab Tests" && <ViewLabTests />}
          {selectedPage === "Prescriptions" && <Prescriptions />}
          {selectedPage === "Refer Patient" && <ReferPatient />}
          {selectedPage === "Billing" && <Billing />}
          {selectedPage === "Messages" && <Messages />}
          {selectedPage === "Reports" && <Reports />}
          {selectedPage === "Add Notes" && <AddNotes />}
        </div>
      </div>
    </div>
  );
}

// Sidebar Component remains the same
interface SidebarProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}

const Sidebar = ({ selectedPage, setSelectedPage }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FaUserMd /> },
    { name: "Patients", icon: <FaUsers /> },
    { name: "Add Notes", icon: <FaStickyNote /> },
    { name: "Request Lab Test", icon: <FaFlask /> },
    { name: "View Lab Tests", icon: <FaFileMedical /> },
    { name: "Prescriptions", icon: <FaClipboardList /> },
    { name: "Messages", icon: <FaComments /> },
    { name: "Refer Patient", icon: <FaComments /> },
    { name: "Reports", icon: <FaChartBar /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-customBg text-white flex flex-col h-screen transition-all duration-300 sticky top-0 z-50 overflow-y-auto`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <h2 className={`${isOpen ? "block" : "hidden"} text-xl font-bold`}>Clinical Officer Panel</h2>
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