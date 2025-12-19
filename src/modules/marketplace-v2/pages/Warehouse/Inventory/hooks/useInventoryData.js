/**
 * useInventoryData Hook
 * Main hook for managing inventory data fetching and processing
 */

import { useMemo } from 'react';
import {
  useInventoryInCompany,
  useMonthlyIssueReport,
  useMonthlyReceiveReport,
  useWarehousesInCompany
} from '../../../../hooks/useApi';
import { useInventoryFilters } from './useInventoryFilters';
import { useInventoryStats } from './useInventoryStats';

/**
 * Consolidated inventory data management hook
 * @param {object} filters - Filter configuration
 * @param {object} sortConfig - Sort configuration
 * @returns {object} - Processed inventory data and utilities
 */
export const useInventoryData = (filters, sortConfig) => {
  // Fetch all data
  const {
    data: inventoryDataRaw = [],
    isLoading: isLoadingInventory,
    refetch: refetchInventory
  } = useInventoryInCompany();

  const { data: warehousesRaw = [] } = useWarehousesInCompany();
  const { data: monthlyIssueRaw = [] } = useMonthlyIssueReport();
  const { data: monthlyReceiveRaw = [] } = useMonthlyReceiveReport();

  // Ensure data is arrays
  const inventoryData = useMemo(() =>
    Array.isArray(inventoryDataRaw) ? inventoryDataRaw : [],
    [inventoryDataRaw]
  );

  const warehouses = useMemo(() =>
    Array.isArray(warehousesRaw) ? warehousesRaw : [],
    [warehousesRaw]
  );

  const monthlyIssue = useMemo(() =>
    Array.isArray(monthlyIssueRaw) ? monthlyIssueRaw : [],
    [monthlyIssueRaw]
  );

  const monthlyReceive = useMemo(() =>
    Array.isArray(monthlyReceiveRaw) ? monthlyReceiveRaw : [],
    [monthlyReceiveRaw]
  );

  // Apply filters and sorting
  const filteredInventory = useInventoryFilters(inventoryData, filters, sortConfig);

  // Calculate statistics
  const { stats, warehouseGrouped } = useInventoryStats(inventoryData);

  return {
    // Raw data
    inventoryData,
    warehouses,
    monthlyIssue,
    monthlyReceive,

    // Processed data
    filteredInventory,
    stats,
    warehouseGrouped,

    // Loading states
    isLoading: isLoadingInventory,

    // Actions
    refetch: refetchInventory
  };
};
