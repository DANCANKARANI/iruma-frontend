"use client";

import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";

interface Patient {
  id: string;
  name: string;
  labTests: LabTest[];
}

interface LabTest {
  id: string;
  testName: string;
}

export default function UploadLabTests() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedLabTestId, setSelectedLabTestId] = useState("");
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = getCookie("Authorization");
        if (!token) throw new Error("No JWT token found");

        const response = await fetch(`${API_URL}/patient`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch patients");

        const data = await response.json();
        console.log("API Response:", data);

        const patientsArray = Array.isArray(data) ? data : data.patients || data.data || [];
        const transformedPatients = patientsArray.map((patient: Patient) => ({
          id: patient.id,
          name: patient.name,
        }));

        console.log("Transformed Patients:", transformedPatients);
        setPatients(transformedPatients);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        setMessage("Failed to fetch patients. Please try again.");
      }
    };

    fetchPatients();
  }, [API_URL]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatientId(e.target.value);
    setSelectedLabTestId("");
    setTestResults({});
  };

  const handleLabTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLabTestId(e.target.value);
  };

  const handleTestResultChange = (labTestId: string, value: string) => {
    setTestResults((prev) => ({ ...prev, [labTestId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedLabTestId || Object.keys(testResults).length === 0) {
      setMessage("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const token = getCookie("Authorization");
      if (!token) throw new Error("No JWT token found");

      const payload = {
        patientId: selectedPatientId,
        labTestId: selectedLabTestId,
        results: Object.entries(testResults).map(([labTestId, result]) => ({
          labTestId,
          result,
        })),
      };

      const response = await fetch(`${API_URL}/upload-lab-tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to upload lab test results.");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setMessage("Lab test results uploaded successfully!");
      setSelectedPatientId("");
      setSelectedLabTestId("");
      setTestResults({});
    } catch (error) {
      setMessage("An error occurred while uploading the lab test results.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId);
  const labTests = selectedPatient ? selectedPatient.labTests : [];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Upload Lab Tests</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Selection */}
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-800">
            Select Patient
          </label>
          <select
            id="patientId"
            value={selectedPatientId}
            onChange={handlePatientChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-400 text-gray-900 bg-white rounded-md shadow-sm 
              focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Select a patient
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id} className="text-gray-900">
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lab Test Selection */}
        {selectedPatientId && (
          <div>
            <label htmlFor="labTestId" className="block text-sm font-medium text-gray-800">
              Select Lab Test
            </label>
            <select
              id="labTestId"
              value={selectedLabTestId}
              onChange={handleLabTestChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 text-gray-900 bg-white rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Select a lab test
              </option>
              {labTests.map((labTest) => (
                <option key={labTest.id} value={labTest.id} className="text-gray-900">
                  {labTest.testName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Test Results Input */}
        {selectedLabTestId && (
          <div>
            <label className="block text-sm font-medium text-gray-800">Test Results</label>
            {labTests.map((labTest) => (
              <div key={labTest.id} className="mt-2">
                <label htmlFor={`result-${labTest.id}`} className="block text-sm text-gray-700">
                  {labTest.testName}
                </label>
                <input
                  type="text"
                  id={`result-${labTest.id}`}
                  value={testResults[labTest.id] || ""}
                  onChange={(e) => handleTestResultChange(labTest.id, e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-400 text-gray-900 bg-white rounded-md shadow-sm 
                    focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {isSubmitting ? "Uploading..." : "Upload Lab Test Results"}
        </button>

        {/* Message */}
        {message && <div className="mt-4 p-3 rounded-md text-sm bg-gray-100 text-gray-800">{message}</div>}
      </form>
    </div>
  );
}
