import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Eye,
  FileText,
  Filter,
  Grid3X3,
  List,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDebounce } from '../../../hooks';
import { useBomsInCompany, useDeleteBom } from '../../../hooks/useApi';

const statusColors = {
  'Hoạt động': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Không hoạt động': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

/**
 * BOM List Page - Display all BOMs in company
 */
const BomList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: bomsData, isLoading, error, refetch } = useBomsInCompany();
  const deleteMutation = useDeleteBom();

  // Process BOMs data
  const boms = useMemo(() => {
    if (!bomsData) return [];
    
    let data = Array.isArray(bomsData) ? bomsData : 
               bomsData.content ? bomsData.content : 
               bomsData.data ? bomsData.data : [];
    
    // Apply search filter
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      data = data.filter(bom =>
        bom.bomCode?.toLowerCase().includes(search) ||
        bom.itemCode?.toLowerCase().includes(search) ||
        bom.itemName?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      data = data.filter(bom => bom.status === statusFilter);
    }
    
    return data;
  }, [bomsData, debouncedSearch, statusFilter]);

  const handleDelete = async (bomId, e) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc muốn xóa BOM này không?')) return;
    
    try {
      await deleteMutation.mutateAsync(bomId);
      toast.success('Xóa BOM thành công!');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa BOM');
    }
  };

  // Stats
  const stats = useMemo(() => {
    const allBoms = Array.isArray(bomsData) ? bomsData : 
                   bomsData?.content || bomsData?.data || [];
    return {
      total: allBoms.length,
      active: allBoms.filter(b => b.status === 'Hoạt động').length,
      inactive: allBoms.filter(b => b.status === 'Không hoạt động').length,
    };
  }, [bomsData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-red-500">Không thể tải danh sách BOM</p>
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
            <FileText size={28} />
            Định mức nguyên vật liệu (BOM)
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--mp-text-secondary)' }}>
            Quản lý định mức NVL cho sản xuất
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/marketplace-v2/bom/create')}
          className="mp-btn mp-btn-primary"
        >
          <Plus size={18} />
          Thêm BOM mới
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng số BOM</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>{stats.total}</p>
        </div>
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Đang hoạt động</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </div>
        <div className="mp-glass-card p-4">
          <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Không hoạt động</p>
          <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
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
              placeholder="Tìm theo mã BOM, mã SP, tên SP..."
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
                <option value="Hoạt động">Hoạt động</option>
                <option value="Không hoạt động">Không hoạt động</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--mp-border-light)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : ''}`}
                style={viewMode !== 'grid' ? { color: 'var(--mp-text-secondary)' } : {}}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : ''}`}
                style={viewMode !== 'table' ? { color: 'var(--mp-text-secondary)' } : {}}
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
      ) : boms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package size={64} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
          <p style={{ color: 'var(--mp-text-tertiary)' }}>
            {debouncedSearch || statusFilter !== 'all' ? 'Không tìm thấy BOM phù hợp' : 'Chưa có BOM nào'}
          </p>
          {!debouncedSearch && statusFilter === 'all' && (
            <button
              onClick={() => navigate('/marketplace-v2/bom/create')}
              className="mt-4 mp-btn mp-btn-primary"
            >
              <Plus size={18} />
              Tạo BOM đầu tiên
            </button>
          )}
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {boms.map((bom, index) => (
              <motion.div
                key={bom.bomId || bom.itemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/marketplace-v2/bom/${bom.itemId}`)}
                className="mp-glass-card p-4 cursor-pointer hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                        {bom.bomCode}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                        {bom.itemCode}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[bom.status] || 'bg-gray-100 text-gray-700'}`}>
                    {bom.status}
                  </span>
                </div>
                
                <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  <strong>Sản phẩm:</strong> {bom.itemName}
                </p>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                    {bom.bomDetails?.length || 0} NVL
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/marketplace-v2/bom/${bom.itemId}`); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} style={{ color: 'var(--mp-text-secondary)' }} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/marketplace-v2/bom/${bom.itemId}/edit`); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Sửa"
                    >
                      <Pencil size={16} style={{ color: 'var(--mp-text-secondary)' }} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(bom.bomId, e)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Xóa"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)', backgroundColor: 'var(--mp-bg-secondary)' }}>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã BOM</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã SP</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên sản phẩm</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Số NVL</th>
                  <th className="py-3 px-4 text-center font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Trạng thái</th>
                  <th className="py-3 px-4 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {boms.map((bom) => (
                  <tr
                    key={bom.bomId || bom.itemId}
                    onClick={() => navigate(`/marketplace-v2/bom/${bom.itemId}`)}
                    className="border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    style={{ borderColor: 'var(--mp-border-light)' }}
                  >
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                      {bom.bomCode}
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
                      {bom.itemCode}
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
                      {bom.itemName}
                    </td>
                    <td className="py-3 px-4 text-center" style={{ color: 'var(--mp-text-secondary)' }}>
                      {bom.bomDetails?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[bom.status] || 'bg-gray-100 text-gray-700'}`}>
                        {bom.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/marketplace-v2/bom/${bom.itemId}/edit`); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Sửa"
                        >
                          <Pencil size={16} style={{ color: 'var(--mp-text-secondary)' }} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(bom.bomId, e)}
                          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                          title="Xóa"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
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

export default BomList;
