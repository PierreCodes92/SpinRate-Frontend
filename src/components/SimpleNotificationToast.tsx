import { useEffect, useState } from 'react';
import { Notification } from '@/hooks/useNotification';
import { useTranslation } from '@/components/TranslationProvider';

interface SimpleNotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

export const SimpleNotificationToast = ({ notification, onRemove }: SimpleNotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-remove with fade-out animation
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onRemove(notification.id), 400);
    }, notification.duration || 6000);

    return () => clearTimeout(timer);
  }, [notification.duration, notification.id, onRemove]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(notification.id), 400);
  };

  return (
    <div
      className={`
        fixed z-[9999] transition-all duration-500 ease-out
        /* Desktop only: positioned on the right side, lower */
        hidden md:block md:top-24 md:right-6 md:left-auto md:transform-none
        ${isVisible && !isLeaving 
          ? 'opacity-100 translate-y-0 md:translate-x-0 scale-100' 
          : isLeaving 
            ? 'opacity-0 translate-y-[-8px] md:translate-x-4 scale-95' 
            : 'opacity-0 translate-y-[-12px] md:translate-x-8 scale-90'
        }
      `}
    >
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden w-full max-w-sm mx-auto md:mx-0 md:min-w-[320px] min-w-[300px]">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {notification.emoji && (
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-lg">
                  {notification.emoji}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <h4 className="text-foreground font-semibold text-base mb-1">
                {t('freeTrialActivated')}
              </h4>
              <p className="text-muted-foreground text-sm whitespace-nowrap">
                {t('redirectingToAccount')}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-muted">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 ease-linear rounded-r-full"
            style={{
              width: isVisible ? '100%' : '0%',
              transition: isVisible ? `width ${notification.duration || 6000}ms linear` : 'width 0.1s ease-out'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};