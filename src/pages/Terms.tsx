import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/components/TranslationProvider";
import SEO from "@/components/SEO";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        titleFr="Conditions Générales d'Utilisation - RevWheel"
        titleEn="Terms and Conditions - RevWheel"
        descriptionFr="Consultez les conditions générales d'utilisation de RevWheel, la solution de collecte d'avis Google pour les commerces locaux."
        descriptionEn="Read the terms and conditions of RevWheel, the Google review collection solution for local businesses."
        canonical="/terms"
      />
      <div className="min-h-screen bg-background">
        <Header />
      
      <main className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">
            {t('terms.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section1Title')}</h2>
              <p>
                {t('terms.section1Para1')}
              </p>
              <p>
                {t('terms.section1Para2')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section2Title')}</h2>
              <p>{t('terms.section2Para1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('terms.section2List1')}</li>
                <li>{t('terms.section2List2')}</li>
                <li>{t('terms.section2List3')}</li>
              </ul>
              <p>
                {t('terms.section2Para2')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section3Title')}</h2>
              <p>{t('terms.section3Para1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('terms.section3List1')}</li>
                <li>{t('terms.section3List2')}</li>
                <li>{t('terms.section3List3')}</li>
                <li>{t('terms.section3List4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section4Title')}</h2>
              <p>{t('terms.section4Para1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('terms.section4List1')}</li>
                <li>{t('terms.section4List2')}</li>
                <li>{t('terms.section4List3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section5Title')}</h2>
              <p>
                {t('terms.section5Para1')}
              </p>
              <p>
                {t('terms.section5Para2')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section6Title')}</h2>
              <p>
                {t('terms.section6Para1')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section7Title')}</h2>
              <p>
                {t('terms.section7Para1')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section8Title')}</h2>
              <p>
                {t('terms.section8Para1')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section9Title')}</h2>
              <p>
                {t('terms.section9Para1')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section10Title')}</h2>
              <p>
                {t('terms.section10Para1')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section11Title')}</h2>
              <p>
                {t('terms.section11Para1')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{t('terms.section12Title')}</h2>
              <p>
                {t('terms.section12Para1')}
              </p>
              <p>
                <strong>{t('terms.section12Email')}</strong> <a href="mailto:revwheelpro@gmail.com" className="text-primary hover:underline">revwheelpro@gmail.com</a>
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Button variant="hero" onClick={() => window.history.back()}>
              {t('terms.backButton')}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </>
  );
};

export default Terms;