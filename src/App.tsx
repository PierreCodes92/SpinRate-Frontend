import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/components/NotificationProvider";
import { TranslationProvider } from "@/components/TranslationProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { lazy, Suspense } from "react";

// Eager load critical landing page
import Index from "./pages/Index";

// Lazy load non-critical pages for better initial load performance
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

// Lazy load Dashboard pages - reduces initial bundle size
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Customers = lazy(() => import("./pages/Customers"));
const Settings = lazy(() => import("./pages/Settings"));
const Subscription = lazy(() => import("./pages/Subscription"));
const WheelGame = lazy(() => import("./pages/WheelGame"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

// Shared routes component to avoid duplication
const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Landing pages - Index is eagerly loaded for best LCP */}
      <Route path="/" element={<Index />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      {/* Dashboard routes - lazy loaded */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/customers" element={<Customers />} />
      <Route path="/dashboard/settings" element={<Settings />} />
      <Route path="/dashboard/subscription" element={<Subscription />} />
      <Route path="/wheelGame/:wheelId" element={<WheelGame />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

// Main app content with language-aware routing
const AppContent = () => (
  <LanguageProvider>
    <OnboardingProvider>
      <TranslationProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <OnboardingOverlay />
          <Routes>
            {/* English routes - /en prefix */}
            <Route path="/en/*" element={<AppRoutes />} />
            {/* French routes - default (no prefix) */}
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </NotificationProvider>
      </TranslationProvider>
    </OnboardingProvider>
  </LanguageProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
