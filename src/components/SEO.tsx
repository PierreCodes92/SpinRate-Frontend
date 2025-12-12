import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { stripLanguagePrefix } from '@/hooks/useLocalizedPath';

interface SEOProps {
  title?: string;
  titleFr?: string;
  titleEn?: string;
  description?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  noindex?: boolean;
}

const SEO = ({
  title,
  titleFr,
  titleEn,
  description,
  descriptionFr,
  descriptionEn,
  canonical,
  type = 'website',
  image = '/lovable-uploads/logo-optimized.webp',
  noindex = false,
}: SEOProps) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  const baseUrl = 'https://revwheel.fr';
  
  // Determine the correct title based on language
  const pageTitle = title || (language === 'fr' ? titleFr : titleEn) || 'RevWheel';
  const fullTitle = pageTitle.includes('RevWheel') ? pageTitle : `${pageTitle} | RevWheel`;
  
  // Determine the correct description based on language
  const pageDescription = description || (language === 'fr' ? descriptionFr : descriptionEn) || 
    (language === 'fr' 
      ? 'La meilleure solution pour avoir des avis positifs sur Google de la part de tous vos clients.'
      : 'The best solution to get positive Google reviews from all your customers.');
  
  // Full image URL
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  // Get the path without language prefix for building canonical/hreflang URLs
  const pathWithoutLang = canonical || stripLanguagePrefix(location.pathname);
  const normalizedPath = pathWithoutLang === '/' ? '' : pathWithoutLang;
  
  // Canonical URL based on current language
  const canonicalUrl = language === 'en' 
    ? `${baseUrl}/en${normalizedPath}`
    : `${baseUrl}${normalizedPath || '/'}`;
  
  // Alternate URLs for hreflang - French is default (no prefix), English uses /en
  const frUrl = `${baseUrl}${normalizedPath || '/'}`;
  const enUrl = `${baseUrl}/en${normalizedPath}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={pageDescription} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Language */}
      <html lang={language} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang - French default, English at /en */}
      <link rel="alternate" hreflang="fr" href={frUrl} />
      <link rel="alternate" hreflang="en" href={enUrl} />
      <link rel="alternate" hreflang="x-default" href={frUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content="RevWheel" />
      <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'fr' ? 'en_US' : 'fr_FR'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={pageTitle} />
    </Helmet>
  );
};

export default SEO;
