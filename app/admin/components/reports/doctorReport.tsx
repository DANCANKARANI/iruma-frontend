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

// Define the types
interface Doctor {
  id: string;
  full_name: string;
  patients_seen: number;
  average_rating: number;
}

interface Prescription {
  id: string;
  doctor_id: string;
  doctor_name: string;
  patient_name: string;
  status: string;
  created_at: string;
}

interface LabResult {
  id: string;
  test_name: string;
  result: string;
  status: string;
  created_at: string;
}

export default function DoctorsReports() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chartRef = useRef(null); // Reference for exporting PDF

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch doctors
        const doctorsResponse = await fetch(`${API_URL}/admin/doctor/all`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        const doctorsData = await doctorsResponse.json();

        if (!doctorsResponse.ok) {
          throw new Error(doctorsData.message || "Failed to fetch doctors");
        }

        setDoctors(doctorsData.data || []);

        // Fetch prescriptions
        const prescriptionsResponse = await fetch(`${API_URL}/prescription`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        const prescriptionsData = await prescriptionsResponse.json();

        if (!prescriptionsResponse.ok) {
          throw new Error(prescriptionsData.message || "Failed to fetch prescriptions");
        }

        setPrescriptions(prescriptionsData.data || []);

        // Fetch lab results
        const labResultsResponse = await fetch(`${API_URL}/technician`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        const labResultsData = await labResultsResponse.json();

        if (!labResultsResponse.ok) {
          throw new Error(labResultsData.message || "Failed to fetch lab results");
        }

        setLabResults(labResultsData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Calculate statistics
  const totalDoctors = doctors.length;
  const totalPrescriptions = prescriptions.length;
  const totalLabResults = labResults.length;

  // Bar Chart Data (Doctors' Performance)
  const barChartData = {
    labels: doctors.map((doctor) => doctor.full_name),
    datasets: [
      {
        label: "Patients Seen",
        data: doctors.map((doctor) => doctor.patients_seen),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // Pie Chart Data (Prescription Status)
  const pieChartData = {
    labels: ["Completed", "Pending", "Canceled"],
    datasets: [
      {
        data: [
          prescriptions.filter((p) => p.status === "Completed").length,
          prescriptions.filter((p) => p.status === "Pending").length,
          prescriptions.filter((p) => p.status === "Canceled").length,
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  // Line Chart Data (Lab Results Over Time)
  const lineChartData = {
    labels: labResults.map((result) => new Date(result.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Lab Results",
        data: labResults.map((_, index) => index + 1),
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
        pdf.save("doctors-report.pdf");
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Category": "Doctors", "Count": totalDoctors },
      { "Category": "Prescriptions", "Count": totalPrescriptions },
      { "Category": "Lab Results", "Count": totalLabResults },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "doctors-report.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📊 Doctors Reports</h1>

      {/* Summary Statistics */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-blue-600">Total Doctors</h2>
          <p className="text-2xl font-bold">{totalDoctors}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-600">Total Prescriptions</h2>
          <p className="text-2xl font-bold">{totalPrescriptions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600">Total Lab Results</h2>
          <p className="text-2xl font-bold">{totalLabResults}</p>
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
          <h2 className="text-lg font-semibold mb-4">Doctors' Performance</h2>
          <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Prescription Status</h2>
          <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Lab Results Over Time</h2>
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="mt-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Detailed Data</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Doctor</th>
              <th className="p-2 border">Prescription Status</th>
              <th className="p-2 border">Lab Result</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="border-t">
                <td className="p-2 border">{doctor.full_name}</td>
                <td className="p-2 border">
                  {prescriptions
                    .filter((p) => p.doctor_id === doctor.id)
                    .map((p) => p.status)
                    .join(", ")}
                </td>
                <td className="p-2 border">
                  {labResults
                    .filter((l) => l.status === "Completed")
                    .map((l) => l.test_name)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}