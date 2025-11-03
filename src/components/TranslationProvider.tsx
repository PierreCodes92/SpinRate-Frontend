import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type TranslationContextType = {
  language: 'fr' | 'en';
  t: (key: string) => string;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  // Use LanguageContext instead of separate hook
  const { language, t } = useLanguage();

  // Memoize the value to ensure React detects changes properly
  const value = useMemo(() => ({
    language,
    t
  }), [language, t]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};