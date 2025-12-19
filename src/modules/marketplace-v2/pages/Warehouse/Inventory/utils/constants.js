/**
 * Inventory Management Constants
 * Centralized configuration for inventory thresholds, UI settings, and color schemes
 */

// ============ Stock Thresholds ============
export const STOCK_THRESHOLDS = {
  CRITICAL: 0,
  LOW: 10,
  HEALTHY_MIN: 50,
  EXCESS: 500,
};

// ============ Capacity Settings ============
export const CAPACITY = {
  MAX_PER_ITEM: 100,
  WARNING_PERCENTAGE: 80,
  CRITICAL_PERCENTAGE: 95,
};

// ============ UI Configuration ============
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ITEMS_PER_PAGE: 20,
  ANIMATION_DURATION: 200,
  SKELETON_COUNT: 5,
  MAX_CHART_ITEMS: 12,
};

// ============ Color Schemes ============
export const STOCK_COLORS = {
  critical: {
    bg: '#fef2f2',
    border: '#ef4444',
    text: '#ef4444',
  },
  low: {
    bg: '#fffbeb',
    border: '#f59e0b',
    text: '#f59e0b',
  },
  healthy: {
    bg: '#f0fdf4',
    border: '#22c55e',
    text: '#22c55e',
  },
  excess: {
    bg: '#eff6ff',
    border: '#3b82f6',
    text: '#3b82f6',
  },
};

// ============ View Modes ============
export const VIEW_MODES = {
  TABLE: 'table',
  HEATMAP: 'heatmap',
};

// ============ Sort Directions ============
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
};

// ============ Stock Status Labels ============
export const STOCK_STATUS = {
  CRITICAL: 'Hết hàng',
  LOW: 'Sắp hết',
  HEALTHY: 'Bình thường',
  EXCESS: 'Dư thừa',
};

// ============ Filter Types ============
export const FILTER_TYPES = {
  ALL: 'all',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  HEALTHY: 'healthy',
};

// ============ Export Formats ============
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
};
