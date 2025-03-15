"use client";
import { useState } from "react";

export default function RegisterPatient() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    phone_number: "",
    email: "",
    address: "",
    emergency_contact: "",
    blood_group: "",
    medical_history: "",
  });

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Convert DOB to RFC 3339 format
    const formattedDOB = new Date(formData.dob).toISOString(); // Converts to "2025-02-10T00:00:00.000Z"
  
    const payload = { ...formData, dob: formattedDOB };
  
    try {
      const response = await fetch("http://localhost:8000/api/V1/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to register patient: ${await response.text()}`);
      }
  
      const result = await response.json();
      console.log("Server Response:", result);
      alert("Patient registered successfully!");
    } catch (error) {
      console.error("Error:", error);
    
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unexpected error occurred.");
      }
    }  
  };
  
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-6">
          Register Patient 
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Personal Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Right Column - Contact & Medical Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300">Blood Group</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300">Emergency Contact</label>
              <input
                type="tel"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Full Width - Address & Medical History */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300">Medical History</label>
              <textarea
                name="medical_history"
                value={formData.medical_history}
                onChange={handleChange}
                rows={3}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
