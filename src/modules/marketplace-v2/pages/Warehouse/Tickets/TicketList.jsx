import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Grid3X3,
    Kanban,
    Package,
    Plus,
    RefreshCw,
    Search
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../../hooks';
import {
    useIssueTicketsInCompany,
    useReceiveTicketsInCompany,
    useTransferTicketsInCompany
} from '../../../hooks/useApi';

// Status configurations for different ticket types
const issueStatusGroups = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', color: '#a855f7' },
  { key: 'Chờ xuất kho', label: 'Chờ xuất kho', color: '#f59e0b' },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', color: '#10b981' },
];

const receiveStatusGroups = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', color: '#a855f7' },
  { key: 'Chờ nhập kho', label: 'Chờ nhập kho', color: '#f59e0b' },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', color: '#10b981' },
];

const transferStatusGroups = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', color: '#a855f7' },
  { key: 'Chờ xuất kho', label: 'Chờ xuất kho', color: '#3b82f6' },
  { key: 'Chờ nhập kho', label: 'Chờ nhập kho', color: '#f59e0b' },
  { key: 'Đã hoàn thành', label: 'Đã hoàn thành', color: '#10b981' },
  { key: 'Đã hủy', label: 'Đã hủy', color: '#ef4444' },
];

// Tab configuration
const tabs = [
  { key: 'issue', label: 'Phiếu xuất kho', icon: ArrowUpFromLine, color: '#ef4444' },
  { key: 'receive', label: 'Phiếu nhập kho', icon: ArrowDownToLine, color: '#22c55e' },
  { key: 'transfer', label: 'Phiếu chuyển kho', icon: Package, color: '#3b82f6' },
];

