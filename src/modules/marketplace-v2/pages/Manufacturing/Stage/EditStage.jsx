import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Loader2,
    Package,
    Plus,
    Save,
    Settings,
    Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useProducts, useStageById, useUpdateStage } from '../../../hooks/useApi';

/**
 * Edit Stage Page
 * Form to edit an existing manufacturing stage
 */
const EditStage = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  
  const [stage, setStage] = useState({
    itemId: '',
    itemCode: '',
    itemName: '',
    description: '',
    status: '',
  });
  
  const [stageDetails, setStageDetails] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch data
  const { data: stageData, isLoading: stageLoading } = useStageById(stageId);
  const { data: itemsData } = useProducts();
  const updateMutation = useUpdateStage();

  // Filter items to only show Thành phẩm and Bán thành phẩm
  const items = (itemsData || []).filter(
    item => item.itemType === 'Thành phẩm' || item.itemType === 'Bán thành phẩm'
  );

  // Initialize form with fetched data
  useEffect(() => {
    if (stageData) {
      setStage({
        itemId: stageData.itemId,
        itemCode: stageData.itemCode,
        itemName: stageData.itemName,
        description: stageData.description || '',
        status: stageData.status,
      });
      
      const details = Array.isArray(stageData.stageDetails) ? stageData.stageDetails : [];
      setStageDetails(
        details.map(d => ({
          stageDetailId: d.stageDetailId,
          stageName: d.stageName || '',
          stageOrder: d.stageOrder || 1,
          estimatedTime: d.estimatedTime || 0,
          description: d.description || '',
        })).sort((a, b) => a.stageOrder - b.stageOrder)
      );
    }
  }, [stageData]);

  const handleAddDetail = () => {
    setStageDetails(prev => [
      ...prev,
      {
        stageName: '',
        stageOrder: prev.length + 1,
        estimatedTime: 0,
        description: '',
      }
    ]);
  };

  const handleUpdateDetail = (index, field, value) => {
    setStageDetails(prev =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    );
  };

  const handleDeleteDetail = (index) => {
    setStageDetails(prev =>
      prev.filter((_, i) => i !== index)
        .map((detail, i) => ({ ...detail, stageOrder: i + 1 }))
    );
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!stage.status) {
      newErrors.status = 'Vui lòng chọn trạng thái';
    }

    // Validate stage details
    stageDetails.forEach((detail, index) => {
      if (!detail.stageName?.trim()) {
        newErrors[`detail_${index}_stageName`] = 'Tên công đoạn không được để trống';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    const request = {
      itemId: stage.itemId,
      description: stage.description,
      status: stage.status,
      stageDetails: stageDetails.map(detail => ({
        stageDetailId: detail.stageDetailId,
        stageName: detail.stageName,
        stageOrder: detail.stageOrder,
        estimatedTime: Number(detail.estimatedTime) || 0,
        description: detail.description,
      })),
    };

    try {
      await updateMutation.mutateAsync({ stageId, data: request });
      toast.success('Cập nhật quy trình sản xuất thành công!');
      navigate(`/marketplace-v2/stage/${stageId}`);
    } catch (error) {
      console.error('Error updating stage:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật quy trình');
    }
  };

  if (stageLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!stageData) {
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
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
              Chỉnh sửa quy trình sản xuất
            </h1>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              {stageData.stageCode}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="mp-btn mp-btn-secondary"
          >
            Hủy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="mp-btn mp-btn-primary"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Lưu
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
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
              {/* Item (Read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  Hàng hóa
                </label>
                <input
                  type="text"
                  value={`${stage.itemCode} - ${stage.itemName}`}
                  readOnly
                  className="mp-input w-full bg-gray-50 dark:bg-gray-800"
                />
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  value={stage.status}
                  onChange={(e) => setStage(prev => ({ ...prev, status: e.target.value }))}
                  className={`mp-input w-full ${errors.status ? 'border-red-500' : ''}`}
                >
                  <option value="Đang sử dụng">Đang sử dụng</option>
                  <option value="Ngừng sử dụng">Ngừng sử dụng</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  Mô tả
                </label>
                <textarea
                  value={stage.description}
                  onChange={(e) => setStage(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mp-input w-full"
                  placeholder="Nhập mô tả quy trình..."
                />
              </div>
            </div>
          </motion.div>

          {/* Stage Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mp-glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                Danh sách công đoạn
              </h2>
              <button
                onClick={handleAddDetail}
                className="mp-btn mp-btn-secondary text-sm"
              >
                <Plus size={16} />
                Thêm công đoạn
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
                    <th className="py-3 px-2 text-left font-medium w-16" style={{ color: 'var(--mp-text-tertiary)' }}>TT</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Tên công đoạn *</th>
                    <th className="py-3 px-2 text-left font-medium w-32" style={{ color: 'var(--mp-text-tertiary)' }}>Thời gian (phút)</th>
                    <th className="py-3 px-2 text-left font-medium" style={{ color: 'var(--mp-text-tertiary)' }}>Ghi chú</th>
                    <th className="py-3 px-2 text-center font-medium w-16" style={{ color: 'var(--mp-text-tertiary)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {stageDetails.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center" style={{ color: 'var(--mp-text-tertiary)' }}>
                        Chưa có công đoạn nào. Nhấn "Thêm công đoạn" để bắt đầu.
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {stageDetails.map((detail, index) => (
                        <motion.tr
                          key={detail.stageDetailId || `new-${index}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="border-b"
                          style={{ borderColor: 'var(--mp-border-light)' }}
                        >
                          <td className="py-2 px-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center text-xs font-medium">
                              {detail.stageOrder}
                            </span>
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={detail.stageName}
                              onChange={(e) => handleUpdateDetail(index, 'stageName', e.target.value)}
                              className={`mp-input w-full text-sm ${errors[`detail_${index}_stageName`] ? 'border-red-500' : ''}`}
                              placeholder="Tên công đoạn..."
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min={0}
                              value={detail.estimatedTime}
                              onChange={(e) => handleUpdateDetail(index, 'estimatedTime', e.target.value)}
                              className="mp-input w-full text-sm"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={detail.description}
                              onChange={(e) => handleUpdateDetail(index, 'description', e.target.value)}
                              className="mp-input w-full text-sm"
                              placeholder="Ghi chú..."
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => handleDeleteDetail(index)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            {stageDetails.length > 0 && (
              <div className="mt-4 pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--mp-border-light)' }}>
                <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                  {stageDetails.length} công đoạn
                </span>
                <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Tổng thời gian: <strong className="text-blue-500">{stageDetails.reduce((sum, d) => sum + (Number(d.estimatedTime) || 0), 0)} phút</strong>
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Item Info */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Sản phẩm
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã hàng hóa</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {stage.itemCode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Settings size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tên hàng hóa</p>
                  <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                    {stage.itemName}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditStage;
