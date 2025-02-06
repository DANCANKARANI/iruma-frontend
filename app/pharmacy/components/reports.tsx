"use client";

import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import * as XLSX from "xlsx"; // Importing XLSX for Excel export

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface Report {
  date: string;
  totalSales: number;
  completedOrders: number;
  pendingOrders: number;
  topMedicine: string;
}

// Sample data
const reports: Report[] = [
  { date: "January 2025", totalSales: 50000, completedOrders: 120, pendingOrders: 20, topMedicine: "Paracetamol" },
  { date: "February 2025", totalSales: 45000, completedOrders: 110, pendingOrders: 25, topMedicine: "Amoxicillin" },
  { date: "March 2025", totalSales: 60000, completedOrders: 150, pendingOrders: 10, topMedicine: "Ibuprofen" },
];

export default function Reports() {
  const [filter, setFilter] = useState("monthly");

  // Bar Chart Data - Sales
  const barChartData = {
    labels: reports.map((r) => r.date),
    datasets: [
      {
        label: "Total Sales (KES)",
        data: reports.map((r) => r.totalSales),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  // Line Chart Data - Orders
  const lineChartData = {
    labels: reports.map((r) => r.date),
    datasets: [
      {
        label: "Completed Orders",
        data: reports.map((r) => r.completedOrders),
        borderColor: "#2196F3",
        fill: false,
      },
      {
        label: "Pending Orders",
        data: reports.map((r) => r.pendingOrders),
        borderColor: "#FF9800",
        fill: false,
      },
    ],
  };

  // Chart Options - Prevent Overflow
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { autoSkip: false },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("📊 Pharmacy Sales Report", 20, 20);
    reports.forEach((r, i) => {
      doc.text(`${r.date}: KES ${r.totalSales} | Orders: ${r.completedOrders} Completed, ${r.pendingOrders} Pending`, 20, 30 + i * 10);
    });
    doc.save("Pharmacy-Report.pdf");
  };

  // Export as Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reports); // Convert JSON data to an Excel sheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Reports"); // Append sheet to workbook
    XLSX.writeFile(wb, "Pharmacy-Report.xlsx"); // Export as an Excel file
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📊 Pharmacy Reports</h2>

      {/* Filter Dropdown */}
      <select className="p-2 border border-gray-300 rounded mb-4" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="daily">Daily Reports</option>
        <option value="weekly">Weekly Reports</option>
        <option value="monthly">Monthly Reports</option>
      </select>

      {/* Horizontal Layout for Charts */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        {/* Sales Chart */}
        <div className="w-[45%] h-[300px] p-4 bg-gray-100 rounded-lg overflow-hidden">
          <h3 className="text-lg font-bold mb-2">📈 Total Sales Trend</h3>
          <div className="w-full h-[250px]">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Orders Chart - FIXED OVERFLOW */}
        <div className="w-[45%] h-[300px] p-4 bg-gray-100 rounded-lg overflow-hidden">
          <h3 className="text-lg font-bold mb-2">📊 Orders Trend</h3>
          <div className="w-full h-[250px]">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Report List */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {reports.map((report) => (
          <div key={report.date} className="p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-bold">📅 {report.date}</h3>
            <p className="text-gray-600">💰 Total Sales: KES {report.totalSales}</p>
            <p className="text-gray-600">✅ Completed Orders: {report.completedOrders}</p>
            <p className="text-gray-600">🕑 Pending Orders: {report.pendingOrders}</p>
            <p className="text-gray-600">💊 Top-Selling Medicine: {report.topMedicine}</p>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="flex space-x-4">
        <button onClick={generatePDF} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          📄 Export as PDF
        </button>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded mt-4">
          📥 Export as Excel
        </button>
      </div>
    </div>
  );
}
