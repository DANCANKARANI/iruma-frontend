"use client";

import { useEffect, useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
}

export default function ViewDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Selected doctor for viewing/editing
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation dialog
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null); // Doctor to delete

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
    setSelectedDoctor(doctor);
    setIsEditing(false); // Ensure it's view-only
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditing(true); // Open editing mode
  };

  const handleSave = async (updatedDoctor: Doctor) => {
    try {
      const response = await fetch(`https://678b5db71a6b89b27a2a3042.mockapi.io/doctors/${updatedDoctor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDoctor),
      });
      if (!response.ok) {
        throw new Error("Failed to save doctor details");
      }
      const updatedDoctorData = await response.json();
      setDoctors((prev) =>
        prev.map((doctor) => (doctor.id === updatedDoctorData.id ? updatedDoctorData : doctor))
      );
      setSelectedDoctor(null); // Close the edit view
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteConfirm(true); // Show confirmation dialog
  };

  const confirmDelete = async () => {
    if (!doctorToDelete) return;

    try {
      const response = await fetch(
        `https://678b5db71a6b89b27a2a3042.mockapi.io/doctors/${doctorToDelete.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      setDoctors((prev) => prev.filter((doctor) => doctor.id !== doctorToDelete.id));
      setDoctorToDelete(null); // Reset the doctor to delete
      setShowDeleteConfirm(false); // Close the confirmation dialog
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCloseDetails = () => {
    setSelectedDoctor(null);
    setIsEditing(false);
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
                      onClick={() => handleEdit(doctor)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(doctor)}
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete Dr. {doctorToDelete?.name}?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Details/Edit Component */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            {isEditing ? (
              <>
                <h2 className="text-xl font-bold mb-4">Edit Doctor</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave(selectedDoctor);
                  }}
                >
                  <input
                    type="text"
                    className="w-full p-2 mb-2 border rounded"
                    value={selectedDoctor.name}
                    onChange={(e) =>
                      setSelectedDoctor({ ...selectedDoctor, name: e.target.value })
                    }
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                      onClick={handleCloseDetails}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Doctor Details</h2>
                <p className="mb-2">
                  <strong>Name:</strong> {selectedDoctor.name}
                </p>
                <p className="mb-2">
                  <strong>Specialty:</strong> {selectedDoctor.specialty}
                </p>
                <p className="mb-2">
                  <strong>Phone:</strong> {selectedDoctor.phone}
                </p>
                <p className="mb-2">
                  <strong>Address:</strong> {selectedDoctor.address}
                </p>
                <p className="mb-2">
                  <strong>License Number:</strong> {selectedDoctor.licenseNumber}
                </p>
                <p className="mb-4">
                  <strong>Email:</strong> {selectedDoctor.email}
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                    onClick={handleCloseDetails}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
