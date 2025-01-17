"use client";

import { SetStateAction, useState } from "react";
import AdminDashboard from "./components/dashboard";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Inventory from "./components/inventory";
import Mode from "./components/mode";
import AddPharmacist from "./components/pharmacist";
export default function Dashboard() {
  // State to track the active view
  const [activeView, setActiveView] = useState("dashboard");

  // Function to render the active content
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <AdminDashboard />;

      case "add-pharmacist":
        return <AddPharmacist />;

      case "reports":
        return <Inventory />;

      case "settings":
        return <Inventory />;

      case "change-mode":
        return <Mode />;
      // Add more cases for other views
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onSelect={(view: SetStateAction<string>) => setActiveView(view)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Navigation */}
        <Navbar />
        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
}
