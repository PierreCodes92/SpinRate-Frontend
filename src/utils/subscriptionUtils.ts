/**
 * Utility functions for handling subscription status
 */

interface User {
  subscriptionRemaining?: number;
  lastPaymentDate?: string | Date;
}

interface UserObject {
  user?: User;
}

/**
 * Check if user has lost their subscription
 */
export const hasLostSubscription = (user: UserObject | null): boolean => {
  if (!user?.user) return false;
  
  const { subscriptionRemaining, lastPaymentDate } = user.user;
  
  // If no lastPaymentDate, treat as free trial
  if (!lastPaymentDate) return false;
  
  const currentDate = new Date();
  const lastPayment = new Date(lastPaymentDate);
  const daysSinceLastPayment = Math.floor((currentDate.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
  
  // If subscriptionRemaining is 7, it's a free trial
  if (subscriptionRemaining === 7) {
    return daysSinceLastPayment >= subscriptionRemaining;
  }
  
  // For paid subscriptions, check if days since last payment exceed remaining days
  return daysSinceLastPayment >= (subscriptionRemaining || 0);
};

/**
 * Check if user is on free trial
 */
export const isOnFreeTrial = (user: UserObject | null): boolean => {
  if (!user?.user) return false;
  
  const { subscriptionRemaining, lastPaymentDate } = user.user;
  
  // If subscriptionRemaining is 7, it's a free trial
  if (subscriptionRemaining === 7) {
    return !hasLostSubscription(user);
  }
  
  return false;
};

/**
 * Get remaining days for free trial
 */
export const getFreeTrialRemainingDays = (user: UserObject | null): number => {
  if (!isOnFreeTrial(user)) return 0;
  
  const { lastPaymentDate } = user.user!;
  const currentDate = new Date();
  const lastPayment = new Date(lastPaymentDate!);
  const daysSinceLastPayment = Math.floor((currentDate.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, 7 - daysSinceLastPayment);
};

/**
 * Get subscription status summary
 */
export const getSubscriptionStatus = (user: UserObject | null): { type: string; remainingDays: number } => {
  if (!user?.user) {
    return { type: 'none', remainingDays: 0 };
  }
  
  if (isOnFreeTrial(user)) {
    return {
      type: 'free_trial',
      remainingDays: getFreeTrialRemainingDays(user)
    };
  }
  
  if (hasLostSubscription(user)) {
    return { type: 'expired', remainingDays: 0 };
  }
  
  return { 
    type: 'active', 
    remainingDays: user.user.subscriptionRemaining || 0 
  };
};

/**
 * Get current plan info
 */
export const getCurrentPlanInfo = (user: UserObject | null): { planType: 'monthly' | 'yearly' | null; expirationDate: Date | null } | null => {
  if (!user?.user) return null;
  
  const { subscriptionRemaining, lastPaymentDate } = user.user;
  
  if (!lastPaymentDate) return null;
  
  let planType: 'monthly' | 'yearly' | null = null;
  let expirationDate: Date | null = null;
  
  // Calculate expiration date based on lastPaymentDate and remaining days
  const lastPayment = new Date(lastPaymentDate);
  const expiration = new Date(lastPayment);
  
  // Determine plan type based on subscriptionRemaining
  if (subscriptionRemaining === 30) {
    planType = 'monthly';
    expiration.setDate(lastPayment.getDate() + subscriptionRemaining);
    expirationDate = expiration;
  } else if (subscriptionRemaining === 365) {
    planType = 'yearly';
    expiration.setDate(lastPayment.getDate() + subscriptionRemaining);
    expirationDate = expiration;
  }
  
  return planType ? { planType, expirationDate } : null;
};

