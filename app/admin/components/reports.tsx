import { useState } from "react";
import PatientReports from "./reports/patientsReports";
import Reports from "@/app/pharmacy/components/reports";
import ReportsDashboard from "./reports/doctorReport";

export default function AdminReports() {
  // State to manage active report type
  const [activeReport, setActiveReport] = useState<string>("");

  // Function to render report content based on the active selection
  const renderReportContent = () => {
    switch (activeReport) {
      case "patients":
        return <PatientReports/>
      case "pharmacy":
        return <Reports/>
      case "doctors":
        return <ReportsDashboard/>
   
      default:
        return <div>Select a report type to view details.</div>;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reports</h1>
      
      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveReport("patients")}
          className={`px-4 py-2 border rounded ${
            activeReport === "patients" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Patient Reports
        </button>
        <button
          onClick={() => setActiveReport("pharmacy")}
          className={`px-4 py-2 border rounded ${
            activeReport === "pharmacy" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Pharmacy Reports
        </button>
        <button
          onClick={() => setActiveReport("doctors")}
          className={`px-4 py-2 border rounded ${
            activeReport === "financial" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
       
          Doctor Reports
        </button>
        
      </div>

      {/* Report Content */}
      <div className="border p-4 rounded bg-gray-50">
        {renderReportContent()}
      </div>
    </div>
  );
}
