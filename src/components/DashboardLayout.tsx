import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageToggle } from "@/components/LanguageToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative dashboard-fonts">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <SidebarTrigger className="-ml-2" />
            <div className="flex items-center">
              <LanguageToggle isScrolled={true} />
            </div>
          </header>
          <main className="flex-1 overflow-auto md:px-6 py-[13px] px-[17px]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
}