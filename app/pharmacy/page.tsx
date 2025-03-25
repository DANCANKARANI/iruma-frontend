"use client";

import { useState, useEffect } from "react";
import {
  FaPills,
  FaClipboardList,
  FaChartBar,
  FaComments,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import Inventory from "./components/inventory";
import Prescriptions from "./components/prescriptions";
import Reports from "./components/reports";
import Messages from "./components/chat";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Navbar from "../admin/components/navbar";

// Components for each section
const Dashboard = () => <div>🏥 Welcome to the Pharmacy Dashboard</div>;

export default function PharmacyDashboard() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [pharmacistName, setPharmacistName] = useState("");
  const router = useRouter();

  // Fetch pharmacist's full name
  useEffect(() => {
    const fetchPharmacistName = async () => {
      try {
        const token = Cookies.get("Authorization");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // First try to get name from JWT token
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          if (decodedToken.full_name) {
            setPharmacistName(decodedToken.full_name);
            return;
          }
        } catch (e) {
          console.log("Name not in JWT, fetching from API",e);
        }

        // If not in JWT, fetch from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/doctor`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pharmacist details");
        }

        const data = await response.json();
        if (data.full_name) {
          setPharmacistName(data.full_name);
        } else {
          throw new Error("Full name not found in response");
        }
      } catch (error) {
        console.error("Error fetching pharmacist name:", error);
        setPharmacistName("Pharmacist"); // Default fallback
      }
    };

    fetchPharmacistName();
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear all authentication tokens
    Cookies.remove("Authorization");
    Cookies.remove("token");
    
    // Clear any client-side storage
    localStorage.removeItem("user");
    sessionStorage.removeItem("session");
    
    // Redirect to login page
    router.push("/");
    router.refresh(); // Ensure client cache is cleared
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar 
        selectedPage={selectedPage} 
        setSelectedPage={setSelectedPage}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Navbar with pharmacist's full name */}
        <Navbar name={pharmacistName} />

        <div className="p-6">
          {selectedPage === "Dashboard" && <Dashboard />}
          {selectedPage === "Inventory" && <Inventory />}
          {selectedPage === "Prescriptions" && <Prescriptions />}
          {selectedPage === "Messages" && <Messages />}
          {selectedPage === "Reports" && <Reports />}
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ selectedPage, setSelectedPage, onLogout }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Inventory", icon: <FaPills /> },
    { name: "Prescriptions", icon: <FaClipboardList /> },
    { name: "Messages", icon: <FaComments /> },
    { name: "Reports", icon: <FaChartBar /> },
  ];

  return (
    <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-customBg text-white flex flex-col transition-all duration-300 sticky top-0 z-50 overflow-y-auto`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <h2 className={`${isOpen ? "block" : "hidden"} text-xl font-bold`}>Pharmacy Panel</h2>
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
        <button 
          onClick={onLogout}
          className="flex items-center space-x-4 p-2 hover:bg-blue-700 rounded w-full"
        >
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};