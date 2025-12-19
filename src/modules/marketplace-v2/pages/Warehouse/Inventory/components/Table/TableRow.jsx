/**
 * TableRow Component
 * Individual row in the inventory table
 */

import { motion } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { isLowStock, isOutOfStock } from '../../utils/inventoryCalculations';

const TableRow = ({ item, index, onEdit }) => {
  const stockLevel = item.quantity || 0;
  const isLow = isLowStock(stockLevel);
  const isCritical = isOutOfStock(stockLevel);

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
          {formatNumber(stockLevel)}
        </span>
        {isLow && (
          <span className="ml-2">
            {isCritical ? (
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                Hết hàng
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">
                Sắp hết
              </span>
            )}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-right" style={{ color: 'var(--mp-text-secondary)' }}>
        {formatNumber(item.onDemandQuantity || 0)}
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

export default TableRow;
