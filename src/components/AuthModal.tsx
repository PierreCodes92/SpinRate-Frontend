import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose} />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-500 ease-out ${isClosing ? 'opacity-0 scale-95' : hasOpened ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* Header with logo */}
        <div className="relative bg-gradient-primary p-4 md:p-6 text-center py-[11px]">
          <button onClick={handleClose} className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-600 hover:text-gray-800 transition-colors p-1" aria-label="Close">
            <X size={20} />
          </button>
          
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center">
              <img src="/lovable-uploads/revwheel-logo.png" alt="RevWheel logo" className="w-32 md:w-48 h-auto" />
            </div>
          </div>
          
          <div className="flex bg-white/30 rounded-full p-1.5 max-w-xs mx-auto border border-white/20 gap-2">
            <button type="button" onClick={() => setMode('login')} className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${mode === 'login' ? 'bg-primary text-white shadow-lg font-semibold' : 'text-primary bg-white/90 hover:bg-primary hover:text-white border border-white/30 hover:shadow-md'}`}>
              {t('login')}
            </button>
            <button type="button" onClick={() => setMode('register')} className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${mode === 'register' ? 'bg-primary text-white shadow-lg font-semibold' : 'text-primary bg-white/90 hover:bg-primary hover:text-white border border-white/30 hover:shadow-md'}`}>
              {t('register')}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 md:p-6">
          {mode === 'register' && <div className="text-center mb-3 md:mb-4">
              <p className="text-xs md:text-sm text-muted-foreground">
                {t('wheelReadyText')}
              </p>
            </div>}

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {mode === 'register' && <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="fullName" className="text-xs md:text-sm font-medium">
                  {t('fullName')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="h-10 md:h-12 pl-10 text-base" required />
                </div>
              </div>}

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="email" className="text-xs md:text-sm font-medium">
                {t('emailAddress')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-10 md:h-12 pl-10 text-base" required />
              </div>
            </div>

            {mode === 'register' && <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="phone" className="text-xs md:text-sm font-medium">
                  {t('phoneNumber')}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="h-10 md:h-12 pl-10 text-base" required />
                </div>
              </div>}

            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="password" className="text-xs md:text-sm font-medium">
                {t('passwordField')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-10 md:h-12 pl-10 text-base" required />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked as boolean)} />
                <Label htmlFor="remember" className="text-sm text-muted-foreground">
                  {t('rememberMe')}
                </Label>
              </div>
              
              {mode === 'login' && <button type="button" className="hidden md:block text-sm text-primary hover:underline">
                  {t('forgotPassword')}
                </button>}
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 md:h-12 font-semibold text-sm md:text-base" 
              variant="cta"
              disabled={isLoading}
            >
              {isLoading ? (mode === 'login' ? t('loggingIn') || 'Logging in...' : t('registering') || 'Registering...') : (mode === 'login' ? t('login') : t('register'))}
            </Button>

            {/* Mobile forgot password - shown below login button */}
            {mode === 'login' && <div className="text-center md:hidden">
                <button type="button" className="text-xs text-primary hover:underline">
                  {t('forgotPassword')}
                </button>
              </div>}
          </form>

          {/* Switch mode - Hidden on mobile */}
          <div className="mt-4 md:mt-6 text-center text-sm text-muted-foreground hidden md:block">
            {mode === 'login' ? <>
                {t('noAccountYet')}{' '}
                <button onClick={() => setMode('register')} className="text-primary hover:underline font-medium">
                  {t('registerHere')}
                </button>
              </> : <>
                {t('alreadyHaveAccount')}{' '}
                <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                  {t('loginHere')}
                </button>
              </>}
          </div>
        </div>
      </div>
    </div>;
};