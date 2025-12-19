/**
 * Formatter Utilities
 * Functions for formatting numbers, dates, and other display values
 */

/**
 * Format number with thousand separators
 * @param {number} value - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString('vi-VN');
};

/**
 * Format currency (VND)
 * @param {number} value - Amount to format
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ₫';
  return `${value.toLocaleString('vi-VN')} ₫`;
};

/**
 * Format percentage
 * @param {number} value - Percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format date to Vietnamese format
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date (dd/mm/yyyy)
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date and time (dd/mm/yyyy HH:MM)
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const dateStr = formatDate(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${dateStr} ${hours}:${minutes}`;
};

/**
 * Format relative time (e.g., "2 giờ trước")
 * @param {Date|string} date - Date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return formatDate(date);
};

/**
 * Format stock difference with + or - sign
 * @param {number} value - Difference value
 * @returns {string} - Formatted difference (+50, -20, etc.)
 */
export const formatDifference = (value) => {
  if (value === 0) return '0';
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatNumber(value)}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size (KB, MB, GB)
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
