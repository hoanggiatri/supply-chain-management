import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";

const MonthlyBarChart = ({
  data,
  metric = "totalQuantity",
  label = "Số lượng",
  color = "#05518B",
  title,
}) => {
  const resolveData = () => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const safeData = resolveData().filter(Boolean);

  const chartData = {
    type: "bar",
    height: 350,
    series: [
      {
        name: label,
        data: safeData.map((item) => {
          const v = item?.[metric];
          const n = typeof v === "number" ? v : Number(v);
          return Number.isFinite(n) ? n : 0;
        }),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: !!title,
        text: title || "",
        style: {
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: "inherit",
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: [color],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 4,
        },
      },
      xaxis: {
        categories: safeData.map((item) => item?.month ?? ""),
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => `${val} ${label.toLowerCase()}`,
        },
      },
    },
  };

  return (
    <Card className="w-full">
      <CardBody className="px-2 pb-0">
        <Chart {...chartData} />
      </CardBody>
    </Card>
  );
};

MonthlyBarChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  metric: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
};

export default MonthlyBarChart;
