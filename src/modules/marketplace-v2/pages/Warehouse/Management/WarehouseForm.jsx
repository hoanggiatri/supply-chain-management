import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WarehouseForm = ({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting = false, 
  isEdit = false 
}) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    warehouseCode: initialData.warehouseCode || '',
    warehouseName: initialData.warehouseName || '',
    address: initialData.address || '',
    managerName: initialData.managerName || '', // Currently generic, can be connected to Employee
    description: initialData.description || '',
    maxCapacity: initialData.maxCapacity || '',
    warehouseType: initialData.warehouseType || 'Kho thường',
    status: initialData.status || 'Hoạt động',
    ...initialData
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
    if (!formData.warehouseCode?.trim()) newErrors.warehouseCode = 'Vui lòng nhập mã kho';
    if (!formData.warehouseName?.trim()) newErrors.warehouseName = 'Vui lòng nhập tên kho';
    // if (!formData.address?.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.maxCapacity || formData.maxCapacity <= 0) newErrors.maxCapacity = 'Sức chứa phải lớn hơn 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

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
                  Mã kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="warehouseCode"
                  value={formData.warehouseCode}
                  onChange={handleChange}
                  readOnly={isEdit} // Often cannot change Code on edit
                  className={`mp-input w-full ${errors.warehouseCode ? 'border-red-500' : ''} ${isEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
                  placeholder="WH-001"
                />
                {errors.warehouseCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.warehouseCode}</p>
                )}
              </div>

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
                <select
                  name="warehouseType"
                  value={formData.warehouseType}
                  onChange={handleChange}
                  className="mp-input w-full"
                >
                  <option value="Kho thường">Kho thường</option>
                  <option value="Kho lạnh">Kho lạnh</option>
                  <option value="Kho ngoại quan">Kho ngoại quan</option>
                  <option value="Kho sản xuất">Kho sản xuất</option>
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mp-input w-full"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                </select>
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
                  Người quản lý
                </label>
                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  className="mp-input w-full"
                  placeholder="Nguyễn Văn A"
                />
              </div>

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
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="mp-input w-full resize-none"
                  placeholder="Số 123 đường ABC..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
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
