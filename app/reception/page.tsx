"use client";

import { useState, useEffect } from "react";
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
import Cookies from "js-cookie";

export default function ReceptionDashboard() {
  // State to track the active view
  const [activeView, setActiveView] = useState("reception-dashboard");
  const [receptionistName, setReceptionistName] = useState("");

  // Fetch receptionist's full name
  useEffect(() => {
    const fetchReceptionistName = async () => {
      try {
        const token = Cookies.get("Authorization");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // First try to get name from JWT token
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          if (decodedToken.full_name) {
            setReceptionistName(decodedToken.full_name);
            return;
          }
        } catch (e) {
          console.log("Name not in JWT, fetching from API");
        }

        // If not in JWT, fetch from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/doctor`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch receptionist details");
        }

        const data = await response.json();
        if (data.full_name) {
          setReceptionistName(data.full_name);
        } else {
          throw new Error("Full name not found in response");
        }
      } catch (error) {
        console.error("Error fetching receptionist name:", error);
        setReceptionistName("Receptionist"); // Default fallback
      }
    };

    fetchReceptionistName();
  }, []);

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
        {/* Top Navigation with receptionist's name */}
        <Navbar name={receptionistName} />

        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
}