import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Eye,
  Grid3X3,
  List,
  Package,
  RefreshCw,
  Search,
  Truck
} from 'lucide-react';
import { forwardRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks';
import { useDeliveryOrdersInCompany } from '../../../hooks/useApi';

// Status configuration
const STATUS_CONFIG = {
  'Chờ xác nhận': { color: '#ef4444', bg: 'bg-red-50', text: 'text-red-600', icon: Clock },
  'Chờ lấy hàng': { color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600', icon: Package },
  'Đang vận chuyển': { color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600', icon: Truck },
  'Đã hoàn thành': { color: '#22c55e', bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle2 },
};

const STATUSES = ['Chờ xác nhận', 'Chờ lấy hàng', 'Đang vận chuyển', 'Đã hoàn thành'];

// Animated Counter Component
const AnimatedCounter = ({ value }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-bold text-2xl"
    >
      {value}
    </motion.span>
  );
};

// Delivery Card Component
const DeliveryCard = forwardRef(({ order, onClick }, ref) => {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['Chờ xác nhận'];
  const StatusIcon = config.icon;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className="mp-glass-card p-4 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-sm" style={{ color: 'var(--mp-text-primary)' }}>
            {order.doCode}
          </h4>
          <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
            SO: {order.soCode}
          </p>
        </div>
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
          <StatusIcon size={12} className="inline mr-1" />
          {order.status}
        </span>
      </div>

      <div className="space-y-2 text-xs" style={{ color: 'var(--mp-text-secondary)' }}>
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{order.createdOn ? new Date(order.createdOn).toLocaleDateString('vi-VN') : '-'}</span>
        </div>
        {order.deliveryItems && (
          <div className="flex items-center gap-2">
            <Package size={14} />
            <span>{order.deliveryItems?.length || 0} sản phẩm</span>
          </div>
        )}
      </div>

      <motion.div 
        className="mt-3 pt-3 border-t flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderColor: 'var(--mp-border-light)' }}
      >
        <span className="text-xs text-blue-500 flex items-center gap-1">
          <Eye size={14} /> Xem chi tiết
        </span>
      </motion.div>
    </motion.div>
  );
});

// Kanban Column Component
const KanbanColumn = ({ status, orders, onCardClick }) => {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  return (
    <div className="flex-1 min-w-[280px]">
      <div 
        className="flex items-center gap-2 mb-4 pb-2 border-b-2"
        style={{ borderColor: config.color }}
      >
        <div 
          className="p-1.5 rounded-lg"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <StatusIcon size={16} style={{ color: config.color }} />
        </div>
        <span className="font-medium text-sm" style={{ color: 'var(--mp-text-primary)' }}>
          {status}
        </span>
        <span 
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${config.color}20`, color: config.color }}
        >
          {orders.length}
        </span>
      </div>
      
      <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <DeliveryCard 
              key={order.doId} 
              order={order} 
              onClick={() => onCardClick(order.doId)}
            />
          ))}
        </AnimatePresence>
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Truck size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Không có đơn</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Table Row Component
const DeliveryRow = ({ order, index, onClick }) => {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['Chờ xác nhận'];

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className="border-b hover:bg-white/5 transition-colors cursor-pointer group"
      style={{ borderColor: 'var(--mp-border-light)' }}
    >
      <td className="py-3 px-4">
        <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
          {order.doCode}
        </span>
      </td>
      <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
        {order.soCode}
      </td>
      <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
        {order.createdBy}
      </td>
      <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
        {order.createdOn ? new Date(order.createdOn).toLocaleString('vi-VN') : '-'}
      </td>
      <td className="py-3 px-4">
        <span 
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
          {order.status}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <Eye size={16} className="mx-auto text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </td>
    </motion.tr>
  );
};

/**
 * Delivery List Page
 * Shows delivery orders with Kanban and Table views
 */
const DeliveryList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: ordersRaw = [], isLoading, refetch } = useDeliveryOrdersInCompany();
  const orders = Array.isArray(ordersRaw) ? ordersRaw : [];

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (selectedStatus !== 'all') {
      result = result.filter(o => o.status === selectedStatus);
    }

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(o =>
        o.doCode?.toLowerCase().includes(query) ||
        o.soCode?.toLowerCase().includes(query) ||
        o.createdBy?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [orders, selectedStatus, debouncedSearch]);

  // Group orders by status for Kanban
  const ordersByStatus = useMemo(() => {
    const grouped = {};
    STATUSES.forEach(status => {
      grouped[status] = filteredOrders.filter(o => o.status === status);
    });
    return grouped;
  }, [filteredOrders]);

  // Stats
  const stats = useMemo(() => {
    const counts = {};
    STATUSES.forEach(status => {
      counts[status] = orders.filter(o => o.status === status).length;
    });
    counts.total = orders.length;
    return counts;
  }, [orders]);

  const handleViewDetail = (doId) => {
    navigate(`/marketplace-v2/warehouse/delivery/${doId}`);
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
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--mp-text-primary)' }}>
            <Truck size={28} />
            Đơn Vận Chuyển
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Quản lý và theo dõi các đơn giao hàng
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          className="mp-glass-button p-3 rounded-xl"
          disabled={isLoading}
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} style={{ color: 'var(--mp-text-secondary)' }} />
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="mp-glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package size={18} style={{ color: '#6366f1' }} />
            <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng đơn</span>
          </div>
          <AnimatedCounter value={stats.total} />
        </div>
        {STATUSES.map(status => {
          const config = STATUS_CONFIG[status];
          const StatusIcon = config.icon;
          return (
            <div 
              key={status}
              onClick={() => setSelectedStatus(selectedStatus === status ? 'all' : status)}
              className={`mp-glass-card p-4 cursor-pointer transition-all ${selectedStatus === status ? 'ring-2' : ''}`}
              style={{ '--tw-ring-color': selectedStatus === status ? config.color : undefined }}
            >
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon size={18} style={{ color: config.color }} />
                <span className="text-xs truncate" style={{ color: 'var(--mp-text-tertiary)' }}>{status}</span>
              </div>
              <AnimatedCounter value={stats[status]} />
            </div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-4 items-center"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mp-text-tertiary)' }} />
          <input
            type="text"
            placeholder="Tìm theo mã DO, SO, người tạo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mp-input pl-10 w-full"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1 mp-glass-card p-1 ml-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-blue-500 text-white' : ''}`}
            title="Kanban"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-blue-500 text-white' : ''}`}
            title="Bảng"
          >
            <List size={18} />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="mp-glass-card p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-6 overflow-x-auto pb-4"
        >
          {STATUSES.map(status => (
            <KanbanColumn 
              key={status}
              status={status}
              orders={ordersByStatus[status]}
              onCardClick={handleViewDetail}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mp-glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)', backgroundColor: 'var(--mp-bg-secondary)' }}>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã đơn</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã SO</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Người tạo</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Trạng thái</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order, index) => (
                    <DeliveryRow 
                      key={order.doId} 
                      order={order} 
                      index={index}
                      onClick={() => handleViewDetail(order.doId)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center">
              <Truck size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--mp-text-tertiary)' }}>Không tìm thấy đơn vận chuyển nào</p>
            </div>
          )}
          <div className="p-4 border-t text-sm" style={{ borderColor: 'var(--mp-border-light)', color: 'var(--mp-text-tertiary)' }}>
            Hiển thị {filteredOrders.length} / {orders.length} đơn
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DeliveryList;
