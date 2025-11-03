import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import { hasLostSubscription, isOnFreeTrial, getCurrentPlanInfo } from "@/utils/subscriptionUtils";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Subscription() {
  const { t, language } = useLanguage();
  const { user, isInitialized, refreshUser } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for successful payment redirect
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && isInitialized) {
      // Payment was successful, refresh user data
      toast.success(t('subscription.paymentSuccess') || "Payment successful! Your subscription is now active.");
      refreshUser();
      // Remove session_id from URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, isInitialized, refreshUser, setSearchParams, t]);

  const handleToggle = (annual: boolean) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAnnual(annual);
      setIsTransitioning(false);
    }, 250);
  };

  const handleStartSubscription = async () => {
    if (!user?.user?._id) {
      toast.error(t('subscription.loginRequired') || "Please log in to subscribe");
      return;
    }

    // Check if email is verified
    if (user.user.emailVerified === false) {
      toast.error(t('subscription.emailNotVerified') || "Please verify your email before subscribing");
      return;
    }

    try {
      setIsLoading(true);
      
      const subscriptionType = isAnnual ? 'yearly' : 'monthly';
      const userEmail = user.user.email || '';
      const userId = user.user._id;

      // Create checkout session
      const response = await fetch(`${API_BASE_URL}/webhooks/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          subscriptionType: subscriptionType,
          userEmail: userEmail
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        toast.error(data.error || t('subscription.checkoutError') || "Failed to create checkout session");
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error(t('subscription.checkoutError') || "An error occurred while processing your request");
    } finally {
      setIsLoading(false);
    }
  };

  const subscriptionLost = hasLostSubscription(user);
  const onFreeTrial = isOnFreeTrial(user);
  const currentPlanInfo = getCurrentPlanInfo(user);

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const features = [
    t('subscription.feature1'),
    t('subscription.feature2'),
    t('subscription.feature3'),
    t('subscription.feature4'),
    t('subscription.feature5'),
    t('subscription.feature6'),
    t('subscription.feature7'),
    t('subscription.feature8'),
    t('subscription.feature9'),
    t('subscription.feature10')
  ];

  return <DashboardLayout>
      <section className="px-px py-[22px]">
        <div className="mx-auto max-w-4xl w-full px-0">
          {/* Current Plan Information */}
          {currentPlanInfo && !subscriptionLost && !onFreeTrial && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-card rounded-lg shadow-sm border border-border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {t('subscription.currentPlan') || 'Current Plan'}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-primary">
                      {currentPlanInfo.planType === 'monthly' ? t('subscription.monthlyPlan') || 'Monthly Plan' : t('subscription.yearlyPlan') || 'Yearly Plan'}
                    </span>
                    <div className="text-muted-foreground">
                      <span className="font-medium">{t('subscription.activeUntil') || 'Active until'}</span>{' '}
                      <span className="text-foreground">{formatDate(currentPlanInfo.expirationDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">
                    {t('subscription.expiresOn') || 'Expires on'}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatDate(currentPlanInfo.expirationDate)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Subscription Status Messages */}
          {subscriptionLost && (
            <div className="mb-8 bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                {t('subscription.expiredTitle') || 'Subscription Expired'}
              </h2>
              <p className="text-muted-foreground">
                {t('subscription.expiredSubtitle') || 'Your subscription has expired. Please choose a plan to continue using our services.'}
              </p>
            </div>
          )}

          {onFreeTrial && !subscriptionLost && (
            <div className="mb-8 bg-warning/10 border border-warning/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-warning mb-2">
                {t('subscription.freeTrialTitle') || 'Free Trial Active'}
              </h2>
              <p className="text-muted-foreground">
                {t('subscription.freeTrialSubtitle') || 'Your free trial is active. Choose a plan to continue after your trial ends.'}
              </p>
            </div>
          )}

          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('subscription.title')} <span className="text-primary">{t('subscription.titleHighlight')}</span>
            </h2>
            
            <div className="flex justify-center px-[8px] my-[41px]">
              <div className="inline-flex gap-2 p-1 bg-muted rounded-full px-[10px]">
                <button 
                  onClick={() => handleToggle(false)} 
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 ${!isAnnual ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}
                >
                  {t('subscription.monthly')}
                </button>
                <button 
                  onClick={() => handleToggle(true)} 
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 ${isAnnual ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}
                >
                  {t('subscription.annual')}
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className={`bg-card rounded-2xl shadow-lg p-8 text-center border border-primary/20 transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} relative`} style={{
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.15), 0 0 80px rgba(59, 130, 246, 0.08)'
          }}>
              <div className="mb-8">
                <div className="flex items-start justify-center gap-1 mb-2">
                  <span className="text-6xl font-bold text-primary">{isAnnual ? "7€" : "9€"}</span>
                  <span className="text-base italic font-normal text-primary mt-1">HT</span>
                </div>
                <div className="text-muted-foreground">{t('subscription.perMonth')}</div>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-left">{feature}</span>
                  </div>)}
              </div>

              <div className="relative w-full">
                <div className="halo" style={{
                animationDelay: '0s'
              }}></div>
                <div className="halo" style={{
                animationDelay: '0.35s'
              }}></div>
                <div className="halo" style={{
                animationDelay: '0.7s'
              }}></div>
              <Button 
                variant="hero" 
                className="w-full py-6 text-lg font-semibold rounded-full"
                onClick={handleStartSubscription}
                disabled={isLoading}
              >
                <span>{isLoading ? (t('subscription.creatingSession') || 'Creating session...') : t('subscription.startNow')}</span>
              </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>;
}