
import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "sonner";

interface AuthFormProps {
  onSignedIn: () => void;
}

const AuthForm = ({ onSignedIn }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (isSignUp) {
        result = await db.signUp(email, password);
      } else {
        result = await db.signIn(email, password);
      }

      if (result.success) {
        toast.success(result.message);
        onSignedIn();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-medium mb-6">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-1 text-primary hover:underline"
            type="button"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
      
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Note: For testing purposes, email verification might be disabled in Supabase.
      </p>
    </div>
  );
};

export default AuthForm;
