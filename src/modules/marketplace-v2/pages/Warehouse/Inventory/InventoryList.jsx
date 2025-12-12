import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Box,
    ChevronDown,
    ChevronUp,
    Edit2,
    Grid3X3,
    List,
    Package,
    Plus,
    RefreshCw,
    Search,
    TrendingDown,
    Warehouse,
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDebounce } from '../../../hooks';
import {
    useInventoryInCompany,
    useMonthlyIssueReport,
    useMonthlyReceiveReport,
    useUpdateInventory,
    useWarehousesInCompany
} from '../../../hooks/useApi';

// Edit Quantity Modal
const EditQuantityModal = ({ isOpen, onClose, inventory }) => {
  const [quantity, setQuantity] = useState(inventory?.quantity || 0);
  const updateInventoryMutation = useUpdateInventory();

  if (!isOpen || !inventory) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity < 0) {
      toast.error('Số lượng không thể âm');
      return;
    }

    updateInventoryMutation.mutate({
      inventoryId: inventory.inventoryId,
      data: { ...inventory, quantity: parseInt(quantity) }
    }, {
      onSuccess: () => {
        toast.success('Cập nhật số lượng thành công');
        onClose();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="font-semibold text-lg" style={{ color: 'var(--mp-text-primary)' }}>
            Cập nhật số lượng
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
              Sản phẩm: <span className="text-blue-600">{inventory.itemCode} - {inventory.itemName}</span>
            </p>
            <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
              Kho: {inventory.warehouseName}
            </p>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>
                Số lượng mới
             </label>
             <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mp-input w-full"
                min="0"
                autoFocus
             />
          </div>

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
              {updateInventoryMutation.isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Warehouse Heatmap Tile
const WarehouseTile = ({ warehouse, items, onClick }) => {
  const totalStock = items.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
  const lowStockCount = items.filter(inv => inv.quantity < 10).length;
  const itemCount = items.length;

  // Calculate fill level (0-100%)
  const maxCapacity = itemCount * 100; // Assume 100 units max per item
  const fillLevel = maxCapacity > 0 ? Math.min((totalStock / maxCapacity) * 100, 100) : 0;

  // Color based on fill level and low stock alerts
  const getColor = () => {
    if (lowStockCount > 0) return { bg: '#fef2f2', border: '#ef4444', text: '#ef4444' };
    if (fillLevel > 70) return { bg: '#f0fdf4', border: '#22c55e', text: '#22c55e' };
    if (fillLevel > 30) return { bg: '#fffbeb', border: '#f59e0b', text: '#f59e0b' };
    return { bg: '#fef2f2', border: '#ef4444', text: '#ef4444' };
  };

  const colors = getColor();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-4 rounded-xl cursor-pointer transition-all"
      style={{ 
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Warehouse size={20} style={{ color: colors.text }} />
        <span className="font-semibold text-sm" style={{ color: 'var(--mp-text-primary)' }}>
          {warehouse.warehouseCode}
        </span>
      </div>
      <p className="text-xs truncate mb-2" style={{ color: 'var(--mp-text-secondary)' }}>
        {warehouse.warehouseName}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold" style={{ color: colors.text }}>
            {totalStock.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: 'var(--mp-text-tertiary)' }}>
            {itemCount} sản phẩm
          </p>
        </div>
        {lowStockCount > 0 && (
          <div className="flex items-center gap-1 text-red-500">
            <AlertTriangle size={14} />
            <span className="text-xs font-medium">{lowStockCount}</span>
          </div>
        )}
      </div>
      {/* Fill bar */}
      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillLevel}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: colors.border }}
        />
      </div>
    </motion.div>
  );
};

// Inventory Item Row
const InventoryRow = ({ item, index, onEdit }) => {
  const stockLevel = item.quantity || 0;
  const isLow = stockLevel < 10;
  const isCritical = stockLevel === 0;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b hover:bg-white/5 transition-colors group"
      style={{ borderColor: 'var(--mp-border-light)' }}
    >
      <td className="py-3 px-4">
        <span className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
          {item.itemCode}
        </span>
      </td>
      <td className="py-3 px-4" style={{ color: 'var(--mp-text-primary)' }}>
        {item.itemName}
      </td>
      <td className="py-3 px-4">
        <span className="font-medium" style={{ color: 'var(--mp-text-secondary)' }}>
          {item.warehouseCode}
        </span>
      </td>
      <td className="py-3 px-4" style={{ color: 'var(--mp-text-secondary)' }}>
        {item.warehouseName}
      </td>
      <td className="py-3 px-4 text-right">
        <span 
          className={`font-bold ${isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : ''}`}
          style={{ color: !isCritical && !isLow ? 'var(--mp-text-primary)' : undefined }}
        >
          {stockLevel.toLocaleString()}
        </span>
        {isLow && (
          <span className="ml-2">
            {isCritical ? (
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Hết hàng</span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">Sắp hết</span>
            )}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-right" style={{ color: 'var(--mp-text-secondary)' }}>
        {(item.onDemandQuantity || 0).toLocaleString()}
      </td>
      <td className="py-3 px-4 text-center">
        <button 
          onClick={() => onEdit(item)}
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
          title="Chỉnh sửa số lượng"
        >
          <Edit2 size={16} className="text-blue-500" />
        </button>
      </td>
    </motion.tr>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data, barColor, title, dataKey, xAxisKey }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p style={{ color: 'var(--mp-text-tertiary)' }}>Không có dữ liệu</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d[dataKey] || 0));

  return (
    <div>
      <h4 className="text-sm font-medium mb-4" style={{ color: 'var(--mp-text-primary)' }}>{title}</h4>
      <div className="flex items-end gap-2 h-[150px]">
        {data.slice(-12).map((item, idx) => {
          const value = item[dataKey] || 0;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="w-full rounded-t-sm min-h-[4px]"
                style={{ backgroundColor: barColor }}
                title={`${item[xAxisKey]}: ${value.toLocaleString()}`}
              />
              <span className="text-[10px] mt-1 truncate w-full text-center" style={{ color: 'var(--mp-text-tertiary)' }}>
                {item[xAxisKey]?.substring(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Inventory List Page
 * Shows inventory with heatmap and table views
 */
const InventoryList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('heatmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'itemCode', direction: 'asc' });

  // Edit Quantity State
  const [editingItem, setEditingItem] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch data
  const { data: inventoryDataRaw = [], isLoading, refetch } = useInventoryInCompany();
  const { data: warehousesRaw = [] } = useWarehousesInCompany();
  const { data: monthlyIssueRaw = [] } = useMonthlyIssueReport();
  const { data: monthlyReceiveRaw = [] } = useMonthlyReceiveReport();

  const inventoryData = Array.isArray(inventoryDataRaw) ? inventoryDataRaw : [];
  const warehouses = Array.isArray(warehousesRaw) ? warehousesRaw : [];
  const monthlyIssue = Array.isArray(monthlyIssueRaw) ? monthlyIssueRaw : [];
  const monthlyReceive = Array.isArray(monthlyReceiveRaw) ? monthlyReceiveRaw : [];

  // Calculate stats
  const stats = useMemo(() => {
    const totalStock = inventoryData.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
    const totalItems = new Set(inventoryData.map(inv => inv.itemCode)).size;
    const lowStockItems = inventoryData.filter(inv => inv.quantity < 10).length;
    const outOfStock = inventoryData.filter(inv => inv.quantity === 0).length;

    return { totalStock, totalItems, lowStockItems, outOfStock };
  }, [inventoryData]);

  // Group inventory by warehouse for heatmap
  const warehouseInventory = useMemo(() => {
    const grouped = {};
    inventoryData.forEach(inv => {
      if (!grouped[inv.warehouseCode]) {
        grouped[inv.warehouseCode] = [];
      }
      grouped[inv.warehouseCode].push(inv);
    });
    return grouped;
  }, [inventoryData]);

  // Filter and sort inventory
  const filteredInventory = useMemo(() => {
    let result = [...inventoryData];

    // Warehouse filter
    if (selectedWarehouse !== 'all') {
      result = result.filter(inv => inv.warehouseCode === selectedWarehouse);
    }

    // Low stock filter
    if (showLowStock) {
      result = result.filter(inv => inv.quantity < 10);
    }

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(inv =>
        inv.itemCode?.toLowerCase().includes(query) ||
        inv.itemName?.toLowerCase().includes(query) ||
        inv.warehouseCode?.toLowerCase().includes(query) ||
        inv.warehouseName?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      const comparison = typeof aVal === 'number' 
        ? aVal - bVal 
        : aVal.toString().localeCompare(bVal.toString());
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [inventoryData, selectedWarehouse, showLowStock, debouncedSearch, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="space-y-6">
      {/* Edit Modal */}
      <EditQuantityModal 
        isOpen={!!editingItem} 
        inventory={editingItem} 
        onClose={() => setEditingItem(null)} 
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Tồn kho
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Quản lý và theo dõi tồn kho
          </p>
        </div>
        <div className="flex gap-2">
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/marketplace-v2/warehouse/inventory/add')}
            className="mp-btn mp-btn-primary"
            >
            <Plus size={18} />
            Thêm hàng
            </motion.button>
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="mp-glass-button p-3 rounded-xl"
            disabled={isLoading}
            >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} style={{ color: 'var(--mp-text-secondary)' }} />
            </motion.button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="mp-glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Box size={18} style={{ color: '#6366f1' }} />
            <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Tổng tồn kho</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            {stats.totalStock.toLocaleString()}
          </p>
        </div>
        <div className="mp-glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package size={18} style={{ color: '#3b82f6' }} />
            <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Số mặt hàng</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            {stats.totalItems}
          </p>
        </div>
        <div className="mp-glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={18} style={{ color: '#f59e0b' }} />
            <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Sắp hết hàng</span>
          </div>
          <p className="text-2xl font-bold text-amber-500">
            {stats.lowStockItems}
          </p>
        </div>
        <div className="mp-glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
            <span className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>Hết hàng</span>
          </div>
          <p className="text-2xl font-bold text-red-500">
            {stats.outOfStock}
          </p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="mp-glass-card p-6">
          <SimpleBarChart
            title="Nhập kho theo tháng"
            data={monthlyReceive}
            dataKey="totalQuantity"
            xAxisKey="month"
            barColor="#22c55e"
          />
        </div>
        <div className="mp-glass-card p-6">
          <SimpleBarChart
            title="Xuất kho theo tháng"
            data={monthlyIssue}
            dataKey="totalQuantity"
            xAxisKey="month"
            barColor="#ef4444"
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 items-center"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mp-text-tertiary)' }} />
          <input
            type="text"
            placeholder="Tìm theo mã SP, tên, kho..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mp-input pl-10 w-full"
          />
        </div>

        {/* Warehouse Filter */}
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          className="mp-input"
        >
          <option value="all">Tất cả kho</option>
          {warehouses.map(w => (
            <option key={w.warehouseId} value={w.warehouseCode}>
              {w.warehouseCode} - {w.warehouseName}
            </option>
          ))}
        </select>

        {/* Low Stock Toggle */}
        <button
          onClick={() => setShowLowStock(!showLowStock)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            showLowStock 
              ? 'bg-amber-500 text-white' 
              : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
          }`}
        >
          <AlertTriangle size={16} />
          Sắp hết hàng ({stats.lowStockItems})
        </button>

        {/* View Mode Toggle */}
        <div className="flex gap-1 mp-glass-card p-1 ml-auto">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'heatmap' ? 'bg-blue-500 text-white' : ''}`}
            title="Heatmap"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-blue-500 text-white' : ''}`}
            title="Bảng"
          >
            <List size={18} />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="mp-glass-card p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ) : viewMode === 'heatmap' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
            Tổng quan kho
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {warehouses.map((warehouse, idx) => (
              <WarehouseTile
                key={warehouse.warehouseId}
                warehouse={warehouse}
                items={warehouseInventory[warehouse.warehouseCode] || []}
                onClick={() => setSelectedWarehouse(warehouse.warehouseCode)}
              />
            ))}
          </div>
          {warehouses.length === 0 && (
            <div className="mp-glass-card p-12 text-center">
              <Warehouse size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--mp-text-tertiary)' }}>Chưa có kho nào</p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mp-glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--mp-border-light)', backgroundColor: 'var(--mp-bg-secondary)' }}>
                  <th 
                    className="py-3 px-4 text-left font-medium cursor-pointer select-none"
                    style={{ color: 'var(--mp-text-tertiary)' }}
                    onClick={() => handleSort('itemCode')}
                  >
                    <div className="flex items-center gap-1">
                      Mã SP <SortIcon columnKey="itemCode" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left font-medium cursor-pointer select-none"
                    style={{ color: 'var(--mp-text-tertiary)' }}
                    onClick={() => handleSort('itemName')}
                  >
                    <div className="flex items-center gap-1">
                      Tên sản phẩm <SortIcon columnKey="itemName" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left font-medium cursor-pointer select-none"
                    style={{ color: 'var(--mp-text-tertiary)' }}
                    onClick={() => handleSort('warehouseCode')}
                  >
                    <div className="flex items-center gap-1">
                      Mã kho <SortIcon columnKey="warehouseCode" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left font-medium"
                    style={{ color: 'var(--mp-text-tertiary)' }}
                  >
                    Tên kho
                  </th>
                  <th 
                    className="py-3 px-4 text-right font-medium cursor-pointer select-none"
                    style={{ color: 'var(--mp-text-tertiary)' }}
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Tồn kho <SortIcon columnKey="quantity" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-right font-medium"
                    style={{ color: 'var(--mp-text-tertiary)' }}
                  >
                    Cần dùng
                  </th>
                  <th 
                    className="py-3 px-4 text-center font-medium"
                    style={{ color: 'var(--mp-text-tertiary)' }}
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredInventory.map((item, index) => (
                    <InventoryRow 
                      key={`${item.itemCode}-${item.warehouseCode}-${item.inventoryId}`} 
                      item={item} 
                      index={index} 
                      onEdit={setEditingItem}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredInventory.length === 0 && (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--mp-text-tertiary)' }}>Không tìm thấy sản phẩm nào</p>
            </div>
          )}
          <div className="p-4 border-t text-sm" style={{ borderColor: 'var(--mp-border-light)', color: 'var(--mp-text-tertiary)' }}>
            Hiển thị {filteredInventory.length} / {inventoryData.length} bản ghi
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InventoryList;
