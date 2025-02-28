
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/db";
import AuthForm from "@/components/AuthForm";
import { Lock } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const currentUser = db.getCurrentUser();
      
      if (currentUser) {
        // If logged in, redirect to home page
        navigate("/");
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [navigate]);

  const handleSignedIn = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md mx-auto mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to sync your notes across devices
        </p>
      </div>
      
      <AuthForm onSignedIn={handleSignedIn} />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Demo credentials for testing:</p>
        <p className="font-mono bg-muted p-2 rounded mt-1">
<<<<<<< HEAD
          demo@example.com
        </p>        
        <p className="font-mono bg-muted p-2 rounded mt-1">
          password123
=======
          Email: demo@example.com | Password: password123
>>>>>>> ab5822a7efa355af19d95ae93f388fd4a2bda70f
        </p>
      </div>
    </div>
  );
};

export default SignIn;
