// RevWheel Landing Page

import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SEO from "@/components/SEO";

// Lazy load below-the-fold sections for better LCP
const StatsSection = lazy(() => import("@/components/StatsSection"));
const BeforeAfterSection = lazy(() => import("@/components/BeforeAfterSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const BenefitsSection = lazy(() => import("@/components/BenefitsSection"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

// Minimal loading placeholder
const SectionLoader = () => (
  <div className="py-16 flex justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <>
      <SEO 
        titleFr="RevWheel | Boostez vos avis Google & fidélisez vos clients automatiquement"
        titleEn="RevWheel | Boost Google Reviews & Retain Your Customers Automatically"
        descriptionFr="Collectez plus d'avis 5 étoiles sur Google sans effort. RevWheel fait revenir vos clients et améliore votre visibilité locale en quelques minutes."
        descriptionEn="Get more 5-star Google reviews effortlessly. RevWheel drives repeat visits and improves your local business visibility in just minutes."
        canonical="/"
      />
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <Suspense fallback={<SectionLoader />}>
            <StatsSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <BeforeAfterSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <ProcessSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <BenefitsSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <PricingSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <TestimonialsSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <FAQ />
          </Suspense>
        </main>
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Index;
