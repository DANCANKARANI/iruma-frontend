"use client";

import { useState } from "react";
import { useTheme } from "./components/themeContext";
import AdminDashboard from "./components/dashboard";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Inventory from "./components/inventory";
import AddPharmacist from "./components/pharmacist/pharmacist";
import ViewPharmacist from "./components/pharmacist/ViewPharmacist";
import AddDoctor from "./components/doctor/addDoctor";
import ViewDoctors from "./components/doctor/viewDoctor";

export default function Dashboard() {
  const { theme } = useTheme(); // Get the theme state
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <AdminDashboard />;
      case "add-pharmacist":
        return <AddPharmacist />;
      case "view-pharmacist":
        return <ViewPharmacist />;
      case "reports":
        return <Inventory />;
      case "settings":
        return <Inventory />;
      case "add-doctor":
        return <AddDoctor />;
      case "view-doctor":
        return <ViewDoctors />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar onSelect={(view) => setActiveView(view)} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {/* Navbar */}
        <Navbar />
        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
}
