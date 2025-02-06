"use client";

import { useState, useEffect } from "react";

interface Medicine {
  id: number;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  reorderLevel: number;
}

export default function Inventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    id: 0,
    name: "",
    category: "",
    quantity: 0,
    expiryDate: "",
    reorderLevel: 0,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const storedMedicines = localStorage.getItem("medicines");
    if (storedMedicines) {
      setMedicines(JSON.parse(storedMedicines));
    }
  }, []);

  // Save data to localStorage whenever medicines change
  useEffect(() => {
    localStorage.setItem("medicines", JSON.stringify(medicines));
  }, [medicines]);

  // Function to check expiry status
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert ms to days

    if (daysLeft < 0) return { text: "Expired", className: "text-red-600 font-bold" };
    if (daysLeft <= 30) return { text: "Expiring Soon", className: "text-orange-500 font-bold" };
    return { text: "Valid", className: "text-green-600 font-bold" };
  };

  // Add or Update Medicine
  const saveMedicine = () => {
    if (!newMedicine.name || !newMedicine.category || newMedicine.quantity <= 0) {
      alert("Please fill in all details correctly!");
      return;
    }

    if (editingMedicine) {
      // Update existing medicine
      setMedicines(
        medicines.map((med) => (med.id === editingMedicine.id ? { ...newMedicine, id: med.id } : med))
      );
      setEditingMedicine(null);
    } else {
      // Add new medicine
      setMedicines([...medicines, { ...newMedicine, id: medicines.length + 1 }]);
    }

    setNewMedicine({ id: 0, name: "", category: "", quantity: 0, expiryDate: "", reorderLevel: 0 });
  };

  // Delete Medicine
  const deleteMedicine = (id: number) => {
    setMedicines(medicines.filter((medicine) => medicine.id !== id));
  };

  // Edit Medicine
  const editMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setNewMedicine(medicine);
  };

  // Search & filter medicines
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(search.toLowerCase()) ||
      medicine.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📦 Pharmacy Inventory</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search medicines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {/* Add/Edit Medicine Form */}
      <div className="mb-4 p-4 border rounded bg-gray-100">
        <h3 className="text-lg font-bold mb-2">{editingMedicine ? "✏️ Edit Medicine" : "➕ Add New Medicine"}</h3>
        <input
          type="text"
          placeholder="Medicine Name"
          value={newMedicine.name}
          onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={newMedicine.category}
          onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newMedicine.quantity}
          onChange={(e) => setNewMedicine({ ...newMedicine, quantity: Number(e.target.value) })}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="date"
          value={newMedicine.expiryDate}
          onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Reorder Level"
          value={newMedicine.reorderLevel}
          onChange={(e) => setNewMedicine({ ...newMedicine, reorderLevel: Number(e.target.value) })}
          className="p-2 border rounded w-full mb-2"
        />
        <button onClick={saveMedicine} className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingMedicine ? "Update Medicine" : "Add Medicine"}
        </button>
        {editingMedicine && (
          <button onClick={() => setEditingMedicine(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Medicine Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Expiry Date</th>
              <th className="border p-2">Expiry Status</th>
              <th className="border p-2">Reorder Level</th>
              <th className="border p-2">Stock Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine, index) => {
              const expiryStatus = getExpiryStatus(medicine.expiryDate);
              return (
                <tr key={medicine.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{medicine.name}</td>
                  <td className="border p-2">{medicine.category}</td>
                  <td className="border p-2">{medicine.quantity}</td>
                  <td className="border p-2">{medicine.expiryDate}</td>
                  <td className={`border p-2 ${expiryStatus.className}`}>{expiryStatus.text}</td>
                  <td className="border p-2">{medicine.reorderLevel}</td>
                  <td className={`border p-2 font-bold ${medicine.quantity <= medicine.reorderLevel ? "text-red-600" : "text-green-600"}`}>
                    {medicine.quantity <= medicine.reorderLevel ? "Low Stock" : "In Stock"}
                  </td>
                  <td className="border p-2 flex justify-center space-x-2">
                    <button onClick={() => editMedicine(medicine)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteMedicine(medicine.id)} className="bg-red-600 text-white px-2 py-1 rounded">
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
