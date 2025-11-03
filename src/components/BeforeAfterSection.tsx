import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollAnimation";
import { useNotificationContext } from "@/components/NotificationProvider";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useTranslation } from "@/components/TranslationProvider";

const BeforeAfterSection = () => {
  const { t, language } = useTranslation();
  const { ref: sectionRef, isVisible } = useScrollReveal(0.3);
  const { showTrialNotification } = useNotificationContext();
  const { openModal } = useAuthModal();

  const handleCTAClick = () => {
    showTrialNotification();
    openModal('register');
  };

  const benefits = [
    {
      title: t('googleReviewsEffortless'),
      subtitle: t('withoutEffort')
    },
    {
      title: t('collectClientContacts'),
      subtitle: t('emailsAndPhones')
    },
    {
      title: t('bringBackClients'),
      subtitle: t('thanksToWonPrizes')
    }
  ];
  return <section className="py-24 px-0 bg-gradient-to-br from-primary/5 to-primary/10 md:py-28">
      <div className="container mx-auto max-w-6xl" ref={sectionRef}>
        <div className={`text-center mb-16 transition-all duration-700 md:mb-20 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="lg:text-5xl font-bold text-foreground mb-6 px-[3px] mx-px my-[6px] py-[6px] text-4xl md:text-[46px] md:leading-[52px]">
            {t('in7DaysWith')}<br className="lg:hidden" /> <span className="text-primary">RevWheel</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center md:gap-16">
          {/* Left Content - Image */}
          <div className={`relative transition-all duration-700 delay-200 md:px-4 lg:-mt-20 ${
            isVisible ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="relative z-10 shadow-card rounded-2xl overflow-hidden hover-lift">
              {/* Image pour desktop */}
              <img 
                src={language === 'en' ? '/lovable-uploads/avant-apres-en.png' : '/lovable-uploads/avant-apres-fr.png'} 
                alt="Avant/Après - Résultats RevWheel" 
                className="w-full h-auto hidden lg:block scale-105" 
              />
              {/* Image pour mobile et tablet */}
              <img 
                src={(language?.toLowerCase?.().startsWith('en')) ? '/lovable-uploads/mobile-avant-apres-en-new.png' : '/lovable-uploads/mobile-avant-apres-fr.png'} 
                alt="Avant/Après - Résultats RevWheel" 
                className="w-full h-auto lg:hidden" 
              />
            </div>
            
            {/* Floating decorations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 gradient-hero rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 gradient-primary rounded-full opacity-15 blur-2xl"></div>
          </div>

          {/* Right Content - Benefits */}
          <div className={`space-y-8 transition-all duration-700 delay-400 md:px-8 md:space-y-10 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="grid gap-6 md:gap-8">
              {benefits.map((benefit, index) => 
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-soft px-[18px] py-[9px] hover-lift transition-all duration-300 delay-${600 + index * 100} md:p-6 md:space-x-5 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full gradient-hero flex items-center justify-center mt-1 py-0 px-0 my-[3px] md:w-7 md:h-7">
                    <Check className="w-3 h-3 text-white md:w-4 md:h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground md:text-xl">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 md:text-base">
                      {benefit.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              variant="hero" 
              size="xl" 
              className={`text-base rounded-full py-0 my-[27px] px-[18px] hover-glow md:text-lg md:py-2 md:my-8 md:px-8 md:mx-auto md:block ${language === 'en' ? 'mx-auto block' : 'mx-[43px]'}`}
              onClick={handleCTAClick}
            >
              {t('startNow')}
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default BeforeAfterSection;