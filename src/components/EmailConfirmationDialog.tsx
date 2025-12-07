import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/components/TranslationProvider';

interface EmailConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResendEmail?: () => void;
  isResendingEmail?: boolean;
}

export const EmailConfirmationDialog = ({
  isOpen,
  onClose,
  email,
  onResendEmail,
  isResendingEmail = false
}: EmailConfirmationDialogProps) => {
  const { t } = useTranslation();
  
  const handleResendEmail = () => {
    console.log('Resending email to:', email);
    if (onResendEmail) {
      onResendEmail();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[calc(100%-2rem)] !max-w-[calc(28rem-2rem)] rounded-[28px] border-border/50 bg-card/95 backdrop-blur-sm shadow-sm z-[150]">
        <AlertDialogHeader className="space-y-3 md:space-y-4">
          {/* Logo */}
          <div className="flex justify-center mb-1 md:mb-2">
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/revwheel-logo.png" 
                alt="RevWheel logo" 
                className="w-14 md:w-20 h-auto"
              />
            </div>
          </div>
          
          <AlertDialogTitle className="text-lg md:text-2xl font-bold text-center text-foreground whitespace-nowrap">
            {t('checkYourInbox') || 'Check your inbox.'}
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-center text-sm md:text-base pt-1 md:pt-2 text-muted-foreground">
            {t('emailSentTo') || 'An email has just been sent to'}{' '}
            <span className="font-semibold text-primary">{email}</span>.{' '}
            {t('clickLinkToActivate') || 'Click the link to activate your account.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-col gap-2 md:gap-3 mt-1 md:mt-2">
          <button
            onClick={handleResendEmail}
            disabled={isResendingEmail}
            className="text-xs md:text-sm text-muted-foreground hover:text-muted-foreground transition-colors py-1 md:py-2 disabled:opacity-50"
          >
            {t('didntReceiveEmail') || "Didn't receive the email?"}{' '}
            <span className="text-primary font-semibold hover:underline">
              {isResendingEmail 
                ? (t('sending') || 'Sending...') 
                : (t('resendEmail') || 'Resend email.')}
            </span>
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

