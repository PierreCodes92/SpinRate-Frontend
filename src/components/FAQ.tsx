import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/components/TranslationProvider";

const FAQ = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const itemObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          setVisibleItems(prev => [...new Set([...prev, index])]);
        }
      });
    }, {
      threshold: 0.2
    });
    itemRefs.current.forEach(ref => {
      if (ref) itemObserver.observe(ref);
    });
    return () => itemObserver.disconnect();
  }, []);
  const faqs = [{
    question: t('faq1Question'),
    answer: t('faq1Answer')
  }, {
    question: t('faq2Question'),
    answer: t('faq2Answer')
  }, {
    question: t('faq3Question'),
    answer: t('faq3Answer')
  }, {
    question: t('faq4Question'),
    answer: t('faq4Answer')
  }, {
    question: t('faq5Question'),
    answer: t('faq5Answer')
  }, {
    question: t('faq6Question'),
    answer: t('faq6Answer')
  }, {
    question: t('faq7Question'),
    answer: t('faq7Answer')
  }, {
    question: t('faq8Question'),
    answer: t('faq8Answer')
  }, {
    question: t('faq9Question'),
    answer: t('faq9Answer')
  }, {
    question: t('faq10Question'),
    answer: t('faq10Answer')
  }, {
    question: t('faq11Question'),
    answer: t('faq11Answer')
  }, {
    question: t('faq12Question'),
    answer: t('faq12Answer')
  }];
  return <section ref={sectionRef} className="py-24 bg-white/30 backdrop-blur-sm relative overflow-hidden md:py-28">
      {/* Animated shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 w-16 h-16 bg-primary/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-8 h-8 bg-primary/25 rotate-45 animate-bounce delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-6 h-6 border-2 border-primary/30 rounded-full animate-spin" style={{
        animationDuration: '8s'
      }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-primary/35 animate-pulse delay-3000"></div>
      </div>

      <div className="mx-auto max-w-5xl relative px-3 md:px-6">
        <div className={`text-center mb-16 transition-all duration-1000 md:mb-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="lg:text-5xl font-bold text-foreground mb-4 text-4xl md:text-[46px] md:leading-[52px] md:mb-6">
            {t('faqTitle').split(' ')[0]} <span className="text-primary">{t('faqTitle').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xl text-muted-foreground md:text-2xl">
            {t('faqSubtitle')}
          </p>
        </div>

        <div>
          <Accordion type="single" collapsible className="space-y-4 md:space-y-6">
            {faqs.map((faq, index) => <div key={index} ref={el => itemRefs.current[index] = el} data-index={index} className={`transition-all duration-1000 ${visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
            transitionDelay: `${index * 100}ms`
          }}>
                <AccordionItem value={`item-${index}`} className="bg-white/80 backdrop-blur-sm rounded-xl border border-primary/10 px-6 md:px-8">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-smooth md:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line md:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>)}
          </Accordion>
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-500 md:mt-16 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} id="contact">
          <p className="text-muted-foreground mb-4 md:text-lg md:mb-6">
            {t('moreQuestions')}
          </p>
           <Button variant="outline" size="lg" className="hover:bg-primary hover:text-white transition-smooth" onClick={() => window.location.href = '/contact'}>
             {t('contactUs')}
           </Button>
        </div>
      </div>
    </section>;
};
export default FAQ;