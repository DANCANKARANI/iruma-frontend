"use client";

import { useState, useEffect } from "react";

interface Medicine {
  id: string;
  medicine_id: number; // Added to match the backend
  name: string;
  category: string;
  quantity: number;
  expiry_date: string; // Ensure this matches the API response
  reorder_level: number;
}

interface MedicineOption {
  id: number; // Matches the backend
  name: string;
}

export default function Inventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicineList, setMedicineList] = useState<MedicineOption[]>([]); // For the dropdown
  const [dropdownSearch, setDropdownSearch] = useState(""); // For filtering dropdown options
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    id: "",
    medicine_id: 0, // Initialize to 0
    name: "",
    category: "",
    quantity: 0,
    expiry_date: "",
    reorder_level: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Access the API endpoint from .env
  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Function to check expiry status
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate); // Ensure expiryDate is in ISO format
    const timeDiff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert ms to days

    if (daysLeft < 0) return { text: "Expired", className: "text-red-600 font-bold" };
    if (daysLeft <= 30) return { text: "Expiring Soon", className: "text-orange-500 font-bold" };
    return { text: "Valid", className: "text-green-600 font-bold" };
  };

  // Fetch medicines for the dropdown
  useEffect(() => {
    const fetchMedicineList = async () => {
      try {
        const response = await fetch(`${API_URL}/medicine`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch medicine list");
        }

        setMedicineList(result.data); // Assuming the API returns { data: MedicineOption[] }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch medicine list");
        console.error("Error fetching medicine list:", err);
      }
    };

    fetchMedicineList();
  }, [API_URL]);

  // Fetch medicines for the inventory table
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/inventory`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch medicines");
        }

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid data format: Expected an array in 'data' property");
        }

        const transformedData = result.data.map((medicine: Medicine) => ({
          ...medicine,
          expiry_date: medicine.expiry_date.includes("T")
            ? medicine.expiry_date
            : `${medicine.expiry_date}T00:00:00Z`,
        }));

        setMedicines(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch medicines");
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [API_URL]);

  // Handle medicine selection from the dropdown
  const handleMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedName = e.target.value;
    const selectedMedicine = medicineList.find((med) => med.name === selectedName);

    if (selectedMedicine) {
      setNewMedicine((prev) => ({
        ...prev,
        medicine_id: selectedMedicine.id, // Set the medicine_id
        name: selectedMedicine.name,
      }));
    } else {
      setNewMedicine((prev) => ({
        ...prev,
        medicine_id: 0, // Reset medicine_id if no valid medicine is selected
        name: selectedName,
      }));
    }
    setDropdownSearch(selectedName); // Update the input with the selected medicine name
  };

  // Save or update medicine
  const saveMedicine = async () => {
    if (!newMedicine.name || !newMedicine.category || newMedicine.quantity <= 0) {
      alert("Please fill in all details correctly!");
      return;
    }

    setLoading(true);
    try {
      let response;
      const payload = {
        name: newMedicine.name,
        medicine_id: newMedicine.medicine_id, // Include medicine_id in the payload
        quantity: newMedicine.quantity,
        category: newMedicine.category,
        expiry_date: newMedicine.expiry_date.includes("T")
          ? newMedicine.expiry_date
          : `${newMedicine.expiry_date}T00:00:00Z`,
        reorder_level: newMedicine.reorder_level,
      };

      if (editingMedicine) {
        // Update existing medicine
        response = await fetch(`${API_URL}/inventory/${editingMedicine.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Add new medicine
        response = await fetch(`${API_URL}/inventory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save medicine");
      }

      if (!result.data || typeof result.data !== "object") {
        throw new Error("Invalid data format: Expected an object in 'data' property");
      }

      if (editingMedicine) {
        setMedicines((prev) =>
          prev.map((med) => (med.id === editingMedicine.id ? result.data : med))
        );
      } else {
        setMedicines((prev) => [...prev, result.data]);
      }

      setEditingMedicine(null);
      setNewMedicine({
        id: "",
        medicine_id: 0,
        name: "",
        category: "",
        quantity: 0,
        expiry_date: "",
        reorder_level: 0,
      });
      setDropdownSearch(""); // Clear the search input after saving
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save medicine");
      console.error("Error saving medicine:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Medicine
  const deleteMedicine = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/inventory/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete medicine");
      }

      setMedicines((prev) => prev.filter((medicine) => medicine.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete medicine");
      console.error("Error deleting medicine:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit Medicine
  const editMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setNewMedicine(medicine);
    setDropdownSearch(medicine.name); // Set the dropdown search to the medicine name
  };

  // Filter dropdown options based on search
  const filteredDropdownOptions = medicineList.filter((med) =>
    med.name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📦 Pharmacy Inventory</h2>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Add/Edit Medicine Form */}
      <div className="mb-4 p-4 border rounded bg-gray-100">
        <h3 className="text-lg font-bold mb-2">{editingMedicine ? "✏️ Edit Medicine" : "➕ Add New Medicine"}</h3>
        
        {/* Searchable Dropdown */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search medicines..."
            value={dropdownSearch}
            onChange={handleMedicineChange}
            list="medicineOptions"
            className="p-2 border rounded w-full mb-2"
          />
          <datalist id="medicineOptions">
            {filteredDropdownOptions.map((med) => (
              <option key={med.id} value={med.name}>
                {med.name}
              </option>
            ))}
          </datalist>
        </div>

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
          value={newMedicine.quantity === 0 ? "" : newMedicine.quantity}
          onChange={(e) => setNewMedicine({ ...newMedicine, quantity: Number(e.target.value) })}
          className="p-2 border rounded w-full mb-2"
        />
        <div className="relative mb-2">
          <input
            type="date"
            value={newMedicine.expiry_date.split("T")[0]}
            onChange={(e) =>
              setNewMedicine({ ...newMedicine, expiry_date: `${e.target.value}T00:00:00Z` })
            }
            className="p-2 border rounded w-full"
          />
          {!newMedicine.expiry_date && (
            <span className="absolute left-2 top-2 text-gray-400 pointer-events-none">
              .........................Expiry Date
            </span>
          )}
        </div>
        <input
          type="number"
          placeholder="Reorder Level"
          value={newMedicine.reorder_level === 0 ? "" : newMedicine.reorder_level}
          onChange={(e) => setNewMedicine({ ...newMedicine, reorder_level: Number(e.target.value) })}
          className="p-2 border rounded w-full mb-2"
        />
        <button
          onClick={saveMedicine}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : editingMedicine ? "Update Medicine" : "Add Medicine"}
        </button>
        {editingMedicine && (
          <button
            onClick={() => setEditingMedicine(null)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
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
            {medicines.map((medicine, index) => {
              const expiryStatus = getExpiryStatus(medicine.expiry_date);
              return (
                <tr key={medicine.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{medicine.name}</td>
                  <td className="border p-2">{medicine.category}</td>
                  <td className="border p-2">{medicine.quantity}</td>
                  <td className="border p-2">
                    {new Date(medicine.expiry_date).toLocaleDateString()}
                  </td>
                  <td className={`border p-2 ${expiryStatus.className}`}>{expiryStatus.text}</td>
                  <td className="border p-2">{medicine.reorder_level}</td>
                  <td className={`border p-2 font-bold ${medicine.quantity <= medicine.reorder_level ? "text-red-600" : "text-green-600"}`}>
                    {medicine.quantity <= medicine.reorder_level ? "Low Stock" : "In Stock"}
                  </td>
                  <td className="border p-2 flex justify-center space-x-2">
                    <button
                      onClick={() => editMedicine(medicine)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteMedicine(medicine.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
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