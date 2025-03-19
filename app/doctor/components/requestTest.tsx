"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export default function RequestLabTest() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    test_name: "", // Matches API expected field
    description: "",
    cost: 75.5, // Default cost, can be changed
    duration: "1 day", // Default duration
    sample_type: "", // Matches API expected field
    is_active: true, // Default to true
    patient_id: "", // Matches API expected field
  });

  const [successMessage, setSuccessMessage] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      const token = getCookie("Authorization"); // Get JWT token
      if (!token) {
        console.error("JWT token not found.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/patient`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Include JWT in the headers
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
          setPatients(responseData.data);
        } else {
          console.error("Unexpected API response format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [API_URL]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, patient_id: e.target.value }); // Matches API field
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getCookie("Authorization");
    if (!token) {
      console.error("JWT token not found.");
      return;
    }

    console.log("Submitting request:", JSON.stringify(formData, null, 2)); // Log before sending

    try {
      const response = await fetch(`${API_URL}/technician`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccessMessage("Lab Test Request Sent Successfully!");
        setFormData({
          test_name: "",
          description: "",
          cost: 75.5,
          duration: "1 day",
          sample_type: "",
          is_active: true,
          patient_id: "",
        });
      } else {
        console.error("Failed to send request:", responseData);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🧪 Request Lab Test</h2>

      {successMessage && <p className="text-green-600 font-semibold">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Patient */}
        <div>
          <label className="block text-gray-700 font-semibold">Select Patient</label>
          <select
            name="patient_id"
            onChange={handlePatientChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500 text-gray-800"
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select>
        </div>

        {/* Auto-filled Patient ID */}
        <div>
          <label className="block text-gray-700 font-semibold">Patient ID</label>
          <input
            type="text"
            name="patient_id"
            value={formData.patient_id}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-800 cursor-not-allowed"
          />
        </div>

        {/* Test Name Dropdown */}
        <div>
          <label className="block text-gray-700 font-semibold">Test Name</label>
          <select
            name="test_name"
            value={formData.test_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500 text-gray-800"
            required
          >
            <option value="">Select a Test</option>
            <option value="Complete Blood Count">Complete Blood Count</option>
            <option value="Urine Analysis">Urine Analysis</option>
            <option value="X-Ray">X-Ray</option>
            <option value="MRI Scan">MRI Scan</option>
            <option value="CT Scan">CT Scan</option>
          </select>
        </div>

        {/* Sample Type Dropdown */}
        <div>
          <label className="block text-gray-700 font-semibold">Sample Type</label>
          <select
            name="sample_type"
            value={formData.sample_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500 text-gray-800"
            required
          >
            <option value="">Select Sample Type</option>
            <option value="Blood">Blood</option>
            <option value="Urine">Urine</option>
            <option value="Saliva">Saliva</option>
            <option value="Tissue">Tissue</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500 text-gray-800"
            placeholder="Enter additional details (if any)"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send to Technician
        </button>
      </form>
    </div>
  );
}
