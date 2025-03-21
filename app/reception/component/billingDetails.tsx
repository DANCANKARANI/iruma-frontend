"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { FaArrowLeft, FaPrint, FaCreditCard, FaMoneyBillWave, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";

// Define the Patient interface
interface Patient {
  id: string;
  name: string;
  insurance: string;
}

// Define the BillingItem interface
interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

// Define the BillingDetailsProps interface
interface BillingDetailsProps {
  patient: Patient;
  onBack: () => void;
}

// Define the Lipa Na Mpesa Payment Details interface
interface LipaNaMpesaDetails {
  cost: number;
  customer_phone: string;
  account_reference: string;
}

// Define the API response structure for billing items
interface ApiBillingItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function BillingDetails({ patient, onBack }: BillingDetailsProps) {
  const [items, setItems] = useState<BillingItem[]>([]);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaDetails, setMpesaDetails] = useState<LipaNaMpesaDetails>({
    cost: 0,
    customer_phone: "254", // Pre-fill with "254"
    account_reference: "Dancan", // Set to "Dancan"
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // Loading state for payment processing
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Fetch billing details when the component mounts or when the patient ID changes
  useEffect(() => {
    const fetchBillingDetails = async () => {
      try {
        const token = Cookies.get("Authorization"); // Get JWT from cookies
        if (!token) {
          console.error("JWT token not found.");
          return;
        }

        // Fetch billing details from the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/reception/${patient.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        // Check if the API call was successful
        if (data.success) {
          // Map the API response to the BillingItem interface
          setItems(
            data.data.map((bill: ApiBillingItem) => ({
              id: bill.id,
              description: bill.description,
              quantity: bill.quantity || 1, // Default to 1 if quantity is 0
              price: bill.price,
            }))
          );
        } else {
          console.error("Failed to fetch billing details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching billing details:", error);
      }
    };

    fetchBillingDetails();
  }, [patient.id]);

  // Add a new item to the invoice
  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 }]);
  };

  // Remove an item from the invoice
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Handle changes to item fields (description, quantity, price)
  const handleChange = (id: string, field: keyof BillingItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calculate the total amount
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Print the invoice
  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContents = invoiceRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  // Handle Lipa Na Mpesa payment
  const handleMpesaPayment = async () => {
    setIsProcessingPayment(true); // Show loading modal

    try {
      const token = Cookies.get("Authorization"); // Get JWT from cookies
      if (!token) {
        console.error("JWT token not found.");
        return;
      }

      // Retrieve patientID from the patient object
      const patientID = patient.id;

      if (!patientID) {
        alert("Patient ID not found. Please select a patient.");
        return;
      }

      // Send payment details to the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/payments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Patient-ID": patientID, // Include patientID in the headers
        },
        body: JSON.stringify(mpesaDetails),
      });

      const data = await response.json();

      if (data.success) {
        alert("Payment request sent successfully!");
        setShowMpesaModal(false); // Close the modal
      } else {
        console.error("Failed to send payment request:", data.message);
        alert("Failed to send payment request.");
      }
    } catch (error) {
      console.error("Error sending payment request:", error);
      alert("An error occurred while sending the payment request.");
    } finally {
      setIsProcessingPayment(false); // Hide loading modal
    }
  };

  // Format phone number to start with 254
  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("0")) {
      return `254${phone.slice(1)}`;
    }
    if (!phone.startsWith("254")) {
      return `254${phone}`;
    }
    return phone;
  };

  // Handle phone number input change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedPhone = formatPhoneNumber(input);
    setMpesaDetails({ ...mpesaDetails, customer_phone: formattedPhone });
  };

  // Open Lipa Na Mpesa modal and set the cost to the total amount
  const openMpesaModal = () => {
    setMpesaDetails({
      ...mpesaDetails,
      cost: totalAmount, // Set cost to the total amount
    });
    setShowMpesaModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Back Button */}
      <button onClick={onBack} className="mb-4 text-blue-600 flex items-center">
        <FaArrowLeft className="mr-2" /> Back to Patients
      </button>

      {/* Patient Information */}
      <h1 className="text-2xl font-bold mb-4">Billing for {patient.name}</h1>
      <div className="bg-white p-4 rounded shadow-md mb-4">
        <p><strong>Patient ID:</strong> {patient.id}</p>
        <p><strong>Insurance:</strong> {patient.insurance}</p>
      </div>

      {/* Invoice Section */}
      <div ref={invoiceRef} className="bg-white p-4 rounded shadow-md mb-4">
        <h2 className="text-lg font-semibold mb-2">Invoice</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Price (Ksh)</th>
              <th className="p-2 border">Total (Ksh)</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleChange(item.id, "description", e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleChange(item.id, "quantity", parseInt(e.target.value))}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleChange(item.id, "price", parseFloat(e.target.value))}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-2 border">{item.quantity * item.price}</td>
                <td className="p-2 border">
                  <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Item Button */}
        <button onClick={addItem} className="mt-2 text-blue-600 flex items-center">
          <FaPlus className="mr-2" /> Add Item
        </button>

        {/* Total Amount */}
        <div className="mt-4 text-lg font-semibold">
          Total Amount: <span className="text-green-600">Ksh {totalAmount}</span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center">
          <FaMoneyBillWave className="mr-2" /> Cash Payment
        </button>
        <button
          onClick={openMpesaModal}
          className="px-4 py-2 bg-green-600 text-white rounded flex items-center"
        >
          <FaCreditCard className="mr-2" /> Lipa Na Mpesa
        </button>
        <button onClick={handlePrint} className="px-4 py-2 bg-gray-700 text-white rounded flex items-center">
          <FaPrint className="mr-2" /> Print Invoice
        </button>
      </div>

      {/* Lipa Na Mpesa Modal */}
      {showMpesaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Lipa Na Mpesa</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Cost (Ksh)</label>
                <input
                  type="number"
                  value={mpesaDetails.cost}
                  readOnly // Make cost non-editable
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Customer Phone</label>
                <input
                  type="text"
                  value={mpesaDetails.customer_phone}
                  onChange={handlePhoneNumberChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Account Reference</label>
                <input
                  type="text"
                  value={mpesaDetails.account_reference}
                  readOnly // Make account reference non-editable
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowMpesaModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleMpesaPayment}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Request Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Modal */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md flex flex-col items-center">
            <FaSpinner className="animate-spin text-2xl mb-4" />
            <p>Processing payment...</p>
          </div>
        </div>
      )}
    </div>
  );
}