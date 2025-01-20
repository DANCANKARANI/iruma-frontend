"use client";

import { useEffect, useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

export default function ViewDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Selected doctor details
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch("https://678b5db71a6b89b27a2a3042.mockapi.io/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const filteredDoctors = searchQuery
    ? doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : doctors;

  const handleView = (doctor: Doctor) => {
    setSelectedDoctor(doctor); // Set selected doctor to show details
  };

  const handleCloseDetails = () => {
    setSelectedDoctor(null); // Close the details view
  };

  const handleEdit = (id: string) => {
    alert(`Edit functionality for doctor ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    alert(`Delete functionality for doctor ID: ${id}`);
  };

  return (
    <div className="p-4 h-full overflow-hidden flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for doctors..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display loading state */}
      {isLoading && <p>Loading doctors...</p>}

      {/* Display error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Doctors Table */}
      {!isLoading && !error && (
        <div className="flex-grow overflow-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Specialty</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor, index) => (
                <tr key={doctor.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{doctor.name}</td>
                  <td className="border border-gray-300 p-2">{doctor.specialty}</td>
                  <td className="border border-gray-300 p-2">{doctor.email}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleView(doctor)}
                    >
                      View
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEdit(doctor.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(doctor.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Doctor Details Component */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Doctor Details</h2>
            <p className="mb-2">
              <strong>Name:</strong> {selectedDoctor.name}
            </p>
            <p className="mb-2">
              <strong>Specialty:</strong> {selectedDoctor.specialty}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {selectedDoctor.email}
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded"
                onClick={handleCloseDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
