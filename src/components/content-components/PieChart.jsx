import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";

const PieChart = ({ data, labelField, valueField, title }) => {
  const chartData = {
    type: "pie",
    height: 350,
    series: data.map((d) => d[valueField]),
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
        align: "center",
      },
      labels: data.map((d) => d[labelField]),
      colors: [
        "#05518B",
        "#FAAD14",
        "#389E0D",
        "#FF4D4F",
        "#722ED1",
        "#13C2C2",
      ],
      legend: {
        position: "bottom",
        fontSize: "12px",
        fontFamily: "inherit",
        markers: {
          width: 12,
          height: 12,
          radius: 2,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontFamily: "inherit",
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => val,
        },
      },
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardBody className="px-2 pb-0">
        <Chart {...chartData} />
      </CardBody>
    </Card>
  );
};

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
  labelField: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default PieChart;
