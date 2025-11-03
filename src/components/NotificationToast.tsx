import { useEffect, useState } from 'react';
import { Notification } from '@/hooks/useNotification';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

export const NotificationToast = ({ notification, onRemove }: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-remove avec animation fade-out
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onRemove(notification.id), 700);
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, [notification.duration, notification.id, onRemove]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(notification.id), 700);
  };

  return (
    <div
      className={`
        fixed top-4 right-4 md:right-4 left-4 md:left-auto z-[9999] max-w-xs md:max-w-sm mx-auto md:mx-0
        transform transition-all duration-700 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-y-0 opacity-100 scale-100' 
          : isLeaving 
            ? 'translate-y-8 opacity-0 scale-90' 
            : '-translate-y-8 opacity-0 scale-90'
        }
      `}
    >
      <div className="bg-white/95 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-[0_20px_40px_rgba(99,102,241,0.25)] p-4 md:p-6 relative overflow-hidden">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none"></div>
        
        {/* Animated glow ring */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-60 animate-pulse pointer-events-none"></div>
        
        <div className="relative z-20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1">
              {notification.emoji && (
                <div className="text-2xl md:text-3xl animate-bounce flex-shrink-0">
                  {notification.emoji}
                </div>
              )}
              <div className="flex-1">
                <p className="text-foreground font-bold text-base md:text-lg leading-tight">
                  {notification.message}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-all duration-200 p-2 hover:bg-primary/10 rounded-full ml-2 flex-shrink-0 hover:scale-110 cursor-pointer relative"
              type="button"
              style={{ 
                zIndex: 10000,
                pointerEvents: 'auto'
              }}
            >
              <span className="text-sm md:text-base font-semibold block leading-none">✕</span>
            </button>
          </div>
          
          <div className="text-center text-xs md:text-sm text-muted-foreground mb-4">
            Redirection vers la création de votre compte...
          </div>
          
          {/* Progress bar */}
          <div className="h-2 md:h-3 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all ease-linear"
              style={{
                animation: `shrink ${notification.duration || 4000}ms linear forwards`,
              }}
            />
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
      }} />
    </div>
  );
};