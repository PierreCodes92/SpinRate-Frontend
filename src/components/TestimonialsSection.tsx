import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import marieImg from "@/assets/testimonial-marie.webp";
import sophieImg from "@/assets/testimonial-sophie.webp";
import jeromeImg from "@/assets/testimonial-jerome.webp";
const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useTranslation();
  const testimonials = [{
    name: t('testimonial1Name'),
    business: t('testimonial1Business'),
    text: t('testimonial1Text'),
    image: marieImg
  }, {
    name: t('testimonial2Name'),
    business: t('testimonial2Business'),
    text: t('testimonial2Text'),
    image: sophieImg
  }, {
    name: t('testimonial3Name'),
    business: t('testimonial3Business'),
    text: t('testimonial3Text'),
    image: jeromeImg
  }];
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 250);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const nextTestimonial = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 250);
  };
  const prevTestimonial = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 250);
  };
  return <section className="py-24 px-0 bg-gradient-to-br from-primary/5 to-primary/10 md:py-28">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="lg:text-5xl font-bold text-foreground mb-4 text-4xl md:text-[46px] md:leading-[52px] md:mb-6">
            {t('theyTrustUs')} <span className="text-primary md:text-[46px]">{t('trust')}</span>
          </h2>
        </div>

        <div className="relative px-4 md:px-24">
          <div className={`bg-white rounded-2xl shadow-card p-4 md:p-10 text-center max-w-3xl mx-auto transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="mb-4 md:mb-6">
              <img 
                src={testimonials[currentIndex].image} 
                alt={testimonials[currentIndex].name} 
                className="w-14 h-14 rounded-full mx-auto object-cover md:w-20 md:h-20"
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
              />
            </div>
            
            {/* Stars */}
            <div className="flex justify-center mb-3 md:mb-5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current md:w-6 md:h-6" />)}
            </div>
            
            <blockquote className="text-base md:text-xl text-foreground leading-relaxed mb-4 italic px-2 md:px-6 md:mb-6">
              "{testimonials[currentIndex].text}"
            </blockquote>
            
            <div className="text-primary font-semibold text-sm md:text-base">
              — {testimonials[currentIndex].name}
            </div>
            <div className="text-muted-foreground text-xs md:text-sm">
              {testimonials[currentIndex].business}
            </div>
          </div>

          {/* Navigation buttons - Hidden on mobile, shown on desktop */}
          <button 
            onClick={prevTestimonial} 
            className="hidden md:block absolute -left-12 top-1/2 transform -translate-y-1/2 bg-white shadow-soft rounded-full p-3 hover:bg-primary/10 transition-smooth z-10"
            aria-label={t('previousTestimonial') || 'Previous testimonial'}
          >
            <ChevronLeft className="w-6 h-6 text-primary" aria-hidden="true" />
          </button>
          
          <button 
            onClick={nextTestimonial} 
            className="hidden md:block absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white shadow-soft rounded-full p-3 hover:bg-primary/10 transition-smooth z-10"
            aria-label={t('nextTestimonial') || 'Next testimonial'}
          >
            <ChevronRight className="w-6 h-6 text-primary" aria-hidden="true" />
          </button>

          {/* Mobile navigation buttons */}
          <div className="flex md:hidden justify-center mt-4 space-x-4" role="group" aria-label={t('testimonialNavigation') || 'Testimonial navigation'}>
            <button 
              onClick={prevTestimonial} 
              className="bg-white shadow-soft rounded-full p-2 hover:bg-primary/10 transition-smooth"
              aria-label={t('previousTestimonial') || 'Previous testimonial'}
            >
              <ChevronLeft className="w-5 h-5 text-primary" aria-hidden="true" />
            </button>
            <button 
              onClick={nextTestimonial} 
              className="bg-white shadow-soft rounded-full p-2 hover:bg-primary/10 transition-smooth"
              aria-label={t('nextTestimonial') || 'Next testimonial'}
            >
              <ChevronRight className="w-5 h-5 text-primary" aria-hidden="true" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2" role="tablist" aria-label={t('testimonialIndicators') || 'Testimonial indicators'}>
            {testimonials.map((testimonial, index) => (
              <button 
                key={index} 
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsTransitioning(false);
                  }, 250);
                }} 
                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-primary' : 'bg-primary/30'}`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`${t('testimonialFrom') || 'Testimonial from'} ${testimonial.name}`}
              />
            ))}
          </div>
        </div>
        
      </div>
    </section>;
};
export default TestimonialsSection;