import {
  ArrowDownCircle,
  ArrowUpCircle,
  Box,
  Building2,
  DollarSign,
  FileText,
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';

/**
 * Navigation Menu Configuration
 */

export const INVENTORY_MENU = [
  { path: '/marketplace-v2/inventory/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/marketplace-v2/inventory/inbound', label: 'Nhập kho', icon: ArrowDownCircle },
  { path: '/marketplace-v2/inventory/outbound', label: 'Xuất kho', icon: ArrowUpCircle },
  { path: '/marketplace-v2/inventory/stock', label: 'Tồn kho', icon: Box },
];

export const PURCHASING_MENU = [
  { path: '/marketplace-v2/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/marketplace-v2/rfqs', label: 'Yêu cầu báo giá (RFQ)', icon: FileText },
  { path: '/marketplace-v2/customer-quotations', label: 'Báo giá từ NCC', icon: DollarSign },
  { path: '/marketplace-v2/pos', label: 'Đơn mua hàng (PO)', icon: ShoppingCart },
  { path: '/marketplace-v2/suppliers', label: 'Nhà cung cấp', icon: Building2 },
  { path: '/marketplace-v2/purchase-report', label: 'Báo cáo mua hàng', icon: TrendingUp },
];

export const SALES_MENU = [
  { path: '/marketplace-v2/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/marketplace-v2/supplier-rfqs', label: 'RFQ từ khách hàng', icon: FileText },
  { path: '/marketplace-v2/sent-quotations', label: 'Báo giá đã gửi', icon: DollarSign },
  { path: '/marketplace-v2/customer-pos', label: 'PO từ khách hàng', icon: ShoppingCart },
  { path: '/marketplace-v2/sos', label: 'Đơn bán hàng (SO)', icon: Package },
  { path: '/marketplace-v2/sales-report', label: 'Báo cáo bán hàng', icon: TrendingUp },
];
