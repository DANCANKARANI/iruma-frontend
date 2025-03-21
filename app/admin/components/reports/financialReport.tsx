"use client";

import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

type ReportType = "profitLoss" | "revenueByMonth" | "expenseBreakdown"; // Financial report types

export default function FinancialReports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("profitLoss");

  // Sample financial data
  const financialData = {
    profitLoss: [
      { id: 1, date: "2025-01-01", revenue: 5000, expenses: 3000, profit: 2000 },
      { id: 2, date: "2025-01-02", revenue: 7000, expenses: 4000, profit: 3000 },
    ],
    revenueByMonth: [
      { month: "January", revenue: 50000 },
      { month: "February", revenue: 60000 },
    ],
    expenseBreakdown: [
      { category: "Salaries", amount: 30000 },
      { category: "Supplies", amount: 20000 },
      { category: "Utilities", amount: 10000 },
    ],
  };

  const exportToPDF = () => {
    const doc = new jsPDF(); // No need for `any`
    doc.text("Financial Report", 10, 10);

    // Define table headers for each report type
    const headers = {
      profitLoss: ["Date", "Revenue (KES)", "Expenses (KES)", "Profit (KES)"],
      revenueByMonth: ["Month", "Revenue (KES)"],
      expenseBreakdown: ["Category", "Amount (KES)"],
    };

    let reportData: ReportData[] = [];
    if (selectedReport === "profitLoss") reportData = financialData.profitLoss;
    if (selectedReport === "revenueByMonth")
      reportData = financialData.revenueByMonth;
    if (selectedReport === "expenseBreakdown")
      reportData = financialData.expenseBreakdown;

    // Prepare the table data
    const tableData = reportData.map((item) => {
      if (selectedReport === "profitLoss") {
        return [item.date, item.revenue, item.expenses, item.profit];
      }
      if (selectedReport === "revenueByMonth") {
        return [item.month, item.revenue];
      }
      if (selectedReport === "expenseBreakdown") {
        return [item.category, item.amount];
      }
      return [];
    });

    // Add the table to the PDF
    doc.autoTable({
      startY: 20, // Position the table below the title
      head: [headers[selectedReport]], // Column headers
      body: tableData, // Table rows
    });

    // Save the PDF
    doc.save(`${selectedReport}_report.pdf`);
  };

  const exportToExcel = () => {
    let reportData: any[] = [];
    if (selectedReport === "profitLoss") reportData = financialData.profitLoss;
    if (selectedReport === "revenueByMonth")
      reportData = financialData.revenueByMonth;
    if (selectedReport === "expenseBreakdown")
      reportData = financialData.expenseBreakdown;

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedReport);

    XLSX.writeFile(workbook, `${selectedReport}_report.xlsx`);
  };

  const renderReport = () => {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
    };

    const chartStyle = {
      maxWidth: "400px",
      maxHeight: "300px",
      margin: "0 auto",
    };

    switch (selectedReport) {
      case "profitLoss":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Profit & Loss</h2>
            <div style={chartStyle}>
              <Bar
                data={{
                  labels: financialData.profitLoss.map((item) => item.date),
                  datasets: [
                    {
                      label: "Profit (KES)",
                      data: financialData.profitLoss.map((item) => item.profit),
                      backgroundColor: "#36A2EB",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        );

      case "revenueByMonth":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Revenue by Month</h2>
            <div style={chartStyle}>
              <Pie
                data={{
                  labels: financialData.revenueByMonth.map((item) => item.month),
                  datasets: [
                    {
                      label: "Revenue (KES)",
                      data: financialData.revenueByMonth.map(
                        (item) => item.revenue
                      ),
                      backgroundColor: ["#FF6384", "#36A2EB"],
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        );

      case "expenseBreakdown":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
            <div style={chartStyle}>
              <Bar
                data={{
                  labels: financialData.expenseBreakdown.map(
                    (item) => item.category
                  ),
                  datasets: [
                    {
                      label: "Amount (KES)",
                      data: financialData.expenseBreakdown.map(
                        (item) => item.amount
                      ),
                      backgroundColor: "#4A90E2",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        );

      default:
        return <p>Select a report to view its details.</p>;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Reports</h1>

      {/* Report Selection */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedReport("profitLoss")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Profit & Loss
        </button>
        <button
          onClick={() => setSelectedReport("revenueByMonth")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Revenue by Month
        </button>
        <button
          onClick={() => setSelectedReport("expenseBreakdown")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Expense Breakdown
        </button>
      </div>

      {/* Flex container for report and export options */}
      <div className="flex justify-between mb-6">
        <div className="w-full max-w-screen-md">{renderReport()}</div>
        {/* Export Buttons on the Right */}
        <div className="flex flex-col gap-4">
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Export to PDF
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
}
