"use client";

import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";

interface LabTestRequest {
  id: string;
  test_name: string;
  description: string;
  sample_type: string;
  patient_id: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
  is_active: boolean; // Use is_active field
  results?: Record<string, { result: string; remarks: string; tested_by: string }>; // Optional results field
}

interface LabTestResult {
  lab_test_id: string;
  result: string;
  remarks: string;
  tested_by: string;
}

export default function LabTestRequests() {
  const [labTestRequests, setLabTestRequests] = useState<LabTestRequest[]>([]);
  const [selectedLabTest, setSelectedLabTest] = useState<LabTestRequest | null>(null);
  const [result, setResult] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch lab test requests from the API
  useEffect(() => {
    const fetchLabTestRequests = async () => {
      setIsLoading(true);
      setMessage("");

      try {
        const token = getCookie("Authorization"); // Get JWT token
        if (!token) throw new Error("No JWT token found");

        const response = await fetch(`${API_URL}/technician`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT token to headers
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch lab test requests: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (data.success && Array.isArray(data.data)) {
          setLabTestRequests(data.data);
        } else {
          throw new Error(data.message || "Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching lab test requests:", error);
        setMessage("Failed to fetch lab test requests. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabTestRequests();
  }, [API_URL]);

  // Open modal for uploading results
  const openModal = (labTest: LabTestRequest) => {
    setSelectedLabTest(labTest);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLabTest(null);
    setResult("");
    setRemarks("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLabTest || !result || !remarks) {
      setMessage("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const token = getCookie("Authorization"); // Get JWT token
      if (!token) throw new Error("No JWT token found");

      const payload: LabTestResult = {
        lab_test_id: selectedLabTest.id,
        result,
        remarks,
        tested_by: "809689af-bdbf-440f-9c28-7edca2183552", // Replace with actual technician ID
      };

      const response = await fetch(`${API_URL}/technician/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add JWT token to headers
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to upload lab test results: ${response.statusText}`);
      }

      // Update the is_active status of the lab test request
      setLabTestRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedLabTest.id ? { ...request, is_active: false } : request
        )
      );

      setMessage("Lab test results uploaded successfully!");
      closeModal();
    } catch (error) {
      setMessage("An error occurred while uploading the lab test results.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Lab Test Requests</h1>

      {/* Display error message if fetch fails */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && <div className="mb-4 text-blue-900">Loading lab test requests...</div>}

      {/* Table to display lab test requests */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-2">Patient Name</th>
              <th className="px-4 py-2">Test Type</th>
              <th className="px-4 py-2">Sample Type</th>
              <th className="px-4 py-2">Requested Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labTestRequests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">
                  {request.patient.first_name} {request.patient.last_name}
                </td>
                <td className="px-4 py-2">{request.test_name}</td>
                <td className="px-4 py-2">{request.sample_type}</td>
                <td className="px-4 py-2">{new Date(request.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(request)}
                    disabled={!request.is_active} // Disable the button if is_active is false
                    className={`px-3 py-1 rounded-md transition duration-200 ${
                      !request.is_active
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {!request.is_active ? "Completed" : "Complete Result"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for uploading results */}
      {isModalOpen && selectedLabTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Upload Lab Test Results</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Test Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Test Name</label>
                <input
                  type="text"
                  value={selectedLabTest.test_name}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Result */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Result</label>
                <input
                  type="text"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>

            {/* Message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-md text-sm ${
                  message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}