import { useLanguage } from '@/contexts/LanguageContext';
import frFlag from '@/assets/france.webp';
import ukFlag from '@/assets/uk.webp';

interface LanguageToggleProps {
  isScrolled?: boolean;
}

export const LanguageToggle = ({ isScrolled }: LanguageToggleProps = {}) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity"
      aria-label={`Switch to ${language === 'fr' ? 'English' : 'French'}`}
    >
      <img
        src={language === 'fr' ? ukFlag : frFlag}
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
