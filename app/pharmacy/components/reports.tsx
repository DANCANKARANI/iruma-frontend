"use client";

import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";

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
  medicine_name: string[];
}

export default function Reports() {
  const [filter, setFilter] = useState("monthly");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  // Fetch user name on component mount
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = Cookies.get("Authorization") || Cookies.get("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Try to get name from JWT token
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          if (decodedToken.full_name) {
            setUserName(decodedToken.full_name);
          } else if (decodedToken.name) {
            setUserName(decodedToken.name);
          }
        } catch (e) {
          console.log("Name not in JWT");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  // Fetch prescriptions from the backend
  useEffect(() => {
    const fetchPrescriptions = async () => {
      const token = Cookies.get("Authorization") || Cookies.get("token");
      if (!token) {
        setError("You are not authorized. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/prescription`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setPrescriptions(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch prescriptions");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const normalizedStatusDistribution = prescriptions.reduce((acc, prescription) => {
    const status = prescription.status.toLowerCase() === "pending" ? "Pending" : "Fulfilled";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const groupedByDate = prescriptions.reduce((acc, prescription) => {
    const date = new Date(prescription.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMedicines = prescriptions
    .flatMap((prescription) => prescription.medicine_name)
    .reduce((acc, medicine) => {
      acc[medicine] = (acc[medicine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const fulfillmentTimes = prescriptions
    .filter((prescription) => prescription.status === "Fulfilled")
    .map((prescription) => {
      const created = new Date(prescription.created_at);
      const updated = new Date(prescription.updated_at);
      return Math.floor((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    });

  const fulfillmentTimeDistribution = fulfillmentTimes.reduce((acc, time) => {
    const bucket = `${Math.floor(time)}-${Math.floor(time) + 1} days`;
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const doctorActivity = prescriptions.reduce((acc, prescription) => {
    const doctorName = prescription.doctor.full_name;
    acc[doctorName] = (acc[doctorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = {
    labels: Object.keys(normalizedStatusDistribution),
    datasets: [
      {
        label: "Number of Prescriptions",
        data: Object.values(normalizedStatusDistribution),
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`📊 Prescription Report - Generated by ${userName || "System"}`, 20, 20);
    doc.text(`Report Period: ${filter}`, 20, 30);
    
    // Add current date
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    
    doc.text("Prescription Status Distribution", 20, 50);
    Object.entries(normalizedStatusDistribution).forEach(([status, count], i) => {
      doc.text(`${status}: ${count} prescriptions`, 20, 60 + i * 10);
    });
    
    doc.text("Prescription Trends Over Time", 20, 90);
    Object.entries(groupedByDate).forEach(([date, count], i) => {
      doc.text(`${date}: ${count} prescriptions`, 20, 100 + i * 10);
    });
    
    doc.text("Top Prescribed Medicines", 20, 140);
    Object.entries(topMedicines).forEach(([medicine, count], i) => {
      doc.text(`${medicine}: ${count} prescriptions`, 20, 150 + i * 10);
    });
    
    doc.save(`Prescription-Report-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const exportToExcel = () => {
    const data = prescriptions.map((prescription) => ({
      "Patient Name": `${prescription.patient.first_name} ${prescription.patient.last_name}`,
      "Doctor Name": prescription.doctor.full_name,
      Diagnosis: prescription.diagnosis,
      Status: prescription.status,
      "Prescribed Medicines": prescription.medicine_name.join(", "),
      "Created At": new Date(prescription.created_at).toLocaleDateString(),
      "Updated At": new Date(prescription.updated_at).toLocaleDateString(),
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    
    // Add metadata sheet
    const metadata = [
      ["Report Type", "Prescription Analysis"],
      ["Generated By", userName || "System"],
      ["Generated On", new Date().toLocaleDateString()],
      ["Report Period", filter],
      ["Total Prescriptions", prescriptions.length],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(metadata), "Metadata");
    XLSX.utils.book_append_sheet(wb, ws, "Prescriptions");
    
    XLSX.writeFile(wb, `Prescription-Report-${new Date().toISOString().slice(0,10)}.xlsx`);
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
      {userName && <p className="text-gray-600 mb-4">Logged in as: {userName}</p>}

      {/* Filter Dropdown */}
      <div className="flex items-center gap-4 mb-6">
        <select 
          className="p-2 border border-gray-300 rounded"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        
        <div className="flex gap-2">
          <button 
            onClick={generatePDF} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <span>📄</span> Export PDF
          </button>
          <button 
            onClick={exportToExcel} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <span>📊</span> Export Excel
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Prescription Status</h3>
          <div className="h-64">
            <Bar data={statusChartData} options={chartOptions} />
          </div>
        </div>

        {/* Trends Over Time */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Prescription Trends</h3>
          <div className="h-64">
            <Line data={trendsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Top Medicines */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Top Prescribed Medicines</h3>
          <div className="h-64">
            <Bar data={topMedicinesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Fulfillment Time */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Fulfillment Time (Days)</h3>
          <div className="h-64">
            <Bar data={fulfillmentTimeChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Doctor Activity */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Doctor Prescription Activity</h3>
        <div className="h-96">
          <Bar data={doctorActivityChartData} options={{
            ...chartOptions,
            indexAxis: 'y'
          }} />
        </div>
      </div>
    </div>
  );
}