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

// Define interfaces
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  patient_number: string;
  phone_number: string;
  email: string;
  address: string;
  blood_group: string;
  medical_history: string;
  is_emergency: boolean;
  emergency_contact: string;
  triage_level: string;
  initial_vitals: string;
  emergency_notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface LabTest {
  id: string;
  test_name: string;
  description: string;
  sample_type: string;
  is_active: boolean;
  patient_id: string;
  patient: Patient;
  results: {
    [key: string]: {
      result: string;
      remarks: string;
      tested_by: string;
    };
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Prescription {
  id: string;
  patient_id: string;
  patient: Patient;
  doctor_id: string;
  doctor: {
    id: string;
    full_name: string;
    email: string;
    username: string;
    phone_number: string;
    role: string;
    date_of_birth: string;
    password: string;
    address: string;
    gender: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  diagnosis: string;
  dosage: string;
  frequency: number;
  instructions: string;
  prescribed_medicines: {
    id: number;
    name: string;
    form: string;
    in_stock: boolean;
    inventories: any;
    created_at: string;
    updated_at: string;
  }[];
  status: string;
  created_at: string;
  updated_at: string;
}

export const Reports = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chartRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch data from the database
  const fetchPatients = async () => {
    const response = await fetch(`${API_URL}/patient`, {
      headers: {
        Authorization: `Bearer ${getCookie("Authorization")}`,
      },
    });
    const data = await response.json();
    return data.data;
  };

  const fetchLabTests = async () => {
    const response = await fetch(`${API_URL}/technician`, {
      headers: {
        Authorization: `Bearer ${getCookie("Authorization")}`,
      },
    });
    const data = await response.json();
    return data.data;
  };

  const fetchPrescriptions = async () => {
    const response = await fetch(`${API_URL}/prescription`, {
      headers: {
        Authorization: `Bearer ${getCookie("Authorization")}`,
      },
    });
    const data = await response.json();
    return data.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientsData, labTestsData, prescriptionsData] = await Promise.all([
          fetchPatients(),
          fetchLabTests(),
          fetchPrescriptions(),
        ]);
        setPatients(patientsData);
        setLabTests(labTestsData);
        setPrescriptions(prescriptionsData);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalPatients = patients.length;
  const totalLabTests = labTests.length;
  const totalPrescriptions = prescriptions.length;

  // Bar Chart Data
  const barChartData = {
    labels: ["Patients", "Lab Tests", "Prescriptions"],
    datasets: [
      {
        label: "Count",
        data: [totalPatients, totalLabTests, totalPrescriptions],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ["Completed", "Pending", "Canceled"],
    datasets: [
      {
        data: [
          prescriptions.filter((p) => p.status === "Fulfilled").length,
          prescriptions.filter((p) => p.status === "Pending").length,
          prescriptions.filter((p) => p.status === "Canceled").length,
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  // Line Chart Data
  const lineChartData = {
    labels: patients.map((p) => p.first_name),
    datasets: [
      {
        label: "Patients",
        data: patients.map((p) => (p.is_emergency ? 1 : 0)),
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
        pdf.save("report.pdf");
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Category": "Patients", "Count": totalPatients },
      { "Category": "Lab Tests", "Count": totalLabTests },
      { "Category": "Prescriptions", "Count": totalPrescriptions },
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
          <h2 className="text-xl font-semibold text-blue-600">Total Patients</h2>
          <p className="text-2xl font-bold">{totalPatients}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-600">Total Lab Tests</h2>
          <p className="text-2xl font-bold">{totalLabTests}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600">Total Prescriptions</h2>
          <p className="text-2xl font-bold">{totalPrescriptions}</p>
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
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Prescription Status</h2>
          <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded shadow-md w-[400px] h-[300px]">
          <h2 className="text-lg font-semibold mb-4">Emergency Patients</h2>
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Tables Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Detailed Data</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Patients Table */}
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Patients</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Gender</th>
                  <th className="p-2 border">Phone</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="p-2 border">{patient.first_name} {patient.last_name}</td>
                    <td className="p-2 border">{patient.gender}</td>
                    <td className="p-2 border">{patient.phone_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lab Tests Table */}
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Lab Tests</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 border">Test Name</th>
                  <th className="p-2 border">Patient</th>
                  <th className="p-2 border">Results</th>
                </tr>
              </thead>
              <tbody>
                {labTests.map((test) => (
                  <tr key={test.id}>
                    <td className="p-2 border">{test.test_name}</td>
                    <td className="p-2 border">{test.patient.first_name} {test.patient.last_name}</td>
                    <td className="p-2 border">{Object.keys(test.results).length} results</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prescriptions Table */}
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 border">Diagnosis</th>
                  <th className="p-2 border">Patient</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id}>
                    <td className="p-2 border">{prescription.diagnosis}</td>
                    <td className="p-2 border">{prescription.patient.first_name} {prescription.patient.last_name}</td>
                    <td className="p-2 border">{prescription.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};