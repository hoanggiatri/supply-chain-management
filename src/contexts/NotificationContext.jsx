import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    // Mock data - sẽ được thay thế bằng API call
    {
      id: 1,
      title: 'Đơn hàng mới',
      message: 'Bạn có 1 đơn hàng mới cần xử lý',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 phút trước
    },
    {
      id: 2,
      title: 'Cảnh báo tồn kho',
      message: 'Sản phẩm ABC sắp hết hàng',
      type: 'warning',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 phút trước
    },
    {
      id: 3,
      title: 'Hoàn thành sản xuất',
      message: 'Công lệnh #12345 đã hoàn thành',
      type: 'success',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 giờ trước
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      timestamp: new Date(),
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
