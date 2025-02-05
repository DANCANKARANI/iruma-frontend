"use client";

import { useState } from "react";
import { FaSave, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

// Define the type for the patient
interface Patient {
  id: string;
  name: string;
}

// Define the type for the prescription details
interface PrescriptionDetail {
  medicine: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

export const Prescriptions = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetail[]>([
    { medicine: "", dosage: "", frequency: "", instructions: "" },
  ]);
  const [notes, setNotes] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    if (patientId) {
      setSelectedPatient({
        id: patientId,
        name: `Patient ${patientId}`, // This should come from a real patient list
      });
    } else {
      setSelectedPatient(null);
    }
  };

  const handlePrescriptionChange = (index: number, field: string, value: string) => {
    const updatedDetails = [...prescriptionDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPrescriptionDetails(updatedDetails);
  };

  const addPrescriptionRow = () => {
    setPrescriptionDetails([
      ...prescriptionDetails,
      { medicine: "", dosage: "", frequency: "", instructions: "" },
    ]);
  };

  const removePrescriptionRow = (index: number) => {
    setPrescriptionDetails(prescriptionDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedPatient || prescriptionDetails.some((detail) => !detail.medicine || !detail.dosage)) {
      alert("Please complete all prescription details.");
      return;
    }

    setStatus("saving");

    // Simulate saving the prescription (this would normally be an API call)
    setTimeout(() => {
      setStatus("success");
      alert("Prescription saved successfully!");
      // Reset form after submission
      setSelectedPatient(null);
      setPrescriptionDetails([{ medicine: "", dosage: "", frequency: "", instructions: "" }]);
      setNotes("");
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">💊 Prescription Form</h1>

      {/* Patient Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Select Patient:</label>
        <select
          value={selectedPatient?.id || ""}
          onChange={handlePatientChange}
          className="p-2 border rounded"
        >
          <option value="">Select a patient</option>
          {/* In a real app, populate this list with patients from the database */}
          <option value="PAT-001">Patient 1</option>
          <option value="PAT-002">Patient 2</option>
          <option value="PAT-003">Patient 3</option>
        </select>
      </div>

      {/* Prescription Details */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Prescription Details:</h2>
        {prescriptionDetails.map((detail, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-md mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">Medicine:</label>
                <input
                  type="text"
                  value={detail.medicine}
                  onChange={(e) => handlePrescriptionChange(index, "medicine", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Dosage:</label>
                <input
                  type="text"
                  value={detail.dosage}
                  onChange={(e) => handlePrescriptionChange(index, "dosage", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">Frequency:</label>
                <input
                  type="text"
                  value={detail.frequency}
                  onChange={(e) => handlePrescriptionChange(index, "frequency", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Instructions:</label>
                <input
                  type="text"
                  value={detail.instructions}
                  onChange={(e) => handlePrescriptionChange(index, "instructions", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <button
              onClick={() => removePrescriptionRow(index)}
              className="text-red-600 hover:text-red-800 mt-2"
            >
              <FaTimes className="inline mr-2" /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={addPrescriptionRow}
          className="mt-2 text-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add More Medicines
        </button>
      </div>

      {/* Additional Notes */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Additional Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="mb-4">
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded ${status === "saving" ? "bg-gray-400" : "bg-blue-600 text-white"}`}
          disabled={status === "saving"}
        >
          {status === "saving" ? (
            "Saving..."
          ) : (
            <>
              <FaSave className="mr-2" />
              Save Prescription
            </>
          )}
        </button>
      </div>

      {/* Status Message */}
      {status === "success" && (
        <div className="text-green-600">
          <FaCheck className="inline mr-2" />
          Prescription saved successfully!
        </div>
      )}
      {status === "error" && (
        <div className="text-red-600">
          <FaTimes className="inline mr-2" />
          Failed to save prescription. Please try again.
        </div>
      )}
    </div>
  );
};
