"use client";

import { SetStateAction, useState } from "react";
import AdminDashboard from "./components/dashboard";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Mode from "./components/mode";
import AddPharmacist from "./components/pharmacist/pharmacist";
import ViewPharmacist from "./components/pharmacist/ViewPharmacist";
import AddDoctor from "./components/doctor/addDoctor";
import ViewDoctors from "./components/doctor/viewDoctor";
import Reports from "./components/reports";
import ApplicationSettings from "./components/settings";

export default function Dashboard() {
  // State to track the active view
  const [activeView, setActiveView] = useState("dashboard");

  // State to store the ID of the selected pharmacist
  const [selectedPharmacistId, setSelectedPharmacistId] = useState<number | null>(null);

  // Function to render the active content
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <AdminDashboard />;

      case "add-pharmacist":
        return <AddPharmacist />;

      case "view-pharmacist":
        return <ViewPharmacist />;

      case "reports":
        return <Reports/>

      case "settings":
        return <ApplicationSettings />;

      case "change-mode":
        return <Mode />;

      case "add-doctor":
        return <AddDoctor />;
      
      case "view-doctor":
        return <ViewDoctors />;    
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
