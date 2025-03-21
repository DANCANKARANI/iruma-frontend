"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

// Define the type for a patient
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export default function AddClinicBooking() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [reasons, setReasons] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch patients from the backend
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(""); // Clear previous errors

      try {
        const response = await fetch(`${API_URL}/patient`, {
          headers: {
            Authorization: `Bearer ${getCookie("Authorization")}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch patients");
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

  // Convert date to ISO 8601 format with "Z" suffix
  const formatDateToISO = (dateString: string) => {
    const dateObj = new Date(dateString);
    return dateObj.toISOString();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient || !reasons || !date) {
      setError("Please fill out all fields!");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    const token = getCookie("Authorization");
    const formattedDate = formatDateToISO(date); // Convert date

    try {
      const response = await fetch(`${API_URL}/reception/${selectedPatient}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reasons, date: formattedDate }), // Ensure correct format
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Invalid request body");
      }

      // Success: Reset form fields
      setSelectedPatient("");
      setReasons("");
      setDate("");
      setError("Clinic appointment booked successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid request body");
      console.error("Error booking appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Book Clinic Appointment</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
        {/* Patient Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Patient</label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select a Patient --</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Appointment Date</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Reasons Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Reasons for Visit</label>
          <textarea
            value={reasons}
            onChange={(e) => setReasons(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Book Appointment"}
        </button>

        {/* Error Message */}
        {error && (
          <p className={`mt-4 text-${error.includes("successfully") ? "green" : "red"}-600`}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
