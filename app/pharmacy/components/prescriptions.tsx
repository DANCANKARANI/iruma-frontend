"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; // For generating PDFs

interface Medicine {
  id: number;
  name: string;
  form: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

interface Prescription {
  id: string;
  patient_id: string;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    address: string;
  };
  doctor_id: string;
  doctor: {
    id: string;
    full_name: string;
    phone_number: string;
    email: string;
  };
  diagnosis: string;
  dosage: string;
  frequency: number;
  instructions: string;
  prescribed_medicines: Medicine[];
  status: "Pending" | "Fulfilled" | "pending"; // Adjust based on backend values
  created_at: string;
  updated_at: string;
}

export default function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
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

  // Fetch prescriptions from the backend with filters
  const fetchPrescriptions = async (filters: { status?: string; patientName?: string }) => {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
      setError("You are not authorized. Please log in.");
      setLoading(false);
      return;
    }

    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== "All") {
        queryParams.append("status", filters.status);
      }
      if (filters.patientName) {
        queryParams.append("patient_name", filters.patientName);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/prescription?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      const data = await response.json();
      if (data.success) {
        setPrescriptions(data.data); // Set the fetched prescriptions
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

  // Fetch prescriptions when filters change
  useEffect(() => {
    fetchPrescriptions({ status: filterStatus, patientName: searchQuery });
  }, [filterStatus, searchQuery]);

  // Handle Prescription Fulfillment
  const fulfillPrescription = async (id: string) => {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
      setError("You are not authorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/prescription/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ status: "Fulfilled" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update prescription status");
      }

      const data = await response.json();
      if (data.success) {
        // Update the local state to reflect the new status
        setPrescriptions((prev) =>
          prev.map((prescription) =>
            prescription.id === id ? { ...prescription, status: "Fulfilled" } : prescription
          )
        );
      } else {
        throw new Error(data.message || "Failed to update prescription status");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  // Generate PDF for a prescription
  const printPrescription = (prescription: Prescription) => {
    const doc = new jsPDF();
    doc.text(`Prescription for ${prescription.patient.first_name} ${prescription.patient.last_name}`, 20, 20);
    doc.text(`Diagnosis: ${prescription.diagnosis}`, 20, 30);
    doc.text("Medications:", 20, 40);

    prescription.prescribed_medicines.forEach((med, index) => {
      doc.text(`${index + 1}. ${med.name} - ${med.form}`, 20, 50 + index * 10);
    });

    doc.save(`${prescription.patient.first_name}-prescription.pdf`);
  };

  // Filtered prescriptions based on search and status (frontend filtering as fallback)
  const filteredPrescriptions = prescriptions.filter((p) => {
    const patientName = `${p.patient.first_name} ${p.patient.last_name}`;
    return (
      (filterStatus === "All" || p.status.toLowerCase() === filterStatus.toLowerCase()) &&
      (patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  });

  if (loading) {
    return <div className="p-6">Loading prescriptions...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📄 Pharmacy Prescriptions</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by patient name..."
        className="p-2 border border-gray-300 rounded mb-4 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Filter by Status */}
      <select
        className="p-2 border border-gray-300 rounded mb-4"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="All">All Prescriptions</option>
        <option value="Pending">Pending</option>
        <option value="Fulfilled">Fulfilled</option>
      </select>

      {filteredPrescriptions.length === 0 ? (
        <div className="text-gray-600">No prescriptions found.</div>
      ) : (
        filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="mb-6 p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-bold">
              🧑‍⚕️ Patient: {prescription.patient.first_name} {prescription.patient.last_name}
            </h3>
            <p className="text-gray-600">Diagnosis: {prescription.diagnosis}</p>
            <p className="text-gray-600">Doctor: {prescription.doctor.full_name}</p>
            <p className="text-gray-600">Doctor&apos;s Contact: {prescription.doctor.phone_number}</p>
            <p className="text-gray-600">Patient&apos;s Contact: {prescription.patient.phone_number}</p>
            <p className="text-gray-600">Patient&apos;s Address: {prescription.patient.address}</p>
            <p className="text-gray-600">Prescription Date: {new Date(prescription.created_at).toLocaleDateString()}</p>

            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Medicine</th>
                  <th className="border p-2">Form</th>
                  <th className="border p-2">Dosage</th>
                  <th className="border p-2">Frequency</th>
                  <th className="border p-2">Instructions</th>
                  <th className="border p-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {prescription.prescribed_medicines.map((medicine) => (
                  <tr key={medicine.id} className="text-center">
                    <td className="border p-2">{medicine.name}</td>
                    <td className="border p-2">{medicine.form}</td>
                    <td className="border p-2">{prescription.dosage}</td>
                    <td className="border p-2">{prescription.frequency}</td>
                    <td className="border p-2">{prescription.instructions}</td>
                    <td className={`border p-2 font-bold ${medicine.in_stock ? "text-green-600" : "text-red-600"}`}>
                      {medicine.in_stock ? "✅ Available" : "❌ Out of Stock"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex gap-4">
              {/* Status with green color for "Fulfilled" */}
              <p
                className={`font-bold ${
                  prescription.status === "Fulfilled" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                Status: {prescription.status}
              </p>
              {prescription.status.toLowerCase() === "pending" && (
                <button
                  onClick={() => fulfillPrescription(prescription.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  ✅ Fulfill
                </button>
              )}
              <button
                onClick={() => printPrescription(prescription)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                🖨️ Print / Download
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}