/**
 * InventoryList - Redesigned & Refactored
 * Main inventory management page with modular architecture
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useDebounce } from '../../../hooks';
import { useInventoryData } from './hooks/useInventoryData';
import { SORT_DIRECTIONS, VIEW_MODES } from './utils/constants';

// Components
import SimpleBarChart from './components/Charts/SimpleBarChart';
import InventoryFilters from './components/Filters/InventoryFilters';
import InventoryHeader from './components/Header/InventoryHeader';
import WarehouseHeatmap from './components/Heatmap/WarehouseHeatmap';
import EditQuantityModal from './components/Modals/EditQuantityModal';
import StatsGrid from './components/Stats/StatsGrid';
import InventoryTable from './components/Table/InventoryTable';

const InventoryList = () => {
  // View and filter state
  const [viewMode, setViewMode] = useState(VIEW_MODES.HEATMAP);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortConfig, setSortConfig] = useState({ 
    key: 'itemCode', 
    direction: SORT_DIRECTIONS.ASC 
  });

  // Modal state
  const [editingItem, setEditingItem] = useState(null);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Consolidated data management
  const {
    inventoryData,
    warehouses,
    monthlyIssue,
    monthlyReceive,
    filteredInventory,
    stats,
    warehouseGrouped,
    isLoading,
    refetch,
  } = useInventoryData(
    {
      searchQuery: debouncedSearch,
      selectedWarehouse,
      showLowStock,
    },
    sortConfig
  );

  // Handlers
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === SORT_DIRECTIONS.ASC 
        ? SORT_DIRECTIONS.DESC 
        : SORT_DIRECTIONS.ASC,
    }));
  };

  const handleWarehouseClick = (warehouseCode) => {
    setSelectedWarehouse(warehouseCode);
    setViewMode(VIEW_MODES.TABLE);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mp-glass-card p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit Modal */}
      <EditQuantityModal
        isOpen={!!editingItem}
        inventory={editingItem}
        onClose={() => setEditingItem(null)}
      />

      {/* Header */}
      <InventoryHeader onRefresh={refetch} isLoading={isLoading} />

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

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
      <InventoryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedWarehouse={selectedWarehouse}
        onWarehouseChange={setSelectedWarehouse}
        showLowStock={showLowStock}
        onLowStockToggle={() => setShowLowStock(!showLowStock)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        warehouses={warehouses}
        lowStockCount={stats.lowStockItems}
      />

      {/* Content - Table or Heatmap */}
      {viewMode === VIEW_MODES.TABLE ? (
        <InventoryTable
          data={filteredInventory}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={setEditingItem}
        />
      ) : (
        <WarehouseHeatmap
          warehouses={warehouses}
          warehouseInventory={warehouseGrouped}
          onWarehouseClick={handleWarehouseClick}
        />
      )}
    </div>
  );
};

export default InventoryList;
