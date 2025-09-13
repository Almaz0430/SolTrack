'use client';

import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '@/components/NotificationToast';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counter, setCounter] = useState(0);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    duration?: number
  ) => {
    setCounter((prev: number) => {
      const newCounter = prev + 1;
      const id = `notification-${newCounter}`;
      const notification: Notification = {
        id,
        type,
        title,
        message,
        duration,
      };

      setNotifications((prevNotifications: Notification[]) => [...prevNotifications, notification]);
      return newCounter;
    });
    
    return `notification-${counter + 1}`;
  }, [counter]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev: Notification[]) => prev.filter((n: Notification) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Удобные методы для разных типов уведомлений
  const success = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('success', title, message, duration);
  }, [addNotification]);

  const error = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('error', title, message, duration || 7000);
  }, [addNotification]);

  const warning = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('warning', title, message, duration);
  }, [addNotification]);

  const info = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('info', title, message, duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
}