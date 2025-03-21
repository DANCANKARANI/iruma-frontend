"use client";

import { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { getCookie } from "cookies-next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

type ReportType = "demographics" | "visitHistory" | "billing";

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
  visits?: { date: string; department: string; reason: string }[];
  billing?: { total: number; status: string }[];
}

export default function PatientReports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("demographics");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch patients from the API
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/patient`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch patients");
        }

        setPatients(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch patients");
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [API_URL]);

  // Export to PDF
  const exportToPDF = () => {
    const doc: any = new jsPDF();
    doc.text("Patient Report", 10, 10);

    // Define the table headers for each report type
    const headers = {
      demographics: [
        "Name",
        "Gender",
        "DOB",
        "Patient Number",
        "Phone",
        "Email",
        "Address",
        "Blood Group",
        "Medical History",
        "Emergency Status",
        "Emergency Contact",
        "Triage Level",
        "Initial Vitals",
        "Emergency Notes",
      ],
      visitHistory: ["Patient", "Date", "Department", "Reason"],
      billing: ["Patient", "Total (KES)", "Status"],
    };

    let reportData: any[] = [];
    if (selectedReport === "demographics") {
      reportData = patients.map((patient) => ({
        name: `${patient.first_name} ${patient.last_name}`,
        gender: patient.gender,
        dob: patient.dob,
        patient_number: patient.patient_number,
        phone_number: patient.phone_number,
        email: patient.email,
        address: patient.address,
        blood_group: patient.blood_group,
        medical_history: patient.medical_history,
        is_emergency: patient.is_emergency ? "Yes" : "No",
        emergency_contact: patient.emergency_contact,
        triage_level: patient.triage_level,
        initial_vitals: patient.initial_vitals,
        emergency_notes: patient.emergency_notes,
      }));
    }
    if (selectedReport === "visitHistory") {
      reportData = patients.flatMap((patient) =>
        (patient.visits || []).map((visit) => ({
          patient: `${patient.first_name} ${patient.last_name}`,
          date: visit.date,
          department: visit.department,
          reason: visit.reason,
        }))
      );
    }
    if (selectedReport === "billing") {
      reportData = patients.flatMap((patient) =>
        (patient.billing || []).map((bill) => ({
          patient: `${patient.first_name} ${patient.last_name}`,
          total: bill.total,
          status: bill.status,
        }))
      );
    }

    // Prepare the table body based on the selected report
    const tableData = reportData.map((item) => {
      if (selectedReport === "demographics") {
        return [
          item.name,
          item.gender,
          item.dob,
          item.patient_number,
          item.phone_number,
          item.email,
          item.address,
          item.blood_group,
          item.medical_history,
          item.is_emergency,
          item.emergency_contact,
          item.triage_level,
          item.initial_vitals,
          item.emergency_notes,
        ];
      }
      if (selectedReport === "visitHistory") {
        return [item.patient, item.date, item.department, item.reason];
      }
      if (selectedReport === "billing") {
        return [item.patient, item.total, item.status];
      }
      return [];
    });

    // Add the table to the PDF using jsPDF's autoTable
    doc.autoTable({
      startY: 20, // Position the table below the title
      head: [headers[selectedReport]], // Column headers
      body: tableData, // Data rows
    });

    // Save the PDF with the appropriate filename
    doc.save(`${selectedReport}_report.pdf`);
  };

  // Export to Excel
  const exportToExcel = () => {
    let reportData: any[] = [];
    if (selectedReport === "demographics") {
      reportData = patients.map((patient) => ({
        Name: `${patient.first_name} ${patient.last_name}`,
        Gender: patient.gender,
        DOB: patient.dob,
        "Patient Number": patient.patient_number,
        Phone: patient.phone_number,
        Email: patient.email,
        Address: patient.address,
        "Blood Group": patient.blood_group,
        "Medical History": patient.medical_history,
        "Emergency Status": patient.is_emergency ? "Yes" : "No",
        "Emergency Contact": patient.emergency_contact,
        "Triage Level": patient.triage_level,
        "Initial Vitals": patient.initial_vitals,
        "Emergency Notes": patient.emergency_notes,
      }));
    }
    if (selectedReport === "visitHistory") {
      reportData = patients.flatMap((patient) =>
        (patient.visits || []).map((visit) => ({
          Patient: `${patient.first_name} ${patient.last_name}`,
          Date: visit.date,
          Department: visit.department,
          Reason: visit.reason,
        }))
      );
    }
    if (selectedReport === "billing") {
      reportData = patients.flatMap((patient) =>
        (patient.billing || []).map((bill) => ({
          Patient: `${patient.first_name} ${patient.last_name}`,
          Total: bill.total,
          Status: bill.status,
        }))
      );
    }

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedReport);

    XLSX.writeFile(workbook, `${selectedReport}_report.xlsx`);
  };

  // Render the selected report
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
      case "demographics":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Demographics</h2>
            <div style={chartStyle}>
              <Pie
                data={{
                  labels: ["Male", "Female", "Other"],
                  datasets: [
                    {
                      label: "Patients by Gender",
                      data: patients.reduce(
                        (acc, patient) => {
                          if (patient.gender === "Male") acc[0] += 1;
                          if (patient.gender === "Female") acc[1] += 1;
                          if (patient.gender === "Other") acc[2] += 1;
                          return acc;
                        },
                        [0, 0, 0]
                      ),
                      backgroundColor: ["#4A90E2", "#FF6384", "#36A2EB"],
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Detailed Demographics</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Gender</th>
                    <th className="border border-gray-300 p-2">DOB</th>
                    <th className="border border-gray-300 p-2">Patient Number</th>
                    <th className="border border-gray-300 p-2">Phone</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Address</th>
                    <th className="border border-gray-300 p-2">Blood Group</th>
                    <th className="border border-gray-300 p-2">Medical History</th>
                    <th className="border border-gray-300 p-2">Emergency Status</th>
                    <th className="border border-gray-300 p-2">Emergency Contact</th>
                    <th className="border border-gray-300 p-2">Triage Level</th>
                    <th className="border border-gray-300 p-2">Initial Vitals</th>
                    <th className="border border-gray-300 p-2">Emergency Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="border border-gray-300 p-2">{`${patient.first_name} ${patient.last_name}`}</td>
                      <td className="border border-gray-300 p-2">{patient.gender}</td>
                      <td className="border border-gray-300 p-2">{patient.dob}</td>
                      <td className="border border-gray-300 p-2">{patient.patient_number}</td>
                      <td className="border border-gray-300 p-2">{patient.phone_number}</td>
                      <td className="border border-gray-300 p-2">{patient.email}</td>
                      <td className="border border-gray-300 p-2">{patient.address}</td>
                      <td className="border border-gray-300 p-2">{patient.blood_group}</td>
                      <td className="border border-gray-300 p-2">{patient.medical_history}</td>
                      <td className="border border-gray-300 p-2">{patient.is_emergency ? "Yes" : "No"}</td>
                      <td className="border border-gray-300 p-2">{patient.emergency_contact}</td>
                      <td className="border border-gray-300 p-2">{patient.triage_level}</td>
                      <td className="border border-gray-300 p-2">{patient.initial_vitals}</td>
                      <td className="border border-gray-300 p-2">{patient.emergency_notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "visitHistory":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Visit History</h2>
            <div style={chartStyle}>
              <Line
                data={{
                  labels: patients.flatMap((patient) =>
                    (patient.visits || []).map((visit) => visit.date)
                  ),
                  datasets: [
                    {
                      label: "Visits by Date",
                      data: patients.flatMap((patient) =>
                        (patient.visits || []).map(() => 1)
                      ),
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

      case "billing":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Billing</h2>
            <div style={chartStyle}>
              <Bar
                data={{
                  labels: patients.flatMap((patient) =>
                    (patient.billing || []).map(
                      () => `${patient.first_name} ${patient.last_name}`
                    )
                  ),
                  datasets: [
                    {
                      label: "Billing (KES)",
                      data: patients.flatMap((patient) =>
                        (patient.billing || []).map((bill) => bill.total)
                      ),
                      backgroundColor: "#36A2EB",
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
      <h1 className="text-2xl font-bold mb-4">Patient Reports</h1>

      {/* Report Selection */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedReport("demographics")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Demographics
        </button>
       
      </div>

      {/* Flex container for report and export options */}
      <div className="flex justify-between mb-6">
        <div className="w-full max-w-screen-md">{renderReport()}</div>
        {/* Export Buttons on the Right */}
        <div className="flex flex-col gap-4">
          <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded">
            Export to PDF
          </button>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">
            Export to Excel
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}