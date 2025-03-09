import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/database/dexie";
import {AuthForm} from "@/components/AuthForm";
import { Lock } from "lucide-react";
import Cookies from "js-cookie";
import { UserData } from "@/components/AuthForm";

const AUTH_COOKIE_NAME = "findit_auth";
const COOKIE_EXPIRY_DAYS = 7;

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
    setIsLoading(true);
    
    try {
      // First check for auth cookie
      const authCookie = Cookies.get(AUTH_COOKIE_NAME);
      if (authCookie) {
        const userData = JSON.parse(authCookie);
        // Restore user session from cookie
        await db.restoreUserSession(userData);
        navigate("/");
        return;
      }
      
      // Fallback to regular session check
      const currentUser = db.getCurrentUser();
      
      if (currentUser) {
        // If logged in, redirect to home page
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      Cookies.remove(AUTH_COOKIE_NAME);
    }
      
      // First check for auth cookie
      const authCookie = Cookies.get(AUTH_COOKIE_NAME);
      if (authCookie) {
        try {
          const userData = JSON.parse(authCookie);
          // Restore user session from cookie
          await db.restoreUserSession(userData);
          navigate("/");
          return;
        } catch (error) {
          // Invalid cookie, remove it
          Cookies.remove(AUTH_COOKIE_NAME);
          console.error("Failed to restore session from cookie:", error);
        }
      }
      
      // Fallback to regular session check
      const currentUser = db.getCurrentUser();
      
      if (currentUser) {
        // If logged in, redirect to home page
        navigate("/");
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [navigate]);

const handleSignedIn = (userData: UserData): void => {
    Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(userData), { 
        expires: COOKIE_EXPIRY_DAYS,
        sameSite: 'strict'
    });
    
    navigate("/");
};

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-base-100 to-base-200">
      <div className="w-full max-w-md mx-auto mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-base-content/60 mt-2">
          Sign in to sync your notes across devices
        </p>
      </div>
  
      <AuthForm onSignedIn={handleSignedIn} />
  
      <div className="mt-8 text-center text-sm text-base-content/60">
        <p>Demo credentials for testing:</p>
        <p className="font-mono bg-base-200 p-2 rounded mt-1">
          demo@example.com
        </p>
        <p className="font-mono bg-base-200 p-2 rounded mt-1">
          password123
        </p>
      </div>
    </div>
  );
};

export { SignIn };