// Riwil Landing Page - Exact replica with bluish gradients

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

const Index = () => {
  return (
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
  );
};

export default Index;
