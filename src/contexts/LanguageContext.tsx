import React, { createContext, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from '../data/translations';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive language from URL path
  const language: Language = useMemo(() => {
    return location.pathname.startsWith('/en') ? 'en' : 'fr';
  }, [location.pathname]);

  const setLanguage = (lang: Language) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;
    const currentHash = location.hash;
    
    let newPath: string;
    
    if (lang === 'en') {
      // Switch to English - add /en prefix
      if (currentPath.startsWith('/en')) {
        // Already on English path
        return;
      }
      newPath = `/en${currentPath === '/' ? '' : currentPath}`;
    } else {
      // Switch to French - remove /en prefix
      if (!currentPath.startsWith('/en')) {
        // Already on French path
        return;
      }
      newPath = currentPath.replace(/^\/en/, '') || '/';
    }
    
    navigate(`${newPath}${currentSearch}${currentHash}`);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, location.pathname]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
