import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/components/TranslationProvider';
import { toast } from 'sonner';

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

  const handleAllSetClick = () => {
    toast.info(t('linkNotClicked') || 'Link not clicked! Check your inbox to activate your account.');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md border-border/50 bg-card/95 backdrop-blur-sm shadow-sm z-[150]">
        <AlertDialogHeader className="space-y-4">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/revwheel-logo.png" 
                alt="RevWheel logo" 
                className="w-16 h-auto"
              />
            </div>
          </div>
          
          <AlertDialogTitle className="text-2xl font-bold text-center text-foreground">
            {t('checkYourInbox') || 'Check your inbox.'}
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-center text-base pt-2 text-muted-foreground">
            {t('emailSentTo') || 'An email has just been sent to'}{' '}
            <span className="font-semibold text-primary">{email}</span>.{' '}
            {t('clickLinkToActivate') || 'Click the link to activate your account.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-col gap-3 mt-2">
          <Button
            onClick={handleAllSetClick}
            className="w-full h-12 text-lg font-semibold shadow-button hover-glow"
            variant="cta"
          >
            {t('allSet') || 'All set'}
          </Button>
          
          <button
            onClick={handleResendEmail}
            disabled={isResendingEmail}
            className="text-sm text-muted-foreground hover:text-muted-foreground transition-colors py-2 disabled:opacity-50"
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

