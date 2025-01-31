"use client";

import { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// Define the type for a patient
interface Patient {
  id: string;
  name: string;
  insurance: string;
}

// Define the initial list of patients
const initialPatients: Patient[] = [
  { id: "PAT-001", name: "John Doe", insurance: "NHIF" },
  { id: "PAT-002", name: "Jane Smith", insurance: "AAR" },
  { id: "PAT-003", name: "David Kim", insurance: "Britam" },
];

export const Patients = () => {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  // Filter the patients list based on the search term
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle adding a new patient
  const handleAddPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
    setIsAddModalOpen(false);
  };

  // Handle editing a patient
  const handleEditPatient = (updatedPatient: Patient) => {
    setPatients(
      patients.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
    setIsEditModalOpen(false);
    setSelectedPatient(updatedPatient);
  };

  // Handle deleting a patient
  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((patient) => patient.id !== id));
    if (selectedPatient?.id === id) {
      setSelectedPatient(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {selectedPatient ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
          <div className="bg-white p-4 rounded shadow-md mb-4">
            <p><strong>Patient ID:</strong> {selectedPatient.id}</p>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Insurance:</strong> {selectedPatient.insurance}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setCurrentPatient(selectedPatient);
                  setIsEditModalOpen(true);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDeletePatient(selectedPatient.id)}
                className="px-3 py-1 bg-red-600 text-white rounded flex items-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-3 py-1 bg-gray-600 text-white rounded"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
          {/* Search Bar and Add Button */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center bg-white p-2 rounded shadow-md w-1/2">
              <FaSearch className="text-gray-500 mx-2" />
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none p-2"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Patient
            </button>
          </div>

          {/* Patient List */}
          <div className="bg-white rounded shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Patient ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Insurance</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t">
                    <td className="p-2 border">{patient.id}</td>
                    <td className="p-2 border">{patient.name}</td>
                    <td className="p-2 border">{patient.insurance}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
                      >
                        <FaEdit className="mr-2" /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <PatientModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPatient}
        />
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && currentPatient && (
        <PatientModal
          patient={currentPatient}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditPatient}
        />
      )}
    </div>
  );
};

// Patient Modal Component
interface PatientModalProps {
  patient?: Patient;
  onClose: () => void;
  onSubmit: (patient: Patient) => void;
}

const PatientModal = ({ patient, onClose, onSubmit }: PatientModalProps) => {
  const [name, setName] = useState(patient?.name || "");
  const [insurance, setInsurance] = useState(patient?.insurance || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !insurance) {
      alert("Please fill in all fields.");
      return;
    }
    onSubmit({
      id: patient?.id || `PAT-${Math.floor(Math.random() * 1000)}`,
      name,
      insurance,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-xl font-bold mb-4">
          {patient ? "Edit Patient" : "Add Patient"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Insurance</label>
            <input
              type="text"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {patient ? "Save Changes" : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};