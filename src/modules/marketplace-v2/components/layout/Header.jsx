import { motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from '../ui/NotificationBell';
import ThemeToggle from '../ui/ThemeToggle';

/**
 * Glass morphism header with logo, search, notifications, and user profile
 */
const Header = ({
  onMenuClick,
  isSidebarCollapsed,
  user
}) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace-v2/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 mp-glass-header flex items-center justify-between px-4 lg:px-6"
      style={{
        height: 'var(--mp-header-height)',
        zIndex: 'calc(var(--mp-z-sticky) + 1)'
      }}
    >
      {/* Left Section: Logo + Menu Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <motion.button
          onClick={onMenuClick}
          className="mp-glass-button mp-btn-icon mp-hide-desktop"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={22} style={{ color: 'var(--mp-text-secondary)' }} />
        </motion.button>

        {/* Logo */}
        <Link to="/marketplace-v2/dashboard" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 5 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--mp-primary-500), var(--mp-secondary-500))'
            }}
          >
            <span className="text-white font-bold text-lg">M</span>
          </motion.div>
          <span
            className="font-bold text-xl hidden sm:block"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Marketplace
          </span>
        </Link>
      </div>

      {/* Center Section: Search (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch} className="w-full relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--mp-text-tertiary)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm đơn hàng, RFQ, nhà cung cấp..."
            className="w-full mp-glass-input pl-11 pr-4"
            style={{ fontSize: 'var(--mp-font-size-sm)' }}
          />
        </form>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Toggle */}
        <motion.button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="mp-glass-button mp-btn-icon md:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSearchOpen ? (
            <X size={20} style={{ color: 'var(--mp-text-secondary)' }} />
          ) : (
            <Search size={20} style={{ color: 'var(--mp-text-secondary)' }} />
          )}
        </motion.button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationBell />

        {/* User Avatar */}
        <motion.button
          onClick={() => navigate('/marketplace-v2/my-profile')}
          className="flex items-center gap-2 mp-glass-button px-2 py-1.5 ml-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
            style={{
              background: 'linear-gradient(135deg, var(--mp-primary-500), var(--mp-secondary-500))'
            }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <span
            className="hidden lg:block text-sm font-medium max-w-24 truncate"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            {user?.fullName || 'User'}
          </span>
        </motion.button>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 p-4 mp-glass-header border-t md:hidden"
          style={{ borderColor: 'var(--mp-border-light)' }}
        >
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--mp-text-tertiary)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full mp-glass-input pl-11 pr-4"
              autoFocus
            />
          </form>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
