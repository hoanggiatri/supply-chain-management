import { Card, CardBody } from "@material-tailwind/react";
import PropTypes from "prop-types";
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

  // Format value based on metric type
  const formatValue = (value, metricType) => {
    if (metricType === 'totalAmount') {
      // Format currency
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(2)} tỷ`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)} triệu`;
      }
      return new Intl.NumberFormat('vi-VN').format(value);
    }
    // Format regular numbers with Vietnamese locale
    return new Intl.NumberFormat('vi-VN').format(value);
  };

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
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      title: {
        show: !!title,
        text: title || "",
        align: 'left',
        style: {
          fontSize: "18px",
          fontWeight: 600,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#1F2937',
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => formatValue(val, metric),
        style: {
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          colors: ['#374151']
        },
        offsetY: -20,
      },
      colors: [color],
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 6,
          dataLabels: {
            position: 'top',
          },
        },
      },
      xaxis: {
        categories: safeData.map((item) => {
          const month = item?.month ?? "";
          // Format month from "MM/YYYY" to "Tháng MM/YY"
          if (month && month.includes('/')) {
            const [m, y] = month.split('/');
            return `Tháng ${m}/${y.slice(-2)}`;
          }
          return month;
        }),
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "13px",
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          },
          rotate: -45,
          rotateAlways: safeData.length > 6,
        },
        title: {
          text: 'Thời gian',
          style: {
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: '#374151',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "13px",
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          },
          formatter: (val) => formatValue(val, metric),
        },
        title: {
          text: label,
          style: {
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: '#374151',
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#E5E7EB",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
          bottom: 5,
        },
      },
      fill: {
        opacity: 0.9,
      },
      tooltip: {
        theme: "light",
        x: {
          show: true,
          formatter: (val, opts) => {
            const item = safeData[opts.dataPointIndex];
            return item?.month ? `Tháng ${item.month}` : val;
          },
        },
        y: {
          formatter: (val) => {
            const formatted = formatValue(val, metric);
            return `${label}: ${formatted}`;
          },
        },
        style: {
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#374151',
          useSeriesColors: false,
        },
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
      },
    },
  };

  if (safeData.length === 0) {
    return (
      <Card className="w-full">
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

MonthlyBarChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  metric: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
};

export default MonthlyBarChart;
