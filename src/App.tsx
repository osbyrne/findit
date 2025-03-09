import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {Index} from "./pages/Index";
import { SignIn}  from "./pages/SignIn";
import {NotFound} from "./pages/NotFound";
import { useEffect, useState } from "react";
import { db } from "@/database/dexie";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const user = db.getCurrentUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const authListener = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });
    
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);
  
  if (isAuthenticated === null) {
    // Still loading
    return (
        <div className="h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-md"></span>
        </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
