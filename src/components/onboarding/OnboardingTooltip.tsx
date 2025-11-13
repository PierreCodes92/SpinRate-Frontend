import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { OnboardingStep } from '@/contexts/OnboardingContext';

interface OnboardingTooltipProps {
  step: OnboardingStep;
  position: {
    x: number;
    y: number;
  };
  title: string;
  message: string;
  actionText?: string;
  onNext?: () => void;
  onSkip?: () => void;
  arrowDirection?: 'top' | 'bottom' | 'left' | 'right';
  isMobile?: boolean;
}

export const OnboardingTooltip = ({
  step,
  position,
  title,
  message,
  actionText,
  onNext,
  onSkip,
  arrowDirection = 'bottom',
  isMobile = false
}: OnboardingTooltipProps) => {
  // Décalages spécifiques par étape sur mobile
  const mobileTopOffset = isMobile ? {
    'analytics': 130,
    'clients': 115,
    'clients-open-menu': 130,
    'settings': 132,
    'subscription': 60
  }[step] ?? 0 : 0;

  console.log(`MOBILE: ${isMobile} | STEP: ${step} | offsetY: ${mobileTopOffset} | finalY: ${position.y + (isMobile ? mobileTopOffset : 0)}`);

  const arrowStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowPointer = {
    top: 'border-l-transparent border-r-transparent border-t-card border-b-0',
    bottom: 'border-l-transparent border-r-transparent border-b-card border-t-0',
    left: 'border-t-transparent border-b-transparent border-l-card border-r-0',
    right: 'border-t-transparent border-b-transparent border-r-card border-l-0'
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{
          opacity: 0,
          scale: 0.9,
          x: position.x,
          y: position.y + (isMobile ? mobileTopOffset : 0)
        }}
        animate={{
          opacity: 1,
          scale: 1,
          x: position.x,
          y: position.y + (isMobile ? mobileTopOffset : 0)
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          x: position.x,
          y: position.y + (isMobile ? mobileTopOffset : 0)
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          duration: 0.15
        }}
        layout={false}
        className="fixed z-[10001] top-0 left-0"
      >
        <div className="relative">
          {/* Arrow */}
          <div className={`absolute ${arrowStyles[arrowDirection]}`}>
            <div className={`w-0 h-0 border-8 ${arrowPointer[arrowDirection]}`} />
          </div>

          {/* Tooltip Card */}
          <div className="bg-card border-2 border-primary/20 rounded-xl shadow-xl p-6 max-w-md animate-pulse-subtle px-[25px] py-[23px] my-0 mx-[17px]">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                {title}
              </h3>
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="text-muted-foreground mb-4 leading-relaxed whitespace-pre-line">
              {message.split('\n').map((line, index) => {
                // Check if line is wrapped in underscores for italic
                const italicMatch = line.match(/^_(.+)_$/);
                if (italicMatch) {
                  return <p key={index} className="italic">{italicMatch[1]}</p>;
                }
                
                // Check for **text** to make it bold and blue
                const boldMatch = line.match(/\*\*(.+?)\*\*/g);
                if (boldMatch) {
                  const parts = line.split(/(\*\*.+?\*\*)/);
                  return (
                    <p key={index} className="px-0 py-[8px]">
                      {parts.map((part, i) => {
                        const boldTextMatch = part.match(/\*\*(.+?)\*\*/);
                        if (boldTextMatch) {
                          return <span key={i} className="font-bold text-primary">{boldTextMatch[1]}</span>;
                        }
                        return part;
                      })}
                    </p>
                  );
                }
                
                return <p key={index} className="px-0 py-[8px]">{line}</p>;
              })}
            </div>

            {(actionText || onNext) && (
              <div className="flex gap-3">
                {actionText && (
                  <div className="flex-1 relative">
                    <div className="halo" style={{ animationDelay: '0s' }}></div>
                    <div className="halo" style={{ animationDelay: '0.35s' }}></div>
                    <div className="halo" style={{ animationDelay: '0.7s' }}></div>
                    <Button
                      onClick={onNext}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full relative z-10"
                    >
                      {actionText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};

