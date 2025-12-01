import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/components/TranslationProvider";
import SEO from "@/components/SEO";

const Blog = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        titleFr="Blog - RevWheel"
        titleEn="Blog - RevWheel"
        descriptionFr="Découvrez nos articles et conseils pour maximiser vos avis Google et fidéliser vos clients. Astuces, guides et bonnes pratiques."
        descriptionEn="Discover our articles and tips to maximize your Google reviews and build customer loyalty. Tips, guides and best practices."
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