import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  DollarSign,
  FileText,
  Package,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useClickOutside } from '../../hooks';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'order':
      return <Package size={18} className="text-blue-500" />;
    case 'rfq':
      return <FileText size={18} className="text-purple-500" />;
    case 'quotation':
      return <DollarSign size={18} className="text-green-500" />;
    case 'status':
      return <RefreshCw size={18} className="text-amber-500" />;
    default:
      return <Bell size={18} className="text-gray-500" />;
  }
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
};

/**
 * Notification bell icon with dropdown panel
 */
const NotificationBell = ({ className = '' }) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const dropdownRef = useClickOutside(() => {
    closeDropdown();
  });

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    closeDropdown();
    navigate(notification.link);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        onClick={toggleDropdown}
        className="mp-glass-button mp-btn-icon mp-ripple relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Notifications"
      >
        <Bell size={20} style={{ color: 'var(--mp-text-secondary)' }} />

        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full mp-animate-badge-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden mp-glass-dropdown z-50"
            style={{ zIndex: 'var(--mp-z-dropdown)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                Thông báo
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--mp-primary-600)' }}
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-72 overflow-y-auto mp-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center" style={{ color: 'var(--mp-text-tertiary)' }}>
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Không có thông báo</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-3 p-4 cursor-pointer border-b transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    style={{
                      borderColor: 'var(--mp-border-light)',
                      backgroundColor: !notification.read ? 'var(--mp-primary-50)' : 'transparent'
                    }}
                    whileHover={{ backgroundColor: 'var(--mp-surface-hover)' }}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--mp-bg-secondary)' }}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}
                        style={{ color: 'var(--mp-text-primary)' }}>
                        {notification.title}
                      </p>
                      <p className="text-sm truncate" style={{ color: 'var(--mp-text-secondary)' }}>
                        {notification.description}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--mp-text-tertiary)' }}>
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t text-center" style={{ borderColor: 'var(--mp-border-light)' }}>
                <button
                  onClick={() => {
                    closeDropdown();
                    navigate('/marketplace-v2/notifications');
                  }}
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--mp-primary-600)' }}
                >
                  Xem tất cả thông báo
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
