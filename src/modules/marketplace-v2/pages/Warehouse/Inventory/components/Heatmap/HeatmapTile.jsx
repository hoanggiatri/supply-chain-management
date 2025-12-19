/**
 * HeatmapTile Component
 * Individual warehouse tile with color-coded status
 */

import { motion } from 'framer-motion';
import { AlertTriangle, Warehouse } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import {
    calculateFillLevel,
    getWarehouseColorScheme,
    isLowStock
} from '../../utils/inventoryCalculations';

const HeatmapTile = ({ warehouse, items, onClick }) => {
  const totalStock = items.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
  const lowStockCount = items.filter((inv) => isLowStock(inv.quantity)).length;
  const itemCount = items.length;

  const fillLevel = calculateFillLevel(totalStock, itemCount);
  const colors = getWarehouseColorScheme(lowStockCount, fillLevel);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-4 rounded-xl cursor-pointer transition-all"
      style={{
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
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
            {formatNumber(totalStock)}
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

export default HeatmapTile;
