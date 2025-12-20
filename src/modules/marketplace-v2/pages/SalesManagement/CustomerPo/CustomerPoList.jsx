import { AnimatePresence, motion } from 'framer-motion';
import {
  Grid3X3,
  Kanban,
  RefreshCw,
  Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderCard } from '../../../components/cards';
import { OrderCardSkeleton } from '../../../components/ui';
import { useDebounce } from '../../../hooks';
import { usePosInSupplierCompany } from '../../../hooks/useApi';

// PO Statuses - Legacy only shows these 2 statuses
const statusGroups = [
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận', color: 'bg-amber-500' },
  { key: 'Đã xác nhận', label: 'Đã xác nhận', color: 'bg-emerald-500' },
];

const statusFilters = [
  { key: 'all', label: 'Tất cả' },
  ...statusGroups
];

// Map API data
const mapPoData = (item) => {
  const itemCount = item.purchaseOrderDetails?.length || item.poDetails?.length || 0;

  return {
    id: item.poId,
    code: item.poCode,
    companyName: item.companyName || 'Khách hàng', // Buyer
    companyCode: item.companyCode,
    quotationCode: item.quotationCode,
    paymentMethod: item.paymentMethod,
    status: item.status,
    itemCount: itemCount,
    totalAmount: item.totalAmount || 0,
    createdAt: item.createdOn,
    type: 'po'
  };
};

/**
 * Customer PO List Page (Sales Department)
 * Displays POs received from customers
 */
const CustomerPoList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch POs in supplier company (POs sent to me)
  const { data: rawData = [], isLoading, isError, refetch } = usePosInSupplierCompany();

  // Filter and map data - Legacy filters to only show 'Chờ xác nhận' and 'Đã xác nhận'
  const pos = useMemo(() => {
    let filtered = Array.isArray(rawData) ? rawData : [];
    
    // Filter to only show pending and confirmed statuses (like legacy)
    filtered = filtered.filter(item => 
      item.status === 'Chờ xác nhận' || item.status === 'Đã xác nhận'
    );
    
    // Map data
    filtered = filtered.map(item => mapPoData(item));

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(item =>
        item.code?.toLowerCase().includes(query) ||
        item.companyName?.toLowerCase().includes(query) ||
        item.quotationCode?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [rawData, statusFilter, debouncedSearch]);

  // Group by status for Kanban view
  const posByStatus = useMemo(() => {
    const groups = {};
    statusGroups.forEach(g => groups[g.key] = []);
    pos.forEach(p => {
      if (groups[p.status]) {
        groups[p.status].push(p);
      } else {
        if (!groups['other']) groups['other'] = [];
        groups['other'].push(p);
      }
    });
    return groups;
  }, [pos]);

  const handlePoClick = (po) => {
    navigate(`/marketplace-v2/customer-po/${po.id}`);
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
            Yêu cầu mua hàng
          </h1>
          <p
            className="mt-1"
            style={{ color: 'var(--mp-text-secondary)' }}
          >
            {isLoading ? 'Đang tải...' : `${pos.length} đơn hàng`}
          </p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="mp-btn mp-btn-secondary"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </motion.button>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-4 flex flex-col lg:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--mp-text-tertiary)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã PO, tên khách hàng..."
            className="w-full mp-input pl-11"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 mp-scrollbar-hidden">
          {statusFilters.map((status) => (
            <button
              key={status.key}
              onClick={() => setStatusFilter(status.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${statusFilter === status.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              style={{
                color: statusFilter === status.key ? 'white' : 'var(--mp-text-secondary)'
              }}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--mp-bg-secondary)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
              }`}
            style={{ color: viewMode === 'grid' ? 'var(--mp-primary-600)' : 'var(--mp-text-tertiary)' }}
          >
            <Grid3X3 size={20} />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
              }`}
            style={{ color: viewMode === 'kanban' ? 'var(--mp-primary-600)' : 'var(--mp-text-tertiary)' }}
          >
            <Kanban size={20} />
          </button>
        </div>
      </motion.div>

      {/* Error State */}
      {isError && (
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải dữ liệu. (Có thể API chưa hỗ trợ)</p>
          <button
            onClick={() => refetch()}
            className="mp-btn mp-btn-primary"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Content */}
      {!isError && (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <OrderCardSkeleton key={i} />
                ))
              ) : pos.length > 0 ? (
                pos.map((po, index) => (
                  <OrderCard
                    key={po.id}
                    order={po}
                    onClick={() => handlePoClick(po)}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full mp-glass-card p-12 text-center">
                  <p style={{ color: 'var(--mp-text-secondary)' }}>
                    Chưa có đơn hàng nào từ khách
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-4 overflow-x-auto pb-4"
            >
              {statusGroups.map((statusGroup) => (
                <div
                  key={statusGroup.key}
                  className="min-w-[300px] flex-shrink-0"
                >
                  <div className="mp-glass-card p-4 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${statusGroup.color}`} />
                      <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                        {statusGroup.label}
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                      {posByStatus[statusGroup.key]?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {isLoading ? (
                      Array.from({ length: 2 }).map((_, i) => (
                        <OrderCardSkeleton key={i} />
                      ))
                    ) : (
                      posByStatus[statusGroup.key]?.map((po, index) => (
                        <OrderCard
                          key={po.id}
                          order={po}
                          onClick={() => handlePoClick(po)}
                          index={index}
                          compact
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default CustomerPoList;
