"use client";

import { useState, useRef } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sample data
const sampleData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  appointments: [120, 150, 200, 180, 220, 250],
  prescriptions: [80, 90, 120, 100, 130, 150],
};

export const Reports = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const chartRef = useRef(null); // Reference for exporting PDF

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate total values
  const totalAppointments = sampleData.appointments.reduce((acc, val) => acc + val, 0);
  const totalPrescriptions = sampleData.prescriptions.reduce((acc, val) => acc + val, 0);
  const totalPatients = 1050; // You can replace this with dynamic data

  // Bar Chart Data
  const barChartData = {
    labels: sampleData.labels,
    datasets: [
      {
        label: "Appointments",
        data: sampleData.appointments,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Prescriptions",
        data: sampleData.prescriptions,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ["Completed", "Pending", "Canceled"],
    datasets: [
      {
        data: [800, 200, 50],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  // Line Chart Data
  const lineChartData = {
    labels: sampleData.labels,
    datasets: [
      {
        label: "Appointments",
        data: sampleData.appointments,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Prescriptions",
        data: sampleData.prescriptions,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Export to PDF
  const exportToPDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
        pdf.save("report.pdf");
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Month": "Jan", "Appointments": 120, "Prescriptions": 80 },
      { "Month": "Feb", "Appointments": 150, "Prescriptions": 90 },
      { "Month": "Mar", "Appointments": 200, "Prescriptions": 120 },
      { "Month": "Apr", "Appointments": 180, "Prescriptions": 100 },
      { "Month": "May", "Appointments": 220, "Prescriptions": 130 },
      { "Month": "Jun", "Appointments": 250, "Prescriptions": 150 },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📊 Reports & Analytics</h1>

      {/* Summary Statistics */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-blue-600">Total Appointments</h2>
          <p className="text-2xl font-bold">{totalAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-600">Total Prescriptions</h2>
          <p className="text-2xl font-bold">{totalPrescriptions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600">Total Patients</h2>
          <p className="text-2xl font-bold">{totalPatients}</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">Filter by Date Range</h2>
        <div className="flex gap-4">
          <input type="date" name="start" value={dateRange.start} onChange={handleDateRangeChange} className="p-2 border rounded" />
          <input type="date" name="end" value={dateRange.end} onChange={handleDateRangeChange} className="p-2 border rounded" />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 mb-6">
        <button onClick={exportToPDF} className="px-4 py-2 bg-red-500 text-white rounded">Export as PDF</button>
        <button onClick={exportToExcel} className="px-4 py-2 bg-green-500 text-white rounded">Export as Excel</button>
      </div>

      {/* Charts Section */}
      <div ref={chartRef} className="grid grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Appointments & Prescriptions</h2>
          <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Prescription Status</h2>
          <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Appointments & Prescriptions Trend</h2>
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};
