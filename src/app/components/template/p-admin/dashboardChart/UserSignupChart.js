"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function UserSignupChart({ signupData }) {
  const chartData = {
    labels: signupData.map(item => item.date), // ["2025-07-01", "2025-07-02", ...]
    datasets: [
      {
        label: "تعداد ثبت‌نام",
        data: signupData.map(item => item.count), // [5, 10, 2, ...]
        backgroundColor: "rgba(59,130,246,0.6)", // blue-500
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return <Bar data={chartData} options={options} />;
}
