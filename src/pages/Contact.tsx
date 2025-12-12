import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";
import SEO from "@/components/SEO";

const Contact = () => {
  const { t } = useTranslation();

  const handleCalendlyClick = () => {
    window.open('https://calendly.com/revwheelpro/30min', '_blank');
  };

  return (
    <>
      <SEO 
        titleFr="Contact RevWheel | Besoin d'aide ou d'une démo ?"
        titleEn="Contact RevWheel | Get Help or Request a Demo Today"
        descriptionFr="Besoin d'assistance ou envie d'essayer RevWheel ? Contactez notre équipe support disponible 7j/7 pour vous aider à booster vos avis Google."
        descriptionEn="Need help or want a demo? Contact RevWheel's support team—we're available 7 days a week to guide you and boost your Google review strategy."
        canonical="/contact"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">
            {t('contactTitle')}
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-8">
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('contactQuestion')} <a href="mailto:revwheelpro@gmail.com?subject=Demande d'information RevWheel&body=Bonjour, je souhaiterais avoir plus d'informations sur RevWheel." className="text-primary font-semibold hover:underline transition-smooth">revwheelpro@gmail.com</a>
            </p>

            <div className="pt-4">
              <p className="text-lg text-muted-foreground mb-6">
                {t('contactSchedule')}<br />
                {t('contactScheduleSubtext')}
              </p>
              
              <Button 
                variant="hero" 
                size="xl" 
                className="text-lg hover-glow"
                onClick={handleCalendlyClick}
              >
                {t('scheduleCall')}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      </div>
    </>
  );
};

export default Contact;