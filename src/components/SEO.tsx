import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

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
  
  const baseUrl = 'https://revwheel.com';
  
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
  
  // Canonical URL
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
  
  // Alternate URLs for hreflang
  const frUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const enUrl = canonical ? `${baseUrl}${canonical}?lang=en` : `${baseUrl}?lang=en`;

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
      
      {/* Hreflang */}
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

