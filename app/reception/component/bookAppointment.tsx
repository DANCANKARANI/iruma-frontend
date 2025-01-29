"use client";
import { useState } from "react";

export default function BookAppointment() {
  const [appointment, setAppointment] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    doctor: "",
    reason: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment Data:", appointment);
    alert("Appointment booked successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      <div className="w-11/12 max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-6">
          Book an Appointment
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          {/* Left Side - Patient Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Patient Information</h3>

            {/* Patient Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={appointment.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={appointment.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={appointment.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="+254700123456"
              />
            </div>
          </div>

          {/* Right Side - Appointment Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Appointment Details</h3>

            {/* Select Doctor */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Select Doctor</label>
              <select
                name="doctor"
                value={appointment.doctor}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose a doctor</option>
                <option value="Dr. Smith">Dr. Smith - Cardiologist</option>
                <option value="Dr. Jane">Dr. Jane - General Physician</option>
              </select>
            </div>

            {/* Date & Time in a Single Row */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Date */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300">Select Date</label>
                <input
                  type="date"
                  name="date"
                  value={appointment.date}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300">Select Time</label>
                <input
                  type="time"
                  name="time"
                  value={appointment.time}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-300">Reason for Appointment</label>
              <textarea
                name="reason"
                value={appointment.reason}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Describe your symptoms or concerns..."
              />
            </div>
          </div>

          {/* Submit Button - Spanning Two Columns */}
          <div className="col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