// Ticket Card Component
const TicketCard = ({ ticket, type, onClick }) => {
  const typeConfig = {
    issue: { icon: ArrowUpFromLine, color: '#ef4444', detailPath: 'issue-ticket' },
    receive: { icon: ArrowDownToLine, color: '#22c55e', detailPath: 'receive-ticket' },
    transfer: { icon: Package, color: '#3b82f6', detailPath: 'transfer-ticket' }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const getStatusColor = (status) => {
    const statusColors = {
      'Chờ xác nhận': '#a855f7',
      'Chờ xuất kho': type === 'transfer' ? '#3b82f6' : '#f59e0b',
      'Chờ nhập kho': '#f59e0b',
      'Đã hoàn thành': '#10b981',
      'Đã hủy': '#ef4444'
    };
    return statusColors[status] || '#6b7280';
  };

  const statusColor = getStatusColor(ticket.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className="mp-glass-card p-5 cursor-pointer group"
      style={{ borderLeft: `4px solid ${config.color}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon size={20} style={{ color: config.color }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
              {ticket.ticketCode}
            </p>
            <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
              {type === 'transfer' 
                ? `${ticket.fromWarehouseName} → ${ticket.toWarehouseName}`
                : ticket.warehouseName
              }
            </p>
          </div>
        </div>
        <span 
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ 
            backgroundColor: `${statusColor}20`,
            color: statusColor
          }}
        >
          {ticket.status}
        </span>
      </div>

      {/* Details */}
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

      {/* Reference Code */}
      {ticket.referenceCode && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
          <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
            Tham chiếu: <span className="font-medium text-blue-500">{ticket.referenceCode}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

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
 * Unified Ticket List Page
 * Shows Issue, Receive, and Transfer tickets with tab navigation
 */
const TicketList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get active tab from URL or default to 'issue'
  const activeTab = searchParams.get('tab') || 'issue';

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch data for all ticket types
  const { data: issueTickets = [], isLoading: issueLoading, refetch: refetchIssue } = useIssueTicketsInCompany();
  const { data: receiveTickets = [], isLoading: receiveLoading, refetch: refetchReceive } = useReceiveTicketsInCompany();
  const { data: transferTickets = [], isLoading: transferLoading, refetch: refetchTransfer } = useTransferTicketsInCompany();

  const isLoading = activeTab === 'issue' ? issueLoading : activeTab === 'receive' ? receiveLoading : transferLoading;

  // Get current tickets and status groups based on active tab
  const { currentTickets, statusGroups } = useMemo(() => {
    switch (activeTab) {
      case 'issue':
        return { currentTickets: issueTickets, statusGroups: issueStatusGroups };
      case 'receive':
        return { currentTickets: receiveTickets, statusGroups: receiveStatusGroups };
      case 'transfer':
        return { currentTickets: transferTickets, statusGroups: transferStatusGroups };
      default:
        return { currentTickets: [], statusGroups: [] };
    }
  }, [activeTab, issueTickets, receiveTickets, transferTickets]);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let result = currentTickets;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(t =>
        t.ticketCode?.toLowerCase().includes(query) ||
        t.warehouseName?.toLowerCase().includes(query) ||
        t.fromWarehouseName?.toLowerCase().includes(query) ||
        t.toWarehouseName?.toLowerCase().includes(query) ||
        t.reason?.toLowerCase().includes(query) ||
        t.referenceCode?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [currentTickets, statusFilter, debouncedSearch]);

  // Status counts for filter badges
  const statusCounts = useMemo(() => {
    const counts = { all: currentTickets.length };
    statusGroups.forEach(s => {
      counts[s.key] = currentTickets.filter(t => t.status === s.key).length;
    });
    return counts;
  }, [currentTickets, statusGroups]);

  // Reset status filter when changing tabs
  useEffect(() => {
    setStatusFilter('all');
  }, [activeTab]);

  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  const handleRefresh = () => {
    refetchIssue();
    refetchReceive();
    refetchTransfer();
  };

  const handleTicketClick = (ticket) => {
    const pathMap = {
      issue: 'issue-ticket',
      receive: 'receive-ticket',
      transfer: 'transfer-ticket'
    };
    navigate(`/marketplace-v2/warehouse/${pathMap[activeTab]}/${ticket.ticketId}`);
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
            Quản lý phiếu kho
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Quản lý xuất, nhập và chuyển kho
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'transfer' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/marketplace-v2/warehouse/create-transfer')}
              className="mp-btn mp-btn-primary"
            >
              <Plus size={18} />
              Tạo phiếu chuyển
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="mp-glass-button p-3 rounded-xl"
            disabled={isLoading}
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} style={{ color: 'var(--mp-text-secondary)' }} />
          </motion.button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-2 flex gap-2"
      >
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = tab.key === 'issue' ? issueTickets.length 
            : tab.key === 'receive' ? receiveTickets.length 
            : transferTickets.length;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                isActive ? 'text-white' : ''
              }`}
              style={{
                backgroundColor: isActive ? tab.color : 'transparent',
                color: isActive ? 'white' : 'var(--mp-text-secondary)'
              }}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${tab.color}20`,
                  color: isActive ? 'white' : tab.color
                }}
              >
                {count}
              </span>
            </button>
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
            placeholder="Tìm theo mã phiếu, kho, lý do..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mp-input pl-10 w-full"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              statusFilter === 'all' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

        {/* View Mode Toggle */}
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
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-280px)] overflow-y-auto p-1"
        >
          <AnimatePresence mode="popLayout">
            {filteredTickets.map(ticket => (
              <TicketCard
                key={ticket.ticketId}
                ticket={ticket}
                type={activeTab}
                onClick={() => handleTicketClick(ticket)}
              />
            ))}
          </AnimatePresence>
          {filteredTickets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--mp-text-tertiary)' }}>
                Không tìm thấy phiếu nào
              </p>
            </div>
          )}
        </motion.div>
      ) : (
        // Kanban View
        <div className="flex gap-4 overflow-x-auto pb-4 max-h-[calc(100vh-280px)]">
          {statusGroups.map(status => {
            const statusTickets = filteredTickets.filter(t => t.status === status.key);
            return (
              <div key={status.key} className="flex-shrink-0 w-[320px] h-full flex flex-col">
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
                <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                  {statusTickets.map(ticket => (
                    <TicketCard
                      key={ticket.ticketId}
                      ticket={ticket}
                      type={activeTab}
                      onClick={() => handleTicketClick(ticket)}
                    />
                  ))}
                  {statusTickets.length === 0 && (
                    <div className="mp-glass-card p-6 text-center">
                      <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                        Không có phiếu
                      </p>
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

export default TicketList;
