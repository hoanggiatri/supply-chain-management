import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyBarChart = ({
  data,
  metric = "totalQuantity",
  label = "Số lượng",
  color = "#05518B",
}) => {
  const raw = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];
  const safeData = raw.filter(Boolean);

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
    <Box width="100%" maxWidth="md" mx="auto">
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default MonthlyBarChart;
