"use client";
import { useEffect, useState } from "react";
import DoctorDetailsEdit from "./DoctorDetailsEdit";
import DeleteConfirmation from "./DeleteConfirmation";
import Cookies from "js-cookie";

interface Doctor {
  id: string;
  full_name: string;
  email: string;
  username: string;
  phone_number: string;
  role: string;
  date_of_birth: string;
  address: string;
  gender: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function ViewDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // Fetch JWT token from cookies
  const token = Cookies.get("Authorization"); // Replace "jwtToken" with your cookie name

  useEffect(() => {
    async function fetchDoctors() {
      if (!token) {
        setError("No JWT token found in cookies");
        setIsLoading(false);
        return;
      }
      console.log(token)
      try {
        const response = await fetch(

          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/doctor/all`,
          
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        console.log("API Response:", data); // Log the API response

        // Extract the "data" array from the response
        if (data.data && Array.isArray(data.data)) {
          setDoctors(data.data);
        } else {
          setError("Invalid data format: Expected an array of doctors");
          setDoctors([]); // Fallback to an empty array
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setDoctors([]); // Fallback to an empty array
      } finally {
        setIsLoading(false);
      }
    }

    fetchDoctors();
  }, [token]);

  const filteredDoctors = searchQuery
    ? doctors.filter(
        (doctor) =>
          doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.phone_number.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : doctors;

  const handleView = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditing(false);
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditing(true);
  };

  const handleSave = async (updatedDoctor: Doctor) => {
    if (!token) {
      setError("No JWT token found in cookies");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/doctor/${updatedDoctor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedDoctor),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save doctor details");
      }
      const updatedDoctorData = await response.json();
      setDoctors((prev) =>
        prev.map((doctor) => (doctor.id === updatedDoctorData.id ? updatedDoctorData : doctor))
      );
      setSelectedDoctor(null);
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }    
  };

  const handleDelete = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!doctorToDelete || !token) {
      setError("No JWT token found in cookies");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/doctor/${doctorToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      setDoctors((prev) => prev.filter((doctor) => doctor.id !== doctorToDelete.id));
      setDoctorToDelete(null);
      setShowDeleteConfirm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
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

      {/* Loading State */}
      {isLoading && <p>Loading doctors...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Doctors Table */}
      {!isLoading && !error && (
        <div className="flex-grow overflow-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">Full Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Phone Number</th>
                <th className="border border-gray-300 p-2">Role</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor, index) => (
                <tr key={doctor.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{doctor.full_name}</td>
                  <td className="border border-gray-300 p-2">{doctor.email}</td>
                  <td className="border border-gray-300 p-2">{doctor.phone_number}</td>
                  <td className="border border-gray-300 p-2">{doctor.role}</td>
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
                  <td colSpan={6} className="text-center p-4">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && doctorToDelete && (
        <DeleteConfirmation
          doctorName={doctorToDelete.full_name}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Doctor Details/Edit Dialog */}
      {selectedDoctor && (
        <DoctorDetailsEdit
          doctor={selectedDoctor}
          isEditing={isEditing}
          onSave={handleSave}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}