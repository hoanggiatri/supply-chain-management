import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Edit3,
    FileText,
    Loader2,
    Package,
    Trash2
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBomByItemId, useDeleteBom } from '../../../hooks/useApi';

/**
 * BOM Detail Page - Display BOM details with materials list
 */
const BomDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  
  const { data: bom, isLoading, error } = useBomByItemId(itemId);
  const deleteMutation = useDeleteBom();

  const bomDetails = useMemo(() => {
    if (!bom?.bomDetails) return [];
    return Array.isArray(bom.bomDetails) ? bom.bomDetails : [];
  }, [bom]);

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa BOM này không?')) return;
    
    try {
      await deleteMutation.mutateAsync(bom.bomId);
      toast.success('Xóa BOM thành công!');
      navigate('/marketplace-v2/boms');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa BOM');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !bom) {
    return (
      <div className="text-center py-12">
        <Package size={64} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
        <p style={{ color: 'var(--mp-text-tertiary)' }}>Không tìm thấy BOM</p>
        <button onClick={() => navigate('/marketplace-v2/boms')} className="mt-4 mp-btn mp-btn-primary">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mp-glass-button p-2 rounded-xl"
        >
          <ArrowLeft size={20} style={{ color: 'var(--mp-text-secondary)' }} />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Chi tiết BOM
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {bom.bomCode}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/marketplace-v2/bom/${itemId}/edit`)}
            className="mp-btn mp-btn-secondary"
          >
            <Edit3 size={18} />
            Sửa
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            className="mp-btn bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 size={18} />
            Xóa
          </motion.button>
        </div>
      </motion.div>

      {/* BOM Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FileText size={32} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
              {bom.itemName}
            </h2>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              Mã sản phẩm: {bom.itemCode}
            </p>
          </div>
          <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
            bom.status === 'Hoạt động' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
          }`}>
            {bom.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã BOM</p>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{bom.bomCode}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số NVL</p>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{bomDetails.length} loại</p>
          </div>
          {bom.description && (
            <div className="md:col-span-2">
              <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mô tả</p>
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{bom.description}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Materials Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card overflow-hidden"
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
            <Package size={18} />
            Danh sách nguyên vật liệu ({bomDetails.length})
          </h3>
        </div>
        
        {bomDetails.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
            <p style={{ color: 'var(--mp-text-tertiary)' }}>Chưa có NVL nào trong BOM</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--mp-bg-secondary)' }}>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>#</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Mã NVL</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên NVL</th>
                  <th className="py-3 px-4 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Số lượng</th>
                  <th className="py-3 px-4 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {bomDetails.map((detail, index) => (
                    <motion.tr
                      key={detail.itemId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      style={{ borderColor: 'var(--mp-border-light)' }}
                    >
                      <td className="py-3 px-4" style={{ color: 'var(--mp-text-tertiary)' }}>{index + 1}</td>
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                        {detail.itemCode}
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
                        {detail.itemName}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                        {detail.quantity}
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--mp-text-tertiary)' }}>
                        {detail.note || '-'}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BomDetail;
