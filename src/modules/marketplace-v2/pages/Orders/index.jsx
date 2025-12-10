import { AnimatePresence, motion } from 'framer-motion';
import {
    Grid3X3,
    Kanban,
    Plus,
    RefreshCw,
    Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderCard } from '../../components/cards';
import { OrderCardSkeleton } from '../../components/ui';
import { useDebounce, useWindowSize } from '../../hooks';
import {
    usePosInCompany,
    usePosInSupplierCompany,
    useQuotationsInCompany,
    useQuotationsInRequestCompany,
    useRfqsInCompany,
    useRfqsInRequestedCompany,
    useSosInCompany
} from '../../hooks/useApi';

// Status configuration for RFQ (6 statuses)
const statusGroups = [
  { key: 'chưa báo giá', label: 'Chưa báo giá', color: 'bg-amber-500' },
  { key: 'đã báo giá', label: 'Đã báo giá', color: 'bg-blue-500' },
  { key: 'quá hạn báo giá', label: 'Quá hạn', color: 'bg-orange-500' },
  { key: 'đã chấp nhận', label: 'Đã chấp nhận', color: 'bg-emerald-500' },
  { key: 'đã từ chối', label: 'Đã từ chối', color: 'bg-red-500' },
  { key: 'đã hủy', label: 'Đã hủy', color: 'bg-gray-500' },
];

const statusFilters = [
  { key: 'all', label: 'Tất cả' },
  ...statusGroups
];

// Map API data to OrderCard format
const mapOrderData = (item, type) => {
  // Calculate total amount from details if available
  let totalAmount = item.totalAmount || item.total || 0;
  let itemCount = 0;

  // Handle RFQ specific structure
  if (type === 'rfq' && item.rfqDetails) {
    itemCount = item.rfqDetails.length;
    totalAmount = item.rfqDetails.reduce((sum, detail) => {
      return sum + (detail.supplierItemPrice || 0) * (detail.quantity || 0);
    }, 0);
  } 
  // Handle Quotation specific structure
  else if (type === 'quotation' && item.quotationDetails) {
    itemCount = item.quotationDetails.length;
    // totalAmount is already in item.totalAmount
  }
  else if (item.details) {
    itemCount = item.details.length;
  } else {
    itemCount = item.items?.length || item.itemCount || item.lineItems?.length || 0;
  }

  // Determine status - preserve case for Vietnamese statuses (RFQ uses lowercase, Quotation uses uppercase)
  let status = item.status || 'pending';
  // Only convert to lowercase for English statuses
  if (/^[a-zA-Z]+$/.test(status)) {
    status = status.toLowerCase();
  }

  // Determine company name based on type
  // For quotation from NCC (customer-quotations): show the company who sent the quotation (companyName)
  let companyName = item.companyName || 'N/A';
  if (type === 'rfq') {
    companyName = item.requestedCompanyName || item.companyName || 'N/A';
  }

  return {
    id: item.rfqId || item.quotationId || item.poId || item.soId || item.id,
    code: item.rfqCode || item.quotationCode || item.poCode || item.soCode || item.code || item.orderCode || `#${item.id}`,
    companyName: companyName,
    status: status,
    itemCount: itemCount,
    totalAmount: totalAmount,
    createdAt: item.createdOn || item.createdAt || item.createdDate || new Date().toISOString(),
    needByDate: item.needByDate,
    rfqCode: item.rfqCode, // Include RFQ reference for quotation
    type: type
  };
};

/**
 * Order list page with Grid and Kanban views - uses real API data
 */
