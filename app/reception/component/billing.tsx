"use client";

import { useState } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import BillingDetails from "./billingDetails";

// Define Patient Type
interface Patient {
  id: string;
  name: string;
  insurance: string;
}

const patientsList: Patient[] = [
  { id: "PAT-001", name: "John Doe", insurance: "NHIF" },
  { id: "PAT-002", name: "Jane Smith", insurance: "AAR" },
  { id: "PAT-003", name: "David Kim", insurance: "Britam" },
];

export default function Billing() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null); // 🔥 Fixed Type

  const filteredPatients = patientsList.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {selectedPatient ? (
        <BillingDetails patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Billing - Select a Patient</h1>

          {/* Search Bar */}
          <div className="mb-4 flex items-center bg-white p-2 rounded shadow-md">
            <FaSearch className="text-gray-500 mx-2" />
            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none p-2"
            />
          </div>

          {/* Patient List */}
          <div className="bg-white rounded shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Patient ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Insurance</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t">
                    <td className="p-2 border">{patient.id}</td>
                    <td className="p-2 border">{patient.name}</td>
                    <td className="p-2 border">{patient.insurance}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
                      >
                        <FaEye className="mr-2" /> View Billing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
