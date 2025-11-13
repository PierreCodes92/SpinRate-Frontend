import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';

export type OnboardingStep = 
  | 'welcome'
  | 'analytics'
  | 'analytics-dashboard'
  | 'clients'
  | 'clients-popup-1'
  | 'clients-open-menu'
  | 'settings'
  | 'subscription'
  | 'complete';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  isActive: boolean;
  startOnboarding: () => void;
  nextStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  checkAndStartTutorial: (userId: string) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

const stepSequence: OnboardingStep[] = [
  'welcome',
  'analytics',
  'analytics-dashboard',
  'clients',
  'clients-popup-1',
  'clients-open-menu',
  'settings',
  'subscription',
  'complete'
];

const mobileStepSequence: OnboardingStep[] = [
  'welcome',
  'analytics',
  'clients',
  'clients-open-menu',
  'settings',
  'subscription',
  'complete'
];

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user should see tutorial based on backend count
  const checkAndStartTutorial = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/getTutorialCount/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch tutorial count');
        return;
      }

      const data = await response.json();
      
      if (data.success && data.tutorialShown === 0) {
        // Start tutorial for first-time users
        startOnboarding();
        
        // Increment the tutorial count
        try {
          await fetch(`${API_BASE_URL}/user/showTutorial/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to increment tutorial count:', error);
        }
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    }
  };

  const startOnboarding = () => {
    setCurrentStep('welcome');
    setIsActive(true);
  };

  const nextStep = () => {
    const sequence = isMobile ? mobileStepSequence : stepSequence;
    const currentIndex = sequence.indexOf(currentStep);
    if (currentIndex < sequence.length - 1) {
      setCurrentStep(sequence[currentIndex + 1]);
    }
  };

  const skipOnboarding = () => {
    setIsActive(false);
    localStorage.setItem('revwheel_onboarding_complete', 'true');
  };

  const completeOnboarding = () => {
    setIsActive(false);
    localStorage.setItem('revwheel_onboarding_complete', 'true');
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        isActive,
        startOnboarding,
        nextStep,
        skipOnboarding,
        completeOnboarding,
        checkAndStartTutorial,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

