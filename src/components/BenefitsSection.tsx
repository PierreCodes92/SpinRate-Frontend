import { Button } from "@/components/ui/button";
import { useScrollReveal, useAnimatedCounter } from "@/hooks/useScrollAnimation";
import { useNotificationContext } from "@/components/NotificationProvider";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useTranslation } from "@/components/TranslationProvider";
import { useEffect } from "react";

const BenefitsSection = () => {
  const { t, language } = useTranslation();
  const { ref: sectionRef, isVisible } = useScrollReveal(0.3);
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal(0.5);
  const { showTrialNotification } = useNotificationContext();
  const { openModal } = useAuthModal();

  const handleCTAClick = () => {
    showTrialNotification();
    openModal('register');
  };

  const { count: count209, startAnimation: start209, isAnimating: isAnimating209 } = useAnimatedCounter(209, 2000, 187);
  const { count: count38, startAnimation: start38, isAnimating: isAnimating38 } = useAnimatedCounter(38, 2500, 30);
  
  useEffect(() => {
    if (statsVisible && !isAnimating209 && count209 === 187) {
      start209();
    }
  }, [statsVisible, start209, isAnimating209, count209]);

  useEffect(() => {
    if (statsVisible && !isAnimating38 && count38 === 30) {
      start38();
    }
  }, [statsVisible, start38, isAnimating38, count38]);
  return <section className="py-24 px-0 bg-white/30 backdrop-blur-sm md:py-28">
      <div className="container mx-auto max-w-6xl" ref={sectionRef}>
        <div className={`text-center mb-16 transition-all duration-700 md:mb-20 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="lg:text-5xl text-foreground mb-8 text-center font-bold text-4xl md:text-[46px] md:leading-[52px]">
            {t('retainClientsSimply')}{" "}
            <span className="text-primary text-4xl lg:text-5xl md:text-[46px]">{t('simply')}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center md:gap-16">
          {/* Left Content - Animated Image */}
          <div className={`relative transition-all duration-700 delay-200 md:px-8 ${
            isVisible ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
             <div className="relative z-10 shadow-card rounded-2xl overflow-hidden">
                <img 
                  src={language === 'en' ? '/lovable-uploads/etsi-en.webp' : '/lovable-uploads/etsi-fr.webp'} 
                  alt="Résultats clients RevWheel" 
                  className="w-full h-auto object-contain rounded-2xl" 
                  loading="lazy" 
                  style={{
                    imageRendering: 'crisp-edges',
                    maxHeight: 'none',
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto'
                  }} 
                />
              
              {/* Floating animation overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-smooth"></div>
            </div>
            
            {/* Animated decorations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 gradient-hero rounded-full opacity-[0.21] blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 gradient-primary rounded-full opacity-[0.16] blur-2xl animate-pulse delay-1000"></div>
          </div>

          {/* Right Content - Metrics */}
          <div className={`space-y-12 transition-all duration-700 delay-400 md:px-8 md:space-y-16 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="grid grid-cols-2 gap-8 md:gap-10" ref={statsRef}>
              {[
                {
                  number: statsVisible ? count209 : "209",
                  label: t('reviewsPerMonth'),
                  color: "text-primary"
                },
                {
                  number: statsVisible ? `+${count38}%` : "+38%",
                  label: t('gainOnRating'),
                  color: "text-green-500"
                },
                {
                  number: "100%",
                  label: t('satisfied'),
                  color: "text-primary"
                },
                {
                  number: "0€",
                  label: t('with7DaysFree'),
                  color: "text-green-500"
                }
              ].map((stat, index) =>
                <div 
                  key={index} 
                  className={`text-center space-y-2 group p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-primary/10 relative hover-lift transition-all duration-300 delay-${600 + index * 100} md:p-8 ${
                    statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  {/* Néon effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/[0.08] to-primary/[0.15] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.18)] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  <div className={`text-3xl sm:text-4xl font-bold ${stat.color} group-hover:scale-110 transition-smooth relative z-10 text-center md:text-5xl`}>
                    {stat.number}
                  </div>
                  <div className="text-base sm:text-sm text-muted-foreground font-medium relative z-10 md:text-base">
                    {stat.label}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center lg:text-left">
              <Button 
                variant="hero" 
                size="xl" 
                className="py-2 text-base rounded-full px-[26px] hover-glow md:text-lg md:py-3 md:px-8"
                onClick={handleCTAClick}
              >
                {t('startHere')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BenefitsSection;