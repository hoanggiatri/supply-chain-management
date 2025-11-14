import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Box, Typography } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, labelField, valueField, title }) => {
  const chartData = {
    labels: data.map((d) => d[labelField]),
    datasets: [
      {
        data: data.map((d) => d[valueField]),
        backgroundColor: [
          "#05518B", "#FAAD14", "#389E0D"
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          boxWidth: 20,
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: { enabled: true }
    }
  };

  return (
    <Box width="100%" maxWidth="sm" mx="auto">
      <Typography variant="h6" align="center" gutterBottom>{title}</Typography>
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default PieChart;
