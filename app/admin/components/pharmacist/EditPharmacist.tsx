import React, { useState } from "react";

interface Pharmacist {
  id: number;
  name:string;
  email: string;
  phone: string;
  address: string;
  qualifications: string;
  licenseNumber: string;
  password: string;
  confirmPassword: string;
}

interface EditPharmacistProps {
  pharmacist: Pharmacist;
  onBack: () => void;
}

const EditPharmacist: React.FC<EditPharmacistProps> = ({ pharmacist, onBack }) => {
  const [formData, setFormData] = useState({
    name:pharmacist.name,
    email: pharmacist.email,
    phone: pharmacist.phone,
    address: pharmacist.address,
    qualifications: pharmacist.qualifications,
    licenseNumber: pharmacist.licenseNumber,
    password: pharmacist.password,
    confirmPassword: pharmacist.confirmPassword,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Updated pharmacist details:", { id: pharmacist.id, ...formData });
    onBack(); // Return to the list
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-semibold mb-4">Edit Pharmacist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Qualifications</label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700"
        >
          Save
        </button>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditPharmacist;
