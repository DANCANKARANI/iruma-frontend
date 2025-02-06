"use client";

import { useState } from "react";
import { jsPDF } from "jspdf"; // For generating PDFs

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  specialInstructions: string;
  inStock: boolean;
}

interface Prescription {
  id: number;
  patientName: string;
  age: number;
  diagnosis: string;
  prescribedMedicines: Medicine[];
  status: "Pending" | "Fulfilled";
}

export default function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 1,
      patientName: "John Doe",
      age: 45,
      diagnosis: "Diabetes & Hypertension",
      status: "Pending",
      prescribedMedicines: [
        { id: 1, name: "Metformin", dosage: "500mg", frequency: "Twice a day", duration: "3 months", route: "Oral", specialInstructions: "Take with meals", inStock: true },
        { id: 2, name: "Losartan", dosage: "50mg", frequency: "Once a day", duration: "3 months", route: "Oral", specialInstructions: "Avoid potassium-rich foods", inStock: false },
      ],
    },
    {
        id: 2,
        patientName: "John Doe",
        age: 45,
        diagnosis: "Diabetes & Hypertension",
        status: "Pending",
        prescribedMedicines: [
          { id: 1, name: "Metformin", dosage: "500mg", frequency: "Twice a day", duration: "3 months", route: "Oral", specialInstructions: "Take with meals", inStock: true },
          { id: 2, name: "Losartan", dosage: "50mg", frequency: "Once a day", duration: "3 months", route: "Oral", specialInstructions: "Avoid potassium-rich foods", inStock: false },
        ],
      },
  ]);

  // Handle Prescription Fulfillment
  const fulfillPrescription = (id: number) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, status: "Fulfilled" } : prescription
      )
    );
  };

  // Generate PDF for a prescription
  const printPrescription = (prescription: Prescription) => {
    const doc = new jsPDF();
    doc.text(`Prescription for ${prescription.patientName}`, 20, 20);
    doc.text(`Diagnosis: ${prescription.diagnosis}`, 20, 30);
    doc.text("Medications:", 20, 40);

    prescription.prescribedMedicines.forEach((med, index) => {
      doc.text(`${index + 1}. ${med.name} - ${med.dosage}, ${med.frequency}, ${med.duration}`, 20, 50 + index * 10);
    });

    doc.save(`${prescription.patientName}-prescription.pdf`);
  };

  // Filtered prescriptions based on search and status
  const filteredPrescriptions = prescriptions.filter((p) => {
    return (
      (filterStatus === "All" || p.status === filterStatus) &&
      (p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

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

      {filteredPrescriptions.map((prescription) => (
        <div key={prescription.id} className="mb-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold">🧑‍⚕️ Patient: {prescription.patientName}</h3>
          <p className="text-gray-600">Age: {prescription.age}</p>
          <p className="text-gray-600">Diagnosis: {prescription.diagnosis}</p>

          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Medicine</th>
                <th className="border p-2">Dosage</th>
                <th className="border p-2">Frequency</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {prescription.prescribedMedicines.map((medicine) => (
                <tr key={medicine.id} className="text-center">
                  <td className="border p-2">{medicine.name}</td>
                  <td className="border p-2">{medicine.dosage}</td>
                  <td className="border p-2">{medicine.frequency}</td>
                  <td className="border p-2">{medicine.duration}</td>
                  <td className={`border p-2 font-bold ${medicine.inStock ? "text-green-600" : "text-red-600"}`}>
                    {medicine.inStock ? "✅ Available" : "❌ Out of Stock"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-4">
            <p className={`font-bold ${prescription.status === "Fulfilled" ? "text-green-600" : "text-yellow-600"}`}>
              Status: {prescription.status}
            </p>
            {prescription.status === "Pending" && (
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
      ))}
    </div>
  );
}