const OrderList = ({ title = 'Đơn hàng', type = 'po' }) => {
  const navigate = useNavigate();
  const { isDesktop } = useWindowSize();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get user department
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  // Determine if this is a "my company" view based on route path
  // /marketplace-v2/rfqs, /marketplace-v2/pos -> my company's orders (Mua hàng)
  // /marketplace-v2/supplier-rfqs, /marketplace-v2/supplier-pos -> orders from customers (Bán hàng)
  const isMyCompanyView = useMemo(() => {
    const path = window.location.pathname;
    // Purchasing routes - get orders my company created
    if (path.includes('/rfqs') && !path.includes('supplier-rfqs')) return true;
    if (path.includes('/pos') && !path.includes('supplier-pos')) return true;
    if (path.includes('/customer-quotations')) return true;
    // Sales routes - get orders received from customers  
    if (path.includes('/supplier-rfqs')) return false;
    if (path.includes('/supplier-pos')) return false;
    if (path.includes('/quotations') && !path.includes('customer-quotations')) return false;
    if (path.includes('/sos')) return false;
    // Default based on department
    return user?.departmentName === 'Mua hàng';
  }, [user]);

  const rfqsCompanyQuery = useRfqsInCompany({ enabled: type === 'rfq' && isMyCompanyView });
  const rfqsRequestedQuery = useRfqsInRequestedCompany({ enabled: type === 'rfq' && !isMyCompanyView });
  const quotationsRequestedQuery = useQuotationsInRequestCompany({ enabled: type === 'quotation' && isMyCompanyView });
  const quotationsCompanyQuery = useQuotationsInCompany({ enabled: type === 'quotation' && !isMyCompanyView });
  const posCompanyQuery = usePosInCompany({ enabled: type === 'po' && isMyCompanyView });
  const posSupplierQuery = usePosInSupplierCompany({ enabled: type === 'po' && !isMyCompanyView });
  const sosCompanyQuery = useSosInCompany({ enabled: type === 'so' });

  const getActiveQuery = () => {
    switch (type) {
      case 'rfq':
        return isMyCompanyView ? rfqsCompanyQuery : rfqsRequestedQuery;
      case 'quotation':
        return isMyCompanyView ? quotationsRequestedQuery : quotationsCompanyQuery;
      case 'po':
        return isMyCompanyView ? posCompanyQuery : posSupplierQuery;
      case 'so':
        return sosCompanyQuery;
      default:
        return posCompanyQuery;
    }
  };

  const activeQuery = getActiveQuery();
  const { data: rawData, isLoading, isError, refetch } = activeQuery;

  const orders = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    const mapped = rawData.map(item => mapOrderData(item, type));
    
    const filtered = mapped.filter(order => {
        // Search filter
        const matchesSearch =
          order.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          order.companyName.toLowerCase().includes(debouncedSearch.toLowerCase());

        // Status filter (compare lowercase)
        const matchesStatus = statusFilter === 'all' ||
          order.status.toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
      });
    
    return filtered;
  }, [rawData, debouncedSearch, statusFilter, type]);

  const groupedOrders = useMemo(() => {
    const groups = {};
    statusGroups.forEach(s => { groups[s.key] = []; });

    orders.forEach(order => {
      const statusKey = order.status.toLowerCase();
      if (groups[statusKey]) {
        groups[statusKey].push(order);
      } else {
        // Default to first status group if not found
        groups[statusGroups[0]?.key]?.push(order);
      }
    });

    return groups;
  }, [orders]);

  const handleOrderClick = (order) => {
    const basePath = type === 'rfq' ? 'rfq' : type === 'quotation' ? 'quotation' : type === 'so' ? 'so' : 'po';
    navigate(`/marketplace-v2/${basePath}/${order.id}`);
  };

  const getCreatePath = () => {
    switch (type) {
      case 'rfq':
        return '/marketplace-v2/create-rfq';
      case 'quotation':
        return '/marketplace-v2/create-quotation';
      default:
        return '/marketplace-v2/create-rfq';
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
            {title}
          </h1>
          <p
            className="mt-1"
            style={{ color: 'var(--mp-text-secondary)' }}
          >
            {isLoading ? 'Đang tải...' : `${orders.length} kết quả`}
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(getCreatePath())}
            className="mp-btn mp-btn-primary mp-ripple"
          >
            <Plus size={18} />
            <span>Tạo mới</span>
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
            placeholder="Tìm theo mã đơn, tên công ty..."
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
          <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
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
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    index={index}
                    variant="grid"
                    onClick={() => handleOrderClick(order)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p style={{ color: 'var(--mp-text-tertiary)' }}>
                    Không tìm thấy dữ liệu
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
              className="flex gap-4 overflow-x-auto pb-4 mp-scrollbar"
            >
              {statusGroups.map((status) => (
                <div
                  key={status.key}
                  className="flex-shrink-0 w-72 lg:w-80"
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <span
                      className="font-semibold"
                      style={{ color: 'var(--mp-text-primary)' }}
                    >
                      {status.label}
                    </span>
                    <span
                      className="text-sm ml-auto"
                      style={{ color: 'var(--mp-text-tertiary)' }}
                    >
                      {groupedOrders[status.key]?.length || 0}
                    </span>
                  </div>

                  {/* Column Content */}
                  <div
                    className="min-h-96 p-2 rounded-xl"
                    style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                  >
                    {isLoading ? (
                      <OrderCardSkeleton />
                    ) : groupedOrders[status.key]?.length > 0 ? (
                      groupedOrders[status.key].map((order, index) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          index={index}
                          variant="kanban"
                          onClick={() => handleOrderClick(order)}
                        />
                      ))
                    ) : (
                      <div
                        className="text-center py-8 text-sm"
                        style={{ color: 'var(--mp-text-tertiary)' }}
                      >
                        Không có dữ liệu
                      </div>
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

export default OrderList;
