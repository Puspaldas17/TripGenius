import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy-load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Planner = lazy(() => import("./pages/Planner"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const SharedTrip = lazy(() => import("./pages/SharedTrip"));
const TravelJournal = lazy(() => import("./pages/TravelJournal"));
const TripReviews = lazy(() => import("./pages/TripReviews"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
import Navbar from "./components/site/Navbar";
import Footer from "./components/site/Footer";
import ErrorBoundary from "./components/site/ErrorBoundary";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { PageTransition } from "./components/common/PageTransition";
import { AuthProvider } from "./contexts/AuthContext";
import AIChatWidget from "./components/AIChatWidget";
import OnboardingModal from "./components/OnboardingModal";
import { toast } from "sonner";

const queryClient = new QueryClient();

function GlobalErrorTrap() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      toast.error(e.message || "Runtime error");
      // console.error is fine for dev; could POST to server here

      console.error("[window.error]", e.error || e.message);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg =
        (e.reason && (e.reason.message || String(e.reason))) ||
        "Unhandled promise rejection";
      toast.error(msg);

      console.error("[unhandledrejection]", e.reason);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/trip/share/:token" element={<SharedTrip />} />
      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <TravelJournal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <TripReviews />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <ErrorBoundary>
                <main className="flex-1">
                  <PageTransition>
                    <AppRoutes />
                  </PageTransition>
                  <GlobalErrorTrap />
                </main>
              </ErrorBoundary>
              <Footer />
              <AIChatWidget />
              <OnboardingModal />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
