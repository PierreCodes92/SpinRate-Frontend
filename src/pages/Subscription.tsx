import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, XCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import { hasLostSubscription, isOnFreeTrial, getCurrentPlanInfo } from "@/utils/subscriptionUtils";
import { toast } from "sonner";
import { motion } from "framer-motion";

const STRIPE_BILLING_PORTAL_URL = "https://billing.stripe.com/p/login/4gMfZhaUabc3augbQQfAc00";

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

  const subscriptionRemaining = user?.user?.subscriptionRemaining ?? 0;
  const lastPaymentDate = user?.user?.lastPaymentDate ? new Date(user.user.lastPaymentDate) : null;
  const now = new Date();
  const diffInDays = lastPaymentDate ? Math.floor((now.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const isFreeTrialUser = subscriptionRemaining === 7;
  const freeTrialActive = isFreeTrialUser && diffInDays !== null && diffInDays <= 7;
  const freeTrialExpired = isFreeTrialUser && diffInDays !== null && diffInDays > 7;
  const subscriptionExpired = !isFreeTrialUser && diffInDays !== null && diffInDays > subscriptionRemaining;

  const subscriptionLost = subscriptionExpired;
  const onFreeTrial = freeTrialActive;
  const currentPlanInfo = getCurrentPlanInfo(user);

  // Check if user has an active paid subscription (not free trial)
  const hasActiveSubscription = currentPlanInfo && !subscriptionLost && !onFreeTrial;
  
  // Check if the displayed plan matches the user's current plan
  const isCurrentPlanDisplayed = hasActiveSubscription && (
    (isAnnual && currentPlanInfo?.planType === 'yearly') ||
    (!isAnnual && currentPlanInfo?.planType === 'monthly')
  );

  // Handle opening Stripe billing portal
  const handleManageSubscription = () => {
    window.open(STRIPE_BILLING_PORTAL_URL, '_blank');
  };

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
          {hasActiveSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-card rounded-xl shadow-sm border border-border p-4 md:p-6"
            >
              {/* Mobile Layout */}
              <div className="flex flex-col gap-4 md:hidden">
                <div>
                  <h2 className="text-base font-semibold text-foreground mb-1">
                    {t('subscription.currentPlan') || 'Current Plan'}
                  </h2>
                  <span className="text-xl font-bold text-primary">
                    {currentPlanInfo?.planType === 'monthly' ? t('subscription.monthlyPlan') || 'Monthly Plan' : t('subscription.yearlyPlan') || 'Yearly Plan'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('subscription.activeUntil') || 'Active until'}</span>
                  <span className="font-medium text-foreground">{formatDate(currentPlanInfo?.expirationDate || null)}</span>
                </div>
                {/* Mobile Buttons */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageSubscription}
                    className="flex-1 gap-1.5 text-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    {t('subscription.changePlan') || 'Change Plan'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManageSubscription}
                    className="flex-1 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {t('subscription.cancelSubscription') || 'Cancel'}
                  </Button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {t('subscription.currentPlan') || 'Current Plan'}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-primary">
                      {currentPlanInfo?.planType === 'monthly' ? t('subscription.monthlyPlan') || 'Monthly Plan' : t('subscription.yearlyPlan') || 'Yearly Plan'}
                    </span>
                    <div className="text-muted-foreground">
                      <span className="font-medium">{t('subscription.activeUntil') || 'Active until'}</span>{' '}
                      <span className="text-foreground">{formatDate(currentPlanInfo?.expirationDate || null)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageSubscription}
                    className="gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {t('subscription.changePlan') || 'Change Plan'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManageSubscription}
                    className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="w-4 h-4" />
                    {t('subscription.cancelSubscription') || 'Cancel'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Subscription Status Messages */}
          {freeTrialExpired && (
            <div className="mb-8 bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                {t('subscription.freeTrialExpiredTitle') || 'Free Trial Expired'}
              </h2>
              <p className="text-muted-foreground">
                {t('subscription.freeTrialExpiredSubtitle') || 'Your free trial has expired. Choose a plan to continue.'}
              </p>
            </div>
          )}

          {subscriptionExpired && (
            <div className="mb-8 bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                {t('subscription.expiredTitle') || 'Subscription Expired'}
              </h2>
              <p className="text-muted-foreground">
                {t('subscription.expiredSubtitle') || 'Your subscription has expired. Please choose a plan to continue using our services.'}
              </p>
            </div>
          )}

          {freeTrialActive && (
            <div className="mb-8 bg-warning/10 border border-warning/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#FFAE05] mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('subscription.freeTrialTitle') || 'Free Trial Active'}
              </h2>
              <p className="text-muted-foreground text-[#4A4B50]">
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
            <div className={`bg-card rounded-2xl shadow-lg p-6 md:p-8 text-center border transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} relative ${isCurrentPlanDisplayed ? 'border-primary/40' : 'border-primary/20'}`} style={{
            boxShadow: isCurrentPlanDisplayed 
              ? '0 0 50px rgba(59, 130, 246, 0.25), 0 0 100px rgba(59, 130, 246, 0.12)' 
              : '0 0 40px rgba(59, 130, 246, 0.15), 0 0 80px rgba(59, 130, 246, 0.08)'
          }}>
              {/* Current Plan Badge */}
              {isCurrentPlanDisplayed && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-xs md:text-sm font-semibold rounded-full shadow-lg">
                    <Check className="w-3.5 h-3.5" />
                    {t('subscription.yourCurrentPlan') || 'Your Current Plan'}
                  </span>
                </div>
              )}

              <div className={`mb-6 md:mb-8 ${isCurrentPlanDisplayed ? 'mt-4' : ''}`}>
                <div className="flex items-start justify-center gap-1 mb-2">
                  <span className="text-5xl md:text-6xl font-bold text-primary">{isAnnual ? "7€" : "9€"}</span>
                  <span className="text-sm md:text-base italic font-normal text-primary mt-1">HT</span>
                </div>
                <div className="text-sm md:text-base text-muted-foreground">{t('subscription.perMonth')}</div>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {features.map((feature, index) => <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm md:text-base text-foreground/80 text-left">{feature}</span>
                  </div>)}
              </div>

              {/* Show CTA only if user doesn't have an active subscription or this is not their current plan */}
              {!hasActiveSubscription ? (
                <div className="relative w-full">
                  <div className="halo" style={{ animationDelay: '0s' }}></div>
                  <div className="halo" style={{ animationDelay: '0.35s' }}></div>
                  <div className="halo" style={{ animationDelay: '0.7s' }}></div>
                  <Button 
                    variant="hero" 
                    className="w-full py-5 md:py-6 text-base md:text-lg font-semibold rounded-full"
                    onClick={handleStartSubscription}
                    disabled={isLoading}
                  >
                    <span>{isLoading ? (t('subscription.creatingSession') || 'Creating session...') : t('subscription.startNow')}</span>
                  </Button>
                </div>
              ) : isCurrentPlanDisplayed ? (
                /* Show "Manage Subscription" button if this is the current plan */
                <Button 
                  variant="outline" 
                  className="w-full py-5 md:py-6 text-base md:text-lg font-semibold rounded-full gap-2"
                  onClick={handleManageSubscription}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{t('subscription.manageSubscription') || 'Manage Subscription'}</span>
                </Button>
              ) : (
                /* Show "Switch to this Plan" button if user has subscription but viewing different plan */
                <Button 
                  variant="outline" 
                  className="w-full py-5 md:py-6 text-base md:text-lg font-semibold rounded-full"
                  onClick={handleManageSubscription}
                >
                  <span>{t('subscription.switchToPlan') || 'Switch to this Plan'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>;
}