import { BarChart3, Users, Settings, CreditCard, LogOut, X, Sparkles, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";
import revwheelLogo from "@/assets/revwheel-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useLogout } from "@/hooks/useLogout";

export function AppSidebar() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isTrialVisible, setIsTrialVisible] = useState(true);
  const { setOpenMobile } = useSidebar();
  const { startOnboarding } = useOnboarding();
  const { localizedPath } = useLocalizedPath();

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
  const isTrialExpired = user?.user?.subscriptionRemaining === 7 && trialDaysRemaining < 1;

  // Get the trial message dynamically
  const getTrialMessage = () => {
    if (trialDaysRemaining < 1) {
      return t('sidebar.trialExpired') || 'Free trial expired';
    }
    const dayWord = trialDaysRemaining === 1 ? t('sidebar.day') : t('sidebar.days');
    return `${t('sidebar.trialExpiresIn') || 'Free trial expires in'} ${trialDaysRemaining} ${dayWord}`;
  };

  const menuItems = [
    {
      title: t('sidebar.analytics'),
      url: localizedPath("/dashboard"),
      icon: BarChart3,
      onboardingId: "analytics"
    },
    {
      title: t('sidebar.clients'),
      url: localizedPath("/dashboard/customers"),
      icon: Users,
      onboardingId: "clients"
    },
    {
      title: t('sidebar.settings'),
      url: localizedPath("/dashboard/settings"),
      icon: Settings,
      onboardingId: "settings"
    },
    {
      title: t('sidebar.subscription'),
      url: localizedPath("/dashboard/subscription"),
      icon: CreditCard,
      onboardingId: "subscription"
    }
  ];
  const getNavClass = ({
    isActive
  }: {
    isActive: boolean;
  }) => isActive ? "flex items-center w-full px-4 py-2 rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-200 font-medium" : "flex items-center w-full px-4 py-2 rounded-xl border border-transparent text-gray-800 hover:border-gray-200 hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-medium";
  return <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-border relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(false)}
          className="md:hidden absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
        <a href={localizedPath('/')} className="block">
          <img 
            src={revwheelLogo} 
            alt="RevWheel" 
            className="h-[132px] w-auto mx-auto cursor-pointer hover:opacity-80 transition-opacity" 
            loading="eager" 
            fetchPriority="high"
            width={132}
            height={132}
            decoding="sync"
          />
        </a>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground px-3">
            {t('sidebar.mainMenu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClass}
                      data-onboarding={item.onboardingId}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-800'}`} />
                          <span className={isActive ? 'text-primary' : 'text-gray-800'}>{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-4">
        {(isOnTrial || isTrialExpired) && isTrialVisible && (
          <Card className={`shadow-sm p-3 ${isTrialExpired ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex flex-col gap-2">
              <p className={`text-xs font-semibold whitespace-nowrap text-center ${isTrialExpired ? 'text-red-800' : 'text-orange-800'}`}>
                {getTrialMessage()}
              </p>
              <Button 
                className="text-xs h-8 px-4 font-semibold bg-red-400 text-white hover:bg-red-500 rounded-md w-full whitespace-nowrap"
                onClick={() => navigate(localizedPath("/dashboard/subscription"))}
              >
                <Clock className="w-3.5 h-3.5 shrink-0 -mr-1.5" />
                {t('sidebar.upgradeNow')}
              </Button>
            </div>
          </Card>
        )}
        
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.user?.fullName?.charAt(0).toUpperCase() || user?.user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.user?.fullName || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.user?.email || 'user@revwheel.fr'}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={logout}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <LogOut className="h-4 w-4" />
            {t('sidebar.disconnect')}
          </span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => {
            setOpenMobile(false);
            startOnboarding();
          }}
        >
          <span
            className={`inline-flex items-center gap-2 whitespace-nowrap ${
              language === 'fr' ? 'text-sm' : ''
            }`}
          >
            <Sparkles className="h-4 w-4" />
            {t('sidebar.rewatchGuide')}
          </span>
        </Button>
      </SidebarFooter>
    </Sidebar>;
}
