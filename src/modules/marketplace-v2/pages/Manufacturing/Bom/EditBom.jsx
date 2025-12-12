import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowLeft,
    Loader2,
    Package,
    Plus,
    Save,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBomByItemId, useItemsInCompany, useUpdateBom } from '../../../hooks/useApi';

/**
 * Edit BOM Page - Edit existing Bill of Materials
 */
const EditBom = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  
  const { data: bom, isLoading: bomLoading } = useBomByItemId(itemId);
  const { data: itemsData, isLoading: itemsLoading } = useItemsInCompany();
  const updateMutation = useUpdateBom();

  const [formData, setFormData] = useState({
    description: '',
    status: 'Hoạt động',
    bomDetails: [],
  });

  // Initialize form data when BOM is loaded
  useEffect(() => {
    if (bom) {
      setFormData({
        description: bom.description || '',
        status: bom.status || 'Hoạt động',
        bomDetails: (bom.bomDetails || []).map(detail => ({
          itemId: detail.itemId?.toString() || '',
          quantity: detail.quantity || 1,
          note: detail.note || ''
        }))
      });
    }
  }, [bom]);

  // Filter items for materials selection
  const materialItems = useMemo(() => {
    if (!itemsData) return [];
    const data = Array.isArray(itemsData) ? itemsData : itemsData.content || itemsData.data || [];
    return data.filter(item => 
      item.itemType === 'Nguyên vật liệu' || 
      item.itemType === 'Vật tư' ||
      item.itemType === 'Bán thành phẩm'
    );
  }, [itemsData]);

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
  };

  const validateForm = () => {
    const newErrors = {};
    
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
        itemId: Number(itemId),
        description: formData.description,
        status: formData.status,
        bomDetails: formData.bomDetails.map(detail => ({
          itemId: Number(detail.itemId),
          quantity: Number(detail.quantity),
          note: detail.note || ''
        }))
      };

      await updateMutation.mutateAsync({ bomId: bom.bomId, data: payload, itemId });
      toast.success('Cập nhật BOM thành công!');
      navigate(`/marketplace-v2/bom/${itemId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật BOM');
    }
  };

  if (bomLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!bom) {
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
    <div className="space-y-6 max-w-3xl mx-auto">
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
            Chỉnh sửa BOM
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            {bom.bomCode} - {bom.itemName}
          </p>
        </div>
      </motion.div>

      {/* Product Info (Read-only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
          Thông tin sản phẩm
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã BOM</p>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{bom.bomCode}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Mã sản phẩm</p>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{bom.itemCode}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tên sản phẩm</p>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{bom.itemName}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="mp-input w-full"
            >
              <option value="Hoạt động">Hoạt động</option>
              <option value="Không hoạt động">Không hoạt động</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              Mô tả
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mp-input w-full"
              placeholder="Mô tả cho BOM..."
            />
          </div>
        </div>
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
                  <select
                    value={detail.itemId}
                    onChange={(e) => handleMaterialChange(index, 'itemId', e.target.value)}
                    className="mp-input w-full text-sm"
                  >
                    <option value="">-- Chọn NVL --</option>
                    {materialItems.map(item => (
                      <option key={item.itemId} value={item.itemId}>
                        {item.itemCode} - {item.itemName}
                      </option>
                    ))}
                  </select>
                  {errors[`material_${index}`] && (
                    <p className="mt-1 text-xs text-red-500">{errors[`material_${index}`]}</p>
                  )}
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

export default EditBom;
