/**
 * useInventoryStats Hook
 * Calculates inventory statistics from data
 */

import { useMemo } from 'react';
import {
  calculateInventoryStats,
  groupInventoryByWarehouse
} from '../utils/inventoryCalculations';

/**
 * Calculate inventory statistics
 * @param {Array} inventoryData - Inventory data array
 * @returns {object} - Statistics object
 */
export const useInventoryStats = (inventoryData) => {
  const stats = useMemo(() => {
    return calculateInventoryStats(inventoryData);
  }, [inventoryData]);

  const warehouseGrouped = useMemo(() => {
    return groupInventoryByWarehouse(inventoryData);
  }, [inventoryData]);

  return {
    stats,
    warehouseGrouped
  };
};
