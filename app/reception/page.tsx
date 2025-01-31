"use client";

import { SetStateAction, useState } from "react";

import Sidebar from "./component/sidebar";
import ReceptionDashboard from "./component/dashboard";
import Navbar from "../admin/components/navbar";
import BookAppointment from "./component/bookAppointment";
import ViewAppointments from "./component/viewAppointments";
import RegisterPatient from "./component/registerPatient";
import ViewPatients from "./component/viewPatients";
import Setting from "./component/setting";
import Billing from "./component/billing";



export default function receptionDashboard() {
  // State to track the active view
  const [activeView, setActiveView] = useState("register-patient");

  // Function to render the active content
  const renderContent = () => {
    switch (activeView) {
      case "reception-dashboard":
        return <ReceptionDashboard />;

      case "book-appointment":
        return <BookAppointment />;
        
      case "view-appointments":
        return <ViewAppointments />;

      case "register-patient":
        return <RegisterPatient />;

      case "view-patients":
        return <ViewPatients />
      
      case "settings":
        return <Setting/>
      
      case "billing":
        return <Billing />
  
     {/* 
n
    

      
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
