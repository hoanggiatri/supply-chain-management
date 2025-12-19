import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Filter,
  Grid3X3,
  List,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks';
import { useStagesInCompany } from '../../../hooks/useApi';

const statusConfig = {
  'Đang sử dụng': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Đang sử dụng' },
  'Ngừng sử dụng': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Ngừng sử dụng' },
  'active': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Đang sử dụng' },
  'inactive': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Ngừng sử dụng' },
};

/**
 * Stage List Page - Display all manufacturing stages
 */
const StageList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: stagesData, isLoading, error, refetch } = useStagesInCompany();

  // Process stages data
  const stages = useMemo(() => {
    if (!stagesData) return [];
    
    let data = Array.isArray(stagesData) ? stagesData : 
               stagesData.content ? stagesData.content : 
               stagesData.data ? stagesData.data : [];
    
    // Apply search filter
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      data = data.filter(stage =>
        stage.stageCode?.toLowerCase().includes(search) ||
        stage.itemCode?.toLowerCase().includes(search) ||
        stage.itemName?.toLowerCase().includes(search) ||
        stage.description?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      data = data.filter(stage => stage.status === statusFilter);
    }
    
    return data;
  }, [stagesData, debouncedSearch, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const allStages = Array.isArray(stagesData) ? stagesData : 
                      stagesData?.content || stagesData?.data || [];
    return {
      total: allStages.length,
      active: allStages.filter(s => s.status === 'Đang sử dụng' || s.status === 'active').length,
      inactive: allStages.filter(s => s.status === 'Ngừng sử dụng' || s.status === 'inactive').length,
    };
  }, [stagesData]);

  const getStatusLabel = (status) => {
    return statusConfig[status]?.label || status;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-red-500">Không thể tải danh sách quy trình sản xuất</p>
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
            <Settings size={28} />
            Quy trình sản xuất
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--mp-text-secondary)' }}>
            Quản lý các quy trình sản xuất cho sản phẩm
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/marketplace-v2/stage/create')}
          className="mp-btn mp-btn-primary"
        >
          <Plus size={18} />
          Tạo quy trình
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng cộng</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>{stats.total}</p>
        </div>
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Đang sử dụng</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </div>
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Ngừng sử dụng</p>
          <p className="text-2xl font-bold text-red-500">{stats.inactive}</p>
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
              placeholder="Tìm theo mã Stage, sản phẩm..."
              className="mp-input pl-10 w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} style={{ color: 'var(--mp-text-tertiary)' }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mp-input"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Ngừng sử dụng">Ngừng sử dụng</option>
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="mp-btn mp-btn-secondary"
              title="Làm mới"
            >
              <RefreshCw size={18} />
            </button>

            {/* View Toggle */}
            <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--mp-border-light)' }}>
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
      ) : stages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Settings size={64} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
          <p style={{ color: 'var(--mp-text-tertiary)' }}>
            {debouncedSearch || statusFilter !== 'all' ? 'Không tìm thấy quy trình phù hợp' : 'Chưa có quy trình sản xuất nào'}
          </p>
          {!debouncedSearch && statusFilter === 'all' && (
            <button
              onClick={() => navigate('/marketplace-v2/stage/create')}
              className="mt-4 mp-btn mp-btn-primary"
            >
              <Plus size={18} />
              Tạo quy trình đầu tiên
            </button>
          )}
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-400px)] overflow-y-auto p-6 pb-20"
        >
          <AnimatePresence>
            {stages.map((stage, index) => (
              <motion.div
                key={stage.stageId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/marketplace-v2/stage/${stage.stageId}`)}
                className="mp-glass-card p-5 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Settings size={20} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                        {stage.stageCode}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                        {stage.itemCode}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[stage.status]?.color || 'bg-gray-100'}`}>
                    {getStatusLabel(stage.status)}
                  </span>
                </div>
                
                <p className="text-sm mb-2 line-clamp-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  <strong>Sản phẩm:</strong> {stage.itemName}
                </p>

                {stage.description && (
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--mp-text-tertiary)' }}>
                    {stage.description}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <Package size={14} style={{ color: 'var(--mp-text-tertiary)' }} />
                  <span className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                    {stage.stageDetails?.length || 0} công đoạn
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
          <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)', backgroundColor: 'var(--mp-bg-secondary)' }}>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã Stage</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã hàng hóa</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên hàng hóa</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mô tả</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Công đoạn</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => (
                  <tr
                    key={stage.stageId}
                    onClick={() => navigate(`/marketplace-v2/stage/${stage.stageId}`)}
                    className="border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    style={{ borderColor: 'var(--mp-border-light)' }}
                  >
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                      {stage.stageCode}
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
                      {stage.itemCode}
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
                      {stage.itemName}
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--mp-text-tertiary)' }}>
                      {stage.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-center" style={{ color: 'var(--mp-text-primary)' }}>
                      {stage.stageDetails?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[stage.status]?.color || 'bg-gray-100'}`}>
                        {getStatusLabel(stage.status)}
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

export default StageList;
