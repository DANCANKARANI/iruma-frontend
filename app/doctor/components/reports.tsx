"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for reports
const sampleData = [
  { name: "Jan", appointments: 120, prescriptions: 80 },
  { name: "Feb", appointments: 150, prescriptions: 90 },
  { name: "Mar", appointments: 200, prescriptions: 120 },
  { name: "Apr", appointments: 180, prescriptions: 100 },
  { name: "May", appointments: 220, prescriptions: 130 },
  { name: "Jun", appointments: 250, prescriptions: 150 },
];

export const Reports = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Filter data based on date range (simplified for demo)
  const filteredData = sampleData.filter((entry) => {
    // Add actual date filtering logic here
    return true;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📊 Reports & Analytics</h1>

      {/* Date Range Filter */}
      <div className="mb-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">Filter by Date Range</h2>
        <div className="flex gap-4">
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={handleDateRangeChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={handleDateRangeChange}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold">Total Appointments</h3>
          <p className="text-2xl font-bold">1,200</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold">Completed Prescriptions</h3>
          <p className="text-2xl font-bold">800</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold">Active Patients</h3>
          <p className="text-2xl font-bold">350</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Appointments & Prescriptions Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="appointments" fill="#8884d8" />
            <Bar dataKey="prescriptions" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};