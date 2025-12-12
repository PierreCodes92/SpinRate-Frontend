import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/components/TranslationProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { X, Mail, KeyRound, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

type Step = 'email' | 'otp' | 'password' | 'success';

export const ForgotPasswordDialog = ({
  isOpen,
  onClose,
  onBackToLogin
}: ForgotPasswordDialogProps) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Animation on open
  useEffect(() => {
    if (isOpen) {
      setHasOpened(false);
      const timer = setTimeout(() => setHasOpened(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setStep('email');
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }, 300);
  };

  const handleBackToLogin = () => {
    handleClose();
    setTimeout(() => {
      onBackToLogin();
    }, 350);
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !email.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || t('emailNotFound'));
        return;
      }

      toast.success(data.message);
      setStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(t('emailNotFound'));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !otp.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || t('invalidOtp'));
        return;
      }

      toast.success(data.message);
      setStep('password');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(t('invalidOtp'));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate passwords
    if (newPassword.length < 6) {
      toast.error(t('passwordTooShort'));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || t('otpExpired'));
        return;
      }

      setStep('success');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(t('otpExpired'));
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message);
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error(t('emailNotFound'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
        onClick={handleClose} 
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md bg-white rounded-[28px] shadow-[0_35px_90px_rgba(15,23,42,0.12)] border border-[#E8EEFA] overflow-hidden transition-all duration-300 ease-out ${isClosing ? 'opacity-0 scale-95' : hasOpened ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 md:top-5 md:right-5 text-[#98A2B3] hover:text-[#1E3FAA] transition-colors z-10" 
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="px-5 pt-6 pb-3 md:px-6 md:pt-8 md:pb-4 text-center">
          <div className="flex flex-col items-center gap-2 mb-4">
            <img src="/lovable-uploads/revwheel-logo.png" alt="RevWheel logo" className="h-12 md:h-14 w-auto" />
          </div>
          
          {step !== 'success' && (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-[#1F2A44] mb-2">
                {step === 'email' && t('forgotPasswordTitle')}
                {step === 'otp' && t('enterOtpCode')}
                {step === 'password' && t('createNewPassword')}
              </h2>
              <p className="text-sm text-[#8A94A6]">
                {step === 'email' && t('forgotPasswordSubtitle')}
                {step === 'otp' && `${t('otpSentTo')} ${email}`}
                {step === 'password' && ''}
              </p>
            </>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-6 md:px-6 md:pb-8">
          
          {/* Step 1: Email Input */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-semibold text-[#1F2A44]">
                  {t('emailAddress')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90A1C0]" />
                  <Input 
                    id="reset-email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder={t('enterEmail')}
                    className="h-12 pl-10 rounded-xl bg-[#F5F7FB] border border-[#E3E8F4] text-[#0F1F3B] text-sm placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#5B86FF] focus-visible:border-[#5B86FF]" 
                    required 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 font-semibold text-base" 
                variant="cta" 
                disabled={isLoading}
              >
                {isLoading ? t('sendingCode') : t('sendCode')}
              </Button>

              <button 
                type="button" 
                onClick={handleBackToLogin}
                className="w-full text-center text-sm text-[#397BFF] font-semibold hover:underline flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToLogin')}
              </button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-code" className="text-sm font-semibold text-[#1F2A44]">
                  Code OTP
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90A1C0]" />
                  <Input 
                    id="otp-code" 
                    type="text" 
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    placeholder="000000"
                    className="h-12 pl-10 rounded-xl bg-[#F5F7FB] border border-[#E3E8F4] text-[#0F1F3B] text-xl text-center tracking-[0.5em] font-mono placeholder:text-[#94A3B8] placeholder:tracking-[0.5em] focus-visible:ring-2 focus-visible:ring-[#5B86FF] focus-visible:border-[#5B86FF]" 
                    maxLength={6}
                    required 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 font-semibold text-base" 
                variant="cta" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? t('verifying') : t('verifyCode')}
              </Button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm text-[#397BFF] font-semibold hover:underline disabled:opacity-50"
                >
                  {t('resendCode')}
                </button>
              </div>

              <button 
                type="button" 
                onClick={() => setStep('email')}
                className="w-full text-center text-sm text-[#8A94A6] hover:text-[#1F2A44] flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToLogin')}
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-semibold text-[#1F2A44]">
                  {t('newPassword')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90A1C0]" />
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    className="h-12 pl-10 rounded-xl bg-[#F5F7FB] border border-[#E3E8F4] text-[#0F1F3B] text-sm placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#5B86FF] focus-visible:border-[#5B86FF]" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-[#1F2A44]">
                  {t('confirmNewPassword')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90A1C0]" />
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    className="h-12 pl-10 rounded-xl bg-[#F5F7FB] border border-[#E3E8F4] text-[#0F1F3B] text-sm placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#5B86FF] focus-visible:border-[#5B86FF]" 
                    required 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 font-semibold text-base" 
                variant="cta" 
                disabled={isLoading}
              >
                {isLoading ? t('resetting') : t('resetPassword')}
              </Button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#1F2A44] mb-2">
                  {t('passwordResetSuccess')}
                </h2>
                <p className="text-sm text-[#8A94A6]">
                  {t('passwordResetSuccessDesc')}
                </p>
              </div>

              <Button 
                onClick={handleBackToLogin}
                className="w-full h-12 font-semibold text-base" 
                variant="cta"
              >
                {t('backToLogin')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

