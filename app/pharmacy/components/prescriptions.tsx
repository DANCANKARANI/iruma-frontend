"use client";

import { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface Doctor {
  id: string;
  full_name: string;
}

interface Prescription {
  id: string;
  medicine_name: string;
  patient_id: string;
  patient: Patient;
  doctor_id: string;
  doctor: Doctor;
  diagnosis: string;
  dosage: string;
  instructions: string;
  status: "pending" | "Fulfilled"; // Note the exact case from your backend
  created_at: string;
  is_given?: boolean;
}

export default function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getJwtToken = useCallback(() => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("Authorization="))
      ?.split("=")[1];
  }, []);

  const fetchPrescriptions = useCallback(async () => {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
      setError("Authentication required. Please login.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/prescription?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
          cache: 'no-store'
        }
      );

      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      
      const data = await response.json();
      setPrescriptions(data.data.map((prescription: Prescription) => ({
        ...prescription,
        is_given: false
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  }, [getJwtToken, searchQuery]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const toggleMedicineGiven = (prescriptionId: string) => {
    setPrescriptions(prev => prev.map(prescription => 
      prescription.id === prescriptionId 
        ? { ...prescription, is_given: !prescription.is_given } 
        : prescription
    ));
  };

  const fulfillPrescription = async (id: string) => {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
      setError("Authentication required. Please login.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/prescription/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ status: "Fulfilled" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update prescription status");
      
      setPrescriptions(prev =>
        prev.map(prescription =>
          prescription.id === id ? { ...prescription, status: "Fulfilled" } : prescription
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const printPrescription = (prescription: Prescription) => {
    const doc = new jsPDF();
    doc.text(`Prescription for ${prescription.patient.first_name} ${prescription.patient.last_name}`, 20, 20);
    doc.text(`Diagnosis: ${prescription.diagnosis}`, 20, 30);
    doc.text(`Medication: ${prescription.medicine_name}`, 20, 40);
    doc.text(`Dosage: ${prescription.dosage}`, 20, 50);
    doc.text(`Instructions: ${prescription.instructions}`, 20, 60);
    doc.save(`prescription-${prescription.id}.pdf`);
  };

  // Optimized filtering - now done client-side
  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesStatus = filterStatus === "All" || 
                         (filterStatus === "Pending" && p.status === "pending") || 
                         (filterStatus === "Fulfilled" && p.status === "Fulfilled");
    
    const matchesSearch = `${p.patient.first_name} ${p.patient.last_name} ${p.diagnosis} ${p.medicine_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="p-6">Loading prescriptions...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Pharmacy Prescriptions</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search patients, diagnosis or medicine..."
          className="p-2 border border-gray-300 rounded flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select
          className="p-2 border border-gray-300 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Fulfilled">Fulfilled</option>
        </select>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <div className="text-gray-600">No prescriptions found.</div>
      ) : (
        <div className="space-y-6">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {prescription.patient.first_name} {prescription.patient.last_name}
                  </h3>
                  <p className="text-gray-600">Diagnosis: {prescription.diagnosis}</p>
                  <p className="text-gray-600">Doctor: {prescription.doctor.full_name}</p>
                  <p className="text-gray-600">
                    Date: {new Date(prescription.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  prescription.status === "Fulfilled" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {prescription.status === "pending" ? "Pending" : "Fulfilled"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Medication Details</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Name:</span> {prescription.medicine_name}</p>
                    <p><span className="font-medium">Dosage:</span> {prescription.dosage}</p>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Given:</span>
                      <input
                        type="checkbox"
                        checked={prescription.is_given || false}
                        onChange={() => toggleMedicineGiven(prescription.id)}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Instructions</h4>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {prescription.instructions}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {prescription.status === "pending" && (
                  <button
                    onClick={() => fulfillPrescription(prescription.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mark as Fulfilled
                  </button>
                )}
                <button
                  onClick={() => printPrescription(prescription)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Print PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}