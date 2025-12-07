import { useLanguage } from '@/contexts/LanguageContext';
import frFlagSm from '@/assets/france-sm.webp';
import frFlagMd from '@/assets/france-md.webp';
import ukFlagSm from '@/assets/uk-sm.webp';
import ukFlagMd from '@/assets/uk-md.webp';

interface LanguageToggleProps {
  isScrolled?: boolean;
}

export const LanguageToggle = ({ isScrolled }: LanguageToggleProps = {}) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const flagSm = language === 'fr' ? ukFlagSm : frFlagSm;
  const flagMd = language === 'fr' ? ukFlagMd : frFlagMd;

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity"
      aria-label={`Switch to ${language === 'fr' ? 'English' : 'French'}`}
    >
      <img
        src={flagSm}
        srcSet={`${flagSm} 1x, ${flagMd} 2x`}
        alt={language === 'fr' ? 'Switch to English' : 'Passer en français'}
        className="w-8 h-8 rounded-md object-cover"
        width={32}
        height={32}
        loading="eager"
        decoding="async"
      />
    </button>
  );
};
