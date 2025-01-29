"use client";

import { SetStateAction, useState } from "react";

import Sidebar from "./component/sidebar";
import ReceptionDashboard from "./component/dashboard";
import Navbar from "../admin/components/navbar";



export default function receptionDashboard() {
  // State to track the active view
  const [activeView, setActiveView] = useState("register-patient");

  // Function to render the active content
  const renderContent = () => {
    switch (activeView) {
      case "reception-dashboard":
        return <ReceptionDashboard />;
      
     {/* case "view-patients":
        return <ViewPatients />;

      case "add-appointment":
        return <AddAppointment />;

      case "view-appointments":
        return <ViewAppointments />;

      case "billing":
        return <Billing />;*/}

     
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onSelect={(view: SetStateAction<string>) => setActiveView(view)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Navigation */}
        {/* Top Navigation */}
              <Navbar />
              {/* Dynamic Content */}
              {renderContent()}
       
      </main>
    </div>
  );
}
