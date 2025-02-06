"use client";

import { useState } from "react";
import { jsPDF } from "jspdf"; // For generating invoices

interface Order {
  id: number;
  patientName: string;
  date: string;
  totalAmount: number;
  paymentMethod: "Cash" | "Mpesa" | "Insurance";
  status: "Pending" | "Completed";
}

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, patientName: "Alice Mwangi", date: "2025-02-05", totalAmount: 1500, paymentMethod: "Mpesa", status: "Completed" },
    { id: 2, patientName: "John Doe", date: "2025-02-06", totalAmount: 3000, paymentMethod: "Insurance", status: "Pending" },
  ]);

  // Mark order as completed
  const completeOrder = (id: number) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: "Completed" } : order)));
  };

  // Generate invoice for an order
  const generateInvoice = (order: Order) => {
    const doc = new jsPDF();
    doc.text("Pharmacy Invoice", 20, 20);
    doc.text(`Patient: ${order.patientName}`, 20, 30);
    doc.text(`Date: ${order.date}`, 20, 40);
    doc.text(`Total Amount: KES ${order.totalAmount}`, 20, 50);
    doc.text(`Payment Method: ${order.paymentMethod}`, 20, 60);
    doc.save(`${order.patientName}-invoice.pdf`);
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(
    (o) =>
      (filterStatus === "All" || o.status === filterStatus) &&
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📦 Orders & Sales</h2>

      {/* Search & Filter */}
      <input
        type="text"
        placeholder="🔍 Search by patient name..."
        className="p-2 border border-gray-300 rounded mb-4 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select className="p-2 border border-gray-300 rounded mb-4" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="All">All Orders</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Order List */}
      {filteredOrders.map((order) => (
        <div key={order.id} className="mb-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold">🧑‍⚕️ Patient: {order.patientName}</h3>
          <p className="text-gray-600">Date: {order.date}</p>
          <p className="text-gray-600">Total: KES {order.totalAmount}</p>
          <p className="text-gray-600">Payment: {order.paymentMethod}</p>
          <p className={`font-bold ${order.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>Status: {order.status}</p>

          <div className="mt-4 flex gap-4">
            {order.status === "Pending" && (
              <button onClick={() => completeOrder(order.id)} className="bg-blue-600 text-white px-4 py-2 rounded">
                ✅ Mark as Completed
              </button>
            )}
            <button onClick={() => generateInvoice(order)} className="bg-gray-600 text-white px-4 py-2 rounded">
              🧾 Print Invoice
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
