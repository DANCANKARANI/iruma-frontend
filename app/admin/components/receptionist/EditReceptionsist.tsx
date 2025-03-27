"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";

interface Receptionist {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  role: string;
}

interface EditReceptionistProps {
  receptionist: Receptionist;
  onBack: () => void;
  onUpdateSuccess?: (updatedReceptionist: Receptionist) => void;
}

const EditReceptionist: React.FC<EditReceptionistProps> = ({ 
  receptionist, 
  onBack,
  onUpdateSuccess 
}) => {
  const [formData, setFormData] = useState<Receptionist>(receptionist);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = Cookies.get("Authorization");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Validate form data
      if (!formData.full_name.trim()) {
        throw new Error("Full name is required");
      }
      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      if (!formData.phone_number.trim()) {
        throw new Error("Phone number is required");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/doctor/${formData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number,
            address: formData.address,
            role: "receptionist"
          }),
        }
      );

      // First check if the response is JSON
      const contentType = response.headers.get("content-type");
      let responseData;
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP error! Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(
          responseData.message || 
          responseData.error ||
          `Failed to update receptionist (Status: ${response.status})`
        );
      }

      console.log("Successfully updated receptionist:", responseData);
      
      if (onUpdateSuccess) {
        onUpdateSuccess(responseData);
      }
      
      onBack();
      
    } catch (err) {
      console.error("Update error:", err);
      let errorMessage = "An unknown error occurred";
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Handle common error messages
        if (err.message.includes("Cannot PUT")) {
          errorMessage = "Failed to update receptionist. The endpoint might be incorrect.";
        } else if (err.message.includes("401")) {
          errorMessage = "Session expired. Please log in again.";
        } else if (err.message.includes("403")) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (err.message.includes("404")) {
          errorMessage = "Receptionist not found.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Receptionist Details</h2>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          &times; Close
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (keep your existing form fields exactly as they are) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Role *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReceptionist;