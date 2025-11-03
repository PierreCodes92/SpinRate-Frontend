import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Clock } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const { user } = useAuthContext();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Calculate remaining days for the current user
  const trialDaysRemaining = useMemo(() => {
    if (!user?.user?.lastPaymentDate || !user?.user?.subscriptionRemaining) return 0;
    
    const today = new Date();
    const lastPaymentDate = new Date(user.user.lastPaymentDate);
    
    // Calculate difference in days
    const diffInMs = today.getTime() - lastPaymentDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    // Remaining days = max(0, subscriptionRemaining - diff)
    const remainingDays = Math.max(0, user.user.subscriptionRemaining - diffInDays);
    
    return remainingDays;
  }, [user?.user?.lastPaymentDate, user?.user?.subscriptionRemaining]);

  // Check if user is on trial (subscriptionRemaining === 7 means free trial)
  const isOnTrial = user?.user?.subscriptionRemaining === 7 && trialDaysRemaining > 0;

  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <SidebarTrigger className="-ml-2" />
            <LanguageToggle isScrolled={true} />
          </header>
          <main className="flex-1 overflow-auto md:px-6 py-[13px] px-[17px]">
            {children}
          </main>
        </div>

        {/* Trial Popup - Bottom Left */}
        {isOnTrial && (
          <div className="fixed bottom-6 left-6 z-50 hidden md:block">
            <div className={`bg-white border-2 rounded-lg shadow-lg p-4 min-w-[240px] ${
              trialDaysRemaining <= 2 
                ? 'border-red-300 animate-pulse' 
                : trialDaysRemaining <= 4 
                ? 'border-orange-300' 
                : 'border-yellow-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0">
                  <Clock className={`w-5 h-5 ${
                    trialDaysRemaining <= 2 
                      ? 'text-red-600' 
                      : trialDaysRemaining <= 4 
                      ? 'text-orange-600' 
                      : 'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium">
                    {t('sidebar.trialRemaining')}
                  </p>
                  <p className={`text-lg font-bold ${
                    trialDaysRemaining <= 2 
                      ? 'text-red-600' 
                      : trialDaysRemaining <= 4 
                      ? 'text-orange-600' 
                      : 'text-yellow-600'
                  }`}>
                    {trialDaysRemaining} {trialDaysRemaining === 1 ? t('sidebar.day') : t('sidebar.days')}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/dashboard/subscription')}
                className={`w-full font-semibold text-sm h-9 ${
                  trialDaysRemaining <= 2
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : trialDaysRemaining <= 4
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                }`}
              >
                {t('sidebar.upgrade')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>;
}