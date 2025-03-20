"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export default function ReferPatient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [formData, setFormData] = useState({
    referred_to: "",
    reason: "",
    diagnosis: "",
    test_name: "",
    test_result: "",
    status: "Pending",
  });

  // API Base URL from environment variables
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Retrieve token from cookies
  const token = getCookie("Authorization"); // Ensure the correct cookie name

  useEffect(() => {
    if (!token) {
      console.error("JWT token not found in cookies.");
      return;
    }

    fetch(`${apiEndpoint}/patient`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setPatients(data.data || []))
      .catch((err) => console.error("Error fetching patients:", err));
  }, [token, apiEndpoint]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Please select a patient!");
      return;
    }

    if (!token) {
      alert("Authentication error: No token found.");
      return;
    }

    try {
      const response = await fetch(`${apiEndpoint}/patient/${selectedPatient}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          patient_id: selectedPatient, // Send selected patient ID
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit referral");
      }

      alert("Referral submitted successfully!");
      console.log("Response:", data);
    } catch (err) {
      console.error("Error submitting referral:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Refer a Patient</h2>

      {/* Patient Dropdown */}
      <label className="block mb-2">Select Patient:</label>
      <select
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">-- Select a Patient --</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.first_name} {patient.last_name}
          </option>
        ))}
      </select>

      {/* Referral Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="referred_to"
          placeholder="Referred To"
          value={formData.referred_to}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="reason"
          placeholder="Reason for Referral"
          value={formData.reason}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* New Fields for Lab Results */}
        <input
          type="text"
          name="test_name"
          placeholder="Test Name"
          value={formData.test_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="test_result"
          placeholder="Test Result"
          value={formData.test_result}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit Referral
        </button>
      </form>
    </div>
  );
}
