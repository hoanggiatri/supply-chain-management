import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyBarChart = ({
  data,
  metric = "totalQuantity",
  label = "Số lượng",
  color = "#05518B",
}) => {
  const resolveData = () => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const safeData = resolveData().filter(Boolean);

  const chartData = {
    labels: safeData.map((item) => item?.month ?? ""),
    datasets: [
      {
        label,
        data: safeData.map((item) => {
          const v = item?.[metric];
          const n = typeof v === "number" ? v : Number(v);
          return Number.isFinite(n) ? n : 0;
        }),
        backgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 3,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
};

MonthlyBarChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  metric: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
};

export default MonthlyBarChart;
