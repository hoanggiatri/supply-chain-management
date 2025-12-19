import { DatePicker } from '@/components/ui/date-picker';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Factory,
  Loader2,
  Package,
  Save,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateMo, useItemsInCompany, useManufactureLinesInCompany } from '../../../hooks/useApi';

/**
 * Create MO Page - Create new Manufacturing Order
 */
const CreateMo = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { data: itemsData, isLoading: itemsLoading } = useItemsInCompany();
  const { data: linesData, isLoading: linesLoading } = useManufactureLinesInCompany();
  const createMutation = useCreateMo();

  const [formData, setFormData] = useState({
    itemId: '',
    lineId: '',
    type: 'Sản xuất',
    quantity: 1,
    estimatedStartTime: '',
    estimatedEndTime: '',
  });

  // Filter items for product selection (finished goods with BOM)
  const productItems = useMemo(() => {
    if (!itemsData) return [];
    const data = Array.isArray(itemsData) ? itemsData : itemsData.content || itemsData.data || [];
    return data.filter(item => item.itemType === 'Thành phẩm' || item.itemType === 'Bán thành phẩm');
  }, [itemsData]);

  const manufactureLines = useMemo(() => {
    if (!linesData) return [];
    return Array.isArray(linesData) ? linesData : linesData.content || linesData.data || [];
  }, [linesData]);

  const selectedProduct = productItems.find(p => p.itemId?.toString() === formData.itemId);
  const selectedLine = manufactureLines.find(l => l.lineId?.toString() === formData.lineId);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.itemId) {
      newErrors.itemId = 'Vui lòng chọn sản phẩm';
    }
    if (!formData.lineId) {
      newErrors.lineId = 'Vui lòng chọn dây chuyền sản xuất';
    }
    if (!formData.type?.trim()) {
      newErrors.type = 'Loại sản xuất không được để trống';
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }
    if (!formData.estimatedStartTime) {
      newErrors.estimatedStartTime = 'Vui lòng chọn ngày bắt đầu';
    }
    if (!formData.estimatedEndTime) {
      newErrors.estimatedEndTime = 'Vui lòng chọn ngày kết thúc';
    }
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
      const employeeName = localStorage.getItem('employeeName');
      
      const payload = {
        itemId: Number(formData.itemId),
        lineId: Number(formData.lineId),
        type: formData.type,
        quantity: Number(formData.quantity),
        estimatedStartTime: formData.estimatedStartTime + 'T00:00:00',
        estimatedEndTime: formData.estimatedEndTime + 'T23:59:59',
        status: 'Chờ xác nhận',
        createdBy: employeeName || 'User'
      };

      const response = await createMutation.mutateAsync(payload);
      
      // Check for BOM not found error
      if (response?.statusCode === 404) {
        toast.error(response?.message || 'Sản phẩm chưa có BOM! Vui lòng tạo BOM trước.');
        return;
      }
      
      setShowSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        navigate('/marketplace-v2/mos');
      }, 2000);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.statusCode === 404) {
        toast.error(errorData?.message || 'Sản phẩm chưa có BOM! Vui lòng tạo BOM trước.');
      } else {
        toast.error(errorData?.message || 'Có lỗi xảy ra khi tạo công lệnh');
      }
    }
  };

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
          Tạo công lệnh thành công!
        </h2>
        <p style={{ color: 'var(--mp-text-secondary)' }}>
          Đang chuyển về danh sách...
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
            Tạo công lệnh sản xuất
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Điền thông tin để tạo công lệnh mới
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
              <select
                value={formData.itemId}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, itemId: e.target.value }));
                  setErrors(prev => ({ ...prev, itemId: undefined }));
                }}
                className="mp-input w-full"
              >
                <option value="">-- Chọn sản phẩm --</option>
                {productItems.map(item => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.itemCode} - {item.itemName}
                  </option>
                ))}
              </select>
              {errors.itemId && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.itemId}
                </p>
              )}
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
              <select
                value={formData.lineId}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, lineId: e.target.value }));
                  setErrors(prev => ({ ...prev, lineId: undefined }));
                }}
                className="mp-input w-full"
              >
                <option value="">-- Chọn dây chuyền --</option>
                {manufactureLines.map(line => (
                  <option key={line.lineId} value={line.lineId}>
                    {line.lineCode} - {line.lineName}
                  </option>
                ))}
              </select>
              {errors.lineId && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.lineId}
                </p>
              )}
              {selectedLine && (
                <p className="mt-2 text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Mô tả: {selectedLine.description || 'Không có mô tả'}
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              Loại sản xuất *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="mp-input w-full"
            >
              <option value="Sản xuất">Sản xuất</option>
              <option value="Sửa chữa">Sửa chữa</option>
              <option value="Tái chế">Tái chế</option>
            </select>
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
              Ngày bắt đầu dự kiến *
            </label>
            <DatePicker
              name="estimatedStartTime"
              value={formData.estimatedStartTime}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, estimatedStartTime: e.target.value }));
                setErrors(prev => ({ ...prev, estimatedStartTime: undefined }));
              }}
              placeholder="Chọn ngày bắt đầu"
              error={!!errors.estimatedStartTime}
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
              Ngày kết thúc dự kiến *
            </label>
            <DatePicker
              name="estimatedEndTime"
              value={formData.estimatedEndTime}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, estimatedEndTime: e.target.value }));
                setErrors(prev => ({ ...prev, estimatedEndTime: undefined }));
              }}
              placeholder="Chọn ngày kết thúc"
              error={!!errors.estimatedEndTime}
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
          disabled={createMutation.isPending}
          className="mp-btn mp-btn-primary"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Save size={18} />
              Tạo công lệnh
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CreateMo;
