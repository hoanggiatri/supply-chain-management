/**
 * Các hàm tiện ích tính toán tồn kho
 * Bao gồm: tính trạng thái tồn kho, xác định màu sắc, và các phép tính liên quan
 */

import { CAPACITY, STOCK_COLORS, STOCK_STATUS, STOCK_THRESHOLDS } from './constants';

/**
 * Xác định trạng thái tồn kho dựa trên số lượng
 * @param {number} quantity - Số lượng tồn kho hiện tại
 * @returns {string} - Mã trạng thái: 'critical' (hết), 'low' (sắp hết), 'healthy' (bình thường), 'excess' (dư thừa)
 */
export const getStockStatus = (quantity) => {
  if (quantity <= STOCK_THRESHOLDS.CRITICAL) return 'critical';
  if (quantity < STOCK_THRESHOLDS.LOW) return 'low';
  if (quantity >= STOCK_THRESHOLDS.EXCESS) return 'excess';
  return 'healthy';
};

/**
 * Lấy nhãn trạng thái tồn kho bằng tiếng Việt
 * @param {number} quantity - Số lượng tồn kho hiện tại
 * @returns {string} - Nhãn trạng thái (VD: "Hết hàng", "Sắp hết", "Bình thường", "Dư thừa")
 */
export const getStockStatusLabel = (quantity) => {
  const status = getStockStatus(quantity);
  return STOCK_STATUS[status.toUpperCase()] || STOCK_STATUS.HEALTHY;
};

/**
 * Lấy bảng màu dựa trên trạng thái tồn kho
 * @param {number} quantity - Số lượng tồn kho hiện tại
 * @returns {object} - Bảng màu gồm: bg (nền), border (viền), text (chữ)
 */
export const getStockColorScheme = (quantity) => {
  const status = getStockStatus(quantity);
  return STOCK_COLORS[status];
};

/**
 * Lấy bảng màu cho tile kho dựa trên số lượng hàng sắp hết và mức lấp đầy
 * @param {number} lowStockCount - Số lượng mặt hàng sắp hết trong kho
 * @param {number} fillLevel - Phần trăm lấp đầy (0-100)
 * @returns {object} - Bảng màu gồm: bg (nền), border (viền), text (chữ)
 */
export const getWarehouseColorScheme = (lowStockCount, fillLevel) => {
  // Ưu tiên 1: Nếu có hàng sắp hết → hiển thị cảnh báo đỏ
  if (lowStockCount > 0) return STOCK_COLORS.critical;
  // Lấp đầy > 70% → xanh lá (tốt)
  if (fillLevel > 70) return STOCK_COLORS.healthy;
  // Lấp đầy 30-70% → vàng (trung bình)
  if (fillLevel > 30) return STOCK_COLORS.low;
  // Lấp đầy < 30% → đỏ (gần trống)
  return STOCK_COLORS.critical;
};

/**
 * Tính phần trăm lấp đầy của kho
 * @param {number} totalStock - Tổng số lượng tồn kho
 * @param {number} itemCount - Số lượng mặt hàng khác nhau trong kho
 * @param {number} warehouseMaxCapacity - Sức chứa thực tế từ database (không bắt buộc)
 * @param {number} maxCapacityPerItem - Sức chứa tối đa mỗi mặt hàng (mặc định từ constants, dùng làm fallback)
 * @returns {number} - Phần trăm lấp đầy (0-100)
 */
export const calculateFillLevel = (
  totalStock,
  itemCount,
  warehouseMaxCapacity = null,
  maxCapacityPerItem = CAPACITY.MAX_PER_ITEM
) => {
  // Ưu tiên sử dụng sức chứa thực tế từ DB, nếu không có thì tính theo công thức
  const maxCapacity = warehouseMaxCapacity || (itemCount * maxCapacityPerItem);
  if (maxCapacity <= 0) return 0;
  return Math.min((totalStock / maxCapacity) * 100, 100);
};

/**
 * Tính số lượng tồn kho khả dụng (tổng - đang giữ chỗ)
 * @param {number} quantity - Tổng số lượng tồn kho
 * @param {number} onDemandQuantity - Số lượng đang được giữ chỗ (onDemand)
 * @returns {number} - Số lượng khả dụng thực tế
 */
export const calculateAvailableStock = (quantity, onDemandQuantity) => {
  return Math.max(0, (quantity || 0) - (onDemandQuantity || 0));
};

/**
 * Kiểm tra mặt hàng có đang sắp hết không
 * Điều kiện: 0 < quantity < ngưỡng LOW (mặc định 10)
 * @param {number} quantity - Số lượng tồn kho hiện tại
 * @returns {boolean} - true nếu sắp hết, false nếu không
 */
export const isLowStock = (quantity) => {
  return quantity < STOCK_THRESHOLDS.LOW && quantity > STOCK_THRESHOLDS.CRITICAL;
};

/**
 * Kiểm tra mặt hàng có hết hàng không
 * Điều kiện: quantity <= ngưỡng CRITICAL (mặc định 0)
 * @param {number} quantity - Số lượng tồn kho hiện tại
 * @returns {boolean} - true nếu hết hàng, false nếu không
 */
export const isOutOfStock = (quantity) => {
  return quantity <= STOCK_THRESHOLDS.CRITICAL;
};

/**
 * Tính toán thống kê tồn kho từ mảng dữ liệu
 * @param {Array} inventoryData - Mảng các bản ghi tồn kho
 * @returns {object} - Đối tượng thống kê gồm:
 *   - totalStock: Tổng số lượng tồn kho
 *   - totalItems: Số lượng mặt hàng (không trùng lặp)
 *   - lowStockItems: Số mặt hàng sắp hết
 *   - outOfStock: Số mặt hàng hết hàng
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
 * Nhóm tồn kho theo mã kho
 * @param {Array} inventoryData - Mảng các bản ghi tồn kho
 * @returns {object} - Đối tượng đã nhóm { warehouseCode: [danh sách items] }
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
 * Tính phần trăm thay đổi giữa 2 giá trị
 * @param {number} oldValue - Giá trị cũ
 * @param {number} newValue - Giá trị mới
 * @returns {number} - Phần trăm thay đổi (dương = tăng, âm = giảm)
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};
