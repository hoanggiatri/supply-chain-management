import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  RefreshCw,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useMemo } from 'react';
import { MetricCard } from '../../../components/cards';
import { OrderTrendsChart } from '../../../components/charts';
import { MetricCardSkeleton } from '../../../components/ui';
import {
  useMonthlyPurchaseReport,
  useMonthlySalesReport,
  usePosInCompany,
  useSosInCompany
} from '../../../hooks/useApi';

const formatCurrency = (amount) => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B VNĐ`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M VNĐ`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K VNĐ`;
  }
  return `${new Intl.NumberFormat('vi-VN').format(amount)} VNĐ`;
};

/**
 * Purchase/Sales Report page with charts and statistics
 */
const Report = ({ type = 'purchase' }) => {
  const isPurchase = type === 'purchase';

  // Call ALL hooks unconditionally at top level (React hooks rules)
  const purchaseReportQuery = useMonthlyPurchaseReport();
  const salesReportQuery = useMonthlySalesReport();
  const posQuery = usePosInCompany();
  const sosQuery = useSosInCompany();

  // Select the appropriate query based on type
  const reportQuery = isPurchase ? purchaseReportQuery : salesReportQuery;
  const ordersQuery = isPurchase ? posQuery : sosQuery;

  // Calculate stats
  const stats = useMemo(() => {
    let ordersData = ordersQuery.data || [];
    // Handle different API response structures
    if (!Array.isArray(ordersData)) {
      ordersData = ordersData.content || ordersData.data || [];
    }
    if (!Array.isArray(ordersData)) ordersData = [];

    let reportData = reportQuery.data || [];
    if (!Array.isArray(reportData)) {
      reportData = reportData.content || reportData.data || [];
    }
    if (!Array.isArray(reportData)) reportData = [];

    // Only count completed orders for total
    const totalOrders = ordersData.filter(o =>
      o && ['Đã hoàn thành'].includes(o.status)
    ).length;
    
    const completedOrders = totalOrders; // Same as totalOrders now
    
    const pendingOrders = ordersData.filter(o =>
      o && ['Chờ xuất kho', 'Chờ vận chuyển', 'Đang vận chuyển'].includes(o.status)
    ).length;
    
    // Total amount from completed orders only
    const totalAmount = ordersData
      .filter(o => o && ['Đã hoàn thành'].includes(o.status))
      .reduce((sum, o) => sum + (o?.totalAmount || 0), 0);

    // Get this month and last month from report
    const thisMonth = reportData[reportData.length - 1] || {};
    const lastMonth = reportData[reportData.length - 2] || {};
    const growth = lastMonth.totalAmount
      ? ((thisMonth.totalAmount - lastMonth.totalAmount) / lastMonth.totalAmount * 100).toFixed(1)
      : 0;

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalAmount,
      growth: parseFloat(growth),
      avgOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0
    };
  }, [ordersQuery.data, reportQuery.data]);

  // Chart data
  const chartData = useMemo(() => {
    const report = reportQuery.data || [];
    if (!Array.isArray(report)) return [];

    return report.map(item => {
      const month = item.month || item.monthNumber || '';
      // Format month from "MM/YYYY" to "MM/YY" without T prefix
      let formattedMonth = month;
      if (month && month.includes('/')) {
        const [m, y] = month.split('/');
        formattedMonth = `${m}/${y.slice(-2)}`;
      }
      
      return {
        month: formattedMonth,
        orders: item.totalOrder || item.orderCount || item.count || 0,
        revenue: (item.totalAmount || item.revenue || 0) / 1000000
      };
    });
  }, [reportQuery.data]);

  // Orders by month for table
  const monthlyData = useMemo(() => {
    const report = reportQuery.data || [];
    if (!Array.isArray(report)) return [];

    return [...report].reverse().slice(0, 6);
  }, [reportQuery.data]);

  const isLoading = reportQuery.isLoading || ordersQuery.isLoading;

  const metrics = [
    {
      key: 'total',
      label: isPurchase ? 'Tổng đơn mua' : 'Tổng đơn bán',
      value: stats.totalOrders,
      trend: 'up',
      trendValue: `${stats.totalOrders} đơn đã hoàn thành`,
      icon: '📦',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      key: 'pending',
      label: 'Đang xử lý',
      value: stats.pendingOrders,
      trend: stats.pendingOrders > 0 ? 'up' : 'down',
      trendValue: `${stats.pendingOrders} đơn`,
      icon: '⏳',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600'
    },
    {
      key: 'amount',
      label: isPurchase ? 'Tổng chi' : 'Doanh thu',
      value: stats.totalAmount,
      trend: stats.growth >= 0 ? 'up' : 'down',
      trendValue: `${stats.growth >= 0 ? '+' : ''}${stats.growth}% so với tháng trước`,
      icon: '💰',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    },
    {
      key: 'avg',
      label: 'Trung bình/đơn',
      value: stats.avgOrderValue,
      trend: 'up',
      trendValue: formatCurrency(stats.avgOrderValue), // formatCurrency đã có VNĐ
      icon: '📊',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Báo cáo {isPurchase ? 'mua hàng' : 'bán hàng'}
          </h1>
          <p
            className="mt-1"
            style={{ color: 'var(--mp-text-secondary)' }}
          >
            Thống kê hoạt động {isPurchase ? 'mua hàng' : 'bán hàng'} theo thời gian
          </p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => reportQuery.refetch()}
            className="mp-btn mp-btn-secondary"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mp-btn mp-btn-primary mp-ripple"
          >
            <Download size={18} />
            <span>Xuất báo cáo</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))
        ) : (
          metrics.map((metric, index) => (
            <MetricCard
              key={metric.key}
              icon={metric.icon}
              iconBg={metric.iconBg}
              label={metric.label}
              value={metric.key === 'amount' || metric.key === 'avg'
                ? formatCurrency(metric.value)
                : metric.value}
              trend={metric.trend}
              trendValue={metric.trendValue}
              delay={index * 0.1}
            />
          ))
        )}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Biểu đồ {isPurchase ? 'mua hàng' : 'doanh thu'} theo tháng
          </h2>
        </div>

        {isLoading ? (
          <div className="h-72 mp-skeleton rounded-xl" />
        ) : chartData.length > 0 ? (
          <OrderTrendsChart data={chartData} />
        ) : (
          <div className="h-72 flex items-center justify-center" style={{ color: 'var(--mp-text-tertiary)' }}>
            Chưa có dữ liệu
          </div>
        )}
      </motion.div>

      {/* Monthly Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mp-glass-card p-6"
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--mp-text-primary)' }}
        >
          Chi tiết theo tháng
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--mp-border-light)' }}>
                <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--mp-text-secondary)' }}>
                  Tháng
                </th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--mp-text-secondary)' }}>
                  Số đơn
                </th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--mp-text-secondary)' }}>
                  Giá trị
                </th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--mp-text-secondary)' }}>
                  Tăng trưởng
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-12 ml-auto" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-24 ml-auto" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : monthlyData.length > 0 ? (
                monthlyData.map((item, index) => {
                  const prevItem = monthlyData[index + 1];
                  const growth = prevItem?.totalAmount
                    ? ((item.totalAmount - prevItem.totalAmount) / prevItem.totalAmount * 100).toFixed(1)
                    : 0;
                  const isPositive = parseFloat(growth) >= 0;

                  return (
                    <tr
                      key={index}
                      style={{ borderBottom: index < monthlyData.length - 1 ? '1px solid var(--mp-border-light)' : undefined }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} style={{ color: 'var(--mp-text-tertiary)' }} />
                          <span style={{ color: 'var(--mp-text-primary)' }}>
                            Tháng {item.month || item.monthNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right" style={{ color: 'var(--mp-text-primary)' }}>
                        {item.orderCount || item.count || 0}
                      </td>
                      <td className="py-3 px-4 text-right font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                        {new Intl.NumberFormat('vi-VN').format(item.totalAmount || item.revenue || 0)} VNĐ
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {isPositive ? '+' : ''}{growth}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Chưa có dữ liệu báo cáo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Report;
