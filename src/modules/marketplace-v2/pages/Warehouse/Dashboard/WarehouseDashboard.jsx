import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowDownToLine,
    ArrowUpFromLine,
    Box,
    Clock,
    Package,
    RefreshCw,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useInventoryInCompany,
    useIssueTicketsInCompany,
    useMonthlyIssueReport,
    useMonthlyReceiveReport,
    useReceiveTicketsInCompany,
    useTransferTicketsInCompany
} from '../../../hooks/useApi';

// Stats Card Component with animated counter
const StatsCard = ({ icon: Icon, label, value, trend, trendValue, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="mp-glass-card p-6 cursor-pointer group"
    style={{ borderLeft: `4px solid ${color}` }}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>{label}</p>
          <motion.p 
            className="text-2xl font-bold"
            style={{ color: 'var(--mp-text-primary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={value}
          >
            {value?.toLocaleString() || 0}
          </motion.p>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-medium">{trendValue}</span>
        </div>
      )}
    </div>
  </motion.div>
);

// Activity Feed Item
const ActivityItem = ({ ticket, type }) => {
  const navigate = useNavigate();
  
  const typeConfig = {
    issue: { icon: ArrowUpFromLine, color: '#ef4444', label: 'Xuất kho', path: 'issue-ticket' },
    receive: { icon: ArrowDownToLine, color: '#22c55e', label: 'Nhập kho', path: 'receive-ticket' },
    transfer: { icon: Package, color: '#3b82f6', label: 'Chuyển kho', path: 'transfer-ticket' }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5 }}
      onClick={() => navigate(`/marketplace-v2/warehouse/${config.path}/${ticket.ticketId}`)}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
    >
      <div 
        className="p-2 rounded-lg"
        style={{ backgroundColor: `${config.color}20` }}
      >
        <Icon size={16} style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" style={{ color: 'var(--mp-text-primary)' }}>
          {ticket.ticketCode}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--mp-text-tertiary)' }}>
          {ticket.warehouseName || ticket.fromWarehouseName} • {config.label}
        </p>
      </div>
      <div className="text-right">
        <span 
          className="text-xs px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: ticket.status === 'Đã hoàn thành' ? '#10b98120' : '#f59e0b20',
            color: ticket.status === 'Đã hoàn thành' ? '#10b981' : '#f59e0b'
          }}
        >
          {ticket.status}
        </span>
      </div>
    </motion.div>
  );
};

// Quick Kanban Column
const KanbanColumn = ({ title, items, color, onItemClick }) => (
  <div className="flex-1 min-w-[280px]">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <h3 className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{title}</h3>
      <span 
        className="text-xs px-2 py-0.5 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {items.length}
      </span>
    </div>
    <div className="space-y-2">
      {items.slice(0, 5).map((item, idx) => (
        <motion.div
          key={`${item.type}-${item.ticketId}` || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onItemClick(item)}
          className="mp-glass-card p-3 cursor-pointer"
          style={{ borderLeft: `3px solid ${color}` }}
        >
          <p className="font-medium text-sm truncate" style={{ color: 'var(--mp-text-primary)' }}>
            {item.ticketCode}
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--mp-text-tertiary)' }}>
            {item.warehouseName || item.fromWarehouseName}
          </p>
        </motion.div>
      ))}
      {items.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: 'var(--mp-text-tertiary)' }}>
          Không có phiếu
        </p>
      )}
    </div>
  </div>
);

/**
 * Warehouse Dashboard
 * Main dashboard for Warehouse department with real-time metrics
 */
