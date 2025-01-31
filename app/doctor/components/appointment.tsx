"use client";

import { useState } from "react";

interface Appointment {
  id: number;
  patientName: string;
  status: "Pending" | "Confirmed" | "Completed" | "Canceled";
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientName: "John Doe", status: "Pending" },
    { id: 2, patientName: "Jane Smith", status: "Confirmed" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState("");

  // Update appointment status
  const updateStatus = (id: number, newStatus: Appointment["status"]) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: newStatus } : appointment
      )
    );
  };

  // Schedule a new appointment
  const scheduleAppointment = () => {
    if (!newPatient.trim()) return;
    setAppointments([
      ...appointments,
      { id: appointments.length + 1, patientName: newPatient, status: "Pending" },
    ]);
    setNewPatient("");
    setShowForm(false);
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

      {/* Schedule Form */}
      {showForm && (
        <div className="bg-white p-4 rounded shadow-md mb-4">
          <input
            type="text"
            placeholder="Enter Patient Name"
            value={newPatient}
            onChange={(e) => setNewPatient(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={scheduleAppointment}
            className="px-4 py-2 bg-green-600 text-white rounded"
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
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-t">
              <td className="p-2 border">{appointment.patientName}</td>
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
