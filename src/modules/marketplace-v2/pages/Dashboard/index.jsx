import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../../components/cards';
import { OrderCountChart, RevenueChart } from '../../components/charts';
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
 * Dashboard tổng quan cho cả mua hàng và bán hàng
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

  // Call ALL hooks unconditionally for both purchasing and sales data
  const rfqsSentQuery = useRfqsInCompany(); // RFQs sent by us
  const rfqsReceivedQuery = useRfqsInRequestedCompany(); // RFQs received from customers
  const quotationsReceivedQuery = useQuotationsInRequestCompany(); // Quotations received from suppliers
  const quotationsSentQuery = useQuotationsInCompany(); // Quotations sent to customers
  const posQuery = usePosInCompany(); // Purchase Orders
  const sosQuery = useSosInCompany(); // Sales Orders
  const purchaseReportQuery = useMonthlyPurchaseReport();
  const salesReportQuery = useMonthlySalesReport();

  const isLoading = 
    rfqsSentQuery.isLoading || 
    rfqsReceivedQuery.isLoading || 
    quotationsReceivedQuery.isLoading || 
    quotationsSentQuery.isLoading ||
    posQuery.isLoading || 
    sosQuery.isLoading;

  // Calculate PURCHASING metrics - Only COMPLETED/SENT items
  const purchaseMetrics = useMemo(() => {
    const rfqsSent = rfqsSentQuery.data || [];
    const quotationsReceived = quotationsReceivedQuery.data || [];
    const pos = posQuery.data || [];

    // Count only completed RFQs
    const completedRfqsSent = rfqsSent.filter(r =>
      r.status === 'Đã chấp nhận'
    ).length;
    
    // Count only sent quotations
    const sentQuotations = quotationsReceived.filter(q =>
      q.status === 'Đã chấp nhận'
    ).length;
    
    // Count only completed POs
    const completedPOs = pos.filter(po =>
      po.status === 'Đã hoàn thành'
    ).length;

    // Total purchase value from completed POs only
    const totalPurchaseValue = pos
      .filter(po => po.status === 'Đã hoàn thành')
      .reduce((sum, po) => sum + (po.totalAmount || 0), 0);

    return {
      rfqsSent: completedRfqsSent,
      quotationsSent: sentQuotations,
      ordersCompleted: completedPOs,
      totalValue: totalPurchaseValue
    };
  }, [rfqsSentQuery.data, quotationsReceivedQuery.data, posQuery.data]);

  // Calculate SALES metrics - Only COMPLETED/SENT items
  const salesMetrics = useMemo(() => {
    const rfqsReceived = rfqsReceivedQuery.data || [];
    const quotationsSent = quotationsSentQuery.data || [];
    const sos = sosQuery.data || [];

    // Count only completed RFQs received
    const completedRfqsReceived = rfqsReceived.filter(r =>
      r.status === 'Đã báo giá'
    ).length;
    
    // Count only sent quotations
    const sentQuotations = quotationsSent.filter(q =>
      q.status === 'Đã chấp nhận'
    ).length;
    
    // Count only completed SOs
    const completedSOs = sos.filter(so =>
      so.status === 'Đã hoàn thành'
    ).length;

    // Total sales value from completed SOs only
    const totalSalesValue = sos
      .filter(so => so.status === 'Đã hoàn thành')
      .reduce((sum, so) => sum + (so.totalAmount || 0), 0);

    return {
      rfqsReceived: completedRfqsReceived,
      quotationsSent: sentQuotations,
      ordersCompleted: completedSOs,
      totalValue: totalSalesValue
    };
  }, [rfqsReceivedQuery.data, quotationsSentQuery.data, sosQuery.data]);

  // Transform report data for charts
  const chartData = useMemo(() => {
    const purchaseReport = purchaseReportQuery.data || [];
    const salesReport = salesReportQuery.data || [];
    
    if (!Array.isArray(purchaseReport) || !Array.isArray(salesReport)) {
      return [];
    }

    // Merge both reports by month
    const months = new Set([
      ...purchaseReport.map(r => r.month),
      ...salesReport.map(r => r.month)
    ]);

    return Array.from(months).sort((a, b) => {
      // Sort by month string (format: "MM/YYYY")
      const [aMonth, aYear] = a.split('/');
      const [bMonth, bYear] = b.split('/');
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return parseInt(aMonth) - parseInt(bMonth);
    }).map(month => {
      const pData = purchaseReport.find(r => r.month === month);
      const sData = salesReport.find(r => r.month === month);
      
      // Format month to show as "12/25" 
      const [m, y] = month.split('/');
      const displayMonth = `${m}/${y.slice(-2)}`;

      return {
        month: displayMonth,
        purchaseOrders: pData?.totalOrder || 0,
        purchaseRevenue: (pData?.totalAmount || 0) / 1000000,
        salesOrders: sData?.totalOrder || 0,
        salesRevenue: (sData?.totalAmount || 0) / 1000000,
      };
    });
  }, [purchaseReportQuery.data, salesReportQuery.data]);

  // Build combined activities from both POs and SOs
  const activities = useMemo(() => {
    const pos = posQuery.data || [];
    const sos = sosQuery.data || [];
    
    const poActivities = pos.slice(0, 9).map((order, index) => ({
      id: `${order.poId}`,
      type: 'purchase',
      title: `${order.poCode || 'N/A'}`,
      description: `${order.supplierName || order.companyName || 'Nhà cung cấp'} - ${formatCurrency(order.totalAmount || 0)}`,
      timestamp: order.createdOn || new Date().toISOString(),
    }));

    const soActivities = sos.slice(0, 9).map((order, index) => ({
      id: `${order.soId}`,
      type: 'sales',
      title: `${order.soCode || 'N/A'}`,
      description: `${order.customerName || order.companyName || 'Khách hàng'} - ${formatCurrency(order.totalAmount || 0)}`,
      timestamp: order.createdOn || new Date().toISOString(),
    }));

    // Combine and sort by timestamp, take top 10
    return [...poActivities, ...soActivities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 9);
  }, [posQuery.data, sosQuery.data]);

  return (
    <div className="max-w-9xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Tổng Quan Quản Lý
          </h1>
          <p
            className="mt-1"
            style={{ color: 'var(--mp-text-secondary)' }}
          >
            Theo dõi toàn bộ hoạt động mua hàng và bán hàng
          </p>
        </div>
      </motion.div>

      {/* Metric Cards - 2 Rows x 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PURCHASING METRICS */}
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard
              icon="💰"
              iconBg="bg-gradient-to-br from-amber-500 to-amber-600"
              label="Báo giá từ nhà cung cấp"
              value={purchaseMetrics.quotationsSent}
              trend="up"
              trendValue={`${purchaseMetrics.quotationsSent} báo giá`}
              onClick={() => navigate('/marketplace-v2/customer-quotations')}
              delay={0.2}
            />
            <MetricCard
              icon="🛒"
              iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
              label="Đơn mua hàng"
              value={purchaseMetrics.ordersCompleted}
              trend="up"
              trendValue={formatCurrency(purchaseMetrics.totalValue)}
              onClick={() => navigate('/marketplace-v2/pos')}
              delay={0.3}
            />

            <MetricCard
              icon="📄"
              iconBg="bg-gradient-to-br from-teal-500 to-teal-600"
              label="Báo giá đã gửi"
              value={salesMetrics.quotationsSent}
              trend="up"
              trendValue={`${salesMetrics.quotationsSent} báo giá`}
              onClick={() => navigate('/marketplace-v2/sent-quotations')}
              delay={0.5}
            />
            <MetricCard
              icon="📦"
              iconBg="bg-gradient-to-br from-green-500 to-green-600"
              label="Đơn bán hàng"
              value={salesMetrics.ordersCompleted}
              trend="up"
              trendValue={formatCurrency(salesMetrics.totalValue)}
              onClick={() => navigate('/marketplace-v2/sos')}
              delay={0.6}
            />
          </>
        )}
      </div>

      {/* Charts Grid - 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Count Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mp-glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--mp-text-primary)' }}
            >
              Số lượng đơn hàng
            </h2>
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span style={{ color: 'var(--mp-text-secondary)' }}>Mua</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span style={{ color: 'var(--mp-text-secondary)' }}>Bán</span>
              </div>
            </div>
          </div>

          {purchaseReportQuery.isLoading || salesReportQuery.isLoading ? (
            <div className="h-72 mp-skeleton rounded-xl" />
          ) : chartData.length > 0 ? (
            <OrderCountChart data={chartData} />
          ) : (
            <div className="h-72 flex items-center justify-center" style={{ color: 'var(--mp-text-tertiary)' }}>
              Chưa có dữ liệu
            </div>
          )}
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mp-glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--mp-text-primary)' }}
            >
              Giá trị giao dịch
            </h2>
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span style={{ color: 'var(--mp-text-secondary)' }}>Mua</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span style={{ color: 'var(--mp-text-secondary)' }}>Bán</span>
              </div>
            </div>
          </div>

          {purchaseReportQuery.isLoading || salesReportQuery.isLoading ? (
            <div className="h-72 mp-skeleton rounded-xl" />
          ) : chartData.length > 0 ? (
            <RevenueChart data={chartData} />
          ) : (
            <div className="h-72 flex items-center justify-center" style={{ color: 'var(--mp-text-tertiary)' }}>
              Chưa có dữ liệu
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Activities - Full Width Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mp-glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-lg font-semibold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Hoạt động gần đây
          </h2>
        </div>

        <ActivityTimeline
          activities={activities}
          loading={isLoading}
          columns={3}
          onActivityClick={(activity) => {
            if (activity.type === 'purchase') {
              navigate(`/marketplace-v2/po/${activity.id}`);
            } else if (activity.type === 'sales') {
              navigate(`/marketplace-v2/so/${activity.id}`);
            }
          }}
        />
      </motion.div>
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
