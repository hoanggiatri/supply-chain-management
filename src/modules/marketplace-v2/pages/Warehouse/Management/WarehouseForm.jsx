import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MpCombobox } from '../../../components/ui/MpCombobox';

const WarehouseForm = ({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting = false, 
  isEdit = false 
}) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    warehouseName: initialData.warehouseName || '',
    description: initialData.description || '',
    maxCapacity: initialData.maxCapacity || '',
    warehouseType: initialData.warehouseType || 'Nguyên vật liệu',
    status: initialData.status || 'Đang sử dụng'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.warehouseName?.trim()) newErrors.warehouseName = 'Vui lòng nhập tên kho';
    // if (!formData.address?.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.maxCapacity || formData.maxCapacity <= 0) newErrors.maxCapacity = 'Sức chứa phải lớn hơn 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Send fields that API requires
      const payload = {
        warehouseName: formData.warehouseName,
        description: formData.description || '',
        maxCapacity: parseInt(formData.maxCapacity),
        warehouseType: formData.warehouseType,
        status: formData.status
      };
      onSubmit(payload);
    }
  };

  const warehouseTypes = [
    { value: 'Nguyên vật liệu', label: 'Nguyên vật liệu' },
    { value: 'Thành phẩm', label: 'Thành phẩm' },
    { value: 'Hàng lỗi', label: 'Hàng lỗi' },
    { value: 'Nhận hàng', label: 'Nhận hàng' },
    { value: 'Xuất hàng', label: 'Xuất hàng' }
  ];

  const warehouseStatuses = [
    { value: 'Đang sử dụng', label: 'Đang sử dụng' },
    { value: 'Ngừng sử dụng', label: 'Ngừng sử dụng' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="mp-glass-card p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Thông tin chung
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Tên kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="warehouseName"
                  value={formData.warehouseName}
                  onChange={handleChange}
                  className={`mp-input w-full ${errors.warehouseName ? 'border-red-500' : ''}`}
                  placeholder="Kho Tổng"
                />
                {errors.warehouseName && (
                  <p className="text-red-500 text-xs mt-1">{errors.warehouseName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Loại kho
                </label>
                <MpCombobox
                  options={warehouseTypes}
                  value={formData.warehouseType}
                  onChange={(option) => handleChange({ target: { name: 'warehouseType', value: option?.value || '' } })}
                  placeholder="Chọn loại kho"
                  error={!!errors.warehouseType}
                  helperText={errors.warehouseType}
                />
              </div>

               <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Trạng thái
                </label>
                <MpCombobox
                  options={warehouseStatuses}
                  value={formData.status}
                  onChange={(option) => handleChange({ target: { name: 'status', value: option?.value || '' } })}
                  placeholder="Chọn trạng thái"
                  error={!!errors.status}
                  helperText={errors.status}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="mp-glass-card p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
               Chi tiết & Sức chứa
            </h3>

             <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Sức chứa tối đa (đơn vị sp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  className={`mp-input w-full ${errors.maxCapacity ? 'border-red-500' : ''}`}
                  placeholder="10000"
                />
                 {errors.maxCapacity && (
                  <p className="text-red-500 text-xs mt-1">{errors.maxCapacity}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mp-input w-full resize-none"
                  placeholder="Mô tả thêm về kho..."
                />
              </div>
             </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mp-glass-button px-6 py-2 rounded-xl text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          style={{ color: 'var(--mp-text-secondary)' }}
        >
          Hủy
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mp-btn mp-btn-primary px-8 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
          disabled={isSubmitting}
        >
          <Save size={18} />
          {isSubmitting ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
        </motion.button>
      </div>
    </form>
  );
};

export default WarehouseForm;
