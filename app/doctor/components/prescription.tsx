"use client";

import { useState, useEffect } from "react";
import { FaSave, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

interface Patient {
  id: string;
  full_name: string;
}

interface Doctor {
  id: string;
  name: string;
}

interface PrescriptionDetail {
  medicine_name: string;
  dosage: string;
  instructions: string;
}

interface ApiPatient {
  id: string;
  first_name: string;
  last_name: string;
}

export const Prescriptions = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetail[]>([
    { medicine_name: "", dosage: "", instructions: "" },
  ]);
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const getJwtToken = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("Authorization="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  useEffect(() => {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
      alert("You are not authorized. Please log in.");
      return;
    }

    // Fetch patients data
    fetch(`${API_URL}/patient`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((responseData: { success: boolean; data: ApiPatient[] }) => {
        if (responseData.success && Array.isArray(responseData.data)) {
          const formattedPatients = responseData.data.map((patient) => ({
            id: patient.id,
            full_name: `${patient.first_name} ${patient.last_name}`,
          }));
          setPatients(formattedPatients);
        }
      })
      .catch((error) => console.error("Error fetching patients:", error));

    // Fetch doctor's details
    fetch(`${API_URL}/admin/doctor`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data: { success: boolean; data: Doctor }) => {
        if (data.success && data.data) {
          setDoctor(data.data);
        }
      })
      .catch((error) => console.error("Error fetching doctor:", error));
  }, []);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    const patient = patients.find((p) => p.id === patientId) || null;
    setSelectedPatient(patient);
  };

  const handlePrescriptionChange = (index: number, field: string, value: string) => {
    const updatedDetails = [...prescriptionDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPrescriptionDetails(updatedDetails);
  };

  const addPrescriptionRow = () => {
    setPrescriptionDetails([
      ...prescriptionDetails,
      { medicine_name: "", dosage: "", instructions: "" },
    ]);
  };

  const removePrescriptionRow = (index: number) => {
    setPrescriptionDetails(prescriptionDetails.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!selectedPatient) {
      errors.patient = "Please select a patient.";
    }

    if (!diagnosis.trim()) {
      errors.diagnosis = "Please enter a diagnosis.";
    }

    prescriptionDetails.forEach((detail, index) => {
      if (!detail.medicine_name.trim()) {
        errors[`medicine_${index}`] = "Please enter a medicine name.";
      }
      if (!detail.dosage.trim()) {
        errors[`dosage_${index}`] = "Please enter a dosage.";
      }
      if (!detail.instructions.trim()) {
        errors[`instructions_${index}`] = "Please enter instructions.";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setStatus("saving");

    const jwtToken = getJwtToken();
    if (!jwtToken) {
      alert("You are not authorized. Please log in.");
      return;
    }

    // Prepare the prescription data according to your Go struct
    const prescriptionData = {
      patient_id: selectedPatient!.id,
      doctor_id: doctor!.id,
      diagnosis,
      medicine_name: prescriptionDetails[0].medicine_name,
      dosage: prescriptionDetails[0].dosage,
      instructions: prescriptionDetails[0].instructions,
      status: "pending",
    };

    try {
      const response = await fetch(`${API_URL}/prescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(prescriptionData),
      });

      if (response.ok) {
        setStatus("success");
        alert("Prescription saved successfully!");
        // Reset form
        setSelectedPatient(null);
        setPrescriptionDetails([{ medicine_name: "", dosage: "", instructions: "" }]);
        setDiagnosis("");
        setValidationErrors({});
      } else {
        setStatus("error");
        alert("Failed to save prescription. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      console.error("Prescription error:", error);
      alert("Failed to save prescription. Please try again.");
    }
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
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.full_name}
            </option>
          ))}
        </select>
        {validationErrors.patient && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.patient}</p>
        )}
      </div>

      {/* Diagnosis */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Diagnosis:</label>
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {validationErrors.diagnosis && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.diagnosis}</p>
        )}
      </div>

      {/* Prescription Details */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Prescription Details:</h2>
        {prescriptionDetails.map((detail, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-md mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">Medicine Name:</label>
                <input
                  type="text"
                  value={detail.medicine_name}
                  onChange={(e) => handlePrescriptionChange(index, "medicine_name", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter medicine name"
                />
                {validationErrors[`medicine_${index}`] && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors[`medicine_${index}`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold">Dosage:</label>
                <input
                  type="text"
                  value={detail.dosage}
                  onChange={(e) => handlePrescriptionChange(index, "dosage", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter dosage"
                />
                {validationErrors[`dosage_${index}`] && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors[`dosage_${index}`]}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold">Instructions:</label>
              <input
                type="text"
                value={detail.instructions}
                onChange={(e) => handlePrescriptionChange(index, "instructions", e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter instructions"
              />
              {validationErrors[`instructions_${index}`] && (
                <p className="text-red-600 text-sm mt-1">{validationErrors[`instructions_${index}`]}</p>
              )}
            </div>
            {prescriptionDetails.length > 1 && (
              <button
                onClick={() => removePrescriptionRow(index)}
                className="text-red-600 hover:text-red-800 mt-2"
              >
                <FaTimes className="inline mr-2" /> Remove
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addPrescriptionRow}
          className="mt-2 text-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add More Medicines
        </button>
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