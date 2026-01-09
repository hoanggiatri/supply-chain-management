import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    Loader2,
    Package,
    Plus,
    Save,
    Trash2,
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MpCombobox } from '../../../components/ui/MpCombobox';
import { useCreateBom, useItemsInCompany } from '../../../hooks/useApi';

/**
 * Create BOM Page - Create new Bill of Materials
 */
const CreateBom = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { data: itemsData, isLoading: itemsLoading } = useItemsInCompany();
  const createMutation = useCreateBom();

  const [formData, setFormData] = useState({
    itemId: '',
    description: '',
    status: 'Đang sử dụng',
    bomDetails: [], // { itemId, quantity, note }
  });

  // Filter items for product selection (only non-raw materials)
  const productItems = useMemo(() => {
    if (!itemsData) return [];
    const data = Array.isArray(itemsData) ? itemsData : itemsData.content || itemsData.data || [];
    return data.filter(item => item.itemType === 'Thành phẩm' || item.itemType === 'Bán thành phẩm');
  }, [itemsData]);

  // Filter items for materials selection (raw materials)
  const materialItems = useMemo(() => {
    if (!itemsData) return [];
    const data = Array.isArray(itemsData) ? itemsData : itemsData.content || itemsData.data || [];
    return data.filter(item => 
      item.itemType === 'Nguyên vật liệu' || 
      item.itemType === 'Vật tư' ||
      item.itemType === 'Bán thành phẩm'
    );
  }, [itemsData]);

  // Convert to Combobox options
  const productOptions = useMemo(() => 
    productItems.map(item => ({
      value: item.itemId,
      label: `${item.itemCode} - ${item.itemName}`
    })), [productItems]
  );

  const materialOptions = useMemo(() => 
    materialItems.map(item => ({
      value: item.itemId,
      label: `${item.itemCode} - ${item.itemName}`
    })), [materialItems]
  );

  const selectedProduct = productItems.find(p => p.itemId?.toString() === formData.itemId);

  const handleAddMaterial = () => {
    setFormData(prev => ({
      ...prev,
      bomDetails: [...prev.bomDetails, { itemId: '', quantity: 1, note: '' }]
    }));
  };

  const handleRemoveMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      bomDetails: prev.bomDetails.filter((_, i) => i !== index)
    }));
  };

  const handleMaterialChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bomDetails: prev.bomDetails.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
    setErrors(prev => ({ ...prev, [`material_${index}`]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.itemId) {
      newErrors.itemId = 'Vui lòng chọn sản phẩm';
    }
    
    if (formData.bomDetails.length === 0) {
      newErrors.bomDetails = 'Vui lòng thêm ít nhất 1 NVL';
    }
    
    formData.bomDetails.forEach((detail, index) => {
      if (!detail.itemId) {
        newErrors[`material_${index}`] = 'Vui lòng chọn NVL';
      }
      if (!detail.quantity || detail.quantity <= 0) {
        newErrors[`quantity_${index}`] = 'Số lượng phải > 0';
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

    try {
      const payload = {
        itemId: Number(formData.itemId),
        description: formData.description,
        status: formData.status,
        bomDetails: formData.bomDetails.map(detail => ({
          itemId: Number(detail.itemId),
          quantity: Number(detail.quantity),
          note: detail.note || ''
        }))
      };

      await createMutation.mutateAsync(payload);
      
      setShowSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        navigate('/marketplace-v2/boms');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo BOM');
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
          Tạo BOM thành công!
        </h2>
        <p style={{ color: 'var(--mp-text-secondary)' }}>
          Đang chuyển về danh sách...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
            Thêm mới BOM
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Tạo định mức nguyên vật liệu cho sản phẩm
          </p>
        </div>
      </motion.div>

      {/* Product Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
          Chọn sản phẩm
        </h3>
        
        {itemsLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
                Sản phẩm *
              </label>
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
            </div>

            {selectedProduct && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--mp-bg-secondary)' }}>
                <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Sản phẩm đã chọn</p>
                <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                  {selectedProduct.itemName}
                </p>
                <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                  Loại: {selectedProduct.itemType} | ĐVT: {selectedProduct.uom}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mp-input w-full resize-none"
                rows={2}
                placeholder="Mô tả cho BOM..."
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Materials List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
            <Package size={18} />
            Danh sách nguyên vật liệu ({formData.bomDetails.length})
          </h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddMaterial}
            className="mp-btn mp-btn-secondary text-sm"
          >
            <Plus size={16} />
            Thêm NVL
          </motion.button>
        </div>

        {errors.bomDetails && (
          <p className="mb-4 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.bomDetails}
          </p>
        )}

        {formData.bomDetails.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-xl" style={{ borderColor: 'var(--mp-border-light)' }}>
            <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
            <p style={{ color: 'var(--mp-text-tertiary)' }}>Chưa có NVL nào</p>
            <button
              onClick={handleAddMaterial}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              + Thêm nguyên vật liệu đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.bomDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl border flex flex-col md:flex-row gap-3"
                style={{ borderColor: 'var(--mp-border-light)', backgroundColor: 'var(--mp-bg-secondary)' }}
              >
                <div className="flex-1">
                 <label className="block text-xs font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Nguyên vật liệu *
                  </label>
                  <MpCombobox
                    options={materialOptions}
                    value={detail.itemId}
                    onChange={(option) => handleMaterialChange(index, 'itemId', option?.value || '')}
                    placeholder="Chọn NVL"
                    error={!!errors[`material_${index}`]}
                    helperText={errors[`material_${index}`]}
                  />
                </div>
                
                <div className="w-full md:w-24">
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Số lượng *
                  </label>
                  <input
                    type="number"
                    value={detail.quantity}
                    onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                    className="mp-input w-full text-sm"
                    min="0.01"
                    step="0.01"
                  />
                  {errors[`quantity_${index}`] && (
                    <p className="mt-1 text-xs text-red-500">{errors[`quantity_${index}`]}</p>
                  )}
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    value={detail.note}
                    onChange={(e) => handleMaterialChange(index, 'note', e.target.value)}
                    className="mp-input w-full text-sm"
                    placeholder="Ghi chú..."
                  />
                </div>
                
                <button
                  onClick={() => handleRemoveMaterial(index)}
                  className="self-end p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                  title="Xóa"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
              Tạo BOM
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CreateBom;
