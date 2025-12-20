import { motion } from 'framer-motion';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '../../context/ThemeContext';

/**
 * Biểu đồ so sánh giữa dữ liệu mua và bán hàng
 * Hiển thị biểu đồ 2 trục cho cả số đơn và giá trị
 */
const ComparisonChart = ({
  data = [],
  loading = false
}) => {
  const { isDark } = useTheme();
  const [chartType, setChartType] = useState('area');

  const options = {
    chart: {
      id: 'purchase-sales-comparison',
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
      }
    },
    colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'],
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
      categories: data.map(d => d.month),
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
          text: 'Số đơn',
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
      {
        seriesName: 'Doanh thu mua',
        opposite: true,
        title: {
          text: 'Giá trị (triệu VNĐ)',
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
      floating: false,
      offsetY: 0,
      itemMargin: {
        horizontal: 10,
        vertical: 0
      },
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
          if (seriesIndex === 0 || seriesIndex === 1) return `${val} đơn`;
          return `${val.toFixed(1)}M VNĐ`;
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
      name: 'Đơn mua',
      type: chartType === 'bar' ? 'column' : chartType,
      data: data.map(d => d.purchaseOrders || 0),
      yAxisIndex: 0
    },
    {
      name: 'Đơn bán',
      type: chartType === 'bar' ? 'column' : chartType,
      data: data.map(d => d.salesOrders || 0),
      yAxisIndex: 0
    },
    {
      name: 'Giá trị mua',
      type: chartType === 'bar' ? 'column' : chartType,
      data: data.map(d => d.purchaseRevenue || 0),
      yAxisIndex: 1
    },
    {
      name: 'Doanh thu',
      type: chartType === 'bar' ? 'column' : chartType,
      data: data.map(d => d.salesRevenue || 0),
      yAxisIndex: 1
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
            {t === 'area' ? 'Vùng' : t === 'line' ? 'Đường' : 'Cột'}
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

export default ComparisonChart;
