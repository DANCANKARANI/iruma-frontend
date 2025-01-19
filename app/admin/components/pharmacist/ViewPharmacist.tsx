"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import EditPharmacist from "./EditPharmacist"; // Import the new component

interface Pharmacist {
  name: any;
  id: number;
  email: string;
  phone: string;
  address: string;
  qualifications: string;
  licenseNumber: string;
  password: string;
  confirmPassword: string;
}

function ViewPharmacist() {
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState<Pharmacist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  useEffect(() => {
    fetch("https://678b5db71a6b89b27a2a3042.mockapi.io/pharmacist")
      .then((response) => response.json())
      .then((data) => {
        setPharmacists(data);
        setFilteredPharmacists(data);
      })
      .catch((error) => console.error("Error fetching pharmacists:", error));
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredPharmacists(
      pharmacists.filter((pharmacist) =>
        pharmacist.name.toLowerCase().includes(value)
      )
    );
  };

  const handleEdit = (id: number) => {
    const pharmacist = pharmacists.find((p) => p.id === id);
    setSelectedPharmacist(pharmacist || null);
    setIsEditing(true); // Switch to edit mode
  };

  const handleDelete = (id: number) => {
    console.log("Delete pharmacist with ID:", id);
    setPharmacists(pharmacists.filter((pharmacist) => pharmacist.id !== id));
    setFilteredPharmacists(filteredPharmacists.filter((pharmacist) => pharmacist.id !== id));
  };

  const viewDetails = (id: number) => {
    const pharmacist = pharmacists.find((p) => p.id === id);
    setSelectedPharmacist(pharmacist || null); // Set the selected pharmacist
  };

  const backToList = () => {
    setSelectedPharmacist(null);
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto">
        {isEditing && selectedPharmacist ? (
          // Render the edit component
          <EditPharmacist pharmacist={selectedPharmacist} onBack={backToList} />
        ) : selectedPharmacist ? (
          // Render the selected pharmacist's details
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-semibold mb-4">Pharmacist Details</h2>
            <p><strong>Name:</strong> {selectedPharmacist.name}</p>
            <p><strong>License No:</strong> {selectedPharmacist.licenseNumber}</p>
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
                    <th className="border px-4 py-2 text-left">License No</th>
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
                        <td className="border px-4 py-2">{pharmacist.name}</td>
                        <td className="border px-4 py-2">
                          {pharmacist.licenseNumber}
                        </td>
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
                      <td colSpan={3} className="text-center text-gray-500 py-4">
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
