"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Cookies from "js-cookie"; // Import js-cookie
import EditTechnician from "./EditTechnicia";


interface Technician {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  role: string;
  licenseNumber?: string;
  password?: string;
  confirmPassword?: string;
}

function ViewTechnician() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
    console.log("Fetching technicians from:", `${API_URL}/admin/technician`);

    const token = Cookies.get("Authorization");

    fetch(`${API_URL}/admin/technician`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Response Status:", response.status);
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Failed to fetch technicians");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        if (data.data && Array.isArray(data.data)) {
          const mappedTechnicians = data.data.map((technician: any) => ({
            id: technician.id,
            full_name: technician.full_name,
            email: technician.email,
            phone_number: technician.phone_number,
            address: technician.address,
            role: technician.role,
          }));
          setTechnicians(mappedTechnicians);
          setFilteredTechnicians(mappedTechnicians);
        } else {
          console.error("Invalid data format: Expected an array of technicians");
          setTechnicians([]);
          setFilteredTechnicians([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching technicians:", error);
        setError(error.message || "Failed to fetch technicians. Please try again.");
        setTechnicians([]);
        setFilteredTechnicians([]);
      });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredTechnicians(
      technicians.filter((technician) =>
        technician.full_name.toLowerCase().includes(value)
      )
    );
  };

  const handleEdit = (id: string) => {
    const technician = technicians.find((t) => t.id === id);
    setSelectedTechnician(technician || null);
    setIsEditing(true);
    setIsViewing(false);
  };

  const handleDelete = (id: string) => {
    console.log("Delete technician with ID:", id);
    setTechnicians(technicians.filter((technician) => technician.id !== id));
    setFilteredTechnicians(filteredTechnicians.filter((technician) => technician.id !== id));
  };

  const viewDetails = (id: string) => {
    const technician = technicians.find((t) => t.id === id);
    setSelectedTechnician(technician || null);
    setIsViewing(true);
    setIsEditing(false);
  };

  const backToList = () => {
    setSelectedTechnician(null);
    setIsEditing(false);
    setIsViewing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {isEditing && selectedTechnician ? (
          <EditTechnician technician={selectedTechnician} onBack={backToList} />
        ) : isViewing && selectedTechnician ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-semibold mb-4">Technician Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedTechnician.full_name}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={selectedTechnician.email}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={selectedTechnician.phone_number}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700">Address</label>
                <textarea
                  value={selectedTechnician.address}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700">Role</label>
                <input
                  type="text"
                  value={selectedTechnician.role}
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
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">Technicians</h1>
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
                  {filteredTechnicians.length > 0 ? (
                    filteredTechnicians.map((technician) => (
                      <tr key={technician.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                        <td className="border px-4 py-2">{technician.full_name}</td>
                        <td className="border px-4 py-2">{technician.email}</td>
                        <td className="border px-4 py-2">{technician.phone_number}</td>
                        <td className="border px-4 py-2 text-center">
                          <button onClick={() => handleEdit(technician.id)} className="text-blue-500 mx-2"><FaEdit /></button>
                          <button onClick={() => handleDelete(technician.id)} className="text-red-500 mx-2"><FaTrash /></button>
                          <button onClick={() => viewDetails(technician.id)} className="text-green-500 mx-2"><FaEye /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="text-center text-gray-500 py-4">No technicians found.</td></tr>
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

export default ViewTechnician;
