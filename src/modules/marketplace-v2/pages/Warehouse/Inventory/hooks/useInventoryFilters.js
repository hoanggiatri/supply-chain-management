/**
 * useInventoryFilters Hook
 * Manages filtering and sorting logic for inventory data
 */

import { useMemo } from 'react';
import { SORT_DIRECTIONS } from '../utils/constants';

/**
 * Filter and sort inventory data
 * @param {Array} inventoryData - Raw inventory data
 * @param {object} filters - Filter configuration
 * @param {object} sortConfig - Sort configuration
 * @returns {Array} - Filtered and sorted inventory data
 */
export const useInventoryFilters = (inventoryData, filters, sortConfig) => {
  const filteredAndSorted = useMemo(() => {
    if (!Array.isArray(inventoryData)) return [];

    let result = [...inventoryData];

    // Apply warehouse filter
    if (filters.selectedWarehouse && filters.selectedWarehouse !== 'all') {
      result = result.filter(inv => inv.warehouseCode === filters.selectedWarehouse);
    }

    // Apply low stock filter
    if (filters.showLowStock) {
      result = result.filter(inv => inv.quantity < 10);
    }

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(inv =>
        inv.itemCode?.toLowerCase().includes(query) ||
        inv.itemName?.toLowerCase().includes(query) ||
        inv.warehouseCode?.toLowerCase().includes(query) ||
        inv.warehouseName?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig && sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';

        const comparison = typeof aVal === 'number'
          ? aVal - bVal
          : aVal.toString().localeCompare(bVal.toString());

        return sortConfig.direction === SORT_DIRECTIONS.ASC
          ? comparison
          : -comparison;
      });
    }

    return result;
  }, [inventoryData, filters, sortConfig]);

  return filteredAndSorted;
};
