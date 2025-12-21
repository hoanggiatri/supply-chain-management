import {
  ArrowDownCircle,
  ArrowUpCircle,
  Box,
  Building2,
  ClipboardList,
  DollarSign,
  Factory,
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck
} from 'lucide-react';

/**
 * Navigation Menu Configuration
 * Note: Dashboard is shown as a separate link in the header, not inside dropdowns
 */

// Mua hàng menu - for "Mua, Bán hàng" department
export const PURCHASING_MENU = [
  { path: '/marketplace-v2/rfqs', label: 'Yêu cầu báo giá', icon: FileText },
  { path: '/marketplace-v2/customer-quotations', label: 'Báo giá từ NCC', icon: DollarSign },
  { path: '/marketplace-v2/pos', label: 'Đơn mua hàng', icon: ShoppingCart },
  { path: '/marketplace-v2/suppliers', label: 'Nhà cung cấp', icon: Building2 },
  { path: '/marketplace-v2/purchase-report', label: 'Báo cáo mua hàng', icon: TrendingUp },
];

// Bán hàng menu - for "Mua, Bán hàng" department
export const SALES_MENU = [
  { path: '/marketplace-v2/supplier-rfqs', label: 'Yêu cầu từ khách', icon: FileText },
  { path: '/marketplace-v2/sent-quotations', label: 'Báo giá đã gửi', icon: DollarSign },
  { path: '/marketplace-v2/customer-pos', label: 'Yêu cầu mua hàng', icon: ShoppingCart },
  { path: '/marketplace-v2/sos', label: 'Đơn bán hàng', icon: Package },
  { path: '/marketplace-v2/sales-report', label: 'Báo cáo bán hàng', icon: TrendingUp },
];

// Kho menu - for "Kho, Sản xuất, Vận chuyển" department
export const WAREHOUSE_MENU = [
  { path: '/marketplace-v2/warehouse/inventory', label: 'Tồn kho', icon: Box },
  { path: '/marketplace-v2/warehouse/management', label: 'Quản lý kho', icon: Building2 },
  { path: '/marketplace-v2/warehouse/delivery', label: 'Vận chuyển', icon: Truck },
  { path: '/marketplace-v2/warehouse/issue-tickets', label: 'Phiếu xuất kho', icon: ArrowUpCircle },
  { path: '/marketplace-v2/warehouse/receive-tickets', label: 'Phiếu nhập kho', icon: ArrowDownCircle },
  { path: '/marketplace-v2/warehouse/transfer-tickets', label: 'Phiếu chuyển kho', icon: ClipboardList },
];

// Sản xuất menu - for "Kho, Sản xuất, Vận chuyển" department
export const MANUFACTURING_MENU = [
  { path: '/marketplace-v2/mos', label: 'Lệnh sản xuất', icon: Factory },
  { path: '/marketplace-v2/boms', label: 'Định mức vật tư', icon: Package },
  { path: '/marketplace-v2/stages', label: 'Quy trình sản xuất', icon: Box },
];
