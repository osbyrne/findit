import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {Dashboard} from "@/pages/Dashboard";
import { SignIn}  from "@/pages/SignIn";
import {NotFound} from "@/pages/NotFound";
import { useEffect, useState } from "react";
import { db } from "@/database/dexie";
import { supabase } from "@/integrations/supabase/client";
import { AddNote } from "@/pages/AddNote";
import { Profile } from "@/pages/Profile";

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
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-note" 
            element={
              <ProtectedRoute>
                <AddNote />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/edit-note/:id" 
            element={
              <ProtectedRoute>
                <AddNote />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export {App};
