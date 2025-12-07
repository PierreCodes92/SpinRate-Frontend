import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollAnimation";
import { useNotificationContext } from "@/components/NotificationProvider";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useTranslation } from "@/components/TranslationProvider";
import VideoPlayer from "@/components/VideoPlayer";
const HeroSection = () => {
  const {
    ref: heroRef,
    isVisible: heroVisible
  } = useScrollReveal(0.2);
  const {
    showTrialNotification
  } = useNotificationContext();
  const {
    openModal
  } = useAuthModal();
  const {
    t
  } = useTranslation();
  const handleCTAClick = () => {
    showTrialNotification();
    openModal('register');
  };
  return <section className="relative py-12 px-6 overflow-hidden">
      {/* Background decorations - simplified for better mobile performance */}
      {/* Only show animated shapes on desktop to improve mobile LCP */}
      <div className="absolute inset-0 opacity-30 px-0 hidden lg:block">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-primary/20 rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-primary/15 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary/25 rotate-12"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative px-0">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center md:hidden" ref={heroRef}>
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('collectGoogleReviews')}{" "}
                <span className="text-primary">{t('effortlessly')}</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('bestSolutionForReviews')}
              </p>
            </div>

            <Button variant="hero" size="xl" className="text-lg hover-glow" onClick={handleCTAClick}>
              {t('tryFreeDesktop')}
            </Button>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4">
              {[t('sevenDaysFree'), t('noCreditCard'), t('noCommitment'), t('setupIn5Min')].map((feature, index) => <div key={index} className={`flex items-center space-x-3 transition-all duration-700 delay-${index * 100} ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full gradient-subtle flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground/80 font-medium">{feature}</span>
                </div>)}
            </div>
          </div>

          {/* Right Content - Video Mockup */}
          <div className={`relative flex justify-end transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative z-10 shadow-card rounded-2xl overflow-hidden aspect-[9/16] max-w-xs ml-20 video-neon-glow">
              <VideoPlayer 
                src="/video/VideoRevwheel.mp4"
                className="w-full h-full"
              />
            </div>
            
            {/* Floating decorations - desktop only for performance */}
            <div className="hidden lg:block">
              <div className="absolute -top-4 -right-4 w-24 h-24 gradient-hero rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 gradient-primary rounded-full opacity-15 blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden flex flex-col items-center space-y-6 md:space-y-8">
          {/* Bloc Titre */}
          <div className="text-center space-y-6 mb-4 md:mb-6" style={{
          width: '90%'
        }}>
            <h1 className="font-poppins font-bold text-foreground text-center md:text-[54px] md:leading-[60px]" style={{
            fontSize: '37px',
            lineHeight: '41px'
          }}>
              <div>{t('collectGoogleReviews').split(' ').slice(0, 2).join(' ')}</div>
              <div>{t('collectGoogleReviews').split(' ').slice(2).join(' ')}</div>
              <div className="text-primary">{t('effortlessly')}</div>
            </h1>
            
            <p className="font-poppins text-foreground/75 text-center font-normal md:text-[18px] md:leading-[28px]" style={{
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0.3px',
            wordSpacing: '4px'
          }}>
              {t('bestSolutionForReviews')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="w-full flex justify-center mb-4 md:mb-6">
            <Button variant="hero" className="text-center font-poppins font-bold hover-glow md:text-[18px] md:h-[56px]" onClick={handleCTAClick} style={{
            width: '80%',
            height: '48px',
            borderRadius: '30px',
            fontSize: '16px',
            paddingTop: '14px',
            paddingBottom: '14px'
          }}>
              {t('tryFreeMobile')}
            </Button>
          </div>

          {/* Liste des avantages */}
          <div className="w-full space-y-2 mb-3 mx-0 py-0 px-[79px] md:space-y-3 md:mb-6 md:flex md:flex-col md:items-center md:px-0">
            {[t('sevenDaysFree'), t('noCreditCard'), t('noCommitment'), t('setupIn5Min')].map((feature, index) => <div key={index} className="flex items-center space-x-3 px-0 py-0 md:space-x-4 md:justify-center">
                <div className="flex-shrink-0 rounded-full gradient-subtle flex items-center justify-center md:w-[20px] md:h-[20px]" style={{
              width: '16px',
              height: '16px'
            }}>
                  <Check className="text-primary md:w-[14px] md:h-[14px]" style={{
                width: '10px',
                height: '10px'
              }} />
                </div>
                <span className="font-poppins text-foreground/80 font-medium text-left whitespace-nowrap md:text-[16px] md:leading-[20px]" style={{
              fontSize: '13px',
              lineHeight: '16px'
            }}>
                  {feature}
                </span>
              </div>)}
          </div>

          {/* Vidéo */}
          <div className="w-full flex justify-center mt-12 mb-5 md:mt-16 md:mb-8">
            <div className="relative z-10 shadow-card rounded-2xl overflow-hidden video-neon-glow md:w-[70%]" style={{
            width: '85%',
            aspectRatio: '9/16'
          }}>
              <VideoPlayer 
                src="/video/VideoRevwheel.mp4"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{
        __html: `
            .video-neon-glow {
              box-shadow: 
                0 0 25px rgba(99, 102, 241, 0.4),
                0 0 50px rgba(99, 102, 241, 0.3),
                0 0 75px rgba(99, 102, 241, 0.2);
              border: 2px solid rgba(99, 102, 241, 0.3);
            }
          `
      }} />
      </div>
    </section>;
};
export default HeroSection;