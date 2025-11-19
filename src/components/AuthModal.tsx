import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/components/TranslationProvider';
import { useLogin } from '@/hooks/useLogin';
import { useSignup } from '@/hooks/useSignup';
import { toast } from 'sonner';
import { X, User, Mail, Phone, Lock } from 'lucide-react';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}
export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = 'login'
}: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useLogin();
  const { signup } = useSignup();
  const {
    t
  } = useTranslation();
  const activeToggleClass = "px-8 py-2 rounded-full text-sm font-semibold text-white shadow-[0_15px_30px_rgba(61,139,255,0.3)] bg-[#3D8BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D8BFF]/60 transition-all";
  const inactiveToggleClass = "text-sm font-semibold text-[#3D8BFF] hover:text-[#1E4FD8] transition-colors px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D8BFF]/40 rounded-full";
  const inputClasses = "h-12 md:h-12 pl-11 rounded-2xl bg-[#F5F7FB] border border-[#E3E8F4] text-[#0F1F3B] placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#5B86FF] focus-visible:border-[#5B86FF]";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#90A1C0]";
  const ctaButtonClass = "w-full h-12 rounded-full bg-gradient-to-r from-[#3D8BFF] to-[#1E62FF] text-base font-semibold text-white shadow-[0_18px_35px_rgba(61,139,255,0.35)] transform transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D8BFF]/60 disabled:opacity-70 disabled:cursor-not-allowed";
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500);
  };

  // Gestion de l'animation d'ouverture et mode initial
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      // Reset hasOpened pour commencer l'animation d'ouverture
      setHasOpened(false);
      // Démarrer l'animation d'ouverture après un micro-délai
      const timer = setTimeout(() => {
        setHasOpened(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialMode]);

  // Reset hasOpened quand la modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setHasOpened(false);
    }
  }, [isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const error = await login(email, password);
        if (error) {
          if (error === 'Incorrect email.!.') {
            toast.error(t('incorrectEmail') || 'Incorrect email');
          } else if (error === 'Incorrect password.!.') {
            toast.error(t('incorrectPassword') || 'Incorrect password');
          } else if (error === 'All fields must be filled...') {
            toast.error(t('allFieldsMustBeFilled') || 'All fields must be filled');
          } else {
            toast.error(error);
          }
        } else {
          toast.success(t('successfullyLoggedIn') || 'Successfully logged in');
          handleClose();
        }
      } else {
        // Register mode
        const result = await signup(fullName, email, phone, password);
        if (typeof result === 'string') {
          // It's an error
          toast.error(result);
        } else {
          toast.success(t('successfullyRegistered') || 'Successfully registered');
          // Optionally switch to login mode or close modal
          setMode('login');
          setFullName('');
          setPhone('');
          // You might want to send verification email here
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose} />
      
      <div className={`relative w-full max-w-md bg-white rounded-[28px] shadow-[0_35px_90px_rgba(15,23,42,0.12)] border border-[#E8EEFA] overflow-hidden transition-all duration-500 ease-out ${isClosing ? 'opacity-0 scale-95' : hasOpened ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <button onClick={handleClose} className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#1E3FAA] transition-colors" aria-label="Close">
          <X size={20} />
        </button>
        
        <div className="px-6 pt-10 pb-5 text-center">
          <div className="flex flex-col items-center gap-2 mb-6">
            <img src="/lovable-uploads/revwheel-logo.png" alt="RevWheel logo" className="h-12 w-auto" />
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? activeToggleClass : inactiveToggleClass}>
              {t('login')}
            </button>
            <button type="button" onClick={() => setMode('register')} className={mode === 'register' ? activeToggleClass : inactiveToggleClass}>
              {t('register')}
            </button>
          </div>
          
          <p className="text-sm text-[#8A94A6]">{t('wheelReadyText')}</p>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-[#1F2A44]">
                  {t('fullName')}
                </Label>
                <div className="relative">
                  <User className={iconClasses} />
                  <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClasses} required />
                </div>
              </div>}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[#1F2A44]">
                {t('emailAddress')}
              </Label>
              <div className="relative">
                <Mail className={iconClasses} />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses} required />
              </div>
            </div>

            {mode === 'register' && <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-[#1F2A44]">
                  {t('phoneNumber')}
                </Label>
                <div className="relative">
                  <Phone className={iconClasses} />
                  <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClasses} required />
                </div>
              </div>}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-[#1F2A44]">
                {t('passwordField')}
              </Label>
              <div className="relative">
                <Lock className={iconClasses} />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClasses} required />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <label htmlFor="remember" className="flex items-center gap-3 text-sm font-medium text-[#4B5674]">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked as boolean)} className="w-5 h-5 rounded-full border-2 border-[#CAD3E6] data-[state=checked]:bg-white data-[state=checked]:border-[#3D8BFF] data-[state=checked]:text-[#3D8BFF]" />
                {t('rememberMe')}
              </label>
              
              {mode === 'login' && <button type="button" className="text-sm font-semibold text-[#397BFF] hover:underline">
                  {t('forgotPassword')}
                </button>}
            </div>

            <button type="submit" className={ctaButtonClass} disabled={isLoading}>
              {isLoading ? mode === 'login' ? t('loggingIn') || 'Logging in...' : t('registering') || 'Registering...' : mode === 'login' ? t('login') : t('register')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8A94A6]">
            {mode === 'login' ? <>
                {t('noAccountYet')}{' '}
                <button type="button" onClick={() => setMode('register')} className="text-[#397BFF] font-semibold hover:underline">
                  {t('registerHere')}
                </button>
              </> : <>
                {t('alreadyHaveAccount')}{' '}
                <button type="button" onClick={() => setMode('login')} className="text-[#397BFF] font-semibold hover:underline">
                  {t('loginHere')}
                </button>
              </>}
          </div>
        </div>
      </div>
    </div>;
};