"use client";
import { useState } from "react";
import { getCookie } from "cookies-next";

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
    is_emergency: false,
    triage_level: "",
    initial_vitals: "",
  });

  const [isEmergency, setIsEmergency] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleEmergency = () => {
    setIsEmergency(!isEmergency);
    setFormData({ ...formData, is_emergency: !isEmergency });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDOB = new Date(formData.dob).toISOString();
    const payload = { ...formData, dob: formattedDOB };

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
      if (!apiEndpoint) throw new Error("API endpoint is not defined.");

      const jwtToken = getCookie("Authorization");
      if (!jwtToken) throw new Error("JWT token not found in cookies.");

      const response = await fetch(`${apiEndpoint}/reception`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to register patient: ${await response.text()}`);
      }

      setSuccessMessage("Patient registered successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);

      setFormData({
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
        is_emergency: false,
        triage_level: "",
        initial_vitals: "",
      });
      setIsEmergency(false);
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? `Error: ${error.message}` : "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-6">
          Register Patient
        </h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-gray-700 dark:text-gray-300">First Name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />

            <label className="block text-gray-700 dark:text-gray-300">Last Name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />

            <label className="block text-gray-700 dark:text-gray-300">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label className="block text-gray-700 dark:text-gray-300">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 dark:text-gray-300">Phone Number</label>
            <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />

            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />

            <label className="block text-gray-700 dark:text-gray-300">Blood Group</label>
            <select name="blood_group" value={formData.blood_group} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
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

          <div className="col-span-1 md:col-span-2 space-y-4">
            <label className="block text-gray-700 dark:text-gray-300">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />

            <label className="block text-gray-700 dark:text-gray-300">Medical History</label>
            <textarea name="medical_history" value={formData.medical_history} onChange={handleChange} rows={3} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-between">
            <button type="button" onClick={toggleEmergency} className={`px-6 py-2 rounded transition ${isEmergency ? "bg-red-600 text-white" : "bg-gray-600 text-white"}`}>
              {isEmergency ? "Emergency Case Selected" : "Mark as Emergency"}
            </button>
          </div>

          {isEmergency && (
            <div className="col-span-1 md:col-span-2 space-y-4">
              <label className="block text-gray-700 dark:text-gray-300">Triage Level</label>
              <select name="triage_level" value={formData.triage_level} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
                <option value="">Select Triage Level</option>
                <option value="Red">Red</option>
                <option value="Yellow">Yellow</option>
                <option value="Green">Green</option>
              </select>

              <label className="block text-gray-700 dark:text-gray-300">Initial Vitals</label>
              <input type="text" name="initial_vitals" value={formData.initial_vitals} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
            </div>
          )}

          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
