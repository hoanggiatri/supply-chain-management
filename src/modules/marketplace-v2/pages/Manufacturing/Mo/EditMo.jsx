import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Factory,
  Loader2,
  Package,
  Save,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { MpCombobox } from '../../../components/ui/MpCombobox';
import {
  useItemsInCompany,
  useManufactureLinesInCompany,
  useMoById,
  useUpdateMo
} from '../../../hooks/useApi';

/**
 * Edit MO Page - Edit existing Manufacturing Order
 * Only allowed when status = "Chờ xác nhận"
 */
const EditMo = () => {
  const navigate = useNavigate();
  const { moId } = useParams();
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: mo, isLoading: moLoading } = useMoById(moId);
  const { data: itemsData, isLoading: itemsLoading } = useItemsInCompany();
  const { data: linesData, isLoading: linesLoading } = useManufactureLinesInCompany();
  const updateMutation = useUpdateMo();

  const [formData, setFormData] = useState({
    itemId: '',
    lineId: '',
    type: 'Sản xuất',
    quantity: 1,
    estimatedStartTime: '',
    estimatedEndTime: '',
  });

  // Load MO data into form
  useEffect(() => {
    if (mo) {
      setFormData({
        itemId: mo.itemId?.toString() || '',
        lineId: mo.lineId?.toString() || '',
        type: mo.type || 'Sản xuất',
        quantity: mo.quantity || 1,
        estimatedStartTime: mo.estimatedStartTime ? dayjs(mo.estimatedStartTime).format('YYYY-MM-DD') : '',
        estimatedEndTime: mo.estimatedEndTime ? dayjs(mo.estimatedEndTime).format('YYYY-MM-DD') : '',
      });
    }
  }, [mo]);

  const productItems = useMemo(() => {
    if (!itemsData) return [];
    const data = Array.isArray(itemsData) ? itemsData : itemsData.content || itemsData.data || [];
    return data.filter(item => item.itemType === 'Thành phẩm' || item.itemType === 'Bán thành phẩm');
  }, [itemsData]);

  const manufactureLines = useMemo(() => {
    if (!linesData) return [];
    return Array.isArray(linesData) ? linesData : linesData.content || linesData.data || [];
  }, [linesData]);

  // Convert to Combobox options
  const productOptions = useMemo(() => 
    productItems.map(item => ({
      value: item.itemId,
      label: `${item.itemCode} - ${item.itemName}`
    })), [productItems]
  );

  const lineOptions = useMemo(() => 
    manufactureLines.map(line => ({
      value: line.lineId,
      label: `${line.lineCode} - ${line.lineName}`
    })), [manufactureLines]
  );

  const typeOptions = [
    { value: 'Sản xuất', label: 'Sản xuất' },
    { value: 'Sửa chữa', label: 'Sửa chữa' },
    { value: 'Tái chế', label: 'Tái chế' }
  ];

  const selectedProduct = productItems.find(p => p.itemId?.toString() === formData.itemId);
  const selectedLine = manufactureLines.find(l => l.lineId?.toString() === formData.lineId);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemId) newErrors.itemId = 'Vui lòng chọn sản phẩm';
    if (!formData.lineId) newErrors.lineId = 'Vui lòng chọn dây chuyền';
    if (!formData.type?.trim()) newErrors.type = 'Loại sản xuất không được để trống';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Số lượng phải lớn hơn 0';
    if (!formData.estimatedStartTime) newErrors.estimatedStartTime = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.estimatedEndTime) newErrors.estimatedEndTime = 'Vui lòng chọn ngày kết thúc';
    if (formData.estimatedStartTime && formData.estimatedEndTime) {
      if (new Date(formData.estimatedStartTime) >= new Date(formData.estimatedEndTime)) {
        newErrors.estimatedEndTime = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        moId,
        data: {
          itemId: Number(formData.itemId),
          lineId: Number(formData.lineId),
          type: formData.type,
          quantity: Number(formData.quantity),
          estimatedStartTime: formData.estimatedStartTime + 'T00:00:00',
          estimatedEndTime: formData.estimatedEndTime + 'T23:59:59',
          status: mo.status, // Keep current status
        }
      });

      setShowSuccess(true);
      toast.success('Cập nhật công lệnh thành công!');

      setTimeout(() => {
        navigate(`/marketplace-v2/mo/${moId}`);
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    }
  };

  // Loading state
  if (moLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Check if MO can be edited
  if (mo && mo.status !== 'Chờ xác nhận') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--mp-text-primary)' }}>
            Không thể chỉnh sửa
          </h2>
          <p className="mb-4" style={{ color: 'var(--mp-text-secondary)' }}>
            Chỉ công lệnh ở trạng thái "Chờ xác nhận" mới được chỉnh sửa.
          </p>
          <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
        >
          <Check size={48} className="text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--mp-text-primary)' }}>
          Cập nhật thành công!
        </h2>
        <p style={{ color: 'var(--mp-text-secondary)' }}>
          Đang chuyển về chi tiết...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
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
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Chỉnh sửa công lệnh
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {mo?.moCode}
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6 space-y-6"
      >
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
            <Package size={16} className="inline mr-1" />
            Sản phẩm *
          </label>
          {itemsLoading ? (
            <div className="flex items-center py-2">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Đang tải...</span>
            </div>
          ) : (
            <>
              <MpCombobox
                options={productOptions}
                value={formData.itemId}
                onChange={(option) => {
                  setFormData(prev => ({ ...prev, itemId: option?.value || '' }));
                  setErrors(prev => ({ ...prev, itemId: undefined }));
                }}
                placeholder="Chọn sản phẩm"
                error={!!errors.itemId}
                helperText={errors.itemId}
              />
              {selectedProduct && (
                <p className="mt-2 text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Loại: {selectedProduct.itemType} | ĐVT: {selectedProduct.uom}
                </p>
              )}
            </>
          )}
        </div>

        {/* Manufacture Line */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
            <Factory size={16} className="inline mr-1" />
            Dây chuyền sản xuất *
          </label>
          {linesLoading ? (
            <div className="flex items-center py-2">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Đang tải...</span>
            </div>
          ) : (
            <>
              <MpCombobox
                options={lineOptions}
                value={formData.lineId}
                onChange={(option) => {
                  setFormData(prev => ({ ...prev, lineId: option?.value || '' }));
                  setErrors(prev => ({ ...prev, lineId: undefined }));
                }}
                placeholder="Chọn dây chuyền"
                error={!!errors.lineId}
                helperText={errors.lineId}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              Loại sản xuất *
            </label>
            <MpCombobox
              options={typeOptions}
              value={formData.type}
              onChange={(option) => setFormData(prev => ({ ...prev, type: option?.value || 'Sản xuất' }))}
              placeholder="Chọn loại"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              Số lượng *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, quantity: e.target.value }));
                setErrors(prev => ({ ...prev, quantity: undefined }));
              }}
              className="mp-input w-full"
              min="1"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.quantity}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              <Calendar size={16} className="inline mr-1" />
              Ngày bắt đầu dự kiến *
            </label>
            <input
              type="date"
              value={formData.estimatedStartTime}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, estimatedStartTime: e.target.value }));
                setErrors(prev => ({ ...prev, estimatedStartTime: undefined }));
              }}
              className="mp-input w-full"
            />
            {errors.estimatedStartTime && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.estimatedStartTime}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              <Calendar size={16} className="inline mr-1" />
              Ngày kết thúc dự kiến *
            </label>
            <input
              type="date"
              value={formData.estimatedEndTime}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, estimatedEndTime: e.target.value }));
                setErrors(prev => ({ ...prev, estimatedEndTime: undefined }));
              }}
              className="mp-input w-full"
            />
            {errors.estimatedEndTime && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.estimatedEndTime}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="mp-btn mp-btn-secondary"
        >
          <X size={18} />
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
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save size={18} />
              Lưu thay đổi
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EditMo;
