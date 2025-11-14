import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const IssueForecast = ({
  data,
  forecastData = [],
  metric = "totalQuantity",
  label = "Số lượng",
  color = "#05518B"
}) => {
  const allMonths = Array.from(
    new Set([...data, ...forecastData].map((item) => item.month))
  );

  const actualMap = Object.fromEntries(data.map((item) => [item.month, item[metric]]));
  const forecastMap = Object.fromEntries(forecastData.map((item) => [item.month, item[metric]]));

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        type: "bar",
        label: "Thực tế",
        data: allMonths.map((month) => actualMap[month] ?? 0),
        backgroundColor: color
      },
      {
        type: "line",
        label: "Dự báo",
        data: allMonths.map((month) => forecastMap[month] ?? null),
        borderColor: "#FF9900",
        borderWidth: 2,
        fill: false,
        tension: 0.2,
        pointRadius: 3,
        pointBackgroundColor: "#FF9900"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 3,
    plugins: {
      legend: { display: true },
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

export default IssueForecast;
