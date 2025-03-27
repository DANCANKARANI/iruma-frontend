import React, { useState } from "react";

interface Doctor {
  id: string;
  full_name: string;
  email: string;
  username: string;
  phone_number: string;
  role: string;
  date_of_birth: string;
  address: string;
  gender: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
            <h2 className="text-xl font-bold mb-4">Edit C.O</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="full_name"
                className="w-full p-2 mb-2 border rounded"
                value={formData.full_name}
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
                type="text"
                name="username"
                className="w-full p-2 mb-2 border rounded"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phone_number"
                className="w-full p-2 mb-2 border rounded"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <input
                type="text"
                name="role"
                className="w-full p-2 mb-2 border rounded"
                value={"doctor"}
                onChange={handleChange}
              />
              <input
                type="date"
                name="date_of_birth"
                className="w-full p-2 mb-2 border rounded"
                value={formData.date_of_birth}
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
                name="gender"
                className="w-full p-2 mb-2 border rounded"
                value={formData.gender}
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
              <strong>Full Name:</strong> {doctor.full_name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {doctor.email}
            </p>
            <p className="mb-2">
              <strong>Username:</strong> {doctor.username}
            </p>
            <p className="mb-2">
              <strong>Phone Number:</strong> {doctor.phone_number}
            </p>
            <p className="mb-2">
              <strong>Role:</strong> {doctor.role}
            </p>
            <p className="mb-2">
              <strong>Date of Birth:</strong> {doctor.date_of_birth}
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {doctor.address}
            </p>
            <p className="mb-2">
              <strong>Gender:</strong> {doctor.gender}
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