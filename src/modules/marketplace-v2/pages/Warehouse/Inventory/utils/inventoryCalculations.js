/**
 * Inventory Calculation Utilities
 * Helper functions for stock calculations, status determination, and color schemes
 */

import { CAPACITY, STOCK_COLORS, STOCK_STATUS, STOCK_THRESHOLDS } from './constants';

/**
 * Calculate stock status based on quantity
 * @param {number} quantity - Current stock quantity
 * @returns {string} - Status key: 'critical', 'low', 'healthy', or 'excess'
 */
export const getStockStatus = (quantity) => {
  if (quantity <= STOCK_THRESHOLDS.CRITICAL) return 'critical';
  if (quantity < STOCK_THRESHOLDS.LOW) return 'low';
  if (quantity >= STOCK_THRESHOLDS.EXCESS) return 'excess';
  return 'healthy';
};

/**
 * Get stock status label in Vietnamese
 * @param {number} quantity - Current stock quantity
 * @returns {string} - Status label
 */
export const getStockStatusLabel = (quantity) => {
  const status = getStockStatus(quantity);
  return STOCK_STATUS[status.toUpperCase()] || STOCK_STATUS.HEALTHY;
};

/**
 * Get color scheme based on stock status
 * @param {number} quantity - Current stock quantity
 * @returns {object} - Color scheme with bg, border, text
 */
export const getStockColorScheme = (quantity) => {
  const status = getStockStatus(quantity);
  return STOCK_COLORS[status];
};

/**
 * Get color scheme for warehouse tile based on low stock count and fill level
 * @param {number} lowStockCount - Number of items with low stock
 * @param {number} fillLevel - Fill level percentage (0-100)
 * @returns {object} - Color scheme with bg, border, text
 */
export const getWarehouseColorScheme = (lowStockCount, fillLevel) => {
  if (lowStockCount > 0) return STOCK_COLORS.critical;
  if (fillLevel > 70) return STOCK_COLORS.healthy;
  if (fillLevel > 30) return STOCK_COLORS.low;
  return STOCK_COLORS.critical;
};

/**
 * Calculate fill level percentage for a warehouse
 * @param {number} totalStock - Total stock in warehouse
 * @param {number} itemCount - Number of different items
 * @param {number} maxCapacityPerItem - Max capacity per item (default from constants)
 * @returns {number} - Fill level percentage (0-100)
 */
export const calculateFillLevel = (
  totalStock,
  itemCount,
  maxCapacityPerItem = CAPACITY.MAX_PER_ITEM
) => {
  const maxCapacity = itemCount * maxCapacityPerItem;
  if (maxCapacity <= 0) return 0;
  return Math.min((totalStock / maxCapacity) * 100, 100);
};

/**
 * Calculate available stock (quantity - onDemandQuantity)
 * @param {number} quantity - Total quantity
 * @param {number} onDemandQuantity - On demand quantity
 * @returns {number} - Available stock
 */
export const calculateAvailableStock = (quantity, onDemandQuantity) => {
  return Math.max(0, (quantity || 0) - (onDemandQuantity || 0));
};

/**
 * Check if item is low stock
 * @param {number} quantity - Current stock quantity
 * @returns {boolean}
 */
export const isLowStock = (quantity) => {
  return quantity < STOCK_THRESHOLDS.LOW && quantity > STOCK_THRESHOLDS.CRITICAL;
};

/**
 * Check if item is out of stock
 * @param {number} quantity - Current stock quantity
 * @returns {boolean}
 */
export const isOutOfStock = (quantity) => {
  return quantity <= STOCK_THRESHOLDS.CRITICAL;
};

/**
 * Calculate inventory statistics from data array
 * @param {Array} inventoryData - Array of inventory items
 * @returns {object} - Stats object with totalStock, totalItems, lowStockItems, outOfStock
 */
export const calculateInventoryStats = (inventoryData) => {
  if (!Array.isArray(inventoryData)) {
    return { totalStock: 0, totalItems: 0, lowStockItems: 0, outOfStock: 0 };
  }

  const totalStock = inventoryData.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
  const totalItems = new Set(inventoryData.map((inv) => inv.itemCode)).size;
  const lowStockItems = inventoryData.filter((inv) => isLowStock(inv.quantity)).length;
  const outOfStock = inventoryData.filter((inv) => isOutOfStock(inv.quantity)).length;

  return { totalStock, totalItems, lowStockItems, outOfStock };
};

/**
 * Group inventory by warehouse code
 * @param {Array} inventoryData - Array of inventory items
 * @returns {object} - Grouped inventory { warehouseCode: [items] }
 */
export const groupInventoryByWarehouse = (inventoryData) => {
  if (!Array.isArray(inventoryData)) return {};

  return inventoryData.reduce((grouped, inv) => {
    const key = inv.warehouseCode;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(inv);
    return grouped;
  }, {});
};

/**
 * Calculate percentage change
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} - Percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};
