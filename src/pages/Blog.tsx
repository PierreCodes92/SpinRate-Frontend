import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/components/TranslationProvider";
import SEO from "@/components/SEO";

const Blog = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        titleFr="Blog RevWheel | Astuces pour obtenir plus d'avis Google et fidéliser vos clients"
        titleEn="RevWheel Blog | Tips to Get More Google Reviews & Boost Loyalty"
        descriptionFr="Découvrez nos guides et conseils pour augmenter vos avis Google, fidéliser vos clients et renforcer votre réputation locale avec RevWheel."
        descriptionEn="Discover guides and strategies to grow your Google reviews, engage customers, and build your local business reputation with RevWheel."
        canonical="/blog"
      />
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <Header />
      
      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl font-bold text-foreground">
              {t('blogTitle')} <span className="text-primary">RevWheel</span>
            </h1>
            <p className="text-2xl text-muted-foreground">
              {t('comingSoon')}
            </p>
          </div>
          
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto"></div>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {t('blogSubtext')}
          </p>
        </div>
      </main>
      
      <Footer />
      </div>
    </>
  );
};

export default Blog;