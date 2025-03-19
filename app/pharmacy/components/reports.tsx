"use client";

import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import * as XLSX from "xlsx"; // Importing XLSX for Excel export

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface Prescription {
  id: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  doctor: {
    full_name: string;
  };
  diagnosis: string;
  status: "Pending" | "Fulfilled";
  created_at: string;
  updated_at: string;
  prescribed_medicines: {
    name: string;
  }[];
}

export default function Reports() {
  const [filter, setFilter] = useState("monthly");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get the JWT token from cookies
  const getJwtToken = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("Authorization="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;
    return token;
  };

  // Fetch prescriptions from the backend
  useEffect(() => {
    const fetchPrescriptions = async () => {
      const jwtToken = getJwtToken();
      if (!jwtToken) {
        setError("You are not authorized. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/prescription`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch prescriptions");
        }
        const data = await response.json();
        if (data.success) {
          setPrescriptions(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch prescriptions");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Normalize status values to ensure consistency
  const normalizedStatusDistribution = prescriptions.reduce((acc, prescription) => {
    const status = prescription.status.toLowerCase() === "pending" ? "Pending" : "Fulfilled";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group prescriptions by date (e.g., monthly)
  const groupedByDate = prescriptions.reduce((acc, prescription) => {
    const date = new Date(prescription.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get top prescribed medicines
  const topMedicines = prescriptions
    .flatMap((prescription) => prescription.prescribed_medicines.map((medicine) => medicine.name))
    .reduce((acc, medicine) => {
      acc[medicine] = (acc[medicine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Calculate fulfillment time for each prescription
  const fulfillmentTimes = prescriptions
    .filter((prescription) => prescription.status === "Fulfilled")
    .map((prescription) => {
      const created = new Date(prescription.created_at);
      const updated = new Date(prescription.updated_at);
      return Math.floor((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)); // Time in days
    });

  // Group fulfillment times into buckets (e.g., 0-1 days, 1-2 days, etc.)
  const fulfillmentTimeDistribution = fulfillmentTimes.reduce((acc, time) => {
    const bucket = `${Math.floor(time)}-${Math.floor(time) + 1} days`;
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group prescriptions by doctor
  const doctorActivity = prescriptions.reduce((acc, prescription) => {
    const doctorName = prescription.doctor.full_name;
    acc[doctorName] = (acc[doctorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Bar Chart Data - Prescription Status Distribution
  const statusChartData = {
    labels: Object.keys(normalizedStatusDistribution),
    datasets: [
      {
        label: "Number of Prescriptions",
        data: Object.values(normalizedStatusDistribution),
        backgroundColor: ["#FF6384", "#36A2EB"], // Colors for Pending and Fulfilled
      },
    ],
  };

  // Line Chart Data - Prescription Trends Over Time
  const trendsChartData = {
    labels: Object.keys(groupedByDate),
    datasets: [
      {
        label: "Prescriptions Created",
        data: Object.values(groupedByDate),
        borderColor: "#4CAF50",
        fill: false,
      },
    ],
  };

  // Bar Chart Data - Top Prescribed Medicines
  const topMedicinesChartData = {
    labels: Object.keys(topMedicines),
    datasets: [
      {
        label: "Number of Prescriptions",
        data: Object.values(topMedicines),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  // Bar Chart Data - Fulfillment Time Distribution
  const fulfillmentTimeChartData = {
    labels: Object.keys(fulfillmentTimeDistribution),
    datasets: [
      {
        label: "Number of Prescriptions",
        data: Object.values(fulfillmentTimeDistribution),
        backgroundColor: "#FF6384",
      },
    ],
  };

  // Bar Chart Data - Doctor Prescription Activity
  const doctorActivityChartData = {
    labels: Object.keys(doctorActivity),
    datasets: [
      {
        label: "Number of Prescriptions",
        data: Object.values(doctorActivity),
        backgroundColor: "#4CAF50",
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
    doc.text("📊 Prescription Report", 20, 20);
    doc.text("Prescription Status Distribution", 20, 30);
    Object.entries(normalizedStatusDistribution).forEach(([status, count], i) => {
      doc.text(`${status}: ${count} prescriptions`, 20, 40 + i * 10);
    });
    doc.text("Prescription Trends Over Time", 20, 80);
    Object.entries(groupedByDate).forEach(([date, count], i) => {
      doc.text(`${date}: ${count} prescriptions`, 20, 90 + i * 10);
    });
    doc.text("Top Prescribed Medicines", 20, 130);
    Object.entries(topMedicines).forEach(([medicine, count], i) => {
      doc.text(`${medicine}: ${count} prescriptions`, 20, 140 + i * 10);
    });
    doc.save("Prescription-Report.pdf");
  };

  // Export as Excel
  const exportToExcel = () => {
    const data = prescriptions.map((prescription) => ({
      "Patient Name": `${prescription.patient.first_name} ${prescription.patient.last_name}`,
      "Doctor Name": prescription.doctor.full_name,
      Diagnosis: prescription.diagnosis,
      Status: prescription.status,
      "Prescribed Medicines": prescription.prescribed_medicines.map((medicine) => medicine.name).join(", "),
      "Created At": new Date(prescription.created_at).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prescriptions");
    XLSX.writeFile(wb, "Prescription-Report.xlsx");
  };

  if (loading) {
    return <div className="p-6">Loading prescriptions...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📊 Prescription Reports</h2>

      {/* Filter Dropdown */}
      <select className="p-2 border border-gray-300 rounded mb-4" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="daily">Daily Reports</option>
        <option value="weekly">Weekly Reports</option>
        <option value="monthly">Monthly Reports</option>
      </select>

      {/* Horizontal Layout for Charts */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        {/* Prescription Status Distribution */}
        <div className="w-[45%] h-[300px] p-4 bg-gray-100 rounded-lg overflow-hidden">
          <h3 className="text-lg font-bold mb-2">📊 Prescription Status Distribution</h3>
          <div className="w-full h-[250px]">
            <Bar data={statusChartData} options={chartOptions} />
          </div>
        </div>

        {/* Prescription Trends Over Time */}
        <div className="w-[45%] h-[300px] p-4 bg-gray-100 rounded-lg overflow-hidden">
          <h3 className="text-lg font-bold mb-2">📈 Prescription Trends Over Time</h3>
          <div className="w-full h-[250px]">
            <Line data={trendsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Top Prescribed Medicines */}
        <div className="w-[45%] h-[300px] p-4 bg-gray-100 rounded-lg overflow-hidden">
          <h3 className="text-lg font-bold mb-2">💊 Top Prescribed Medicines</h3>
          <div className="w-full h-[250px]">
            <Bar data={topMedicinesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Prescription Fulfillment Time */}
        <div className="w-[45%] h-[300px] p-4 bg-gray-100 rounded-lg overflow-hidden">
          <h3 className="text-lg font-bold mb-2">⏳ Prescription Fulfillment Time</h3>
          <div className="w-full h-[250px]">
            <Bar data={fulfillmentTimeChartData} options={chartOptions} />
          </div>
        </div>

        {/* Doctor Prescription Activity */}
        <div className="w-[45%] h-[300px] p-4 bg-gray-100 rounded-lg overflow-hidden">
          <h3 className="text-lg font-bold mb-2">👨‍⚕️ Doctor Prescription Activity</h3>
          <div className="w-full h-[250px]">
            <Bar data={doctorActivityChartData} options={chartOptions} />
          </div>
        </div>
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