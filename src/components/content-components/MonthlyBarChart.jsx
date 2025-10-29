import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyBarChart = ({ data, metric = "totalQuantity", label = "Số lượng", color = "#05518B" }) => {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label,
        data: data.map((item) => item[metric]),
        backgroundColor: color
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 3,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <Box width="100%" maxWidth="md" mx="auto">
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default MonthlyBarChart;
