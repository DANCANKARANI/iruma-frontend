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
import ViewTechnician from "./components/technician/viewTechnician";
import ViewReceptionist from "./components/receptionist/viewReceptionist";

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
        return <AddDoctor />;

      case "view-pharmacist":
        return <ViewPharmacist />;

      case "reports":
        return <Reports/>

      case "settings":
        return <ApplicationSettings />;

      case "change-mode":
        return <Mode />;

      case "add-clinical-officer":
        return <AddDoctor />;
      
      case "view-clinical-officer":
        return <ViewDoctors />;    
        
      case "view-technician":
        return <ViewTechnician />; 
      case "add-technician":
          return <AddDoctor/>; 


      case "view-reception":
          return <ViewReceptionist />; 
      case "add-reception":
          return <AddDoctor/>; 
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onSelect={(view: SetStateAction<string>) => setActiveView(view)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Navigation */}
        <Navbar name={""} />
        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
}
