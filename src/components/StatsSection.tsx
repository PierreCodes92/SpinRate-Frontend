import { useState, useEffect } from "react";
import { useScrollReveal, useAnimatedCounter } from "@/hooks/useScrollAnimation";
import { useTranslation } from "@/components/TranslationProvider";
import clientLogo1 from "@/assets/client-logo-1.webp";
import clientLogo2 from "@/assets/client-logo-2.webp";
import clientLogo3 from "@/assets/client-logo-3.webp";
import clientLogo4 from "@/assets/client-logo-4.webp";
import clientLogo5 from "@/assets/client-logo-5.webp";
import clientLogo6 from "@/assets/client-logo-6.webp";
import clientLogo7 from "@/assets/client-logo-7.webp";
import clientLogo8 from "@/assets/client-logo-8.webp";

const StatsSection = () => {
  const { ref: counterRef, isVisible: counterVisible } = useScrollReveal(0.3);
  const [animatedCount, setAnimatedCount] = useState(526);
  const [hasStarted, setHasStarted] = useState(false);
  const { t } = useTranslation();
  const clientLogos = [clientLogo1, clientLogo2, clientLogo3, clientLogo4, clientLogo5, clientLogo6, clientLogo7, clientLogo8];
  
  useEffect(() => {
    if (counterVisible && !hasStarted) {
      setHasStarted(true);
      let currentCount = 526;
      
      const incrementCounter = () => {
        if (currentCount < 534) {
          currentCount++;
          setAnimatedCount(currentCount);
          setTimeout(incrementCounter, 7000);
        }
      };
      
      incrementCounter();
    }
  }, [counterVisible, hasStarted]);
  return <section className="py-16 px-0 backdrop-blur-sm md:py-20">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-lg text-muted-foreground mb-4 mx-0 px-0 md:text-xl md:mb-6">
          {t('reviewsObtainedToday')}
        </h2>
        
        
        <div className="relative" ref={counterRef}>
          <span className={`text-8xl font-bold gradient-hero bg-clip-text text-transparent transition-all duration-1000 md:text-9xl ${
            counterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {animatedCount}+
          </span>
          
          {/* Animated counter effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full gradient-subtle opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Client logos carousel */}
        <div className={`mt-16 overflow-hidden transition-all duration-700 delay-500 md:mt-20 ${
          counterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex space-x-12 items-center animate-scroll md:space-x-16">
            {clientLogos.map((logo, i) => <div key={i} className="flex-shrink-0 w-24 h-16 bg-white rounded-lg shadow-soft flex items-center justify-center p-2 hover-scale md:w-28 md:h-20">
                <img src={logo} alt={`Client ${i + 1}`} className="w-full h-full object-contain rounded opacity-60 transition-opacity hover:opacity-90" />
              </div>)}
            {/* Duplicate for seamless loop */}
            {clientLogos.map((logo, i) => <div key={`dup-${i}`} className="flex-shrink-0 w-24 h-16 bg-white rounded-lg shadow-soft flex items-center justify-center p-2 hover-scale">
                <img src={logo} alt={`Client ${i + 1}`} className="w-full h-full object-contain rounded opacity-60 transition-opacity hover:opacity-90" />
              </div>)}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
      __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 15s linear infinite;
          }
          @media (min-width: 768px) {
            .animate-scroll {
              animation: scroll 20s linear infinite;
            }
          }
        `
    }} />
    </section>;
};
export default StatsSection;