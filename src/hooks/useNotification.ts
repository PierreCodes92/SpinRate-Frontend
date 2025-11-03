import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  message: string;
  emoji?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      id,
      duration: 4000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, newNotification.duration);

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showTrialNotification = useCallback(() => {
    addNotification({
      message: 'freeTrialActivated', // Translation key instead of text
      emoji: '🎉',
      type: 'success',
      duration: 6000,
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showTrialNotification,
  };
};