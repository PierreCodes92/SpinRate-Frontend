import { useLocation } from 'react-router-dom';

/**
 * Hook to get the current language from the URL path
 * Returns 'en' if path starts with /en, otherwise 'fr'
 */
export const useCurrentLanguage = (): 'fr' | 'en' => {
  const location = useLocation();
  return location.pathname.startsWith('/en') ? 'en' : 'fr';
};

/**
 * Hook to get the language prefix for building URLs
 * Returns '/en' for English, '' for French (default)
 */
export const useLanguagePrefix = (): string => {
  const language = useCurrentLanguage();
  return language === 'en' ? '/en' : '';
};

/**
 * Hook to create localized paths
 * Automatically prepends /en for English routes
 */
export const useLocalizedPath = () => {
  const prefix = useLanguagePrefix();
  
  /**
   * Creates a localized path
   * @param path - The path without language prefix (e.g., '/contact', '/blog')
   * @returns The localized path (e.g., '/en/contact' for English, '/contact' for French)
   */
  const localizedPath = (path: string): string => {
    // Handle root path
    if (path === '/' || path === '') {
      return prefix || '/';
    }
    
    // Handle hash links (e.g., /#pricing)
    if (path.startsWith('/#')) {
      return `${prefix || '/'}${path.slice(1)}`;
    }
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${prefix}${normalizedPath}`;
  };

  /**
   * Gets the path to switch to the other language
   * @param currentPath - The current full path including language prefix
   * @returns The equivalent path in the other language
   */
  const getOtherLanguagePath = (currentPath: string): string => {
    const language = currentPath.startsWith('/en') ? 'en' : 'fr';
    
    if (language === 'en') {
      // Switch to French - remove /en prefix
      const pathWithoutLang = currentPath.replace(/^\/en/, '') || '/';
      return pathWithoutLang;
    } else {
      // Switch to English - add /en prefix
      return `/en${currentPath === '/' ? '' : currentPath}`;
    }
  };

  return { localizedPath, getOtherLanguagePath };
};

/**
 * Utility function to strip language prefix from a path
 */
export const stripLanguagePrefix = (path: string): string => {
  if (path.startsWith('/en/')) {
    return path.slice(3);
  }
  if (path === '/en') {
    return '/';
  }
  return path;
};

