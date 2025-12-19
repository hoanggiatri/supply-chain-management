/**
 * Validator Utilities
 * Functions for validating inventory data and user inputs
 */

/**
 * Validate quantity value
 * @param {any} value - Value to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateQuantity = (value) => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: 'Số lượng không được để trống' };
  }

  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Số lượng phải là số' };
  }

  if (num < 0) {
    return { valid: false, error: 'Số lượng không thể âm' };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Số lượng phải là số nguyên' };
  }

  return { valid: true, error: null };
};

/**
 * Validate on-demand quantity
 * @param {any} value - Value to validate
 * @param {number} totalQuantity - Total quantity available
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateOnDemandQuantity = (value, totalQuantity) => {
  const quantityValidation = validateQuantity(value);
  if (!quantityValidation.valid) {
    return quantityValidation;
  }

  const num = Number(value);

  if (num > totalQuantity) {
    return {
      valid: false,
      error: `Số lượng cần dùng không thể lớn hơn tồn kho (${totalQuantity})`
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate warehouse ID
 * @param {any} value - Value to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateWarehouseId = (value) => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: 'Vui lòng chọn kho' };
  }

  return { valid: true, error: null };
};

/**
 * Validate item ID
 * @param {any} value - Value to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateItemId = (value) => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: 'Vui lòng chọn sản phẩm' };
  }

  return { valid: true, error: null };
};

/**
 * Validate inventory update data
 * @param {object} data - Inventory data to validate
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validateInventoryData = (data) => {
  const errors = {};

  const warehouseValidation = validateWarehouseId(data.warehouseId);
  if (!warehouseValidation.valid) {
    errors.warehouseId = warehouseValidation.error;
  }

  const itemValidation = validateItemId(data.itemId);
  if (!itemValidation.valid) {
    errors.itemId = itemValidation.error;
  }

  const quantityValidation = validateQuantity(data.quantity);
  if (!quantityValidation.valid) {
    errors.quantity = quantityValidation.error;
  }

  const onDemandValidation = validateOnDemandQuantity(
    data.onDemandQuantity,
    data.quantity || 0
  );
  if (!onDemandValidation.valid) {
    errors.onDemandQuantity = onDemandValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate search query
 * @param {string} query - Search query
 * @returns {boolean} - True if valid
 */
export const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  // Check if query has at least 1 non-whitespace character
  return query.trim().length > 0;
};

/**
 * Sanitize search query
 * @param {string} query - Search query
 * @returns {string} - Sanitized query
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  // Remove special characters that could cause issues
  return query.trim().replace(/[<>]/g, '');
};
