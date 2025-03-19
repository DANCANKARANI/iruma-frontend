"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import BillingDetails from "./billingDetails";


// Define the Patient interface
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
}

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Billing() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patients from the backend
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/patient?page=${page}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch patients");
        }

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid data format: Expected an array in 'data' property");
        }

        setPatients((prev) => (page === 1 ? result.data : [...prev, ...result.data]));
        setHasMore(result.data.length > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch patients");
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [page]);

  // Filter patients based on search input
  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Load more patients
  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {selectedPatient ? (
        <BillingDetails
          patient={{
            id: selectedPatient.id,
            name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
            insurance: "NHIF", // Replace with actual insurance data if available
          }}
          onBack={() => setSelectedPatient(null)}
        />
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
                  <th className="p-2 border">Phone Number</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t">
                    <td className="p-2 border">{patient.patient_number}</td>
                    <td className="p-2 border">{`${patient.first_name} ${patient.last_name}`}</td>
                    <td className="p-2 border">{patient.phone_number}</td>
                    <td className="p-2 border">{patient.email}</td>
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

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </>
      )}
    </div>
  );
}