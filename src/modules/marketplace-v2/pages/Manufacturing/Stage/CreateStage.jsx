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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateStage, useProducts } from '../../../hooks/useApi';

/**
 * Create Stage Page
 * Form to create a new manufacturing stage with stage details
 */
const CreateStage = () => {
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [existingStageWarning, setExistingStageWarning] = useState(false);
  
  const [stage, setStage] = useState({
    itemId: '',
    itemCode: '',
    itemName: '',
    description: '',
    status: 'Đang sử dụng',
  });
  
  const [stageDetails, setStageDetails] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch items
  const { data: itemsData } = useProducts();
  const createMutation = useCreateStage();

  // Filter items to only show Thành phẩm and Bán thành phẩm
  const items = (itemsData || []).filter(
    item => item.itemType === 'Thành phẩm' || item.itemType === 'Bán thành phẩm'
  );

  const handleItemSelect = (itemId) => {
    const selectedItem = items.find(item => item.itemId === Number(itemId));
    if (selectedItem) {
      setStage(prev => ({
        ...prev,
        itemId: selectedItem.itemId,
        itemCode: selectedItem.itemCode,
        itemName: selectedItem.itemName,
      }));
      setErrors(prev => ({ ...prev, itemId: null }));
    }
  };

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
    
    if (!stage.itemId) {
      newErrors.itemId = 'Vui lòng chọn hàng hóa';
    }
    
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
        stageName: detail.stageName,
        stageOrder: detail.stageOrder,
        estimatedTime: Number(detail.estimatedTime) || 0,
        description: detail.description,
      })),
    };

    try {
      await createMutation.mutateAsync(request);
      toast.success('Tạo quy trình sản xuất thành công!');
      navigate('/marketplace-v2/stages');
    } catch (error) {
      console.error('Error creating stage:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo quy trình');
    }
  };

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
              Tạo quy trình sản xuất
            </h1>
            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              Thêm mới quy trình sản xuất cho sản phẩm
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
            disabled={createMutation.isPending}
            className="mp-btn mp-btn-primary"
          >
            {createMutation.isPending ? (
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
              {/* Item Select */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  Hàng hóa <span className="text-red-500">*</span>
                </label>
                <select
                  value={stage.itemId}
                  onChange={(e) => handleItemSelect(e.target.value)}
                  className={`mp-input w-full ${errors.itemId ? 'border-red-500' : ''}`}
                >
                  <option value="">-- Chọn hàng hóa --</option>
                  {items.map(item => (
                    <option key={item.itemId} value={item.itemId}>
                      {item.itemCode} - {item.itemName}
                    </option>
                  ))}
                </select>
                {errors.itemId && (
                  <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>
                )}
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
                          key={index}
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

        {/* Right Column: Selected Item Info */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Sản phẩm đã chọn
            </h2>
            {stage.itemId ? (
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
            ) : (
              <p className="text-center py-4" style={{ color: 'var(--mp-text-tertiary)' }}>
                Chưa chọn hàng hóa
              </p>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="mp-glass-card p-6"
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--mp-text-primary)' }}>
              Hướng dẫn
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Chọn hàng hóa (Thành phẩm/Bán thành phẩm) để tạo quy trình
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Thêm các công đoạn theo thứ tự sản xuất
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Nhập thời gian dự kiến cho mỗi công đoạn
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateStage;
