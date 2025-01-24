import { useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

type PerformanceData = { id: number; doctor: string; patientsSeen: number; averageRating: number };
type ScheduleData = { id: number; doctor: string; date: string; shift: string };
type AppointmentData = { id: number; doctor: string; patient: string; date: string; status: string };

type ReportType = "performance" | "schedules" | "appointments";

const reportsData = {
  performance: [
    { id: 1, doctor: "Dr. John", patientsSeen: 25, averageRating: 4.7 },
    { id: 2, doctor: "Dr. Jane", patientsSeen: 20, averageRating: 4.9 },
  ] as PerformanceData[],
  schedules: [
    { id: 1, doctor: "Dr. John", date: "2025-01-20", shift: "Morning" },
    { id: 2, doctor: "Dr. Jane", date: "2025-01-21", shift: "Evening" },
  ] as ScheduleData[],
  appointments: [
    { id: 1, doctor: "Dr. John", patient: "John Doe", date: "2025-01-20", status: "Completed" },
    { id: 2, doctor: "Dr. Jane", patient: "Jane Smith", date: "2025-01-21", status: "Pending" },
  ] as AppointmentData[],
};

export default function DoctorsReports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("performance");

  const getReportData = (): PerformanceData[] | ScheduleData[] | AppointmentData[] => {
    return reportsData[selectedReport];
  };

  const renderReport = () => {
    const reportData = getReportData();

    const chartStyles = {
      maxWidth: "400px", // Limit the chart width
      margin: "0 auto", // Center the chart horizontally
    };

    if (selectedReport === "performance") {
      const data = reportData as PerformanceData[];
      return (
        <div>
          <h2 className="text-xl font-bold mb-4">Performance</h2>
          <div style={chartStyles}>
            <Bar
              data={{
                labels: data.map((item) => item.doctor),
                datasets: [
                  {
                    label: "Patients Seen",
                    data: data.map((item) => item.patientsSeen),
                    backgroundColor: "#36A2EB",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
              }}
            />
          </div>
        </div>
      );
    }

    if (selectedReport === "schedules") {
      const data = reportData as ScheduleData[];
      return (
        <div>
          <h2 className="text-xl font-bold mb-4">Schedules</h2>
          <div style={chartStyles}>
            <Pie
              data={{
                labels: data.map((item) => `${item.doctor} (${item.shift})`),
                datasets: [
                  {
                    label: "Schedules",
                    data: data.map(() => 1),
                    backgroundColor: ["#FF6384", "#4A90E2"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
              }}
            />
          </div>
        </div>
      );
    }

    if (selectedReport === "appointments") {
      const data = reportData as AppointmentData[];
      return (
        <div>
          <h2 className="text-xl font-bold mb-4">Appointments</h2>
          <div style={chartStyles}>
            <Line
              data={{
                labels: data.map((item) => item.date),
                datasets: [
                  {
                    label: "Completed Appointments",
                    data: data.map(() => 1),
                    borderColor: "#FF6384",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
              }}
            />
          </div>
        </div>
      );
    }

    return <p>Select a report type to view data.</p>;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Doctors Reports</h1>

      {/* Report Selection */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedReport("performance")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Performance
        </button>
        <button
          onClick={() => setSelectedReport("schedules")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Schedules
        </button>
        <button
          onClick={() => setSelectedReport("appointments")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Appointments
        </button>
      </div>

      {/* Report Content */}
      <div className="border p-4 rounded bg-gray-50 mb-6">{renderReport()}</div>
    </div>
  );
}
