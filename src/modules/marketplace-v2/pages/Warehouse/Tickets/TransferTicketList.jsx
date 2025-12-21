import { motion } from 'framer-motion';
import {
  Grid3X3,
  Kanban,
  Package,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';
import { forwardRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks';
import { useTransferTicketsInCompany } from '../../../hooks/useApi';

// Status configurations
const statusGroups = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', color: '#a855f7' },
  { key: 'Chờ xuất kho', label: 'Chờ xuất kho', color: '#3b82f6' },
  { key: 'Chờ nhập kho', label: 'Chờ nhập kho', color: '#f59e0b' },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', color: '#10b981' },
  { key: 'Đã hủy', label: 'Đã hủy', color: '#ef4444' },
];

// Ticket Card Component
const TicketCard = forwardRef(({ ticket, onClick }, ref) => {
  const getStatusColor = (status) => {
    const statusColors = {
      'Chờ xác nhận': '#a855f7',
      'Chờ xuất kho': '#3b82f6',
      'Chờ nhập kho': '#f59e0b',
      'Đã hoàn thành': '#10b981',
      'Đã hủy': '#ef4444',
    };
    return statusColors[status] || '#6b7280';
  };

  const statusColor = getStatusColor(ticket.status);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="mp-glass-card p-5 cursor-pointer group hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      style={{ borderLeft: '4px solid #3b82f6' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: '#3b82f620' }}
          >
            <Package size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
              {ticket.ticketCode}
            </p>
            <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
              {ticket.fromWarehouseName} → {ticket.toWarehouseName}
            </p>
          </div>
        </div>
        <span 
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
        >
          {ticket.status}
        </span>
      </div>

      <div className="space-y-2">
        {ticket.reason && (
          <p className="text-sm truncate" style={{ color: 'var(--mp-text-secondary)' }}>
            {ticket.reason}
          </p>
        )}
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
          <span>{ticket.createdBy}</span>
          <span>{new Date(ticket.createdOn).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {ticket.referenceCode && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
          <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
            Tham chiếu: <span className="font-medium text-blue-500">{ticket.referenceCode}</span>
          </p>
        </div>
      )}
    </div>
  );
});

TicketCard.displayName = 'TicketCard';

// Loading Skeleton
const TicketSkeleton = () => (
  <div className="mp-glass-card p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-gray-200" />
      <div className="flex-1">
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="h-3 w-full bg-gray-200 rounded mb-2" />
    <div className="h-3 w-2/3 bg-gray-200 rounded" />
  </div>
);

/**
 * Transfer Ticket List Page
 */
const TransferTicketList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: tickets = [], isLoading, refetch } = useTransferTicketsInCompany();

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let result = Array.isArray(tickets) ? tickets : [];

    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(t =>
        t.ticketCode?.toLowerCase().includes(query) ||
        t.fromWarehouseName?.toLowerCase().includes(query) ||
        t.toWarehouseName?.toLowerCase().includes(query) ||
        t.reason?.toLowerCase().includes(query) ||
        t.referenceCode?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tickets, statusFilter, debouncedSearch]);

  const statusCounts = useMemo(() => {
    const ticketArr = Array.isArray(tickets) ? tickets : [];
    const counts = { all: ticketArr.length };
    statusGroups.forEach(s => {
      counts[s.key] = ticketArr.filter(t => t.status === s.key).length;
    });
    return counts;
  }, [tickets]);

  const handleTicketClick = (ticket) => {
    navigate(`/marketplace-v2/warehouse/transfer-ticket/${ticket.ticketId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl" style={{ backgroundColor: '#3b82f620' }}>
            <Package size={24} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
              Phiếu chuyển kho
            </h1>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              Quản lý các phiếu chuyển kho
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/marketplace-v2/warehouse/create-transfer')}
            className="mp-btn mp-btn-primary"
          >
            <Plus size={18} />
            Tạo phiếu chuyển
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="mp-glass-button p-3 rounded-xl"
            disabled={isLoading}
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} style={{ color: 'var(--mp-text-secondary)' }} />
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 items-center"
      >
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mp-text-tertiary)' }} />
          <input
            type="text"
            placeholder="Tìm theo mã phiếu, kho, lý do..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mp-input pl-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả ({statusCounts.all})
          </button>
          {statusGroups.map(status => (
            <button
              key={status.key}
              onClick={() => setStatusFilter(status.key)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: statusFilter === status.key ? status.color : `${status.color}20`,
                color: statusFilter === status.key ? 'white' : status.color
              }}
            >
              {status.label} ({statusCounts[status.key] || 0})
            </button>
          ))}
        </div>

        <div className="flex gap-1 mp-glass-card p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : ''}`}
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-blue-500 text-white' : ''}`}
          >
            <Kanban size={18} />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <TicketSkeleton key={i} />)}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
            {filteredTickets.map(ticket => (
              <TicketCard
                key={ticket.ticketId}
                ticket={ticket}
                onClick={() => handleTicketClick(ticket)}
              />
            ))}
          {filteredTickets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--mp-text-tertiary)' }}>Không tìm thấy phiếu nào</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 max-h-[calc(100vh-320px)]">
          {statusGroups.map(status => {
            const statusTickets = filteredTickets.filter(t => t.status === status.key);
            return (
              <div key={status.key} className="flex-shrink-0 w-[320px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                  <h3 className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{status.label}</h3>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                  >
                    {statusTickets.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {statusTickets.map(ticket => (
                    <TicketCard
                      key={ticket.ticketId}
                      ticket={ticket}
                      onClick={() => handleTicketClick(ticket)}
                    />
                  ))}
                  {statusTickets.length === 0 && (
                    <div className="mp-glass-card p-6 text-center">
                      <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Không có phiếu</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransferTicketList;
