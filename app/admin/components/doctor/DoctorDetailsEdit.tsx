import React, { useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
}

interface DoctorDetailsEditProps {
  doctor: Doctor;
  isEditing: boolean;
  onSave: (updatedDoctor: Doctor) => void;
  onClose: () => void;
}

const DoctorDetailsEdit: React.FC<DoctorDetailsEditProps> = ({
  doctor,
  isEditing,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState(doctor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        {isEditing ? (
          <>
            <h2 className="text-xl font-bold mb-4">Edit Doctor</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                className="w-full p-2 mb-2 border rounded"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="specialty"
                className="w-full p-2 mb-2 border rounded"
                value={formData.specialty}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                className="w-full p-2 mb-2 border rounded"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phone"
                className="w-full p-2 mb-2 border rounded"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="address"
                className="w-full p-2 mb-2 border rounded"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                type="text"
                name="licenseNumber"
                className="w-full p-2 mb-2 border rounded"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Doctor Details</h2>
            <p className="mb-2">
              <strong>Name:</strong> {doctor.name}
            </p>
            <p className="mb-2">
              <strong>Specialty:</strong> {doctor.specialty}
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> {doctor.phone}
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {doctor.address}
            </p>
            <p className="mb-2">
              <strong>License Number:</strong> {doctor.licenseNumber}
            </p>
            <p className="mb-4">
              <strong>Email:</strong> {doctor.email}
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDetailsEdit;