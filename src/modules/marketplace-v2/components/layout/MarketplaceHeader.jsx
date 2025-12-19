import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MANUFACTURING_MENU, PURCHASING_MENU, SALES_MENU, WAREHOUSE_MENU } from '../../config/navigation';
import NotificationBell from '../ui/NotificationBell';
import ThemeToggle from '../ui/ThemeToggle';

// Dropdown Component for Desktop
const NavDropdown = ({ label, items, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (path) => {
    // Exact match for pathname + search query
    return (location.pathname + location.search) === path;
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isOpen ? 'bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        {Icon && <Icon size={18} />}
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 w-64 p-2 rounded-xl mp-glass-card shadow-xl border border-white/20 dark:border-white/10"
            style={{ zIndex: 'var(--mp-z-dropdown)' }}
          >
            {items.map((item) => {
              const active = isActiveLink(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Department constants
const DEPT_ADMIN = 'Quản trị';
const DEPT_SALES = 'Mua, Bán hàng';
const DEPT_WAREHOUSE = 'Kho, Sản xuất, Vận chuyển';

const MarketplaceHeader = ({ onMenuClick, user }) => {
  const navigate = useNavigate();

  // Determine which menus to show based on user's department/role
  const visibleMenus = useMemo(() => {
    const department = user?.departmentName?.trim() || '';
    const role = user?.roleName?.toLowerCase() || '';
    
    // Admin or "Quản trị" sees all menus
    if (role === 'admin' || role === 'c_admin' || department === DEPT_ADMIN) {
      return [
        { label: 'Mua hàng', items: PURCHASING_MENU },
        { label: 'Bán hàng', items: SALES_MENU },
        { label: 'Kho', items: WAREHOUSE_MENU },
        { label: 'Sản xuất', items: MANUFACTURING_MENU },
      ];
    }

    const menus = [];

    // "Mua, Bán hàng" department - Purchase and Sales menus
    if (department === DEPT_SALES) {
      menus.push({ label: 'Mua hàng', items: PURCHASING_MENU });
      menus.push({ label: 'Bán hàng', items: SALES_MENU });
    }

    // "Kho, Sản xuất, Vận chuyển" department - Warehouse and Manufacturing menus
    if (department === DEPT_WAREHOUSE) {
      menus.push({ label: 'Kho', items: WAREHOUSE_MENU });
      menus.push({ label: 'Sản xuất', items: MANUFACTURING_MENU });
    }

    // If no department matches, show all menus (fallback for development/testing)
    if (menus.length === 0) {
      return [
        { label: 'Mua hàng', items: PURCHASING_MENU },
        { label: 'Bán hàng', items: SALES_MENU },
        { label: 'Kho', items: WAREHOUSE_MENU },
        { label: 'Sản xuất', items: MANUFACTURING_MENU },
      ];
    }

    return menus;
  }, [user?.departmentName, user?.roleName]);

  // Dashboard path based on department
  const dashboardPath = useMemo(() => {
    const department = user?.departmentName?.trim() || '';
    const role = user?.roleName?.toLowerCase() || '';

    // Warehouse department goes to warehouse dashboard
    if (department === DEPT_WAREHOUSE) {
      return '/marketplace-v2/warehouse';
    }
    // Admin and Sales go to main dashboard
    return '/marketplace-v2/dashboard';
  }, [user?.departmentName, user?.roleName]);

  return (
    <header
      className="fixed top-0 left-0 right-0 mp-glass-header flex items-center justify-between px-4 lg:px-6"
      style={{
        height: 'var(--mp-header-height)',
        zIndex: 'calc(var(--mp-z-sticky) + 10)'
      }}
    >
      <div className="flex items-center gap-6">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onMenuClick}
            className="mp-glass-button mp-btn-icon lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={22} style={{ color: 'var(--mp-text-secondary)' }} />
          </motion.button>

          <Link to={dashboardPath} className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 5 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20"
            >
              <span className="text-white font-bold text-lg">M</span>
            </motion.div>
            <span
              className="font-bold text-xl hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >
              SCMS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* Dashboard Link - Direct */}
          <NavLink
            to={dashboardPath}
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400 bg-black/5 dark:bg-white/10' : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`
            }
          >
            Tổng quan
          </NavLink>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Dynamic Menus based on department */}
          {visibleMenus.map((menu) => (
            <NavDropdown key={menu.label} label={menu.label} items={menu.items} />
          ))}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />

          {/* User Profile */}
          <motion.button
            onClick={() => navigate('/marketplace-v2/my-profile')}
            className="flex items-center gap-3 pl-2 py-1.5 pr-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-right hidden xl:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {user?.departmentName || 'Admin'}
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium shadow-md shadow-blue-500/20"
              style={{
                background: 'linear-gradient(135deg, var(--mp-primary-500), var(--mp-secondary-500))'
              }}
            >
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;

