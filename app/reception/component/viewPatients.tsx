"use client";
import { useState } from "react";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  bloodGroup: string;
}

export default function ViewPatients() {
  // Sample patient data
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, firstName: "John", lastName: "Doe", gender: "Male", dob: "1990-05-10", phone: "0712345678", email: "john@example.com", bloodGroup: "O+" },
    { id: 2, firstName: "Jane", lastName: "Smith", gender: "Female", dob: "1995-08-20", phone: "0723456789", email: "jane@example.com", bloodGroup: "A-" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle "View" button click
  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditMode(false);
  };

  // Handle "Edit" button click
  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditMode(true);
  };

  // Handle "Delete" button click
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
    if (confirmDelete) {
      setPatients((prevPatients) => prevPatients.filter((p) => p.id !== id));
    }
  };

  // Handle input changes in edit mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPatient) {
      setSelectedPatient({ ...selectedPatient, [e.target.name]: e.target.value });
    }
  };

  // Handle save after editing
  const handleSave = () => {
    setPatients((prevPatients) =>
      prevPatients.map((p) => (p.id === selectedPatient?.id ? selectedPatient : p))
    );
    setSelectedPatient(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-4">Patients List</h2>

        {/* Search Bar */}
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                <th className="p-2 border border-gray-300 dark:border-gray-600">#</th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">Name</th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">Gender</th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">DOB</th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">Phone</th>
                <th className="p-2 border border-gray-300 dark:border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="p-2 border border-gray-300 dark:border-gray-600">{index + 1}</td>
                    <td className="p-2 border border-gray-300 dark:border-gray-600">{patient.firstName} {patient.lastName}</td>
                    <td className="p-2 border border-gray-300 dark:border-gray-600">{patient.gender}</td>
                    <td className="p-2 border border-gray-300 dark:border-gray-600">{patient.dob}</td>
                    <td className="p-2 border border-gray-300 dark:border-gray-600">{patient.phone}</td>
                    <td className="p-2 border border-gray-300 dark:border-gray-600">
                      <button onClick={() => handleView(patient)} className="text-blue-600 hover:underline mr-2">View</button>
                      <button onClick={() => handleEdit(patient)} className="text-green-600 hover:underline mr-2">Edit</button>
                      <button onClick={() => handleDelete(patient.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500 dark:text-gray-400">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Edit Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {isEditMode ? "Edit Patient" : "Patient Details"}
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Full Name</label>
              {isEditMode ? (
                <input
                  type="text"
                  name="firstName"
                  value={selectedPatient.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{selectedPatient.firstName} {selectedPatient.lastName}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Phone</label>
              {isEditMode ? (
                <input
                  type="text"
                  name="phone"
                  value={selectedPatient.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{selectedPatient.phone}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              {isEditMode ? (
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              ) : (
                <button onClick={() => setSelectedPatient(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
