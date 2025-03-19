import React from "react";

interface Pharmacist {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  role: string;
}

interface ViewPharmacistDetailsProps {
  pharmacist: Pharmacist;
  onBack: () => void;
}

const ViewPharmacistDetails: React.FC<ViewPharmacistDetailsProps> = ({ pharmacist, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-semibold mb-4">Pharmacist Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={pharmacist.full_name}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={pharmacist.email}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            value={pharmacist.phone_number}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700">Address</label>
          <textarea
            value={pharmacist.address}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700">Role</label>
          <input
            type="text"
            value={pharmacist.role}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
      </div>
      <div className="flex space-x-4 mt-6">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-700"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default ViewPharmacistDetails;