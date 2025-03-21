"use client";

import { SetStateAction, useState } from "react";

import Sidebar from "./component/sidebar";
import Navbar from "../admin/components/navbar";
import BookAppointment from "./component/bookAppointment";
import ViewAppointments from "./component/viewAppointments";
import RegisterPatient from "./component/registerPatient";
import Setting from "./component/setting";
import Billing from "./component/billing";
import {ViewPatients} from "./component/viewPatients";
import ReferPatient from "./component/referPatient";
import AssignClinic from "./component/assignClinic";



export default function ReceptionDashboard() {
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

      case "refer-patient":
        return <ReferPatient />
      
      case "clinicians":
         return <AssignClinic />
      
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
              <Navbar name={""} />
              {/* Dynamic Content */}
              {renderContent()}
       
      </main>
    </div>
  );
}
