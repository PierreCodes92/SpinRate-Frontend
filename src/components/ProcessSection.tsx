import { Button } from "@/components/ui/button";
import { useNotificationContext } from "@/components/NotificationProvider";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useTranslation } from "@/components/TranslationProvider";

const ProcessSection = () => {
  const { showTrialNotification } = useNotificationContext();
  const { openModal } = useAuthModal();
  const { t } = useTranslation();

  const handleCTAClick = () => {
    showTrialNotification();
    openModal('register');
  };
  const steps = [{
    number: "1",
    title: t('configureWheel'),
    description: t('generatePosterAuto')
  }, {
    number: "2",
    title: t('exposeQRPoster'),
    description: t('accessibleToClients')
  }, {
    number: "3",
    title: t('letClientsScan'),
    description: t('reviewChanceWin')
  }, {
    number: "4",
    title: t('outCompeteRivals'),
    description: t('googleFavorsReviews')
  }];
  return <section className="py-24 px-0 md:py-28">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="lg:text-5xl font-bold text-foreground mb-6 text-4xl md:text-[46px] md:leading-[52px]">
            {t('explodeGoogleReviews')}{" "}
            <span className="text-primary text-4xl lg:text-5xl md:text-[46px]">{t('doingNothing')}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 md:gap-10 md:mb-16">
          {steps.map((step, index) => <div key={index} className="text-center space-y-1 group md:space-y-8">
              {/* Espace réservé sans icône */}
              
              
              {/* Numéro de l'étape */}
              <div className="relative">
                <div className="w-14 h-14 mx-auto gradient-hero rounded-full flex items-center justify-center text-white text-lg font-bold shadow-button hover:scale-[1.32] transition-all duration-300 cursor-pointer md:w-16 md:h-16 md:text-xl">
                  {step.number}
                </div>
                {index < steps.length - 1 && <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent opacity-30"></div>}
              </div>
              
              <h3 className="text-xl font-semibold text-foreground md:text-2xl h-[3.5rem] flex items-start justify-center">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground md:text-lg h-[5rem] flex items-start justify-center">
                {step.description}
              </p>
            </div>)}
        </div>

        <div className="text-center">
          <Button 
            variant="hero" 
            size="xl" 
            className="text-base rounded-full py-0 px-[26px] hover-glow md:text-lg md:py-2 md:px-8"
            onClick={handleCTAClick}
          >
            {t('sevenDaysFreeCTA')}
          </Button>
        </div>
      </div>
    </section>;
};
export default ProcessSection;