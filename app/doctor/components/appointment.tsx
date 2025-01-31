"use client";

import { useState } from "react";

interface Patient {
  id: string;
  name: string;
  insurance: string;
}

interface Appointment {
  id: number;
  patient: Patient;
  status: "Pending" | "Confirmed" | "Completed" | "Canceled";
}

// Sample list of patients
const patientsList: Patient[] = [
  { id: "PAT-001", name: "John Doe", insurance: "NHIF" },
  { id: "PAT-002", name: "Jane Smith", insurance: "AAR" },
  { id: "PAT-003", name: "David Kim", insurance: "Britam" },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Check if patient already has an active appointment
  const isDuplicateAppointment = (patientId: string) => {
    return appointments.some(
      (appointment) =>
        appointment.patient.id === patientId &&
        (appointment.status === "Pending" || appointment.status === "Confirmed")
    );
  };

  // Schedule a new appointment
  const scheduleAppointment = () => {
    if (!selectedPatient) return;

    if (isDuplicateAppointment(selectedPatient.id)) {
      setErrorMessage("⚠️ This patient already has a scheduled appointment.");
      return;
    }

    setAppointments([
      ...appointments,
      {
        id: appointments.length + 1,
        patient: selectedPatient,
        status: "Pending",
      },
    ]);

    setSelectedPatient(null);
    setShowForm(false);
    setErrorMessage("");
  };

  // Update appointment status
  const updateStatus = (id: number, newStatus: Appointment["status"]) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: newStatus } : appointment
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📅 Appointment Scheduling</h1>

      {/* Schedule Now Button */}
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        ➕ Schedule Now
      </button>

      {/* Show error message if patient already has an appointment */}
      {errorMessage && (
        <p className="text-red-600 mb-2">{errorMessage}</p>
      )}

      {/* Schedule Form */}
      {showForm && (
        <div className="bg-white p-4 rounded shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Select a Patient</h2>
          <ul>
            {patientsList.map((patient) => (
              <li
                key={patient.id}
                className={`p-2 cursor-pointer border-b ${
                  selectedPatient?.id === patient.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                {patient.name} ({patient.insurance})
              </li>
            ))}
          </ul>
          <button
            onClick={scheduleAppointment}
            disabled={!selectedPatient}
            className={`mt-2 px-4 py-2 ${
              selectedPatient ? "bg-green-600 text-white" : "bg-gray-400 text-gray-700"
            } rounded`}
          >
            ✅ Confirm Appointment
          </button>
        </div>
      )}

      {/* Appointment List */}
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Patient</th>
            <th className="p-2 border">Insurance</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-t">
              <td className="p-2 border">{appointment.patient.name}</td>
              <td className="p-2 border">{appointment.patient.insurance}</td>
              <td className="p-2 border">{appointment.status}</td>
              <td className="p-2 border space-x-2">
                {appointment.status !== "Completed" && (
                  <button
                    onClick={() => updateStatus(appointment.id, "Completed")}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    ✅ Complete
                  </button>
                )}
                {appointment.status !== "Canceled" && (
                  <button
                    onClick={() => updateStatus(appointment.id, "Canceled")}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    ❌ Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
