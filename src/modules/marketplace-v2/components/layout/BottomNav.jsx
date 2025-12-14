import { motion } from 'framer-motion';
import {
    Box,
    Factory,
    FileText,
    LayoutDashboard,
    Plus,
    ShoppingCart,
    User
} from 'lucide-react';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

// Department constants
const DEPT_ADMIN = 'Quản trị';
const DEPT_SALES = 'Mua, Bán hàng';
const DEPT_WAREHOUSE = 'Kho, Sản xuất, Vận chuyển';

/**
 * Bottom navigation bar for mobile view
 * Shows different nav items based on user's department
 */
const BottomNav = ({ onCreateClick, user }) => {
  // Get nav items based on department
  const navItems = useMemo(() => {
    const department = user?.departmentName?.trim() || '';
    const role = user?.roleName?.toLowerCase() || '';

    // Base items that appear for everyone
    const baseItems = [
      { path: '/marketplace-v2/my-profile', label: 'Tài khoản', icon: User },
    ];

    // Admin or Quản trị - show all
    if (role === 'admin' || role === 'c_admin' || department === DEPT_ADMIN) {
      return [
        { path: '/marketplace-v2/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
        { path: '/marketplace-v2/rfqs', label: 'RFQ', icon: FileText },
        { path: '/marketplace-v2/create', label: 'Tạo mới', icon: Plus, isAction: true },
        { path: '/marketplace-v2/pos', label: 'Đơn hàng', icon: ShoppingCart },
        ...baseItems,
      ];
    }

    // Mua, Bán hàng department
    if (department === DEPT_SALES) {
      return [
        { path: '/marketplace-v2/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
        { path: '/marketplace-v2/rfqs', label: 'RFQ', icon: FileText },
        { path: '/marketplace-v2/create', label: 'Tạo mới', icon: Plus, isAction: true },
        { path: '/marketplace-v2/pos', label: 'Đơn hàng', icon: ShoppingCart },
        ...baseItems,
      ];
    }

    // Kho, Sản xuất, Vận chuyển department
    if (department === DEPT_WAREHOUSE) {
      return [
        { path: '/marketplace-v2/warehouse', label: 'Kho', icon: Box },
        { path: '/marketplace-v2/mos', label: 'Sản xuất', icon: Factory },
        { path: '/marketplace-v2/create', label: 'Tạo mới', icon: Plus, isAction: true },
        { path: '/marketplace-v2/warehouse/tickets?tab=issue', label: 'Phiếu', icon: FileText },
        ...baseItems,
      ];
    }

    // Fallback - show all for development
    return [
      { path: '/marketplace-v2/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
      { path: '/marketplace-v2/rfqs', label: 'RFQ', icon: FileText },
      { path: '/marketplace-v2/create', label: 'Tạo mới', icon: Plus, isAction: true },
      { path: '/marketplace-v2/pos', label: 'Đơn hàng', icon: ShoppingCart },
      ...baseItems,
    ];
  }, [user?.departmentName, user?.roleName]);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 mp-glass-header border-t mp-hide-desktop"
      style={{
        height: 'var(--mp-bottom-nav-height)',
        zIndex: 'var(--mp-z-sticky)',
        borderColor: 'var(--mp-border-light)'
      }}
    >
      <div className="h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          // Center floating action button
          if (item.isAction) {
            return (
              <motion.button
                key={item.path}
                onClick={() => onCreateClick?.()}
                className="relative -mt-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg mp-ripple"
                style={{
                  background: 'linear-gradient(135deg, var(--mp-primary-500), var(--mp-primary-600))'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon size={24} className="text-white" />
              </motion.button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-blue-600' : ''
                }`
              }
              style={{ color: 'var(--mp-text-tertiary)' }}
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon size={22} className={isActive ? 'text-blue-600' : ''} />
                  </motion.span>
                  <span className={`text-xs ${isActive ? 'font-medium text-blue-600' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute bottom-0 w-12 h-0.5 rounded-full bg-blue-600"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
