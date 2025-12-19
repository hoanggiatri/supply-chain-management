/**
 * EditQuantityModal Component  
 * Modal for editing inventory quantities with diff view
 */

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUpdateInventory } from '../../../../../hooks/useApi';
import { formatDifference, formatNumber } from '../../utils/formatters';
import { calculateAvailableStock } from '../../utils/inventoryCalculations';
import { validateInventoryData } from '../../utils/validators';

const EditQuantityModal = ({ isOpen, onClose, inventory }) => {
  const [formData, setFormData] = useState({
    quantity: 0,
    onDemandQuantity: 0,
  });
  
  const updateInventoryMutation = useUpdateInventory();

  // Reset form when inventory changes
  useEffect(() => {
    if (inventory) {
      setFormData({
        quantity: inventory.quantity || 0,
        onDemandQuantity: inventory.onDemandQuantity || 0,
      });
    }
  }, [inventory]);

  if (!isOpen || !inventory) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToValidate = {
      warehouseId: inventory.warehouseId,
      itemId: inventory.itemId,
      quantity: parseInt(formData.quantity),
      onDemandQuantity: parseInt(formData.onDemandQuantity),
    };

    const validation = validateInventoryData(dataToValidate);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    updateInventoryMutation.mutate(
      {
        inventoryId: inventory.inventoryId,
        data: dataToValidate,
      },
      {
        onSuccess: () => {
          toast.success('Cập nhật số lượng thành công');
          onClose();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        },
      }
    );
  };

  // Calculate changes
  const quantityDiff = parseInt(formData.quantity) - (inventory.quantity || 0);
  const demandDiff = parseInt(formData.onDemandQuantity) - (inventory.onDemandQuantity || 0);
  const oldAvailable = calculateAvailableStock(inventory.quantity, inventory.onDemandQuantity);
  const newAvailable = calculateAvailableStock(formData.quantity, formData.onDemandQuantity);
  const availableDiff = newAvailable - oldAvailable;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span>✏️</span>
            <span style={{ color: 'var(--mp-text-primary)' }}>Cập nhật tồn kho</span>
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Product Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
              Sản phẩm: <span className="text-blue-600 font-semibold">{inventory.itemCode} - {inventory.itemName}</span>
            </p>
            <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
              Kho: {inventory.warehouseName}
            </p>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              Số lượng thực tế
            </label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Hiện tại</p>
                <p className="font-bold text-lg">{formatNumber(inventory.quantity)}</p>
              </div>
              <div>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  className="mp-input w-full text-center font-semibold"
                  min="0"
                  autoFocus
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Thay đổi</p>
                <p className={`font-bold text-lg ${quantityDiff > 0 ? 'text-green-600' : quantityDiff < 0 ? 'text-red-600' : ''}`}>
                  {formatDifference(quantityDiff)}
                  {quantityDiff > 0 ? ' 📈' : quantityDiff < 0 ? ' 📉' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* On-Demand Quantity Input */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
              Số lượng cần dùng
            </label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Hiện tại</p>
                <p className="font-bold text-lg">{formatNumber(inventory.onDemandQuantity)}</p>
              </div>
              <div>
                <input
                  type="number"
                  value={formData.onDemandQuantity}
                  onChange={(e) => handleChange('onDemandQuantity', e.target.value)}
                  className="mp-input w-full text-center font-semibold"
                  min="0"
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Thay đổi</p>
                <p className={`font-bold text-lg ${demandDiff > 0 ? 'text-green-600' : demandDiff < 0 ? 'text-red-600' : ''}`}>
                  {formatDifference(demandDiff)}
                  {demandDiff > 0 ? ' 📈' : demandDiff < 0 ? ' 📉' : ''}
                </p>
              </div>
            </div>
            <p className="text-xs mt-1 text-gray-500">
              Số lượng đang được giữ cho các đơn hàng/lệnh sản xuất
            </p>
          </div>

          {/* Available Stock Summary */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium mb-1">Tồn kho khả dụng:</p>
            <p className="text-lg font-bold">
              <span>{formatNumber(oldAvailable)}</span>
              <span className="mx-2">→</span>
              <span className="text-blue-600">{formatNumber(newAvailable)}</span>
              <span className={`ml-2 text-sm ${availableDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({formatDifference(availableDiff)})
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateInventoryMutation.isLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {updateInventoryMutation.isLoading ? 'Đang lưu...' : 'Lưu thay đổi ✓'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditQuantityModal;
