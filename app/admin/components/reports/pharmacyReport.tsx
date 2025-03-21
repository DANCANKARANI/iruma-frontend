"use client";

import { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from "chart.js";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

type ReportType = "inventory" | "prescriptions"; // Only inventory and prescriptions

export default function PharmacyReport() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("inventory");
  const [reportData, setReportData] = useState<any[]>([]); // Store fetched data
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        let url = "";
        if (selectedReport === "inventory") {
          url = "/api/inventory"; // Update with your API endpoint
        } else if (selectedReport === "prescriptions") {
          url = "/api/prescriptions"; // Update with your API endpoint
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch report data");
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedReport]); // Fetch data when `selectedReport` changes

  const exportToPDF = () => {
    const doc: any = new jsPDF();
    doc.text("Pharmacy Report", 10, 10);

    const headers = {
      inventory: ["Medicine", "Quantity", "Price (KES)"],
      prescriptions: ["Patient", "Medicine", "Dose", "Date"],
    };

    const tableData = reportData.map((item) => {
      if (selectedReport === "inventory") return [item.name, item.quantity, item.price];
      if (selectedReport === "prescriptions") return [item.patient, item.medicine, item.dose, item.date];
      return [];
    });

    doc.autoTable({
      startY: 20,
      head: [headers[selectedReport]],
      body: tableData,
    });

    doc.save(`${selectedReport}_report.pdf`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedReport);
    XLSX.writeFile(workbook, `${selectedReport}_report.xlsx`);
  };

  const renderReport = () => {
    if (loading) return <p>Loading...</p>;
    if (reportData.length === 0) return <p>No data available.</p>;

    const chartOptions = { responsive: true, maintainAspectRatio: true };
    const chartStyle = { maxWidth: "400px", maxHeight: "300px", margin: "0 auto" };

    switch (selectedReport) {
      case "inventory":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Inventory Report</h2>
            <div style={chartStyle}>
              <Pie
                data={{
                  labels: reportData.map((item) => item.name),
                  datasets: [
                    {
                      label: "Medicines Stock",
                      data: reportData.map((item) => item.quantity),
                      backgroundColor: ["#4A90E2", "#FF6384"],
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        );

      case "prescriptions":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Prescription Report</h2>
            <div style={chartStyle}>
              <Line
                data={{
                  labels: reportData.map((item) => item.patient),
                  datasets: [
                    {
                      label: "Prescriptions Count",
                      data: reportData.map(() => 1),
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

      default:
        return <p>Select a report to view its details.</p>;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pharmacy Reports</h1>

      {/* Report Selection */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setSelectedReport("inventory")} className="bg-blue-600 text-white px-4 py-2 rounded">
          Inventory
        </button>
        <button onClick={() => setSelectedReport("prescriptions")} className="bg-blue-600 text-white px-4 py-2 rounded">
          Prescriptions
        </button>
      </div>

      {/* Export Options */}
      <div className="flex gap-4 mb-6 justify-end">
        <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded">
          Export to PDF
        </button>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">
          Export to Excel
        </button>
      </div>

      {/* Report Content */}
      {renderReport()}
    </div>
  );
}
