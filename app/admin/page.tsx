"use client";

import { SetStateAction, useState, useEffect } from "react";
import AdminDashboard from "./components/dashboard";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Mode from "./components/mode";
import ViewPharmacist from "./components/pharmacist/ViewPharmacist";
import AddDoctor from "./components/doctor/addDoctor";
import ViewDoctors from "./components/doctor/viewDoctor";
import ApplicationSettings from "./components/settings";
import ViewTechnician from "./components/technician/viewTechnician";
import ViewReceptionist from "./components/receptionist/viewReceptionist";
import AdminReports from "./components/reports";
import Cookies from "js-cookie";
import Logout from "./components/logout";

export default function Dashboard() {
  // State to track the active view
  const [activeView, setActiveView] = useState("dashboard");
  const [adminName, setAdminName] = useState("");

  // Fetch admin's full name
  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = Cookies.get("Authorization") || Cookies.get("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // First try to get name from JWT token
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          if (decodedToken.full_name) {
            setAdminName(decodedToken.full_name);
            return;
          } else if (decodedToken.name) {
            setAdminName(decodedToken.name);
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
          throw new Error("Failed to fetch admin details");
        }

        const data = await response.json();
        if (data.full_name) {
          setAdminName(data.full_name);
        } else if (data.name) {
          setAdminName(data.name);
        } else {
          throw new Error("Name not found in response");
        }
      } catch (error) {
        console.error("Error fetching admin name:", error);
        setAdminName("Administrator"); // Default fallback
      }
    };

    fetchAdminName();
  }, []);

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
        return <AdminReports/>;

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
      
      case "logout":
          return <Logout/>

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
        {/* Top Navigation with admin's name */}
        <Navbar name={adminName} />
        
        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
}