import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Package,
  Plus,
  Save,
  Search,
  Trash2,
  Warehouse
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MpCombobox } from '../../../components/ui/MpCombobox';
import { useDebounce } from '../../../hooks';
import {
  useCreateTransferTicket,
  useInventoryInCompany,
  useWarehousesInCompany
} from '../../../hooks/useApi';

/**
 * Create Transfer Ticket Page
 * Form to create a new transfer ticket between warehouses
 */
const CreateTransferTicket = () => {
  const navigate = useNavigate();
  
  const [fromWarehouse, setFromWarehouse] = useState(null);
  const [toWarehouse, setToWarehouse] = useState(null);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch data
  const { data: warehouses = [], isLoading: warehouseLoading } = useWarehousesInCompany();
  const { data: inventoryData = [], isLoading: inventoryLoading } = useInventoryInCompany();
  const createMutation = useCreateTransferTicket();

  // Convert warehouses to Combobox options
  const warehouseOptions = useMemo(() => 
    warehouses.map(w => ({
      value: w.warehouseId,
      label: `${w.warehouseCode} - ${w.warehouseName}`,
      warehouseData: w // Store full warehouse object for later use
    })), [warehouses]
  );

  // Get available items from source warehouse
  const availableItems = useMemo(() => {
    if (!fromWarehouse) return [];
    
    let items = inventoryData.filter(inv => 
      inv.warehouseCode === fromWarehouse.warehouseCode && 
      inv.quantity > 0
    );

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      items = items.filter(inv =>
        inv.itemCode?.toLowerCase().includes(query) ||
        inv.itemName?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [inventoryData, fromWarehouse, debouncedSearch]);

  // Filter out already selected items
  const selectableItems = useMemo(() => {
    const selectedCodes = new Set(selectedItems.map(i => i.itemCode));
    return availableItems.filter(inv => !selectedCodes.has(inv.itemCode));
  }, [availableItems, selectedItems]);

  // Reset selected items when source warehouse changes
  useEffect(() => {
    setSelectedItems([]);
  }, [fromWarehouse]);

  const handleAddItem = (inventoryItem) => {
    setSelectedItems(prev => [...prev, {
      itemId: inventoryItem.itemId,
      itemCode: inventoryItem.itemCode,
      itemName: inventoryItem.itemName,
      maxQuantity: inventoryItem.quantity,
      quantity: 1,
      note: ''
    }]);
  };

  const handleRemoveItem = (itemCode) => {
    setSelectedItems(prev => prev.filter(i => i.itemCode !== itemCode));
  };

  const handleUpdateQuantity = (itemCode, quantity) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.itemCode === itemCode) {
        return { ...item, quantity: Math.min(Math.max(1, quantity), item.maxQuantity) };
      }
      return item;
    }));
  };

  const handleUpdateNote = (itemCode, note) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.itemCode === itemCode) {
        return { ...item, note };
      }
      return item;
    }));
  };

  const handleSubmit = async () => {
    // Validation
    let hasError = false;
    
    if (!reason.trim()) {
      setReasonError('Vui lòng nhập lý do chuyển kho');
      hasError = true;
    } else {
      setReasonError('');
    }
    
    if (!fromWarehouse) {
      toast.error('Vui lòng chọn kho xuất');
      hasError = true;
    }
    if (!toWarehouse) {
      toast.error('Vui lòng chọn kho nhập');
      hasError = true;
    }
    if (fromWarehouse && toWarehouse && fromWarehouse.warehouseId === toWarehouse.warehouseId) {
      toast.error('Kho xuất và kho nhập không được trùng nhau');
      hasError = true;
    }
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      hasError = true;
    }
    
    if (hasError) return;

    // Get auth data inline (since getAuthData is not exported from useApi)
    const employeeName = localStorage.getItem('employeeName');
    const companyId = parseInt(localStorage.getItem('companyId'));

    const request = {
      companyId,
      createdBy: employeeName,
      status: 'Chờ xác nhận',
      fromWarehouseId: fromWarehouse.warehouseId,
      toWarehouseId: toWarehouse.warehouseId,
      reason,
      transferTicketDetails: selectedItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        note: item.note || ''
      }))
    };

    try {
      await createMutation.mutateAsync(request);
      toast.success('Tạo phiếu chuyển kho thành công');
      navigate('/marketplace-v2/warehouse/transfer-tickets');
    } catch (error) {
      console.error('Error creating transfer ticket:', error);
      toast.error('Có lỗi xảy ra khi tạo phiếu chuyển kho');
    }
  };

  const isLoading = warehouseLoading || inventoryLoading;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mp-glass-button p-2 rounded-xl"
        >
          <ArrowLeft size={20} style={{ color: 'var(--mp-text-secondary)' }} />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Tạo phiếu chuyển kho
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Tạo phiếu chuyển hàng giữa các kho
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Warehouse Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Warehouse Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Chọn kho
            </h2>
            
            <div className="flex items-center gap-4">
              {/* From Warehouse */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Kho xuất
                </label>
                <MpCombobox
                  options={warehouseOptions.filter(w => !toWarehouse || w.value !== toWarehouse.warehouseId)}
                  value={fromWarehouse?.warehouseId}
                  onChange={(option) => {
                    const wh = option ? warehouses.find(w => w.warehouseId === option.value) : null;
                    setFromWarehouse(wh);
                  }}
                  placeholder="Chọn kho xuất"
                  disabled={isLoading}
                />
              </div>

              {/* Arrow */}
              <div className="pt-6">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <ArrowRight size={24} style={{ color: 'var(--mp-text-tertiary)' }} />
                </motion.div>
              </div>

              {/* To Warehouse */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Kho nhập
                </label>
                <MpCombobox
                  options={warehouseOptions.filter(w => !fromWarehouse || w.value !== fromWarehouse.warehouseId)}
                  value={toWarehouse?.warehouseId}
                  onChange={(option) => {
                    const wh = option ? warehouses.find(w => w.warehouseId === option.value) : null;
                    setToWarehouse(wh);
                  }}
                  placeholder="Chọn kho nhập"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Reason (Required) */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--mp-text-tertiary)' }}>
                Lý do chuyển kho <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim()) {
                    setReasonError('');
                  }
                }}
                className={`mp-input w-full ${reasonError ? 'border-red-500' : ''}`}
                rows={2}
                placeholder="Nhập lý do chuyển kho..."
              />
              {reasonError && (
                <p className="text-red-500 text-sm mt-1">{reasonError}</p>
              )}
            </div>
          </motion.div>

          {/* Item Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mp-glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
              Chọn sản phẩm
            </h2>

            {!fromWarehouse ? (
              <div className="text-center py-8">
                <Warehouse size={48} className="mx-auto mb-4 opacity-30" />
                <p style={{ color: 'var(--mp-text-tertiary)' }}>Vui lòng chọn kho xuất để xem danh sách sản phẩm</p>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="relative mb-4">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mp-text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mp-input pl-10 w-full"
                  />
                </div>

                {/* Available items list */}
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {selectableItems.length === 0 ? (
                    <p className="text-center py-4" style={{ color: 'var(--mp-text-tertiary)' }}>
                      {availableItems.length === 0 ? 'Không có sản phẩm trong kho này' : 'Đã thêm hết sản phẩm'}
                    </p>
                  ) : (
                    selectableItems.map(item => (
                      <motion.div
                        key={item.itemCode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                      >
                        <div>
                          <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
                            {item.itemCode} - {item.itemName}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                            Tồn kho: {item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddItem(item)}
                          className="mp-btn mp-btn-primary py-1 px-3"
                        >
                          <Plus size={16} />
                          Thêm
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Right Column: Selected Items & Submit */}
        <div className="space-y-6">
          {/* Selected Items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mp-glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                Sản phẩm đã chọn
              </h3>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}
              >
                {selectedItems.length} sản phẩm
              </span>
            </div>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8">
                <Package size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                  Chưa có sản phẩm nào
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                  {selectedItems.map((item, idx) => (
                    <motion.div
                      key={item.itemCode}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--mp-text-primary)' }}>
                            {item.itemCode}
                          </p>
                          <p className="text-xs truncate" style={{ color: 'var(--mp-text-secondary)' }}>
                            {item.itemName}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.itemCode)}
                          className="text-red-500 hover:bg-red-100 p-1 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.itemCode, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.itemCode, parseInt(e.target.value) || 1)}
                          className="w-16 text-center mp-input py-1 text-sm"
                          min={1}
                          max={item.maxQuantity}
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.itemCode, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                        <span className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
                          / {item.maxQuantity}
                        </span>
                      </div>

                      {/* Note Input */}
                      <div>
                        <input
                          type="text"
                          value={item.note}
                          onChange={(e) => handleUpdateNote(item.itemCode, e.target.value)}
                          className="mp-input w-full py-1 text-sm"
                          placeholder="Ghi chú (tùy chọn)"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || selectedItems.length === 0 || !fromWarehouse || !toWarehouse}
              className="w-full mp-btn mp-btn-primary justify-center py-3"
              style={{ backgroundColor: '#3b82f6' }}
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Tạo phiếu chuyển kho
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransferTicket;
