"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function RevenueChart() {
  const chartData = {
    labels: ["فروردین", "اردیبهشت", "خرداد", "تیر"],
    datasets: [
      {
        label: "درآمد (میلیون تومان)",
        data: [30, 45, 28, 60],
        fill: true,
        borderColor: "rgb(16, 185, 129)", // emerald-500
        backgroundColor: "rgba(16,185,129,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return <Line data={chartData} options={options} />;
}
