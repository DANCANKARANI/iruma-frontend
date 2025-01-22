

"use client";

import { useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from "chart.js";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

type ReportType = "demographics" | "visitHistory" | "billing"; // Specific report types
export default function PatientReports() {
    const [selectedReport, setSelectedReport] = useState<ReportType>("demographics");
  
    // Sample data for reports
    const reportsData = {
      demographics: [
        { id: 1, name: "John Doe", gender: "Male", age: 30, location: "Nairobi" },
        { id: 2, name: "Jane Smith", gender: "Female", age: 25, location: "Mombasa" },
      ],
      visitHistory: [
        { id: 1, patient: "John Doe", date: "2025-01-15", department: "Pharmacy", reason: "Malaria" },
        { id: 2, patient: "Jane Smith", date: "2025-01-18", department: "Outpatient", reason: "Flu" },
      ],
      billing: [
        { id: 1, patient: "John Doe", total: 3000, status: "Paid" },
        { id: 2, patient: "Jane Smith", total: 2500, status: "Pending" },
      ],
    };
  
    const exportToPDF = () => {
      const doc: any = new jsPDF(); // Cast as `any`
      doc.text("Patient Report", 10, 10);
  
      // Define the table headers for each report type
      const headers = {
        demographics: ["Name", "Gender", "Age", "Location"],
        visitHistory: ["Patient", "Date", "Department", "Reason"],
        billing: ["Patient", "Total (KES)", "Status"],
      };
  
      let reportData: any[] = [];
      if (selectedReport === "demographics") reportData = reportsData.demographics;
      if (selectedReport === "visitHistory") reportData = reportsData.visitHistory;
      if (selectedReport === "billing") reportData = reportsData.billing;
  
      // Prepare the table body based on the selected report
      const tableData = reportData.map((item) => {
        if (selectedReport === "demographics") {
          return [item.name, item.gender, item.age, item.location];
        }
        if (selectedReport === "visitHistory") {
          return [item.patient, item.date, item.department, item.reason];
        }
        if (selectedReport === "billing") {
          return [item.patient, item.total, item.status];
        }
        return [];
      });
  
      // Add the table to the PDF using jsPDF's autoTable
      doc.autoTable({
        startY: 20, // Position the table below the title
        head: [headers[selectedReport]], // Column headers
        body: tableData, // Data rows
      });
  
      // Save the PDF with the appropriate filename
      doc.save(`${selectedReport}_report.pdf`);
    };
  
    const exportToExcel = () => {
      let reportData: any[] = [];
      if (selectedReport === "demographics") reportData = reportsData.demographics;
      if (selectedReport === "visitHistory") reportData = reportsData.visitHistory;
      if (selectedReport === "billing") reportData = reportsData.billing;
  
      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, selectedReport);
  
      XLSX.writeFile(workbook, `${selectedReport}_report.xlsx`);
    };
  
    const renderReport = () => {
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
      };
  
      const chartStyle = {
        maxWidth: "400px",
        maxHeight: "300px",
        margin: "0 auto",
      };
  
      switch (selectedReport) {
        case "demographics":
          return (
            <div>
              <h2 className="text-xl font-bold mb-4">Demographics</h2>
              <div style={chartStyle}>
                <Pie
                  data={{
                    labels: ["Male", "Female"],
                    datasets: [
                      {
                        label: "Patients by Gender",
                        data: reportsData.demographics.reduce(
                          (acc, item) => {
                            if (item.gender === "Male") acc[0] += 1;
                            if (item.gender === "Female") acc[1] += 1;
                            return acc;
                          },
                          [0, 0]
                        ),
                        backgroundColor: ["#4A90E2", "#FF6384"],
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </div>
          );
  
        case "visitHistory":
          return (
            <div>
              <h2 className="text-xl font-bold mb-4">Visit History</h2>
              <div style={chartStyle}>
                <Line
                  data={{
                    labels: reportsData.visitHistory.map((item) => item.date),
                    datasets: [
                      {
                        label: "Visits by Date",
                        data: [1, 1], // Example count of visits
                        borderColor: "#FF6384",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </div>
          );
  
        case "billing":
          return (
            <div>
              <h2 className="text-xl font-bold mb-4">Billing</h2>
              <div style={chartStyle}>
                <Bar
                  data={{
                    labels: reportsData.billing.map((item) => item.patient),
                    datasets: [
                      {
                        label: "Billing (KES)",
                        data: reportsData.billing.map((item) => item.total),
                        backgroundColor: "#36A2EB",
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </div>
          );
  
        default:
          return <p>Select a report to view its details.</p>;
      }
    };
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Patient Reports</h1>
  
        {/* Report Selection */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setSelectedReport("demographics")} className="bg-blue-600 text-white px-4 py-2 rounded">
            Demographics
          </button>
          <button onClick={() => setSelectedReport("visitHistory")} className="bg-blue-600 text-white px-4 py-2 rounded">
            Visit History
          </button>
          <button onClick={() => setSelectedReport("billing")} className="bg-blue-600 text-white px-4 py-2 rounded">
            Billing
          </button>
        </div>
  
        {/* Flex container for report and export options */}
        <div className="flex justify-between mb-6">
          <div className="w-full max-w-screen-md">{renderReport()}</div>
          {/* Export Buttons on the Right */}
          <div className="flex flex-col gap-4">
            <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded">
              Export to PDF
            </button>
            <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    );
  }
  