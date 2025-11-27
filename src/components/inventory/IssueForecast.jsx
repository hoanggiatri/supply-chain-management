import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";

const IssueForecast = ({
  data = [],
  forecastData = [],
  metric = "totalQuantity",
  label = "Số lượng",
  color = "#05518B",
  title,
}) => {
  const allMonths = Array.from(
    new Set([...data, ...forecastData].map((item) => item.month))
  );

  const actualMap = Object.fromEntries(
    data.map((item) => [item.month, item[metric]])
  );
  const forecastMap = Object.fromEntries(
    forecastData.map((item) => [item.month, item[metric]])
  );

  const chartData = {
    type: "line",
    height: 350,
    series: [
      {
        name: "Thực tế",
        type: "column",
        data: allMonths.map((month) => {
          const val = actualMap[month];
          return val !== undefined && val !== null ? Number(val) : 0;
        }),
      },
      {
        name: "Dự báo",
        type: "line",
        data: allMonths.map((month) => {
          const val = forecastMap[month];
          return val !== undefined && val !== null ? Number(val) : null;
        }),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        stacked: false,
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
      colors: [color, "#FF9900"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 4,
        },
      },
      stroke: {
        width: [0, 2],
        curve: "smooth",
      },
      markers: {
        size: [0, 4],
        colors: ["#FF9900"],
        strokeColors: "#FF9900",
        strokeWidth: 2,
      },
      xaxis: {
        categories: allMonths,
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
        opacity: [0.8, 1],
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        fontSize: "12px",
        fontFamily: "inherit",
        markers: {
          width: 12,
          height: 12,
          radius: 2,
        },
      },
      tooltip: {
        theme: "light",
        shared: true,
        intersect: false,
        y: {
          formatter: (val) => {
            if (val === null || val === undefined) return "";
            return `${val} ${label.toLowerCase()}`;
          },
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

IssueForecast.propTypes = {
  data: PropTypes.array,
  forecastData: PropTypes.array,
  metric: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
};

export default IssueForecast;
