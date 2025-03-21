"use client";

import { useState, useEffect, useRef } from "react";
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
import { getCookie } from "cookies-next";

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

// Define the type for a lab test
interface LabTest {
  id: string;
  test_name: string;
  sample_type: string;
  status: string;
  created_at: string;
}

export default function TechnicianReports() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState("");
  const chartRef = useRef(null); // Reference for exporting PDF

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch lab tests from the backend
  useEffect(() => {
    const fetchLabTests = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/technician`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch lab tests");
        }

        setLabTests(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch lab tests");
        console.error("Error fetching lab tests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLabTests();
  }, [API_URL]);

  // Calculate statistics
  const totalLabTests = labTests.length;
  const totalSamples = labTests.reduce((acc, test) => acc + (test.sample_type ? 1 : 0), 0);
  const testTypes = labTests.reduce((acc, test) => {
    acc[test.test_name] = (acc[test.test_name] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Bar Chart Data
  const barChartData = {
    labels: ["Lab Tests", "Samples"],
    datasets: [
      {
        label: "Count",
        data: [totalLabTests, totalSamples],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)"],
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: Object.keys(testTypes),
    datasets: [
      {
        data: Object.values(testTypes),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  // Line Chart Data
  const lineChartData = {
    labels: labTests.map((test) => new Date(test.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Lab Tests Over Time",
        data: labTests.map((_, index) => index + 1),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
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
        pdf.save("technician-report.pdf");
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Category": "Lab Tests", "Count": totalLabTests },
      { "Category": "Samples", "Count": totalSamples },
      ...Object.keys(testTypes).map((type) => ({
        "Test Type": type,
        "Count": testTypes[type],
      })),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "technician-report.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📊 Technician Reports</h1>

      {/* Summary Statistics */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-blue-600">Total Lab Tests</h2>
          <p className="text-2xl font-bold">{totalLabTests}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-600">Total Samples</h2>
          <p className="text-2xl font-bold">{totalSamples}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600">Test Types</h2>
          <p className="text-2xl font-bold">{Object.keys(testTypes).length}</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 mb-6">
        <button onClick={exportToPDF} className="px-4 py-2 bg-red-500 text-white rounded">
          Export as PDF
        </button>
        <button onClick={exportToExcel} className="px-4 py-2 bg-green-500 text-white rounded">
          Export as Excel
        </button>
      </div>

      {/* Charts Section */}
      <div ref={chartRef} className="grid grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Lab Tests and Samples</h2>
          <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Test Types</h2>
          <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Lab Tests Over Time</h2>
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="mt-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Detailed Lab Tests</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Test Name</th>
              <th className="p-2 border">Sample Type</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {labTests.map((test) => (
              <tr key={test.id} className="border-t">
                <td className="p-2 border">{test.test_name}</td>
                <td className="p-2 border">{test.sample_type}</td>
                <td className="p-2 border">{test.status}</td>
                <td className="p-2 border">{new Date(test.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}