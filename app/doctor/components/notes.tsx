"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface Note {
  id: string;
  notes: string;
  patient_id: string;
  created_at: string;
  updated_at: string;
}

export default function AddNotes() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [noteContent, setNoteContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/patient`, {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load patients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getJwtToken = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("Authorization="))
      ?.split("=")[1];
  };

  const handleAddNote = async () => {
    if (!selectedPatient || !noteContent.trim()) {
      setError("Please select a patient and enter note content");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getJwtToken()}`
        },
        body: JSON.stringify({
          notes: noteContent,
          patient_id: selectedPatient
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add note");
      }

      // Reset form on success
      setNoteContent("");
      setSelectedPatient("");
      setError(null);
      setSuccess("Note added successfully!");
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note");
      setTimeout(() => setError(null), 5000);
    }
  };

  if (isLoading) return <div className="p-4">Loading patients...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Clinical Notes</h2>

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
          {success}
        </div>
      )}

      {/* Patient Dropdown Selection */}
      <div className="mb-6">
        <label htmlFor="patient-select" className="block text-gray-700 font-medium mb-2">
          Select Patient
        </label>
        <select
          id="patient-select"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">-- Select a patient --</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.first_name} {patient.last_name} ({patient.phone_number})
            </option>
          ))}
        </select>
      </div>

      {/* Note Input */}
      <div className="mb-6">
        <label htmlFor="note" className="block text-gray-700 font-medium mb-2">
          Clinical Note
        </label>
        <textarea
          id="note"
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your clinical notes here..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </div>

      {/* Add Button */}
      <button
        onClick={handleAddNote}
        disabled={!selectedPatient || !noteContent.trim()}
        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <FaPlus className="mr-2" />
        Add Note
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}