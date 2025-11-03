import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { useScrollReveal, useAnimatedCounter } from "@/hooks/useScrollAnimation";
import { useNotificationContext } from "@/components/NotificationProvider";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useTranslation } from "@/components/TranslationProvider";
import { useEffect } from "react";

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { ref: pricingRef, isVisible } = useScrollReveal(0.3);
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal(0.5);
  const { showTrialNotification } = useNotificationContext();
  const { openModal } = useAuthModal();
  const { t } = useTranslation();

  const handleCTAClick = () => {
    showTrialNotification();
    openModal('register');
  };

  const { count: count250, startAnimation: start250, isAnimating: isAnimating250 } = useAnimatedCounter(250, 2000, 200);
  const { count: count20k, startAnimation: start20k, isAnimating: isAnimating20k } = useAnimatedCounter(20, 2500, 15);

  useEffect(() => {
    if (statsVisible && !isAnimating250 && count250 === 200) {
      start250();
    }
  }, [statsVisible, start250, isAnimating250, count250]);

  useEffect(() => {
    if (statsVisible && !isAnimating20k && count20k === 15) {
      start20k();
    }
  }, [statsVisible, start20k, isAnimating20k, count20k]);
  
  const features = [
    t('setupIn5Minutes'), 
    t('boostGoogleReviews'), 
    t('customWheel'), 
    t('customPosterQR'), 
    t('performanceTracking'), 
    t('dataExtraction'), 
    t('customerSupport247'), 
    t('noCommitmentFee'), 
    t('noSetupFee'), 
    t('noTerminationFee')
  ];
  return <section id="pricing" className="py-24 px-0 md:py-28">
      <div className="container mx-auto max-w-4xl" ref={pricingRef}>
        <div className={`text-center mb-16 transition-all duration-700 md:mb-20 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="lg:text-5xl font-bold text-foreground mb-4 text-4xl md:text-[46px] md:leading-[52px] md:mb-6">
            {t('satisfiedOrRefunded')} <span className="text-primary md:text-[46px]">{t('refunded')}</span>
          </h2>
          
           <div className="flex items-center justify-center space-x-8 mt-8 md:mt-10 md:space-x-12">
             <button onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setIsAnnual(false);
              setIsTransitioning(false);
            }, 250);
               }} className={`px-4 py-2 rounded-full text-lg font-medium transition-smooth hover-scale md:px-6 md:py-3 md:text-xl ${!isAnnual ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
                {t('monthly')}
              </button>
              <button onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setIsAnnual(true);
              setIsTransitioning(false);
            }, 250);
          }} className={`px-4 py-2 rounded-full transition-smooth hover-scale md:px-6 md:py-3 md:text-xl ${isAnnual ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
                {t('annualSavings')}
              </button>
           </div>
        </div>

        <div className={`max-w-md mx-auto transition-all duration-500 delay-300 md:max-w-lg ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className={`bg-white rounded-2xl p-8 text-center border-2 border-primary/30 transition-all duration-500 ease-in-out hover-lift md:p-10 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`} style={{
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.25), 0 10px 40px -10px rgba(99, 102, 241, 0.15)'
          }}>
            <div className="mb-8 md:mb-10">
              <div className="flex flex-col items-center mb-2">
                <div className="relative inline-block">
                  <span className="text-6xl font-bold text-primary md:text-7xl">
                    {isAnnual ? "7€" : "9€"}
                  </span>
                </div>
              </div>
              <div className="text-muted-foreground text-center md:text-lg">{t('perMonth')}</div>
            </div>

            <div className="space-y-4 mb-8 md:space-y-5 md:mb-10">
              {features.map((feature, index) => <div key={index} className="flex items-center space-x-3 md:space-x-4">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full gradient-subtle flex items-center justify-center md:w-6 md:h-6">
                    <Check className="w-3 h-3 text-primary md:w-4 md:h-4" />
                  </div>
                  <span className="text-foreground/80 text-left md:text-base">{feature}</span>
                </div>)}
            </div>

            <Button 
              variant="hero" 
              size="xl" 
              className="py-2 text-base rounded-full px-[27px] hover-glow md:text-lg md:py-3 md:px-8"
              onClick={handleCTAClick}
            >
              {t('startNowCTA')}
            </Button>
          </div>
        </div>

        {/* Social Proof */}
        <div className={`mt-20 text-center transition-all duration-700 delay-700 md:mt-24 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={statsRef}>
          <div className="grid md:grid-cols-3 gap-8 mb-12 md:gap-12">
            <div className={`space-y-2 transition-all duration-500 hover-scale md:space-y-3 ${
              statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="text-4xl font-bold text-primary md:text-5xl">
                {statsVisible ? `${count250}+` : "250+"}
              </div>
              <div className="text-muted-foreground md:text-lg">{t('merchantsInFrance')}</div>
            </div>
            <div className={`space-y-2 transition-all duration-500 delay-200 hover-scale md:space-y-3 ${
              statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="text-4xl font-bold text-primary md:text-5xl">
                {statsVisible ? `${count20k}k+` : "20k+"}
              </div>
              <div className="text-muted-foreground md:text-lg">{t('reviewsCollected')}</div>
            </div>
            <div className={`space-y-2 transition-all duration-500 delay-400 hover-scale md:space-y-3 ${
              statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="text-4xl font-bold text-primary md:text-5xl">4.8/5</div>
              <div className="text-muted-foreground md:text-lg">{t('averageRating')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default PricingSection;
