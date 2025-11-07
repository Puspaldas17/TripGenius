import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Planner from "./pages/Planner";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/site/Navbar";
import Footer from "./components/site/Footer";
import ErrorBoundary from "./components/site/ErrorBoundary";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { PageTransition } from "./components/common/PageTransition";
import { AuthProvider } from "./contexts/AuthContext";
import { toast } from "sonner";

const queryClient = new QueryClient();

function GlobalErrorTrap() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      toast.error(e.message || "Runtime error");
      // console.error is fine for dev; could POST to server here
      // eslint-disable-next-line no-console
      console.error("[window.error]", e.error || e.message);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg =
        (e.reason && (e.reason.message || String(e.reason))) ||
        "Unhandled promise rejection";
      toast.error(msg);
      // eslint-disable-next-line no-console
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
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
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
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <ErrorBoundary>
              <main className="flex-1">
                <AppRoutes />
                <GlobalErrorTrap />
              </main>
            </ErrorBoundary>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
