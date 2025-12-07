
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollAnimation";
import { useNotificationContext } from "@/components/NotificationProvider";
import { useTranslation } from '@/components/TranslationProvider';
import { LanguageToggle } from "@/components/LanguageToggle";
import { AuthModal } from "@/components/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import pricingIcon from "@/assets/pricing-icon.webp";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  
  const scrollY = useScrollPosition();
  const { showTrialNotification } = useNotificationContext();
  const { t } = useTranslation();
  const { isOpen: isAuthModalOpen, mode: authModalMode, openModal, closeModal } = useAuthModal();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const isScrolled = scrollY > 50;
  const isAuthenticated = !!user;

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsMobileMenuOpen(true);
      setIsOpening(true);
      // Remove opening state after animation duration
      setTimeout(() => {
        setIsOpening(false);
      }, 50);
    }
  };

  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      showTrialNotification();
      openModal('register');
    }
  };

  const handleProSpaceClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openModal('login');
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'border-b border-border bg-background/98 backdrop-blur-md shadow-soft' 
          : 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      }`}>
        <div className="container mx-auto flex items-center justify-between px-4 lg:px-6 h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 lg:ml-6">
            <a href="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/revwheel-logo.webp" 
                alt="RevWheel logo" 
                className="h-12 w-auto" 
                width={120} 
                height={48} 
                loading="eager"
                fetchPriority="high"
              />
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-foreground/80 hover:text-foreground transition-smooth font-medium">
              {t('home')}
            </a>
            <a href="/#pricing" className="text-foreground/80 hover:text-foreground transition-smooth font-medium">
              {t('pricing')}
            </a>
            <button
              onClick={handleProSpaceClick}
              className="text-foreground/80 hover:text-foreground transition-smooth font-medium"
            >
              {t('proSpace')}
            </button>
            <a href="/contact" className="text-foreground/80 hover:text-foreground transition-smooth font-medium">
              {t('contact')}
            </a>
            <a href="/blog" className="text-foreground/80 hover:text-foreground transition-smooth font-medium">
              {t('blog')}
            </a>
          </nav>

          {/* Language Toggle & CTA Button */}
          <div className="hidden lg:flex items-center space-x-3 lg:mr-10">
            <LanguageToggle />
            
            <div className="button-container">
              <span className="halo" style={{ animationDelay: '0s' }}></span>
              <span className="halo" style={{ animationDelay: '0.35s' }}></span>
              <span className="halo" style={{ animationDelay: '0.7s' }}></span>
              <Button 
                variant="nav-cta" 
                className="btn"
                onClick={handleCTAClick}
              >
                {t('startFreeTrial')}
              </Button>
            </div>
          </div>

          {/* Mobile & Tablet: Language Toggle & Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageToggle />
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? t('closeMenu') || 'Close menu' : t('openMenu') || 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
              isClosing ? 'opacity-0' : isOpening ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={toggleMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className={`fixed top-20 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-lg transition-all duration-300 ${
            isClosing ? 'opacity-0 -translate-y-4' : isOpening ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <nav className="container mx-auto px-6 py-8">
              <div className="flex flex-col space-y-6">
                <a 
                  href="/" 
                  className="text-foreground/80 hover:text-foreground transition-smooth font-medium text-lg py-2 flex items-center space-x-3"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span>{t('home')}</span>
                </a>
                <a 
                  href="/#pricing" 
                  className="text-foreground/80 hover:text-foreground transition-smooth font-medium text-lg py-2 flex items-center space-x-3"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src={pricingIcon} alt="Pricing" className="w-5 h-5" />
                  </div>
                  <span>{t('pricing')}</span>
                </a>
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    handleProSpaceClick();
                  }}
                  className="text-foreground/80 hover:text-foreground transition-smooth font-medium text-lg py-2 text-left flex items-center space-x-3"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src="/lovable-uploads/database-icon.webp" alt="Pro Space" className="w-5 h-5" />
                  </div>
                  <span>{t('proSpace')}</span>
                </button>
                <a 
                  href="/contact" 
                  className="text-foreground/80 hover:text-foreground transition-smooth font-medium text-lg py-2 flex items-center space-x-3"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>{t('contact')}</span>
                </a>
                <a 
                  href="/blog" 
                  className="text-foreground/80 hover:text-foreground transition-smooth font-medium text-lg py-2 flex items-center space-x-3"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </div>
                  <span>{t('blog')}</span>
                </a>
                
                {/* Mobile CTA Button */}
                <div className="pt-4">
                  <div className="button-container w-full">
                    <span className="halo" style={{ animationDelay: '0s' }}></span>
                    <span className="halo" style={{ animationDelay: '0.35s' }}></span>
                    <span className="halo" style={{ animationDelay: '0.7s' }}></span>
                    <Button 
                      variant="nav-cta" 
                      className="w-full btn"
                      onClick={() => {
                        toggleMobileMenu();
                        handleCTAClick();
                      }}
                    >
                      {t('startFreeTrial')}
                    </Button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeModal}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;
