"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Cookies from "js-cookie"; // Import js-cookie
import EditReceptionist from "./EditReceptionsist";

interface Receptionist {
  id: string; // Updated to string to match UUID
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  role: string;
  licenseNumber?: string; // Optional field (not in JSON)
  password?: string; // Optional field (not in JSON)
  confirmPassword?: string; // Optional field (not in JSON)
}

function ViewReceptionist() {
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [filteredReceptionists, setFilteredReceptionists] = useState<Receptionist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceptionist, setSelectedReceptionist] = useState<Receptionist | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [isViewing, setIsViewing] = useState(false); // Track viewing state
  const [error, setError] = useState<string | null>(null); // State to store error messages

  useEffect(() => {
    // Fetch data from your API endpoint
    const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
    console.log("Fetching receptionists from:", `${API_URL}/admin/reception`);

    // Retrieve the token from cookies
    const token = Cookies.get("Authorization"); // Replace "token" with your cookie name

    fetch(`${API_URL}/admin/reception`, {
      headers: {
        Authorization: `Bearer ${token}`, // Use the token from cookies
      },
    })
      .then((response) => {
        console.log("Response Status:", response.status);
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Failed to fetch receptionists");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data); // Log the API response

        // Check if data.data exists and is an array
        if (data.data && Array.isArray(data.data)) {
          const mappedReceptionists = data.data.map((receptionist: any) => ({
            id: receptionist.id,
            full_name: receptionist.full_name,
            email: receptionist.email,
            phone_number: receptionist.phone_number,
            address: receptionist.address,
            role: receptionist.role,
          }));
          setReceptionists(mappedReceptionists);
          setFilteredReceptionists(mappedReceptionists);
        } else {
          console.error("Invalid data format: Expected an array of receptionists");
          setReceptionists([]); // Fallback to an empty array
          setFilteredReceptionists([]); // Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching receptionists:", error);
        setError(error.message || "Failed to fetch receptionists. Please try again.");
        setReceptionists([]); // Fallback to an empty array
        setFilteredReceptionists([]); // Fallback to an empty array
      });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredReceptionists(
      receptionists.filter((receptionist) =>
        receptionist.full_name.toLowerCase().includes(value)
      )
    );
  };

  const handleEdit = (id: string) => {
    const receptionist = receptionists.find((r) => r.id === id);
    setSelectedReceptionist(receptionist || null);
    setIsEditing(true); // Switch to edit mode
    setIsViewing(false); // Exit view mode
  };

  const handleDelete = (id: string) => {
    console.log("Delete receptionist with ID:", id);
    setReceptionists(receptionists.filter((receptionist) => receptionist.id !== id));
    setFilteredReceptionists(filteredReceptionists.filter((receptionist) => receptionist.id !== id));
  };

  const viewDetails = (id: string) => {
    const receptionist = receptionists.find((r) => r.id === id);
    setSelectedReceptionist(receptionist || null); // Set the selected receptionist
    setIsViewing(true); // Switch to view mode
    setIsEditing(false); // Exit edit mode
  };

  const backToList = () => {
    setSelectedReceptionist(null);
    setIsEditing(false); // Exit edit mode
    setIsViewing(false); // Exit view mode
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {isEditing && selectedReceptionist ? (
          // Render the edit component
          <EditReceptionist receptionist={selectedReceptionist} onBack={backToList} />
        ) : isViewing && selectedReceptionist ? (
          // Render the view details section
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-semibold mb-4">Receptionist Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedReceptionist.full_name}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={selectedReceptionist.email}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={selectedReceptionist.phone_number}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700">Address</label>
                <textarea
                  value={selectedReceptionist.address}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Role</label>
                <input
                  type="text"
                  value={selectedReceptionist.role}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>
            <button
              onClick={backToList}
              className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
        ) : (
          // Render the list of receptionists
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">Receptionists</h1>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-auto max-h-[70vh]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 sticky top-0 z-10">
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Email</th>
                    <th className="border px-4 py-2 text-left">Phone</th>
                    <th className="border px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceptionists.length > 0 ? (
                    filteredReceptionists.map((receptionist) => (
                      <tr
                        key={receptionist.id}
                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                      >
                        <td className="border px-4 py-2">{receptionist.full_name}</td>
                        <td className="border px-4 py-2">{receptionist.email}</td>
                        <td className="border px-4 py-2">{receptionist.phone_number}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => handleEdit(receptionist.id)}
                            title="Edit"
                            className="text-blue-500 hover:text-blue-700 mx-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(receptionist.id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-700 mx-2"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => viewDetails(receptionist.id)}
                            title="View Details"
                            className="text-green-500 hover:text-green-700 mx-2"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-4">
                        No receptionists found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewReceptionist;