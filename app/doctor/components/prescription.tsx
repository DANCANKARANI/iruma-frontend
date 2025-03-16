"use client"; // Ensure this is at the top of the file

import { useState, useEffect } from "react"; // Ensure React is imported
import { FaSave, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

// Define the API endpoint from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Define the type for the patient
interface Patient {
  id: string;
  full_name: string; // Only id and full_name are needed
}

// Define the type for the doctor
interface Doctor {
  id: string;
  name: string;
}

// Define the type for the medicine
interface Medicine {
  id: number;
  name: string;
}

// Define the type for the prescription details
interface PrescriptionDetail {
  medicine_id: number | null;
  dosage: string;
  frequency: string;
  instructions: string;
}

export const Prescriptions = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetail[]>([
    { medicine_id: null, dosage: "", frequency: "", instructions: "" },
  ]);
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Function to get the JWT token from cookies
  const getJwtToken = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("Authorization="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;
    console.log("Retrieved token:", token); // Debugging
    return token;
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
      .then((response) => {
        console.log("Patients response status:", response.status); // Debugging
        return response.json();
      })
      .then((responseData) => {
        console.log("Patients response data:", responseData); // Debugging

        // Extract the `data` field from the response and map to the required format
        if (responseData.success && Array.isArray(responseData.data)) {
          const formattedPatients = responseData.data.map((patient: any) => ({
            id: patient.id,
            full_name: `${patient.first_name} ${patient.last_name}`, // Combine first and last name
          }));
          setPatients(formattedPatients);
        } else {
          console.error("Invalid patients data format:", responseData);
        }
      })
      .catch((error) => console.error("Error fetching patients:", error));

    // Fetch doctor's details
    fetch(`${API_URL}/admin/doctor`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => {
        console.log("Doctor response status:", response.status); // Debugging
        return response.json();
      })
      .then((data) => {
        console.log("Doctor response data:", data); // Debugging
        if (data.success && data.data) {
          setDoctor(data.data); // Ensure the doctor data is correctly set
        } else {
          console.error("Invalid doctor data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching doctor:", error));

    // Fetch medicines data
    fetch(`${API_URL}/medicine`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => {
        console.log("Medicines response status:", response.status); // Debugging
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Medicines response data:", data); // Debugging
        // Ensure the response has the `data` field and it's an array
        if (data.success && Array.isArray(data.data)) {
          setMedicines(data.data);
        } else {
          console.error("Invalid medicines data format:", data);
          setMedicines([]); // Set to an empty array to avoid errors
        }
      })
      .catch((error) => {
        console.error("Error fetching medicines:", error);
        setMedicines([]); // Set to an empty array to avoid errors
      });
  }, []);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    const patient = patients.find((p) => p.id === patientId) || null;
    setSelectedPatient(patient);
    console.log("Selected Patient:", patient); // Debugging
  };

  const handlePrescriptionChange = (index: number, field: string, value: string | number) => {
    const updatedDetails = [...prescriptionDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPrescriptionDetails(updatedDetails);
  };

  const addPrescriptionRow = () => {
    setPrescriptionDetails([
      ...prescriptionDetails,
      { medicine_id: null, dosage: "", frequency: "", instructions: "" },
    ]);
  };

  const removePrescriptionRow = (index: number) => {
    setPrescriptionDetails(prescriptionDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!selectedPatient || !doctor || prescriptionDetails.some((detail) => !detail.medicine_id || !detail.dosage)) {
      alert("Please complete all prescription details.");
      return;
    }

    setStatus("saving");

    const jwtToken = getJwtToken();

    if (!jwtToken) {
      alert("You are not authorized. Please log in.");
      return;
    }

    // Debugging: Log the selected patient and doctor
    console.log("Selected Patient:", selectedPatient);
    console.log("Doctor:", doctor);

    // Construct the prescription data in the required format
    const prescriptionData = {
      patient_id: selectedPatient.id, // Ensure patient_id is included
      doctor_id: doctor.id, // Ensure doctor_id is included
      diagnosis,
      dosage: prescriptionDetails[0].dosage, // Assuming only one prescription detail for simplicity
      instructions: prescriptionDetails[0].instructions, // Assuming only one prescription detail for simplicity
      frequency: parseInt(prescriptionDetails[0].frequency), // Convert frequency to a number
      prescribed_medicine_ids: prescriptionDetails.map((detail) => detail.medicine_id!), // Array of medicine IDs
      status: "pending", // Ensure status is lowercase as per your requirement
    };

    console.log("Prescription Payload:", prescriptionData); // Debugging

    try {
      const response = await fetch(`${API_URL}/prescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(prescriptionData),
      });

      console.log("Prescription response status:", response.status); // Debugging

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          setStatus("success");
          console.log(data);
          alert("Prescription saved successfully!");
          // Reset form after submission
          setSelectedPatient(null);
          setPrescriptionDetails([{ medicine_id: null, dosage: "", frequency: "", instructions: "" }]);
          setDiagnosis("");
        } else {
          setStatus("error");
          console.error("Prescription error data:", data); // Debugging
          alert("Failed to save prescription. Please try again.");
        }
      } else {
        // Handle non-JSON responses (e.g., HTML error pages)
        const text = await response.text();
        console.error("Non-JSON response:", text); // Debugging
        setStatus("error");
        alert("Server returned an invalid response. Please check the endpoint.");
      }
    } catch (error) {
      setStatus("error");
      console.error("Prescription error:", error); // Debugging
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
              {patient.full_name} {/* Display full name */}
            </option>
          ))}
        </select>
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
      </div>

      {/* Prescription Details */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Prescription Details:</h2>
        {prescriptionDetails.map((detail, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-md mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">Medicine:</label>
                <select
                  value={detail.medicine_id || ""}
                  onChange={(e) => handlePrescriptionChange(index, "medicine_id", parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a medicine</option>
                  {medicines.map((medicine) => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </option>
                  ))}
                </select>
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