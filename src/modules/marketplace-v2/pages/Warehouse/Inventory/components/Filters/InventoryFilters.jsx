/**
 * InventoryFilters Component
 * Consolidated filter controls including search, warehouse filter, view mode, and quick filters
 */

import { motion } from 'framer-motion';
import { AlertTriangle, Grid3X3, List, Search } from 'lucide-react';
import { VIEW_MODES } from '../../utils/constants';

const InventoryFilters = ({
  searchQuery,
  onSearchChange,
  selectedWarehouse,
  onWarehouseChange,
  showLowStock,
  onLowStockToggle,
  viewMode,
  onViewModeChange,
  warehouses,
  lowStockCount
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap gap-4 items-center"
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--mp-text-tertiary)' }}
        />
        <input
          type="text"
          placeholder="Tìm theo mã SP, tên, kho..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mp-input pl-10 w-full"
        />
      </div>

      {/* Warehouse Filter */}
      <select
        value={selectedWarehouse}
        onChange={(e) => onWarehouseChange(e.target.value)}
        className="mp-input"
      >
        <option value="all">Tất cả kho</option>
        {warehouses.map((w) => (
          <option key={w.warehouseId} value={w.warehouseCode}>
            {w.warehouseCode} - {w.warehouseName}
          </option>
        ))}
      </select>

      {/* Low Stock Toggle */}
      <button
        onClick={onLowStockToggle}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
          showLowStock
            ? 'bg-amber-500 text-white'
            : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
        }`}
      >
        <AlertTriangle size={16} />
        Sắp hết hàng ({lowStockCount})
      </button>

      {/* View Mode Toggle */}
      <div className="flex gap-1 mp-glass-card p-1 ml-auto">
        <button
          onClick={() => onViewModeChange(VIEW_MODES.HEATMAP)}
          className={`p-2 rounded-lg transition-all ${
            viewMode === VIEW_MODES.HEATMAP ? 'bg-blue-500 text-white' : ''
          }`}
          title="Heatmap"
        >
          <Grid3X3 size={18} />
        </button>
        <button
          onClick={() => onViewModeChange(VIEW_MODES.TABLE)}
          className={`p-2 rounded-lg transition-all ${
            viewMode === VIEW_MODES.TABLE ? 'bg-blue-500 text-white' : ''
          }`}
          title="Bảng"
        >
          <List size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default InventoryFilters;
