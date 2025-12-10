import { motion } from 'framer-motion';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '../../context/ThemeContext';

/**
 * Order trends chart using ApexCharts
 * Shows line/bar chart for monthly order data
 */
const OrderTrendsChart = ({
  data = [],
  loading = false,
  type = 'area' // 'line', 'bar', 'area'
}) => {
  const { isDark } = useTheme();
  const [chartType, setChartType] = useState(type);

  // Default mock data if no data provided
  const defaultData = [
    { month: 'T1', orders: 45, revenue: 120 },
    { month: 'T2', orders: 52, revenue: 145 },
    { month: 'T3', orders: 48, revenue: 130 },
    { month: 'T4', orders: 70, revenue: 180 },
    { month: 'T5', orders: 65, revenue: 170 },
    { month: 'T6', orders: 85, revenue: 220 },
    { month: 'T7', orders: 78, revenue: 200 },
    { month: 'T8', orders: 95, revenue: 250 },
    { month: 'T9', orders: 88, revenue: 230 },
    { month: 'T10', orders: 110, revenue: 290 },
    { month: 'T11', orders: 102, revenue: 270 },
    { month: 'T12', orders: 125, revenue: 320 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const options = {
    chart: {
      id: 'order-trends',
      type: chartType,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    colors: ['#3B82F6', '#8B5CF6'],
    stroke: {
      curve: 'smooth',
      width: chartType === 'bar' ? 0 : 3,
    },
    fill: {
      type: chartType === 'area' ? 'gradient' : 'solid',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.map(d => d.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: isDark ? '#94A3B8' : '#64748B',
          fontSize: '12px',
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Số đơn hàng',
          style: {
            color: isDark ? '#94A3B8' : '#64748B',
            fontSize: '12px',
          }
        },
        labels: {
          style: {
            colors: isDark ? '#94A3B8' : '#64748B',
            fontSize: '12px',
          },
          formatter: (val) => Math.round(val)
        }
      },
      {
        opposite: true,
        title: {
          text: 'Doanh thu (triệu)',
          style: {
            color: isDark ? '#94A3B8' : '#64748B',
            fontSize: '12px',
          }
        },
        labels: {
          style: {
            colors: isDark ? '#94A3B8' : '#64748B',
            fontSize: '12px',
          },
          formatter: (val) => `${Math.round(val)}M`
        }
      }
    ],
    grid: {
      borderColor: isDark ? '#334155' : '#E2E8F0',
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10,
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: isDark ? '#CBD5E1' : '#475569',
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4,
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      shared: true,
      intersect: false,
      y: {
        formatter: (val, { seriesIndex }) => {
          if (seriesIndex === 0) return `${val} đơn`;
          return `${val}M VNĐ`;
        }
      }
    },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: {
          height: 250
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = [
    {
      name: 'Đơn hàng',
      type: chartType === 'bar' ? 'column' : chartType,
      data: chartData.map(d => d.orders)
    },
    {
      name: 'Doanh thu',
      type: chartType === 'bar' ? 'column' : chartType,
      data: chartData.map(d => d.revenue)
    }
  ];

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center">
        <div className="mp-skeleton w-full h-full rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chart Type Toggle */}
      <div className="flex justify-end gap-2 mb-4">
        {['area', 'line', 'bar'].map((t) => (
          <button
            key={t}
            onClick={() => setChartType(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${chartType === t
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-transparent hover:bg-black/5'
              }`}
            style={{
              color: chartType === t ? 'white' : 'var(--mp-text-secondary)'
            }}
          >
            {t === 'area' ? 'Area' : t === 'line' ? 'Line' : 'Bar'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <Chart
        options={options}
        series={series}
        type={chartType}
        height={300}
      />
    </motion.div>
  );
};

export default OrderTrendsChart;
