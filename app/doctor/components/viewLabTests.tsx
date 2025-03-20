"use client";

import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";

interface LabTestResult {
  id: string;
  test_name: string;
  description: string;
  sample_type: string;
  is_active: boolean;
  patient_id: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  results: Record<string, { result: string; remarks: string; tested_by: string }>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function ViewLabTests() {
  const [labTests, setLabTests] = useState<LabTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Access the API endpoint from environment variables
  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch lab test results from the API
  useEffect(() => {
    const fetchLabTests = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Retrieve the JWT token from cookies
        const token = getCookie("Authorization");
        if (!token) {
          throw new Error("No JWT token found");
        }

        // Fetch data from the API
        const response = await fetch(`${API_URL}/technician`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the headers
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch lab test results");
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setLabTests(data.data);
        } else {
          throw new Error(data.message || "Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching lab test results:", error);
        setError("Failed to fetch lab test results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabTests();
  }, [API_URL]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Lab Test Results</h1>

      {/* Display error message if fetch fails */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && <div className="mb-4 text-blue-900">Loading lab test results...</div>}

      {/* Table to display lab test results */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-2">Patient Name</th>
              <th className="px-4 py-2">Results</th>
            </tr>
          </thead>
          <tbody>
            {labTests.map((labTest) => (
              <tr key={labTest.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">
                  {labTest.patient.first_name} {labTest.patient.last_name}
                </td>
                <td className="px-4 py-2">
                  <ul>
                    {Object.entries(labTest.results).map(([timestamp, result]) => (
                      <li key={timestamp} className="mb-2">
                        <div className="text-sm text-gray-700">
                          <strong>Result:</strong> {result.result}
                        </div>
                        <div className="text-sm text-gray-700">
                          <strong>Remarks:</strong> {result.remarks}
                        </div>
                        <div className="text-sm text-gray-700">
                          <strong>Tested By:</strong> {result.tested_by}
                        </div>
                        <div className="text-sm text-gray-500">
                          <strong>Date:</strong> {new Date(timestamp).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

