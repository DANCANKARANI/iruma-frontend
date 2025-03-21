"use client";

import { useState } from "react";

import Sidebar from "./component/sidebar";
import Navbar from "../admin/components/navbar";
import BookAppointment from "./component/bookAppointment";
import ViewAppointments from "./component/viewAppointments";
import RegisterPatient from "./component/registerPatient";
import Setting from "./component/setting";
import Billing from "./component/billing";
import { ViewPatients } from "./component/viewPatients";
import ReferPatient from "./component/referPatient";
import AssignClinic from "./component/assignClinic";

export default function ReceptionDashboard() {
  // State to track the active view
  const [activeView, setActiveView] = useState("reception-dashboard");

  // Function to render the active content
  const renderContent = () => {
    switch (activeView) {
      case "reception-dashboard":
        return (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-3xl font-bold text-gray-700">
              Welcome to the Reception Dashboard!
            </h1>
          </div>
        );

      case "book-appointment":
        return <BookAppointment />;

      case "view-appointments":
        return <ViewAppointments />;

      case "register-patient":
        return <RegisterPatient />;

      case "view-patients":
        return <ViewPatients />;

      case "refer-patient":
        return <ReferPatient />;

      case "clinicians":
        return <AssignClinic />;

      case "settings":
        return <Setting />;

      case "billing":
        return <Billing />;

      default:
        return (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-xl text-red-500">Invalid selection</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onSelect={(view) => setActiveView(view)} />

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
