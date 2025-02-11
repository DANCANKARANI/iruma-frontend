import { useTheme } from "./themeContext";
import {
  FaFileAlt,
  FaCogs,
  FaTachometerAlt,
  FaAdjust,
  FaEye,
  FaPlus,
} from "react-icons/fa";
import { useState } from "react";
import ViewPharmacist from "./pharmacist/ViewPharmacist";
import AddPharmacist from "./pharmacist/pharmacist";
import ViewDoctors from "./doctor/viewDoctor";
import AddDoctor from "./doctor/addDoctor";
import Reports from "./reports";

const sections = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FaTachometerAlt,
    description: "Overview of activities",
  },
  {
    id: "view-pharmacist",
    label: "View Pharmacist",
    icon: FaEye,
    description: "View all pharmacists",
  },
  {
    id: "add-pharmacist",
    label: "Add Pharmacist",
    icon: FaPlus,
    description: "Add a new pharmacist",
  },
  {
    id: "view-doctor",
    label: "View Doctor",
    icon: FaEye,
    description: "View all doctors",
  },
  {
    id: "add-doctor",
    label: "Add Doctor",
    icon: FaPlus,
    description: "Add a new doctor",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FaFileAlt,
    description: "View reports and analytics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: FaCogs,
    description: "Adjust application settings",
  },
  {
    id: "change-mode",
    label: "Change Mode",
    icon: FaAdjust,
    description: "Toggle light/dark mode",
  },
];

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <div>Welcome to the Dashboard Overview!</div>;
      case "view-pharmacist":
        return <ViewPharmacist/>
      case "add-pharmacist":
        return <AddPharmacist/>
      case "view-doctor":
        return <ViewDoctors/>
      case "add-doctor":
        return <AddDoctor/>
      case "reports":
        return <Reports/>
      case "settings":
        return <div>Application Settings Section</div>;
      case "change-mode":
        return <div>Change Mode Section</div>;
      default:
        // Render the grid view if no section is active
        return (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)} // Activate section view on click
              className={`p-6 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 ${
                theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              {/* Icon and Title */}
              <div className="flex items-center mb-4">
                <section.icon className="text-2xl mr-4" />
                <h3 className="text-lg font-semibold">{section.label}</h3>
              </div>
              {/* Description */}
              <p className="text-sm">{section.description}</p>
            </div>
          ))}
        </div>

         
        );
    }
  };

  return (
    <div
      className={`p-6 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {activeSection && (
        <div className="mb-4">
          <button
            onClick={() => setActiveSection(null)}
            className="text-blue-600 font-semibold hover:underline"
          >
            Back to Grid
          </button>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
