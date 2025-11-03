import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/components/NotificationProvider";
import { TranslationProvider } from "@/components/TranslationProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthContextProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
// Dashboard pages
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import WheelGame from "./pages/WheelGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthContextProvider>
        <LanguageProvider>
          <TranslationProvider>
            <NotificationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Landing pages */}
                  <Route path="/" element={<Index />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  {/* Dashboard routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/customers" element={<Customers />} />
                  <Route path="/dashboard/settings" element={<Settings />} />
                  <Route path="/dashboard/subscription" element={<Subscription />} />
                  <Route path="/wheelGame/:wheelId" element={<WheelGame />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </TranslationProvider>
        </LanguageProvider>
      </AuthContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
