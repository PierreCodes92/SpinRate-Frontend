import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding, OnboardingStep } from '@/contexts/OnboardingContext';
import { OnboardingTooltip } from './OnboardingTooltip';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Hook to detect mobile (simple version)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

interface StepConfig {
  targetSelector: string;
  title: string;
  message: string;
  mobileMessage?: string;
  actionText: string;
  arrowDirection: 'top' | 'bottom' | 'left' | 'right';
  requireRoute?: string;
  waitForElement?: boolean;
}

// Step configs are now generated dynamically using translations
export const OnboardingOverlay = () => {
  const {
    currentStep,
    isActive,
    nextStep,
    skipOnboarding,
    completeOnboarding,
    startOnboarding
  } = useOnboarding();
  const { t } = useLanguage();
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0
  });
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Generate step configs dynamically with translations
  const stepConfigs: Record<OnboardingStep, StepConfig | null> = {
    welcome: null,
    analytics: {
      targetSelector: '[data-onboarding="analytics"]',
      title: t('onboarding.analytics.title'),
      message: t('onboarding.analytics.message'),
      actionText: t('onboarding.analytics.action'),
      arrowDirection: 'bottom',
      requireRoute: '/dashboard'
    },
    'analytics-dashboard': {
      targetSelector: '[data-onboarding="analytics-metrics"]',
      title: t('onboarding.analyticsDashboard.title'),
      message: t('onboarding.analyticsDashboard.message'),
      actionText: t('onboarding.analyticsDashboard.action'),
      arrowDirection: 'bottom',
      requireRoute: '/dashboard',
      waitForElement: true
    },
    clients: {
      targetSelector: '[data-onboarding="clients"]',
      title: t('onboarding.clients.title'),
      message: t('onboarding.clients.message'),
      actionText: t('onboarding.clients.action'),
      arrowDirection: 'bottom',
      requireRoute: '/dashboard/customers'
    },
    'clients-popup-1': {
      targetSelector: '[data-onboarding="monthly-reviews"]',
      title: t('onboarding.clientsPopup.title'),
      message: t('onboarding.clientsPopup.message'),
      actionText: t('onboarding.clientsPopup.action'),
      arrowDirection: 'bottom',
      requireRoute: '/dashboard/customers',
      waitForElement: true
    },
    'clients-open-menu': {
      targetSelector: '[data-onboarding="client-actions-cell"]',
      title: t('onboarding.clientsMenu.title'),
      message: t('onboarding.clientsMenu.message'),
      mobileMessage: t('onboarding.clientsMenu.messageMobile'),
      actionText: t('onboarding.clientsMenu.action'),
      arrowDirection: 'right',
      requireRoute: '/dashboard/customers',
      waitForElement: true
    },
    settings: {
      targetSelector: '[data-onboarding="settings"]',
      title: t('onboarding.settings.title'),
      message: t('onboarding.settings.message'),
      actionText: t('onboarding.settings.action'),
      arrowDirection: 'bottom',
      requireRoute: '/dashboard/settings'
    },
    subscription: {
      targetSelector: '[data-onboarding="subscription"]',
      title: t('onboarding.subscription.title'),
      message: t('onboarding.subscription.message'),
      actionText: t('onboarding.subscription.action'),
      arrowDirection: 'bottom',
      requireRoute: '/dashboard/subscription'
    },
    complete: null
  };
  
  const currentConfig = stepConfigs[currentStep];

  // Réinitialiser les états locaux quand l'onboarding démarre
  useEffect(() => {
    if (isActive && currentStep === 'welcome') {
      setIsExiting(false);
      setHasOpened(false);
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    if (!isActive || !currentConfig) return;

    const updatePosition = () => {
      console.log('=== ONBOARDING DEBUG ===');
      console.log('Step:', currentStep);
      console.log('isMobile:', isMobile);
      console.log('window.innerWidth:', window.innerWidth);
      
      // Sur mobile, pour l'étape clients-open-menu, on utilise la position de l'élément clients
      const targetSelector = (currentStep === 'clients-open-menu' && isMobile) 
        ? '[data-onboarding="clients"]' 
        : currentConfig.targetSelector;
      
      const element = document.querySelector(targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setSpotlightRect(rect);

        // Calculer la position de base du tooltip selon la direction de la flèche
        let calculatedX = rect.left + rect.width / 2;
        let calculatedY = rect.bottom + 20;
        
        if (currentConfig.arrowDirection === 'top') {
          calculatedY = rect.top - 20;
        } else if (currentConfig.arrowDirection === 'left') {
          calculatedX = rect.left - 20;
          calculatedY = rect.top + rect.height / 2;
        } else if (currentConfig.arrowDirection === 'right') {
          if (currentStep === 'clients-open-menu') {
            if (isMobile) {
              calculatedX = rect.left - 660;
              calculatedY = rect.top - 204;
            } else {
              calculatedX = rect.left - 799;
              calculatedY = rect.top - 202;
            }
          } else {
            calculatedX = rect.right + 20;
            calculatedY = rect.top + rect.height / 2;
          }
        } else if (currentConfig.arrowDirection === 'bottom') {
          if (currentStep === 'analytics-dashboard') {
            calculatedX = rect.left + rect.width / 2 - 220;
          }
        }
        
        // Position de base sans offset (l'offset sera appliqué en CSS dans le Tooltip)
        setTooltipPosition({
          x: calculatedX,
          y: calculatedY
        });
      }
    };

    // Attendre que l'élément soit disponible
    const checkElement = () => {
      const element = document.querySelector(currentConfig.targetSelector);
      if (element) {
        updatePosition();
      } else if (currentConfig.waitForElement) {
        setTimeout(checkElement, 100);
      }
    };

    checkElement();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isActive, currentConfig, isMobile]);

  // Naviguer vers la bonne route si nécessaire
  useEffect(() => {
    if (!isActive || !currentConfig?.requireRoute) return;

    if (location.pathname !== currentConfig.requireRoute) {
      navigate(currentConfig.requireRoute);
    }
  }, [currentStep, isActive, currentConfig, location.pathname, navigate]);

  const isComplete = currentStep === 'complete';

  useEffect(() => {
    if (isComplete) {
      setHasOpened(true);
    }
  }, [isComplete]);

  const handleElementClick = () => {
    if (currentConfig) {
      nextStep();
    }
  };

  // Ajouter un écouteur de clic sur l'élément ciblé
  useEffect(() => {
    if (!isActive || !currentConfig) return;
    
    // Désactiver le clic sur l'encadré pour 'clients-open-menu' sur PC
    if (currentStep === 'clients-open-menu' && !isMobile) return;
    
    const element = document.querySelector(currentConfig.targetSelector);
    if (element) {
      element.addEventListener('click', handleElementClick);
      return () => {
        element.removeEventListener('click', handleElementClick);
      };
    }
  }, [currentStep, isActive, currentConfig, isMobile]);

  if (!isActive) return null;

  // Écran de bienvenue
  if (currentStep === 'welcome') {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="bg-card rounded-2xl shadow-2xl p-8 max-w-lg border-2 border-primary/20 py-[31px] px-[20px] mx-[12px]"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
              {t('onboarding.welcome.title')} <span className="text-2xl md:text-3xl">👋</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-lg mb-6 leading-relaxed">
              {t('onboarding.welcome.subtitle')}
            </p>
            <div className="flex gap-3">
              <Button onClick={skipOnboarding} variant="outline" className="flex-1">
                {t('onboarding.welcome.skip')}
              </Button>
              <div className="flex-1 relative">
                <div className="halo" style={{ animationDelay: '0s' }}></div>
                <div className="halo" style={{ animationDelay: '0.35s' }}></div>
                <div className="halo" style={{ animationDelay: '0.7s' }}></div>
                <Button onClick={nextStep} className="w-full bg-primary hover:bg-primary/90 relative z-10">
                  {t('onboarding.welcome.start')}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6 whitespace-pre-line" style={{ fontSize: '0.7425rem' }}>
              💡 {isMobile ? t('onboarding.welcome.footerMobile') : t('onboarding.welcome.footer')}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Écran de fin
  const handleCompleteClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      completeOnboarding();
    }, 300);
  };

  if (isComplete) {
    return (
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className={`bg-card rounded-2xl shadow-2xl p-8 max-w-lg mx-4 border-2 border-primary/20 relative transform transition-all duration-150 ease-out ${
              hasOpened && !isExiting ? 'translate-y-0 opacity-100 scale-100' : isExiting ? 'translate-y-8 opacity-0 scale-95' : '-translate-y-8 opacity-0 scale-95'
            }`}>
              <button
                onClick={handleCompleteClose}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  {t('onboarding.complete.title')}
                </h2>
                {isMobile ? (
                  <div className="text-foreground/70 text-sm mb-4 space-y-[13px]">
                    <p>{t('onboarding.complete.subtitleMobile1')}</p>
                    <p>{t('onboarding.complete.subtitleMobile2')}</p>
                    <p>{t('onboarding.complete.subtitleMobile3')}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-foreground/70 text-sm md:text-lg mb-4 leading-relaxed">
                      {t('onboarding.complete.subtitleDesktop')}
                    </p>
                    <p className="text-foreground font-semibold text-base mb-3">
                      {t('onboarding.complete.explore')}
                    </p>
                    <div className="text-muted-foreground text-sm space-y-2 mb-6 text-left">
                      <p>{t('onboarding.complete.exploreAnalytics')}</p>
                      <p>{t('onboarding.complete.exploreClients')}</p>
                      <p>{t('onboarding.complete.exploreSettings')}</p>
                      <p>{t('onboarding.complete.exploreSubscription')}</p>
                    </div>
                  </>
                )}
                <p className="text-foreground font-semibold text-lg mb-4">{t('onboarding.complete.cta')}</p>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="halo" style={{ animationDelay: '0s' }}></div>
                    <div className="halo" style={{ animationDelay: '0.35s' }}></div>
                    <div className="halo" style={{ animationDelay: '0.7s' }}></div>
                    <Button
                      onClick={() => {
                        setIsExiting(true);
                        setTimeout(() => {
                          completeOnboarding();
                          navigate('/dashboard/settings');
                        }, 150);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 rounded-full relative z-10"
                    >
                      {t('onboarding.complete.start')}
                    </Button>
                  </div>
                  <Button onClick={startOnboarding} variant="outline" className="w-full rounded-full">
                    {t('onboarding.complete.rewatch')}
                  </Button>
                  {isMobile && (
                    <p className="text-xs text-muted-foreground mt-3 italic">
                      {t('onboarding.complete.mobileNote')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Autres étapes avec overlay et spotlight
  return (
    <AnimatePresence>
      {currentConfig && (
        <>
          {/* Overlay sombre avec spotlight - moins intense */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[10000]"
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              pointerEvents: 'none'
            }}
          />

          {/* Highlight box around target */}
          {spotlightRect && (
            <>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="fixed z-[10000] border-4 border-primary rounded-lg pointer-events-none shadow-lg shadow-primary/50"
                style={{
                  left: spotlightRect.left - 8,
                  top: spotlightRect.top - 8,
                  width: spotlightRect.width + 16,
                  height: spotlightRect.height + 16
                }}
              />
              
              {/* Flèche animée pointant vers les 3 petits points - pour clients-open-menu */}
              {currentStep === 'clients-open-menu' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="fixed z-[10001] pointer-events-none"
                  style={{
                    left: spotlightRect.left - 60,
                    top: spotlightRect.top + spotlightRect.height / 2 - 24
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary drop-shadow-lg"
                    />
                  </svg>
                </motion.div>
              )}
            </>
          )}

          {/* Tooltip */}
          <div className="pointer-events-auto">
            <OnboardingTooltip 
              step={currentStep} 
              position={tooltipPosition} 
              title={currentConfig.title} 
              message={isMobile && currentConfig.mobileMessage ? currentConfig.mobileMessage : currentConfig.message} 
              actionText={currentConfig.actionText} 
              onNext={nextStep} 
              onSkip={skipOnboarding} 
              arrowDirection={currentStep === 'clients-open-menu' && isMobile ? 'bottom' : currentConfig.arrowDirection} 
              isMobile={isMobile}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

