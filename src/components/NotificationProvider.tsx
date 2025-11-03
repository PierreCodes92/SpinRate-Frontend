import { createContext, useContext, ReactNode } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { SimpleNotificationToast } from './SimpleNotificationToast';

const NotificationContext = createContext<ReturnType<typeof useNotification> | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const notificationService = useNotification();

  return (
    <NotificationContext.Provider value={notificationService}>
      {children}
      
      {/* Render notifications */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {notificationService.notifications.map((notification) => (
          <SimpleNotificationToast
            key={notification.id}
            notification={notification}
            onRemove={notificationService.removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};