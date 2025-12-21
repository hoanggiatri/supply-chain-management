import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BackButton from '../../../components/ui/BackButton';
import { MpCombobox } from '../../../components/ui/MpCombobox';
import { useCreateInventory, useItemsInCompany, useWarehousesInCompany } from '../../../hooks/useApi';

const AddInventory = () => {
  const navigate = useNavigate();
  const createInventoryMutation = useCreateInventory();
  
  const { data: warehouses = [] } = useWarehousesInCompany();
  const { data: items = [] } = useItemsInCompany();

  // Convert to Combobox options format
  const warehouseOptions = useMemo(() => 
    warehouses.map(w => ({
      value: w.warehouseId,
      label: `${w.warehouseCode} - ${w.warehouseName}`
    })), [warehouses]
  );

  const itemOptions = useMemo(() => 
    items.map(item => ({
      value: item.itemId,
      label: `${item.itemCode} - ${item.itemName}`
    })), [items]
  );

  const [formData, setFormData] = useState({
    warehouseId: '',
    itemId: '',
    quantity: '',
    onDemandQuantity: 0
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleComboboxChange = (name, option) => {
    setFormData(prev => ({ ...prev, [name]: option?.value || '' }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.warehouseId) newErrors.warehouseId = 'Vui lòng chọn kho';
    if (!formData.itemId) newErrors.itemId = 'Vui lòng chọn sản phẩm';
    if (formData.quantity === '' || parseInt(formData.quantity) < 0) 
      newErrors.quantity = 'Số lượng phải lớn hơn hoặc bằng 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        warehouseId: parseInt(formData.warehouseId),
        itemId: parseInt(formData.itemId),
        quantity: parseInt(formData.quantity),
        onDemandQuantity: parseInt(formData.onDemandQuantity)
      };

      createInventoryMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Thêm tồn kho thành công!');
          navigate('/marketplace-v2/warehouse/inventory');
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm tồn kho');
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Thêm tồn kho
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Nhập thủ công số lượng hàng hóa vào kho
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6 max-w-3xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
             <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                Chọn kho <span className="text-red-500">*</span>
              </label>
              <MpCombobox
                options={warehouseOptions}
                value={formData.warehouseId}
                onChange={(option) => handleComboboxChange('warehouseId', option)}
                placeholder="Chọn kho"
                error={!!errors.warehouseId}
                helperText={errors.warehouseId}
              />
            </div>

            {/* Item Selection */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                Chọn sản phẩm <span className="text-red-500">*</span>
              </label>
              <MpCombobox
                options={itemOptions}
                value={formData.itemId}
                onChange={(option) => handleComboboxChange('itemId', option)}
                placeholder="Chọn sản phẩm"
                error={!!errors.itemId}
                helperText={errors.itemId}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Số lượng thực tế <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`mp-input w-full ${errors.quantity ? 'border-red-500' : ''}`}
                  placeholder="0"
                  min="0"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
              </div>

               {/* On Demand Quantity */}
               <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                  Số lượng cần dùng
                </label>
                <input
                  type="number"
                  name="onDemandQuantity"
                  value={formData.onDemandQuantity}
                  onChange={handleChange}
                  className="mp-input w-full"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs mt-1 text-gray-500">Số lượng đang được giữ cho các đơn hàng/lệnh sản xuất</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mp-btn mp-btn-primary px-8 py-2.5 rounded-xl flex items-center gap-2"
              disabled={createInventoryMutation.isLoading}
            >
              <Save size={18} />
              {createInventoryMutation.isLoading ? 'Đang thêm...' : 'Lưu tồn kho'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddInventory;
