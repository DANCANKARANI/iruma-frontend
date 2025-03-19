"use client";

import { useState } from "react";

export default function LabTestRequests() {
  // Sample data for lab test requests
  const [labTestRequests, setLabTestRequests] = useState([
    {
      id: 1,
      patientName: "John Doe",
      testType: "Blood Test",
      requestedDate: "2023-10-01",
      status: "Pending",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      testType: "Urine Test",
      requestedDate: "2023-10-02",
      status: "Completed",
    },
    {
      id: 3,
      patientName: "Alice Johnson",
      testType: "X-Ray",
      requestedDate: "2023-10-03",
      status: "Pending",
    },
  ]);

  // Function to mark a lab test request as completed
  const markAsCompleted = (id: number) => {
    setLabTestRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: "Completed" } : request
      )
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Lab Test Requests</h1>

      {/* Table to display lab test requests */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-2">Patient Name</th>
              <th className="px-4 py-2">Test Type</th>
              <th className="px-4 py-2">Requested Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labTestRequests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{request.patientName}</td>
                <td className="px-4 py-2">{request.testType}</td>
                <td className="px-4 py-2">{request.requestedDate}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      request.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {request.status === "Pending" && (
                    <button
                      onClick={() => markAsCompleted(request.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}