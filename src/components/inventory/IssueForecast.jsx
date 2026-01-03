import { Card, CardBody } from "@material-tailwind/react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";

// Helper to resolve data from array or object
const resolveData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// Format value based on metric type
const formatValue = (value, metricType) => {
  if (value === null || value === undefined) return "";
  if (metricType === "totalAmount") {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)} tỷ`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} triệu`;
    }
    return new Intl.NumberFormat("vi-VN").format(value);
  }
  return new Intl.NumberFormat("vi-VN").format(value);
};

const IssueForecast = ({
  data = [],
  metric = "totalQuantity",
  label = "Số lượng",
  color = "#05518B",
  title,
}) => {
  const safeData = resolveData(data).filter(Boolean);

  // Build categories
  const allMonths = safeData.map((item) => item?.month ?? "");

  const series = [
    {
      name: label,
      data: safeData.map((item) => {
        const v = item?.[metric];
        const n = typeof v === "number" ? v : Number(v);
        return Number.isFinite(n) ? n : 0;
      }),
    },
  ];

  const chartData = {
    type: "bar",
    height: 350,
    series,
    options: {
      chart: {
        zoom: {
          enabled: true,
        },
        toolbar: {
          show: true,
        },
        stacked: false,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      title: {
        show: !!title,
        text: title || "",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: 600,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: "#1F2937",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => formatValue(val, metric),
        style: {
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          colors: ["#374151"],
        },
        offsetY: -20,
      },
      colors: [color],
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 6,
          dataLabels: {
            position: "top",
          },
        },
      },
      stroke: { width: 0 },
      markers: { size: 0 },
      xaxis: {
        categories: allMonths,
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          },
          rotate: safeData.length > 6 ? -45 : 0,
          rotateAlways: safeData.length > 6,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          },
          formatter: (val) => formatValue(val, metric),
        },
        title: {
          text: label,
          style: {
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            color: '#6B7280',
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#E5E7EB",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 5, right: 20, bottom: 5 },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        fontSize: "13px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        labels: { colors: "#374151" },
        markers: { width: 12, height: 12, radius: 2 },
      },
      tooltip: {
        theme: "light",
        shared: false,
        intersect: true,
        x: {
          show: true,
          formatter: (val, opts) => {
            const item = safeData[opts?.dataPointIndex];
            return item?.month ? `Tháng ${item.month}` : val;
          },
        },
        y: {
          formatter: (val) => {
            if (val === null || val === undefined) return "";
            return formatValue(val, metric);
          },
        },
        style: { fontSize: "13px", fontFamily: "Inter, sans-serif" },
      },
    },
  };

  // Empty state
  if (safeData.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardBody className="px-6 py-12 text-center">
          <p className="text-gray-500 text-lg font-medium">
            Chưa có dữ liệu để hiển thị
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardBody className="px-4 pb-4">
        <Chart {...chartData} />
      </CardBody>
    </Card>
  );
};

IssueForecast.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  metric: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
};

export default IssueForecast;
