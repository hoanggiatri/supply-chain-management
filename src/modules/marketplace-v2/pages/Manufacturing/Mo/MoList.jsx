import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar,
    Clock,
    Factory,
    Grid3X3,
    Kanban,
    List,
    Loader2,
    Package,
    Plus,
    Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MpCombobox } from '../../../components/ui/MpCombobox';
import { useDebounce } from '../../../hooks';
import { useMosInCompany } from '../../../hooks/useApi';

const statusConfig = {
  'Chờ xác nhận': { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Chờ xác nhận' },
  'Chờ sản xuất': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Chờ sản xuất' },
  'Đang sản xuất': { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Đang sản xuất' },
  'Chờ nhập kho': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Chờ nhập kho' },
  'Đã nhập kho': { color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', label: 'Đã nhập kho' },
  'Đã hoàn thành': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Đã hoàn thành' },
  'Đã hủy': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Đã hủy' },
};

const kanbanStatuses = [
  'Chờ xác nhận',
  'Chờ sản xuất',
  'Đang sản xuất',
  'Chờ nhập kho',
  'Đã nhập kho',
  'Đã hoàn thành'
];

const MoCard = ({ mo, onClick }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
      onClick={onClick}
      className="mp-glass-card p-4 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
          {mo.moCode}
        </p>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[mo.status]?.color || 'bg-gray-100'}`}>
          {mo.type}
        </span>
      </div>
      
      <p className="text-sm mb-2 line-clamp-1" style={{ color: 'var(--mp-text-secondary)' }}>
        {mo.itemName || mo.itemCode}
      </p>
      
      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
        <span className="flex items-center gap-1">
          <Package size={12} />
          {mo.quantity}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(mo.estimatedStartTime)}
        </span>
      </div>
    </motion.div>
  );
};

const KanbanColumn = ({ title, status, mos, onMoClick }) => {
  const columnMos = mos.filter(mo => mo.status === status);
  
  return (
    <div className="flex-shrink-0 w-72 flex flex-col h-full bg-white/5 dark:bg-black/20 rounded-xl p-2">
      <div className="flex items-center justify-between mb-3 px-2 pt-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]?.color || 'bg-gray-100'}`}>
            {title}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--mp-bg-secondary)', color: 'var(--mp-text-tertiary)' }}>
            {columnMos.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto px-2 pb-4 hide-scroll-arrows min-h-0">
        <AnimatePresence>
          {columnMos.map(mo => (
            <MoCard key={mo.moId} mo={mo} onClick={() => onMoClick(mo.moId)} />
          ))}
        </AnimatePresence>
        {columnMos.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-xl" style={{ borderColor: 'var(--mp-border-light)' }}>
            <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Trống</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * MO List Page - Display all Manufacturing Orders with Kanban/Table views
 */
const MoList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: mosData, isLoading, error, refetch } = useMosInCompany();

  // Process MOs data
  const mos = useMemo(() => {
    if (!mosData) return [];
    
    let data = Array.isArray(mosData) ? mosData : 
               mosData.content ? mosData.content : 
               mosData.data ? mosData.data : [];
    
    // Apply search filter
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      data = data.filter(mo =>
        mo.moCode?.toLowerCase().includes(search) ||
        mo.itemCode?.toLowerCase().includes(search) ||
        mo.itemName?.toLowerCase().includes(search) ||
        mo.type?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      data = data.filter(mo => mo.status === statusFilter);
    }
    
    // Sort by creation date desc
    return data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [mosData, debouncedSearch, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const allMos = Array.isArray(mosData) ? mosData : 
                   mosData?.content || mosData?.data || [];
    return {
      total: allMos.length,
      pending: allMos.filter(m => m.status === 'Chờ xác nhận').length,
      inProgress: allMos.filter(m => m.status === 'Đang sản xuất').length,
      waitingInventory: allMos.filter(m => m.status === 'Chờ nhập kho' || m.status === 'Đã nhập kho').length,
      completed: allMos.filter(m => m.status === 'Đã hoàn thành').length,
    };
  }, [mosData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-red-500">Không thể tải danh sách công lệnh</p>
        <button onClick={() => refetch()} className="mp-btn mp-btn-primary">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--mp-text-primary)' }}>
            <Factory size={28} />
            Công lệnh sản xuất
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--mp-text-secondary)' }}>
            Quản lý các công lệnh sản xuất
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/marketplace-v2/mo/create')}
          className="mp-btn mp-btn-primary"
        >
          <Plus size={18} />
          Tạo công lệnh
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
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng cộng</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>{stats.total}</p>
        </div>
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Chờ xác nhận</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Đang sản xuất</p>
          <p className="text-2xl font-bold text-purple-500">{stats.inProgress}</p>
        </div>
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Chờ nhập kho</p>
          <p className="text-2xl font-bold text-orange-500">{stats.waitingInventory}</p>
        </div>
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Đã hoàn thành</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card p-4"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mp-text-tertiary)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã MO, sản phẩm, loại..."
              className="mp-input pl-10 w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="min-w-[220px]">
              <MpCombobox
                options={[
                  { value: 'all', label: 'Tất cả trạng thái' },
                  ...Object.keys(statusConfig).map(status => ({
                    value: status,
                    label: status
                  }))
                ]}
                value={statusFilter}
                onChange={(option) => setStatusFilter(option?.value || 'all')}
                placeholder="Lọc trạng thái"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--mp-border-light)' }}>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 transition-colors ${viewMode === 'kanban' ? 'bg-blue-500 text-white' : ''}`}
                style={viewMode !== 'kanban' ? { color: 'var(--mp-text-secondary)' } : {}}
                title="Kanban"
              >
                <Kanban size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : ''}`}
                style={viewMode !== 'grid' ? { color: 'var(--mp-text-secondary)' } : {}}
                title="Grid"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : ''}`}
                style={viewMode !== 'table' ? { color: 'var(--mp-text-secondary)' } : {}}
                title="Table"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : mos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Factory size={64} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
          <p style={{ color: 'var(--mp-text-tertiary)' }}>
            {debouncedSearch || statusFilter !== 'all' ? 'Không tìm thấy công lệnh phù hợp' : 'Chưa có công lệnh nào'}
          </p>
          {!debouncedSearch && statusFilter === 'all' && (
            <button
              onClick={() => navigate('/marketplace-v2/mo/create')}
              className="mt-4 mp-btn mp-btn-primary"
            >
              <Plus size={18} />
              Tạo công lệnh đầu tiên
            </button>
          )}
        </motion.div>
      ) : viewMode === 'kanban' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto h-[calc(100vh-280px)] overflow-y-hidden hide-scroll-arrows"
        >
          <div className="flex gap-4 min-w-max h-full p-1 pb-4">
            {kanbanStatuses.map(status => (
              <KanbanColumn
                key={status}
                title={status}
                status={status}
                mos={mos}
                onMoClick={(moId) => navigate(`/marketplace-v2/mo/${moId}`)}
              />
            ))}
          </div>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-380px)] overflow-y-auto p-8 pb-20 hide-scroll-arrows"
        >
          <AnimatePresence>
            {mos.map((mo, index) => (
              <motion.div
                key={mo.moId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/marketplace-v2/mo/${mo.moId}`)}
                className="mp-glass-card p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Factory size={20} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                        {mo.moCode}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                        {mo.type}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[mo.status]?.color || 'bg-gray-100'}`}>
                    {mo.status}
                  </span>
                </div>
                
                <p className="text-sm mb-3" style={{ color: 'var(--mp-text-secondary)' }}>
                  <strong>Sản phẩm:</strong> {mo.itemName || mo.itemCode}
                </p>

                <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                    <Package size={14} />
                    SL: {mo.quantity}
                  </span>
                  <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                    <Clock size={14} />
                    {formatDate(mo.estimatedStartTime)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mp-glass-card overflow-hidden"
        >
          <div className="overflow-x-auto max-h-[calc(100vh-380px)] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)', backgroundColor: 'var(--mp-bg-secondary)' }}>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã MO</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Sản phẩm</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Loại</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>SL</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày bắt đầu</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {mos.map((mo) => (
                  <tr
                    key={mo.moId}
                    onClick={() => navigate(`/marketplace-v2/mo/${mo.moId}`)}
                    className="border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    style={{ borderColor: 'var(--mp-border-light)' }}
                  >
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                      {mo.moCode}
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
                      {mo.itemName || mo.itemCode}
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
                      {mo.type}
                    </td>
                    <td className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                      {mo.quantity}
                    </td>
                    <td className="py-3 px-4 text-center" style={{ color: 'var(--mp-text-secondary)' }}>
                      {formatDate(mo.estimatedStartTime)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[mo.status]?.color || 'bg-gray-100'}`}>
                        {mo.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoList;
