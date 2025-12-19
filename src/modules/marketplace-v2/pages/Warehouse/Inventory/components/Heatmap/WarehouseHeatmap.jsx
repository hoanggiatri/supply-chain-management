/**
 * WarehouseHeatmap Component
 * Grid view of warehouses with color-coded tiles
 */

import { motion } from 'framer-motion';
import { Warehouse as WarehouseIcon } from 'lucide-react';
import HeatmapTile from './HeatmapTile';

const WarehouseHeatmap = ({ warehouses, warehouseInventory, onWarehouseClick }) => {
  if (!warehouses || warehouses.length === 0) {
    return (
      <div className="mp-glass-card p-12 text-center">
        <WarehouseIcon size={48} className="mx-auto mb-4 opacity-30" />
        <p style={{ color: 'var(--mp-text-tertiary)' }}>Chưa có kho nào</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>
        Tổng quan kho
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {warehouses.map((warehouse) => (
          <HeatmapTile
            key={warehouse.warehouseId}
            warehouse={warehouse}
            items={warehouseInventory[warehouse.warehouseCode] || []}
            onClick={() => onWarehouseClick(warehouse.warehouseCode)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default WarehouseHeatmap;
