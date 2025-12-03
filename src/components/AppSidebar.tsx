import { BarChart3, Users, Settings, CreditCard, LogOut, X, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import revwheelLogo from "@/assets/revwheel-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
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

  const menuItems = [
    {
      title: t('sidebar.analytics'),
      url: "/dashboard",
      icon: BarChart3,
      onboardingId: "analytics"
    },
    {
      title: t('sidebar.clients'),
      url: "/dashboard/customers",
      icon: Users,
      onboardingId: "clients"
    },
    {
      title: t('sidebar.settings'),
      url: "/dashboard/settings",
      icon: Settings,
      onboardingId: "settings"
    },
    {
      title: t('sidebar.subscription'),
      url: "/dashboard/subscription",
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
        <a href="/" className="block">
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
        {isOnTrial && isTrialVisible && (
          <Card className="border-orange-200 bg-orange-50 shadow-sm p-3">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-orange-800 whitespace-nowrap text-center">
                {t('sidebar.trialExpires')}
              </p>
              <Button 
                className="text-xs h-8 px-4 font-semibold bg-red-400 text-white hover:bg-red-500 rounded-md w-full whitespace-nowrap"
                onClick={() => navigate("/dashboard/subscription")}
              >
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