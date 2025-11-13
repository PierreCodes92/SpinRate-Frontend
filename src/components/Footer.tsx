
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/revwheel-logo.webp" alt="RevWheel logo" className="h-10 md:h-12 w-auto" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('footerDescription')}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('navigation')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-smooth">{t('home')}</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-smooth">{t('pricing')}</a></li>
              <li><a href="/blog" className="text-muted-foreground hover:text-primary transition-smooth">{t('blog')}</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-smooth">{t('contact')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-smooth">{t('proSpace')}</a></li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('getStarted')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('readyToBoost')}
            </p>
            <Button 
              variant="hero" 
              size="sm" 
              className="hover:bg-white hover:text-primary transition-smooth"
              onClick={() => window.location.href = '/contact'}
              id="contact"
            >
              {t('contactUs')}
            </Button>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 RevWheel. {t('allRightsReserved')}
            </div>
             <div className="flex space-x-6 text-sm">
               <a href="/terms" className="text-muted-foreground hover:text-primary transition-smooth">
                 {t('termsOfService')}
               </a>
               <a href="/privacy" className="text-muted-foreground hover:text-primary transition-smooth">
                 {t('privacyPolicy')}
               </a>
               <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                 {t('legalNotices')}
               </a>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
