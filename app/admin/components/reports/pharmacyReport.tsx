"use client";

import { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from "chart.js";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

type ReportType = "inventory" | "sales" | "prescriptions" | "returns"; // Report types

export default function PharmacyReport() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("inventory");

  // Sample data for pharmacy reports
  const reportsData = {
    inventory: [
      { id: 1, name: "Paracetamol", quantity: 150, price: 20 },
      { id: 2, name: "Amoxicillin", quantity: 100, price: 25 },
    ],
    sales: [
      { id: 1, patient: "John Doe", medicine: "Paracetamol", date: "2025-01-15", quantity: 2, total: 40 },
      { id: 2, patient: "Jane Smith", medicine: "Amoxicillin", date: "2025-01-18", quantity: 1, total: 25 },
    ],
    prescriptions: [
      { id: 1, patient: "John Doe", medicine: "Paracetamol", dose: "500mg", date: "2025-01-15" },
      { id: 2, patient: "Jane Smith", medicine: "Amoxicillin", dose: "250mg", date: "2025-01-18" },
    ],
    returns: [
      { id: 1, patient: "John Doe", medicine: "Paracetamol", quantity: 1, reason: "Wrong dosage", date: "2025-01-17" },
      { id: 2, patient: "Jane Smith", medicine: "Amoxicillin", quantity: 1, reason: "Expired", date: "2025-01-20" },
    ],
  };

  const exportToPDF = () => {
    const doc: any = new jsPDF(); // Cast as `any`
    doc.text("Pharmacy Report", 10, 10);

    const headers = {
      inventory: ["Medicine", "Quantity", "Price (KES)"],
      sales: ["Patient", "Medicine", "Date", "Quantity", "Total (KES)"],
      prescriptions: ["Patient", "Medicine", "Dose", "Date"],
      returns: ["Patient", "Medicine", "Quantity", "Reason", "Date"],
    };

    let reportData: any[] = [];
    if (selectedReport === "inventory") reportData = reportsData.inventory;
    if (selectedReport === "sales") reportData = reportsData.sales;
    if (selectedReport === "prescriptions") reportData = reportsData.prescriptions;
    if (selectedReport === "returns") reportData = reportsData.returns;

    const tableData = reportData.map((item) => {
      if (selectedReport === "inventory") {
        return [item.name, item.quantity, item.price];
      }
      if (selectedReport === "sales") {
        return [item.patient, item.medicine, item.date, item.quantity, item.total];
      }
      if (selectedReport === "prescriptions") {
        return [item.patient, item.medicine, item.dose, item.date];
      }
      if (selectedReport === "returns") {
        return [item.patient, item.medicine, item.quantity, item.reason, item.date];
      }
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
    let reportData: any[] = [];
    if (selectedReport === "inventory") reportData = reportsData.inventory;
    if (selectedReport === "sales") reportData = reportsData.sales;
    if (selectedReport === "prescriptions") reportData = reportsData.prescriptions;
    if (selectedReport === "returns") reportData = reportsData.returns;

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
      case "inventory":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Inventory Report</h2>
            <div style={chartStyle}>
              <Pie
                data={{
                  labels: reportsData.inventory.map((item) => item.name),
                  datasets: [
                    {
                      label: "Medicines Stock",
                      data: reportsData.inventory.map((item) => item.quantity),
                      backgroundColor: ["#4A90E2", "#FF6384"],
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        );

      case "sales":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Sales Report</h2>
            <div style={chartStyle}>
              <Bar
                data={{
                  labels: reportsData.sales.map((item) => item.patient),
                  datasets: [
                    {
                      label: "Sales (KES)",
                      data: reportsData.sales.map((item) => item.total),
                      backgroundColor: "#36A2EB",
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
                  labels: reportsData.prescriptions.map((item) => item.patient),
                  datasets: [
                    {
                      label: "Prescriptions Count",
                      data: reportsData.prescriptions.map(() => 1),
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

      case "returns":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Returns Report</h2>
            <div style={chartStyle}>
              <Bar
                data={{
                  labels: reportsData.returns.map((item) => item.patient),
                  datasets: [
                    {
                      label: "Returned Medicines",
                      data: reportsData.returns.map((item) => item.quantity),
                      backgroundColor: "#FF6384",
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
        <button onClick={() => setSelectedReport("sales")} className="bg-blue-600 text-white px-4 py-2 rounded">
          Sales
        </button>
        <button onClick={() => setSelectedReport("prescriptions")} className="bg-blue-600 text-white px-4 py-2 rounded">
          Prescriptions
        </button>
        <button onClick={() => setSelectedReport("returns")} className="bg-blue-600 text-white px-4 py-2 rounded">
          Returns
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
