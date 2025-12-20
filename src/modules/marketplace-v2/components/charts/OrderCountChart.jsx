import { motion } from 'framer-motion';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '../../context/ThemeContext';

/**
 * Biểu đồ so sánh số lượng đơn mua/bán
 */
const OrderCountChart = ({
  data = [],
  loading = false,
  type = 'line' // Default to line chart
}) => {
  const { isDark } = useTheme();
  const [chartType, setChartType] = useState(type);

  const options = {
    chart: {
      id: 'order-count-comparison',
      type: chartType,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
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
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDark ? '#94A3B8' : '#64748B',
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      title: {
        text: 'Số đơn hàng',
        style: {
          color: isDark ? '#94A3B8' : '#64748B',
          fontSize: '13px',
          fontWeight: 600,
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
    grid: {
      borderColor: isDark ? '#334155' : '#E2E8F0',
      strokeDashArray: 4,
      padding: { left: 10, right: 10 }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: false,
      labels: {
        colors: isDark ? '#CBD5E1' : '#475569',
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4,
        fillColors: ['#3B82F6', '#8B5CF6']
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} đơn`
      }
    },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: { height: 250 },
        legend: { position: 'bottom' }
      }
    }]
  };

  const series = [
    {
      name: 'Đơn mua',
      type: chartType === 'bar' ? 'column' : chartType,
      data: data.map(d => d.purchaseOrders || 0)
    },
    {
      name: 'Đơn bán',
      type: chartType === 'bar' ? 'column' : chartType,
      data: data.map(d => d.salesOrders || 0)
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
      {/* Chọn loại biểu đồ */}
      <div className="flex justify-end gap-2 mb-4">
        {['line', 'bar'].map((t) => (
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
            {t === 'line' ? 'Đường' : 'Cột'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <Chart
        options={options}
        series={series}
        type={chartType}
        height={280}
      />
    </motion.div>
  );
};

export default OrderCountChart;
