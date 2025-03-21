"use client";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import EditPharmacist from "./EditPharmacist"; // Import the edit component

interface Pharmacist {
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

function ViewPharmacist() {
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState<Pharmacist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [isViewing, setIsViewing] = useState(false); // Track viewing state

  useEffect(() => {
    // Fetch data from your API endpoint
    const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
    console.log(API_URL);
    fetch(`${API_URL}/admin/pharmacist`)
      .then((response) => response.json())
      .then((data) => {
        // Map the JSON data to the Pharmacist interface
        const mappedPharmacists: Pharmacist[] = data.data.map((pharmacist: Pharmacist) => ({
          id: pharmacist.id,
          full_name: pharmacist.full_name,
          email: pharmacist.email,
          phone_number: pharmacist.phone_number,
          address: pharmacist.address,
          role: pharmacist.role,
        }));
        
        setPharmacists(mappedPharmacists);
        setFilteredPharmacists(mappedPharmacists);
      })
      .catch((error) => console.error("Error fetching pharmacists:", error));
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredPharmacists(
      pharmacists.filter((pharmacist) =>
        pharmacist.full_name.toLowerCase().includes(value)
      )
    );
  };

  const handleEdit = (id: string) => {
    const pharmacist = pharmacists.find((p) => p.id === id);
    setSelectedPharmacist(pharmacist || null);
    setIsEditing(true); // Switch to edit mode
    setIsViewing(false); // Exit view mode
  };

  const handleDelete = (id: string) => {
    console.log("Delete pharmacist with ID:", id);
    setPharmacists(pharmacists.filter((pharmacist) => pharmacist.id !== id));
    setFilteredPharmacists(filteredPharmacists.filter((pharmacist) => pharmacist.id !== id));
  };

  const viewDetails = (id: string) => {
    const pharmacist = pharmacists.find((p) => p.id === id);
    setSelectedPharmacist(pharmacist || null); // Set the selected pharmacist
    setIsViewing(true); // Switch to view mode
    setIsEditing(false); // Exit edit mode
  };

  const backToList = () => {
    setSelectedPharmacist(null);
    setIsEditing(false); // Exit edit mode
    setIsViewing(false); // Exit view mode
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto">
        {isEditing && selectedPharmacist ? (
          // Render the edit component
          <EditPharmacist pharmacist={selectedPharmacist} onBack={backToList} />
        ) : isViewing && selectedPharmacist ? (
          // Render the view details section
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-semibold mb-4">Pharmacist Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedPharmacist.full_name}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={selectedPharmacist.email}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={selectedPharmacist.phone_number}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700">Address</label>
                <textarea
                  value={selectedPharmacist.address}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Role</label>
                <input
                  type="text"
                  value={selectedPharmacist.role}
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
          // Render the list of pharmacists
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">Pharmacists</h1>
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
                  {filteredPharmacists.length > 0 ? (
                    filteredPharmacists.map((pharmacist) => (
                      <tr
                        key={pharmacist.id}
                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                      >
                        <td className="border px-4 py-2">{pharmacist.full_name}</td>
                        <td className="border px-4 py-2">{pharmacist.email}</td>
                        <td className="border px-4 py-2">{pharmacist.phone_number}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => handleEdit(pharmacist.id)}
                            title="Edit"
                            className="text-blue-500 hover:text-blue-700 mx-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(pharmacist.id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-700 mx-2"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => viewDetails(pharmacist.id)}
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
                        No pharmacists found.
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

export default ViewPharmacist;