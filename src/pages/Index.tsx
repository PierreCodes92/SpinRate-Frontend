// RevWheel Landing Page

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import ProcessSection from "@/components/ProcessSection";
import BenefitsSection from "@/components/BenefitsSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO 
        titleFr="RevWheel - Collectez des Avis Google (sans effort)"
        titleEn="RevWheel - Get Google Reviews (effortlessly)"
        descriptionFr="La meilleure solution pour avoir des avis positifs sur Google de la part de tous vos clients pour être premier dans les recherches. 7 jours gratuits, sans engagement."
        descriptionEn="The best solution to get positive Google reviews from all your customers to be first in searches. 7 days free, no commitment."
        canonical="/"
      />
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <StatsSection />
          <BeforeAfterSection />
          <ProcessSection />
          <BenefitsSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
