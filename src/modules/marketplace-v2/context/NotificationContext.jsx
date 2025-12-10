import { createContext, useCallback, useContext, useState } from 'react';

const NotificationContext = createContext(undefined);

// Mock notifications for demo - in production, these would come from API
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng mới',
    description: 'Bạn có đơn hàng PO-2024-001 từ ABC Corp',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    link: '/marketplace-v2/orders/1',
  },
  {
    id: '2',
    type: 'rfq',
    title: 'Yêu cầu báo giá mới',
    description: 'RFQ-2024-015 cần phản hồi trong 24h',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    link: '/marketplace-v2/rfqs/15',
  },
  {
    id: '3',
    type: 'quotation',
    title: 'Báo giá đã được duyệt',
    description: 'Quotation cho RFQ-2024-012 đã được chấp nhận',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    link: '/marketplace-v2/quotations/12',
  },
  {
    id: '4',
    type: 'status',
    title: 'Cập nhật trạng thái',
    description: 'PO-2024-008 đã chuyển sang "Đang giao hàng"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    link: '/marketplace-v2/orders/8',
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const value = {
    notifications,
    unreadCount,
    isDropdownOpen,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    toggleDropdown,
    closeDropdown,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
