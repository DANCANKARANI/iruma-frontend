"use client";

import { useState, useRef } from "react";
import { FaArrowLeft, FaPrint, FaCreditCard, FaMoneyBillWave, FaTrash, FaPlus } from "react-icons/fa";

// Define a type for the patient object
interface Patient {
  id: string;
  name: string;
  insurance: string;
}

// Define a type for the component props
interface BillingDetailsProps {
  patient: Patient;
  onBack: () => void;
}

export default function BillingDetails({ patient, onBack }: BillingDetailsProps) {
  const [items, setItems] = useState([
    { id: 1, description: "Consultation Fee", quantity: 1, price: 500 },
    { id: 2, description: "Lab Test", quantity: 1, price: 1200 },
  ]);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setItems([...items, { id: items.length + 1, description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleChange = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Print only the invoice and patient details
  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContents = invoiceRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      // Include patient details and invoice in the printable content
      const patientDetails = document.getElementById("patientDetails")?.innerHTML;
      document.body.innerHTML = patientDetails + printContents; // Combine both
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload page to restore original content
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Back Button */}
      <button onClick={onBack} className="mb-4 text-blue-600 flex items-center">
        <FaArrowLeft className="mr-2" /> Back to Patients
      </button>

      <h1 className="text-2xl font-bold mb-4">Billing for {patient.name}</h1>

      {/* Patient Information (ID, Name, Insurance) */}
      <div id="patientDetails" className="bg-white p-4 rounded shadow-md mb-4">
        <p><strong>Patient ID:</strong> {patient.id}</p>
        <p><strong>Insurance:</strong> {patient.insurance}</p>
      </div>

      {/* Invoice Section (Wrapped in a Ref for Printing) */}
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

        <button onClick={addItem} className="mt-2 text-blue-600 flex items-center">
          <FaPlus className="mr-2" /> Add Item
        </button>

        {/* Total Amount */}
        <div className="mt-4 text-lg font-semibold">
          Total Amount: <span className="text-green-600">Ksh {totalAmount}</span>
        </div>
      </div>

      {/* Payment Options & Print Invoice */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center">
          <FaMoneyBillWave className="mr-2" /> Cash Payment
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded flex items-center">
          <FaCreditCard className="mr-2" /> Lipa Na Mpesa
        </button>
        <button onClick={handlePrint} className="px-4 py-2 bg-gray-700 text-white rounded flex items-center">
          <FaPrint className="mr-2" /> Print Invoice
        </button>
      </div>
    </div>
  );
}