const WarehouseDashboard = () => {
  const navigate = useNavigate();

  // Fetch data
  const { data: inventoryDataRaw = [], isLoading: inventoryLoading, refetch: refetchInventory } = useInventoryInCompany();
  const { data: issueTicketsRaw = [], isLoading: issueLoading, refetch: refetchIssue } = useIssueTicketsInCompany();
  const { data: receiveTicketsRaw = [], isLoading: receiveLoading, refetch: refetchReceive } = useReceiveTicketsInCompany();
  const { data: transferTicketsRaw = [], isLoading: transferLoading, refetch: refetchTransfer } = useTransferTicketsInCompany();
  const { data: monthlyIssueRaw = [] } = useMonthlyIssueReport();
  const { data: monthlyReceiveRaw = [] } = useMonthlyReceiveReport();

  // Ensure all data are arrays to prevent "reduce is not a function" errors
  const inventoryData = Array.isArray(inventoryDataRaw) ? inventoryDataRaw : [];
  const issueTickets = Array.isArray(issueTicketsRaw) ? issueTicketsRaw : [];
  const receiveTickets = Array.isArray(receiveTicketsRaw) ? receiveTicketsRaw : [];
  const transferTickets = Array.isArray(transferTicketsRaw) ? transferTicketsRaw : [];
  const monthlyIssue = Array.isArray(monthlyIssueRaw) ? monthlyIssueRaw : [];
  const monthlyReceive = Array.isArray(monthlyReceiveRaw) ? monthlyReceiveRaw : [];

  const isLoading = inventoryLoading || issueLoading || receiveLoading || transferLoading;

  // Calculate stats
  const stats = useMemo(() => {
    const totalStock = inventoryData.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
    const pendingIssue = issueTickets.filter(t => t.status !== 'Đã hoàn thành').length;
    const pendingReceive = receiveTickets.filter(t => t.status !== 'Đã hoàn thành').length;
    const lowStock = inventoryData.filter(inv => inv.quantity < 10).length;

    return { totalStock, pendingIssue, pendingReceive, lowStock };
  }, [inventoryData, issueTickets, receiveTickets]);

  // Group tickets by status for kanban
  const kanbanData = useMemo(() => {
    const allTickets = [
      ...issueTickets.map(t => ({ ...t, type: 'issue' })),
      ...receiveTickets.map(t => ({ ...t, type: 'receive' })),
      ...transferTickets.map(t => ({ ...t, type: 'transfer' }))
    ];

    return {
      pending: allTickets.filter(t => t.status === 'Chờ xác nhận'),
      processing: allTickets.filter(t => ['Chờ xuất kho', 'Chờ nhập kho'].includes(t.status)),
      completed: allTickets.filter(t => t.status === 'Đã hoàn thành').slice(0, 10)
    };
  }, [issueTickets, receiveTickets, transferTickets]);

  // Recent activity (combine all tickets, sort by date)
  const recentActivity = useMemo(() => {
    const all = [
      ...issueTickets.map(t => ({ ...t, type: 'issue' })),
      ...receiveTickets.map(t => ({ ...t, type: 'receive' })),
      ...transferTickets.map(t => ({ ...t, type: 'transfer' }))
    ];
    return all
      .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
      .slice(0, 8);
  }, [issueTickets, receiveTickets, transferTickets]);

  const handleRefresh = () => {
    refetchInventory();
    refetchIssue();
    refetchReceive();
    refetchTransfer();
  };

  const handleKanbanItemClick = (item) => {
    const pathMap = {
      issue: 'issue-ticket',
      receive: 'receive-ticket',
      transfer: 'transfer-ticket'
    };
    navigate(`/marketplace-v2/warehouse/${pathMap[item.type]}/${item.ticketId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Dashboard Kho
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Tổng quan hoạt động kho hàng
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="mp-glass-button p-3 rounded-xl"
          disabled={isLoading}
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} style={{ color: 'var(--mp-text-secondary)' }} />
        </motion.button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          icon={Box}
          label="Tổng tồn kho"
          value={stats.totalStock}
          color="#6366f1"
          onClick={() => navigate('/marketplace-v2/warehouse/inventory')}
        />
        <StatsCard
          icon={ArrowUpFromLine}
          label="Chờ xuất kho"
          value={stats.pendingIssue}
          color="#ef4444"
          onClick={() => navigate('/marketplace-v2/warehouse/issue-tickets')}
        />
        <StatsCard
          icon={ArrowDownToLine}
          label="Chờ nhập kho"
          value={stats.pendingReceive}
          color="#22c55e"
          onClick={() => navigate('/marketplace-v2/warehouse/receive-tickets')}
        />
        <StatsCard
          icon={AlertTriangle}
          label="Cảnh báo hết hàng"
          value={stats.lowStock}
          color={stats.lowStock > 0 ? '#ef4444' : '#10b981'}
          onClick={() => navigate('/marketplace-v2/warehouse/inventory?filter=low')}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mp-glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
              Hoạt động gần đây
            </h2>
            <Clock size={18} style={{ color: 'var(--mp-text-tertiary)' }} />
          </div>
          <div className="space-y-1">
            <AnimatePresence>
              {recentActivity.map((ticket, idx) => (
                <ActivityItem key={ticket.ticketId || idx} ticket={ticket} type={ticket.type} />
              ))}
            </AnimatePresence>
            {recentActivity.length === 0 && (
              <p className="text-center py-8" style={{ color: 'var(--mp-text-tertiary)' }}>
                Chưa có hoạt động nào
              </p>
            )}
          </div>
        </motion.div>

        {/* Kanban Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 mp-glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
              Phiếu đang xử lý
            </h2>
            <button
              onClick={() => navigate('/marketplace-v2/warehouse/issue-tickets')}
              className="text-sm mp-btn mp-btn-secondary py-1 px-3"
            >
              Xem tất cả
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <KanbanColumn
              title="Chờ xác nhận"
              items={kanbanData.pending}
              color="#a855f7"
              onItemClick={handleKanbanItemClick}
            />
            <KanbanColumn
              title="Đang xử lý"
              items={kanbanData.processing}
              color="#f59e0b"
              onItemClick={handleKanbanItemClick}
            />
            <KanbanColumn
              title="Hoàn thành gần đây"
              items={kanbanData.completed}
              color="#10b981"
              onItemClick={handleKanbanItemClick}
            />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Xem tồn kho', icon: Box, path: '/marketplace-v2/warehouse/inventory', color: '#6366f1' },
          { label: 'Phiếu xuất', icon: ArrowUpFromLine, path: '/marketplace-v2/warehouse/issue-tickets', color: '#ef4444' },
          { label: 'Phiếu nhập', icon: ArrowDownToLine, path: '/marketplace-v2/warehouse/receive-tickets', color: '#22c55e' },
          { label: 'Chuyển kho', icon: Package, path: '/marketplace-v2/warehouse/transfer-tickets', color: '#3b82f6' },
        ].map((action, idx) => (
          <motion.button
            key={action.path}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(action.path)}
            className="mp-glass-card p-4 flex flex-col items-center gap-2 group"
          >
            <div 
              className="p-3 rounded-xl transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${action.color}20` }}
            >
              <action.icon size={24} style={{ color: action.color }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--mp-text-primary)' }}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default WarehouseDashboard;
