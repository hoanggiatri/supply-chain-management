import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Edit,
    Package,
    Settings,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useDeleteStage, useStageById } from '../../../hooks/useApi';

const statusConfig = {
  'Đang sử dụng': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  'Ngừng sử dụng': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  'active': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  'inactive': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

/**
 * Stage Detail Page
 * Displays manufacturing stage details with stage details list
 */
const StageDetail = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch stage data
  const { data: stage, isLoading, refetch } = useStageById(stageId);
  const deleteMutation = useDeleteStage();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(stageId);
      toast.success('Đã xóa quy trình sản xuất');
      navigate('/marketplace-v2/stages');
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa quy trình');
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'active') return 'Đang sử dụng';
    if (status === 'inactive') return 'Ngừng sử dụng';
    return status;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="mp-glass-card p-6 h-64" />
        <div className="mp-glass-card p-6 h-48" />
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Không tìm thấy quy trình sản xuất</p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const stageDetails = Array.isArray(stage.stageDetails) ? stage.stageDetails : [];
  const sortedDetails = [...stageDetails].sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="mp-glass-button p-2 rounded-xl"
          >
            <ArrowLeft size={20} style={{ color: 'var(--mp-text-secondary)' }} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
              Chi tiết quy trình sản xuất
            </h1>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              {stage.stageCode}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/marketplace-v2/stage/${stageId}/edit`)}
            className="mp-btn mp-btn-primary"
          >
            <Edit size={18} />
            Chỉnh sửa
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDeleteModalOpen(true)}
            className="mp-btn mp-btn-secondary text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
            Xóa
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin chung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Settings size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã quy trình</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {stage.stageCode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Hàng hóa</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {stage.itemCode} - {stage.itemName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số công đoạn</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {sortedDetails.length} công đoạn
                  </p>
                </div>
              </div>
            </div>
            
            {/* Description */}
            {stage.description && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mô tả</p>
                <p className="font-medium mt-1" style={{ color: 'var(--mp-text-primary)' }}>
                  {stage.description}
                </p>
              </div>
            )}
          </motion.div>

          {/* Stage Details List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Danh sách công đoạn
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Thứ tự</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên công đoạn</th>
                    <th className="py-3 px-2 text-right font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Thời gian dự kiến (phút)</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDetails.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center" style={{ color: 'var(--mp-text-tertiary)' }}>
                        Chưa có công đoạn nào
                      </td>
                    </tr>
                  ) : (
                    sortedDetails.map((detail, index) => (
                      <tr 
                        key={detail.stageDetailId || index} 
                        className="border-b"
                        style={{ borderColor: 'var(--mp-border-light)' }}
                      >
                        <td className="py-3 px-2" style={{ color: 'var(--mp-text-primary)' }}>
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center text-xs font-medium">
                            {detail.stageOrder || index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium" style={{ color: 'var(--mp-text-primary)' }}>{detail.stageName}</td>
                        <td className="py-3 px-2 text-right" style={{ color: 'var(--mp-text-primary)' }}>{detail.estimatedTime || 0}</td>
                        <td className="py-3 px-2" style={{ color: 'var(--mp-text-tertiary)' }}>{detail.description || '---'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            {sortedDetails.length > 0 && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                <div className="flex justify-end">
                  <div className="text-right">
                    <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng thời gian dự kiến: </span>
                    <span className="font-bold text-blue-500">
                      {sortedDetails.reduce((sum, d) => sum + (d.estimatedTime || 0), 0)} phút
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Status */}
        <div className="space-y-6">
          {/* Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Trạng thái
            </h2>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusConfig[stage.status]?.color || 'bg-gray-100'}`}>
              {getStatusLabel(stage.status)}
            </span>
          </motion.div>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="mp-glass-card p-6"
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin bổ sung
            </h3>
            <div className="space-y-3">
              {stage.createdOn && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: 'var(--mp-text-tertiary)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>Ngày tạo</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                      {new Date(stage.createdOn).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
              {stage.lastUpdatedOn && (
                <div className="flex items-center gap-2">
                  <Clock size={16} style={{ color: 'var(--mp-text-tertiary)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>Cập nhật lần cuối</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                      {new Date(stage.lastUpdatedOn).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa quy trình sản xuất"
        message={`Bạn có chắc chắn muốn xóa quy trình sản xuất "${stage.stageCode}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default StageDetail;
