import { motion } from 'framer-motion';
import {
  ArrowRight,
  DollarSign,
  FileText,
  Package,
  Plus,
  TrendingUp
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../../components/cards';
import { OrderTrendsChart } from '../../components/charts';
import { ActivityTimeline } from '../../components/timeline';
import { MetricCardSkeleton } from '../../components/ui';
import {
  useMonthlyPurchaseReport,
  useMonthlySalesReport,
  usePosInCompany,
  useQuotationsInCompany,
  useQuotationsInRequestCompany,
  useRfqsInCompany,
  useRfqsInRequestedCompany,
  useSosInCompany
} from '../../hooks/useApi';

/**
 * Dashboard page for Marketplace V2
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Get user info
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error('Error parsing user:', e);
    }
  }, []);

  const department = user?.departmentName || 'Mua hàng';
  const isPurchasing = department === 'Mua hàng';

  // Call ALL hooks unconditionally at top level (React hooks rules)
  const rfqsCompanyQuery = useRfqsInCompany();
  const rfqsRequestedQuery = useRfqsInRequestedCompany();
  const quotationsRequestedQuery = useQuotationsInRequestCompany();
  const quotationsCompanyQuery = useQuotationsInCompany();
  const posCompanyQuery = usePosInCompany();
  const sosCompanyQuery = useSosInCompany();
  const purchaseReportQuery = useMonthlyPurchaseReport();
  const salesReportQuery = useMonthlySalesReport();

  // Select the appropriate query based on department
  const rfqsQuery = isPurchasing ? rfqsCompanyQuery : rfqsRequestedQuery;
  const quotationsQuery = isPurchasing ? quotationsRequestedQuery : quotationsCompanyQuery;
  const ordersQuery = isPurchasing ? posCompanyQuery : sosCompanyQuery;
  const reportQuery = isPurchasing ? purchaseReportQuery : salesReportQuery;

  const isLoading = rfqsQuery.isLoading || quotationsQuery.isLoading || ordersQuery.isLoading;

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const rfqs = rfqsQuery.data || [];
    const quotations = quotationsQuery.data || [];
    const orders = ordersQuery.data || [];

    // Calculate totals
    const totalRfqs = rfqs.length;
    const pendingQuotations = quotations.filter(q =>
      q.status === 'PENDING' || q.status === 'pending'
    ).length;
    const processingOrders = orders.filter(o =>
      ['PENDING', 'CONFIRMED', 'PROCESSING', 'pending', 'confirmed', 'processing'].includes(o.status)
    ).length;

    // Calculate total revenue from orders
    const totalRevenue = orders.reduce((sum, order) => {
      const amount = order.totalAmount || order.total || 0;
      return sum + amount;
    }, 0);

    return [
      {
        key: 'rfq',
        label: isPurchasing ? 'Yêu cầu báo giá đã gửi' : 'RFQ từ khách hàng',
        value: totalRfqs,
        trend: 'up',
        trendValue: `${totalRfqs} yêu cầu`,
        icon: '📝',
        iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        link: isPurchasing ? '/marketplace-v2/rfqs' : '/marketplace-v2/supplier-rfqs'
      },
      {
        key: 'quotation',
        label: isPurchasing ? 'Báo giá chờ xử lý' : 'Báo giá đã gửi',
        value: pendingQuotations,
        trend: pendingQuotations > 0 ? 'up' : 'down',
        trendValue: `${pendingQuotations} đang chờ`,
        icon: '💰',
        iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
        link: isPurchasing ? '/marketplace-v2/customer-quotations' : '/marketplace-v2/quotations'
      },
      {
        key: 'orders',
        label: isPurchasing ? 'Đơn mua hàng' : 'Đơn bán hàng',
        value: processingOrders,
        trend: 'up',
        trendValue: `${processingOrders} đang xử lý`,
        icon: '📦',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        link: isPurchasing ? '/marketplace-v2/pos' : '/marketplace-v2/sos'
      },
      {
        key: 'revenue',
        label: isPurchasing ? 'Tổng giá trị mua hàng' : 'Doanh thu',
        value: totalRevenue,
        trend: 'up',
        trendValue: formatCurrency(totalRevenue),
        icon: '📈',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        link: isPurchasing ? '/marketplace-v2/purchase-report' : '/marketplace-v2/sales-report'
      },
    ];
  }, [rfqsQuery.data, quotationsQuery.data, ordersQuery.data, isPurchasing]);

  // Transform report data for chart
  const chartData = useMemo(() => {
    const report = reportQuery.data || [];
    if (!Array.isArray(report) || report.length === 0) {
      return [];
    }
    return report.map(item => ({
      month: `T${item.month || item.monthNumber}`,
      orders: item.orderCount || item.count || 0,
      revenue: (item.totalAmount || item.revenue || 0) / 1000000 // Convert to millions
    }));
  }, [reportQuery.data]);

  // Build activities from recent orders
  const activities = useMemo(() => {
    const orders = ordersQuery.data || [];
    return orders.slice(0, 5).map((order, index) => ({
      id: order.id || index,
      type: 'order',
      title: `${isPurchasing ? 'PO' : 'SO'}: ${order.code || order.orderCode || 'N/A'}`,
      description: `${order.supplierName || order.companyName || 'Công ty'} - ${formatCurrency(order.totalAmount || 0)}`,
      timestamp: order.createdAt || order.createdDate || new Date().toISOString(),
    }));
  }, [ordersQuery.data, isPurchasing]);

  const handleMetricClick = (metric) => {
    if (metric.link) {
      navigate(metric.link);
    }
  };

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
            Dashboard - {department}
          </h1>
          <p
            className="mt-1"
            style={{ color: 'var(--mp-text-secondary)' }}
          >
            Tổng quan hoạt động {isPurchasing ? 'mua hàng' : 'bán hàng'} của bạn
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(isPurchasing ? '/marketplace-v2/create-rfq' : '/marketplace-v2/create-quotation')}
            className="mp-btn mp-btn-primary mp-ripple"
          >
            <Plus size={18} />
            <span>{isPurchasing ? 'Tạo RFQ mới' : 'Tạo báo giá'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Metric Cards */}
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
              value={metric.value}
              trend={metric.trend}
              trendValue={metric.trendValue}
              onClick={() => handleMetricClick(metric)}
              delay={index * 0.1}
            />
          ))
        )}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mp-glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Xu hướng {isPurchasing ? 'mua hàng' : 'bán hàng'}
          </h2>
        </div>

        {reportQuery.isLoading ? (
          <div className="h-72 mp-skeleton rounded-xl" />
        ) : (
          <OrderTrendsChart data={chartData} />
        )}
      </motion.div>

      {/* Bottom Grid: Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="mp-glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--mp-text-primary)' }}
            >
              Hoạt động gần đây
            </h2>
            <button
              className="text-sm font-medium flex items-center gap-1 hover:underline"
              style={{ color: 'var(--mp-primary-600)' }}
              onClick={() => navigate(isPurchasing ? '/marketplace-v2/pos' : '/marketplace-v2/sos')}
            >
              Xem tất cả
              <ArrowRight size={14} />
            </button>
          </div>

          <ActivityTimeline
            activities={activities}
            loading={isLoading}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="mp-glass-card p-6"
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Hành động nhanh
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {(isPurchasing ? [
              { label: 'Tạo RFQ', icon: FileText, path: '/marketplace-v2/create-rfq', color: 'from-purple-500 to-purple-600' },
              { label: 'Xem báo giá', icon: DollarSign, path: '/marketplace-v2/customer-quotations', color: 'from-amber-500 to-amber-600' },
              { label: 'Đơn mua hàng', icon: Package, path: '/marketplace-v2/pos', color: 'from-blue-500 to-blue-600' },
              { label: 'Báo cáo', icon: TrendingUp, path: '/marketplace-v2/purchase-report', color: 'from-emerald-500 to-emerald-600' },
            ] : [
              { label: 'RFQ từ KH', icon: FileText, path: '/marketplace-v2/supplier-rfqs', color: 'from-purple-500 to-purple-600' },
              { label: 'Tạo báo giá', icon: DollarSign, path: '/marketplace-v2/create-quotation', color: 'from-amber-500 to-amber-600' },
              { label: 'Đơn bán hàng', icon: Package, path: '/marketplace-v2/sos', color: 'from-blue-500 to-blue-600' },
              { label: 'Báo cáo', icon: TrendingUp, path: '/marketplace-v2/sales-report', color: 'from-emerald-500 to-emerald-600' },
            ]).map((action, index) => (
              <motion.button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="mp-glass-card p-4 flex flex-col items-center gap-3 group cursor-pointer border-0"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${action.color} shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <action.icon size={22} />
                </div>
                <span
                  className="text-sm font-medium text-center"
                  style={{ color: 'var(--mp-text-primary)' }}
                >
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper function
const formatCurrency = (amount) => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B VNĐ`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M VNĐ`;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

export default Dashboard;
