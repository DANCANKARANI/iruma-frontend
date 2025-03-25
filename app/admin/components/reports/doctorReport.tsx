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

type ReportType = "overview" | "doctors" | "prescriptions" | "lab-results";

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
  status: "Completed" | "Pending" | "Canceled";
  created_at: string;
}

interface LabResult {
  id: string;
  test_name: string;
  result: string;
  status: "Completed" | "Pending";
  created_at: string;
}

export default function ReportsDashboard() {
  const [reportType, setReportType] = useState<ReportType>("overview");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch doctors
        const doctorsResponse = await fetch(`${API_URL}/admin/doctor/all`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        
        if (!doctorsResponse.ok) {
          throw new Error(`Failed to fetch doctors: ${doctorsResponse.status}`);
        }
        
        const doctorsData = await doctorsResponse.json();
        setDoctors(Array.isArray(doctorsData?.data) ? doctorsData.data : []);

        // Fetch prescriptions
        const prescriptionsResponse = await fetch(`${API_URL}/prescription`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        
        if (!prescriptionsResponse.ok) {
          throw new Error(`Failed to fetch prescriptions: ${prescriptionsResponse.status}`);
        }
        
        const prescriptionsData = await prescriptionsResponse.json();
        setPrescriptions(Array.isArray(prescriptionsData?.data) ? prescriptionsData.data : []);

        // Fetch lab results
        const labResultsResponse = await fetch(`${API_URL}/technician`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        
        if (!labResultsResponse.ok) {
          throw new Error(`Failed to fetch lab results: ${labResultsResponse.status}`);
        }
        
        const labResultsData = await labResultsResponse.json();
        setLabResults(Array.isArray(labResultsData?.data) ? labResultsData.data : []);

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
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

  // Chart data preparation
  const barChartData = {
    labels: doctors.map(doctor => doctor.full_name),
    datasets: [
      {
        label: "Patients Seen",
        data: doctors.map(doctor => doctor.patients_seen),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const pieChartData = {
    labels: ["Completed", "Pending", "Canceled"],
    datasets: [
      {
        data: [
          prescriptions.filter(p => p.status === "Completed").length,
          prescriptions.filter(p => p.status === "Pending").length,
          prescriptions.filter(p => p.status === "Canceled").length,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)", 
          "rgba(255, 99, 132, 0.6)"
        ],
      },
    ],
  };

  const lineChartData = {
    labels: labResults.map(result => new Date(result.created_at).toLocaleDateString()),
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

  const exportToPDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
        pdf.save(`${reportType}-report.pdf`);
      });
    }
  };

  const exportToExcel = () => {
    let data = [];
    
    switch(reportType) {
      case "doctors":
        data = doctors.map(doctor => ({
          "Doctor Name": doctor.full_name,
          "Patients Seen": doctor.patients_seen,
          "Average Rating": doctor.average_rating
        }));
        break;
      case "prescriptions":
        data = prescriptions.map(prescription => ({
          "Patient Name": prescription.patient_name,
          "Doctor Name": prescription.doctor_name,
          "Status": prescription.status,
          "Date": new Date(prescription.created_at).toLocaleDateString()
        }));
        break;
      case "lab-results":
        data = labResults.map(result => ({
          "Test Name": result.test_name,
          "Result": result.result,
          "Status": result.status,
          "Date": new Date(result.created_at).toLocaleDateString()
        }));
        break;
      default:
        data = [
          { "Category": "Doctors", "Count": totalDoctors },
          { "Category": "Prescriptions", "Count": totalPrescriptions },
          { "Category": "Lab Results", "Count": totalLabResults },
        ];
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${reportType}-report.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h2 className="font-bold text-xl mb-2">Error Loading Data</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderReportContent = () => {
    switch(reportType) {
      case "doctors":
        return (
          <>
            <div className="bg-white p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-4">Doctors Performance</h2>
              <div className="h-[300px]">
                <Bar 
                  data={barChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } }
                  }} 
                />
              </div>
            </div>
            <div className="mt-6 bg-white p-4 rounded shadow-md overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Doctors List</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Doctor</th>
                    <th className="p-2 border">Patients Seen</th>
                    <th className="p-2 border">Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 border">{doctor.full_name}</td>
                      <td className="p-2 border">{doctor.patients_seen}</td>
                      <td className="p-2 border">{doctor.average_rating?.toFixed(1) || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case "prescriptions":
        return (
          <>
            <div className="bg-white p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-4">Prescription Status</h2>
              <div className="h-[300px]">
                <Pie 
                  data={pieChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } }
                  }} 
                />
              </div>
            </div>
            <div className="mt-6 bg-white p-4 rounded shadow-md overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Recent Prescriptions</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Patient</th>
                    <th className="p-2 border">Doctor</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.slice(0, 10).map((prescription) => (
                    <tr key={prescription.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 border">{prescription.patient_name}</td>
                      <td className="p-2 border">{prescription.doctor_name}</td>
                      <td className="p-2 border">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          prescription.status === "Completed" ? "bg-green-100 text-green-800" :
                          prescription.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {prescription.status}
                        </span>
                      </td>
                      <td className="p-2 border">{new Date(prescription.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case "lab-results":
        return (
          <>
            <div className="bg-white p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-4">Lab Results Over Time</h2>
              <div className="h-[300px]">
                <Line 
                  data={lineChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } }
                  }} 
                />
              </div>
            </div>
            <div className="mt-6 bg-white p-4 rounded shadow-md overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Recent Lab Results</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Test Name</th>
                    <th className="p-2 border">Result</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.slice(0, 10).map((result) => (
                    <tr key={result.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 border">{result.test_name}</td>
                      <td className="p-2 border">{result.result}</td>
                      <td className="p-2 border">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          result.status === "Completed" ? "bg-green-100 text-green-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="p-2 border">{new Date(result.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      default: // overview
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Doctors Performance</h2>
                <div className="h-[300px]">
                  <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Prescription Status</h2>
                <div className="h-[300px]">
                  <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Lab Results Over Time</h2>
                <div className="h-[300px]">
                  <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Healthcare Analytics Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={exportToPDF} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            disabled={loading}
          >
            Export as PDF
          </button>
          <button 
            onClick={exportToExcel} 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            disabled={loading}
          >
            Export as Excel
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="mb-6 flex flex-wrap gap-2 bg-white p-3 rounded-md shadow">
        <button
          onClick={() => setReportType("overview")}
          className={`px-4 py-2 rounded transition ${
            reportType === "overview" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setReportType("doctors")}
          className={`px-4 py-2 rounded transition ${
            reportType === "doctors" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Doctors
        </button>
        <button
          onClick={() => setReportType("prescriptions")}
          className={`px-4 py-2 rounded transition ${
            reportType === "prescriptions" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setReportType("lab-results")}
          className={`px-4 py-2 rounded transition ${
            reportType === "lab-results" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Lab Results
        </button>
      </div>

      {/* Report Content */}
      <div ref={chartRef}>
        {renderReportContent()}
      </div>
    </div>
  );
}