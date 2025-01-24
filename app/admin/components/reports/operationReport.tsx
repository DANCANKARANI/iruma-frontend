import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OperationReports() {
  // State for operation summary
  const [operationSummary, setOperationSummary] = useState<{
    emergency: number;
    outpatient: number;
    inpatient: number;
    surgery: number;
    others: number;
  } | null>(null);

  // Simulate API call to fetch operation data
  useEffect(() => {
    // Replace this with your API call logic
    const fetchData = async () => {
      const mockData = {
        emergency: 45,
        outpatient: 80,
        inpatient: 65,
        surgery: 30,
        others: 20,
      };
      setTimeout(() => setOperationSummary(mockData), 1000); // Simulate delay
    };

    fetchData();
  }, []);

  // Data and chart options for Bar Chart
  const data = {
    labels: ["Emergency", "Outpatient", "Inpatient", "Surgery", "Others"],
    datasets: [
      {
        label: "Number of Operations",
        data: operationSummary
          ? Object.values(operationSummary)
          : [0, 0, 0, 0, 0], // Show 0 while loading
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Operations Overview",
      },
    },
  };

  const chartStyles = {
    maxWidth: "400px", // Limit the width of the chart
    margin: "0 auto", // Center the chart horizontally
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Operations Report</h1>

      {/* Chart Section */}
      <div style={chartStyles} className="mb-6">
        {operationSummary ? (
          <Bar data={data} options={options} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      {/* Summary Section */}
      <div className="border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        {operationSummary ? (
          <ul className="list-disc list-inside mt-4">
            <li>
              <strong>Emergency:</strong> {operationSummary.emergency} cases
            </li>
            <li>
              <strong>Outpatient:</strong> {operationSummary.outpatient} cases
            </li>
            <li>
              <strong>Inpatient:</strong> {operationSummary.inpatient} cases
            </li>
            <li>
              <strong>Surgery:</strong> {operationSummary.surgery} cases
            </li>
            <li>
              <strong>Others:</strong> {operationSummary.others} cases
            </li>
          </ul>
        ) : (
          <p>Loading summary...</p>
        )}
      </div>
    </div>
  );
}
