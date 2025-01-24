import { useState } from "react";
import PatientReports from "./reports/patientsReports";
import PharmacyReport from "./reports/pharmacyReport";
import FinancialReports from "./reports/financialReport";
import DoctorsReports from "./reports/doctorReport";
import OperationReports from "./reports/operationReport";

export default function Reports() {
  // State to manage active report type
  const [activeReport, setActiveReport] = useState<string>("");

  // Function to render report content based on the active selection
  const renderReportContent = () => {
    switch (activeReport) {
      case "patients":
        return <PatientReports/>
      case "pharmacy":
        return <PharmacyReport/>
      case "financial":
        return <FinancialReports/>
      case "doctors":
        return <DoctorsReports/>
      case "operations":
        return <OperationReports/>
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
          onClick={() => setActiveReport("financial")}
          className={`px-4 py-2 border rounded ${
            activeReport === "financial" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Financial Reports
        </button>
        <button
          onClick={() => setActiveReport("doctors")}
          className={`px-4 py-2 border rounded ${
            activeReport === "doctors" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Doctor Reports
        </button>
        <button
          onClick={() => setActiveReport("operations")}
          className={`px-4 py-2 border rounded ${
            activeReport === "operations" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Operations Reports
        </button>
      </div>

      {/* Report Content */}
      <div className="border p-4 rounded bg-gray-50">
        {renderReportContent()}
      </div>
    </div>
  );
}
