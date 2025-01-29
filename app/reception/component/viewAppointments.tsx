"use client";
import { useState, useEffect } from "react";

interface Appointment {
  id: number;
  name: string;
  doctor: string;
  date: string;
  time: string;
  reason: string;
}

export default function ViewAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Mock Data (Replace with API Fetch)
  useEffect(() => {
    setAppointments([
      { id: 1, name: "John Doe", doctor: "Dr. Smith", date: "2025-02-10", time: "10:00 AM", reason: "Checkup" },
      { id: 2, name: "Alice Johnson", doctor: "Dr. Jane", date: "2025-02-12", time: "02:00 PM", reason: "Consultation" },
      { id: 3, name: "Bob Williams", doctor: "Dr. Smith", date: "2025-02-15", time: "11:30 AM", reason: "Follow-up" },
    ]);
  }, []);

  // Filtered Appointments
  const filteredAppointments = appointments.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) &&
      (doctorFilter ? a.doctor === doctorFilter : true) &&
      (dateFilter ? a.date === dateFilter : true)
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-6">
          View Appointments
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="w-full sm:w-1/4 p-2 border rounded dark:bg-gray-700 dark:text-white mt-2 sm:mt-0"
          >
            <option value="">All Doctors</option>
            <option value="Dr. Smith">Dr. Smith</option>
            <option value="Dr. Jane">Dr. Jane</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-1/4 p-2 border rounded dark:bg-gray-700 dark:text-white mt-2 sm:mt-0"
          />
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Doctor</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="p-3">{appointment.name}</td>
                    <td className="p-3">{appointment.doctor}</td>
                    <td className="p-3">{appointment.date}</td>
                    <td className="p-3">{appointment.time}</td>
                    <td className="p-3">{appointment.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500 dark:text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
