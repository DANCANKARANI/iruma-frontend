"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import { getCookie } from "cookies-next";

// Define the type for a patient
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  patient_number: string;
  phone_number: string;
  email: string;
  address: string;
  blood_group: string;
  medical_history: string;
  is_emergency: boolean;
  emergency_contact: string;
  triage_level: string;
  initial_vitals: string;
  emergency_notes: string;
}

export const Patients = () => {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
 


  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Fetch patients from the backend
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/patient?page=${page}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch patients");
        }

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid data format: Expected an array in 'data' property");
        }

        setPatients((prev) => (page === 1 ? result.data : [...prev, ...result.data]));
        setHasMore(result.data.length > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch patients");
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [API_URL, page]);

  // Load more patients
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Filter the patients list based on the search term
  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

 

  // Handle adding a new patient
  const handleAddPatient = async (newPatient: Patient) => {
    setLoading(true);
    newPatient.is_emergency = true; // Ensure is_emergency is set to true
  
    // Retrieve the JWT token from cookies
    const token = getCookie("Authorization");
    console.log(token)
    try {
      const response = await fetch(`${API_URL}/reception`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token in the headers
        },
        body: JSON.stringify(newPatient),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to add patient");
      }
  
      setPatients([result.data, ...patients]);
      setIsModalOpen(false);
      alert("Patient added successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add patient");
      alert("Failed to add patient. Please try again.");
      console.error("Error adding patient:", err);
    } finally {
      setLoading(false);
    }
  };

  

  

  // Open modal for viewing or editing a patient
  const openModal = (patient: Patient | null, editMode: boolean = false) => {
    setCurrentPatient(patient);
    setIsEditMode(editMode);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
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
            aria-label="Search patients"
          />
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Patient ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone Number</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-t">
                <td className="p-2 border">{patient.patient_number}</td>
                <td className="p-2 border">{patient.first_name} {patient.last_name}</td>
                <td className="p-2 border">{patient.phone_number}</td>
                <td className="p-2 border">{patient.email}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => openModal(patient)}
                    className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
                    aria-label={`View details of ${patient.first_name} ${patient.last_name}`}
                  >
                    <FaEdit className="mr-2" /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && (
          <div className="flex justify-center p-4">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
              aria-label="Load more patients"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* Patient Modal */}
      {isModalOpen && (
        <PatientModal
          patient={currentPatient}
          isEditMode={isEditMode}
          onClose={() => setIsModalOpen(false)}
          onSubmit={isEditMode ? handleAddPatient : handleAddPatient}
          
        />
      )}
    </div>
  );
};

// Patient Modal Component
interface PatientModalProps {
  patient: Patient | null;
  isEditMode: boolean;
  onClose: () => void;
  onSubmit: (patient: Patient) => void;
  onDelete?: (id: string) => void;
}

const PatientModal = ({
  patient,
  isEditMode,
  onClose,
  onSubmit,
  onDelete,
}: PatientModalProps) => {
  const [firstName, setFirstName] = useState(patient?.first_name || "");
  const [lastName, setLastName] = useState(patient?.last_name || "");
  const [gender, setGender] = useState(patient?.gender || "");
  const [dob, setDob] = useState(patient?.dob || "");
  const [phoneNumber, setPhoneNumber] = useState(patient?.phone_number || "");
  const [email, setEmail] = useState(patient?.email || "");
  const [address, setAddress] = useState(patient?.address || "");
  const [bloodGroup, setBloodGroup] = useState(patient?.blood_group || "");
  const [medicalHistory, setMedicalHistory] = useState(patient?.medical_history || "");
  const [emergencyContact, setEmergencyContact] = useState(patient?.emergency_contact || "");
  const [triageLevel, setTriageLevel] = useState(patient?.triage_level || "");
  const [initialVitals, setInitialVitals] = useState(patient?.initial_vitals || "");
  const [emergencyNotes, setEmergencyNotes] = useState(patient?.emergency_notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: patient?.id || "",
      first_name: firstName,
      last_name: lastName,
      gender,
      dob,
      patient_number: patient?.patient_number || "",
      phone_number: phoneNumber,
      email,
      address,
      blood_group: bloodGroup,
      medical_history: medicalHistory,
      is_emergency: false,
      emergency_contact: emergencyContact,
      triage_level: triageLevel,
      initial_vitals: initialVitals,
      emergency_notes: emergencyNotes,
    };
    onSubmit(newPatient);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? (patient ? "Edit Patient" : "Add Patient") : "Patient Details"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="Last Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!isEditMode}
                required
                aria-label="Gender"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob.split("T")[0]}
                onChange={(e) => setDob(`${e.target.value}T00:00:00Z`)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="Date of Birth"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="Phone Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="Blood Group"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Medical History</label>
              <textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="Medical History"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Emergency Contact</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                required
                aria-label="Emergency Contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Triage Level</label>
              <input
                type="text"
                value={triageLevel}
                onChange={(e) => setTriageLevel(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                aria-label="Triage Level"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Initial Vitals</label>
              <textarea
                value={initialVitals}
                onChange={(e) => setInitialVitals(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                aria-label="Initial Vitals"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Emergency Notes</label>
              <textarea
                value={emergencyNotes}
                onChange={(e) => setEmergencyNotes(e.target.value)}
                className="w-full p-2 border rounded"
                readOnly={!isEditMode}
                aria-label="Emergency Notes"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {isEditMode && patient && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(patient.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
                aria-label="Delete patient"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded"
              aria-label="Cancel"
            >
              Cancel
            </button>
            {isEditMode && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                aria-label="Save changes"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};