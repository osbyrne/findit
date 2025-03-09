import { useState } from "react";
import { db } from "@/database/dexie";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";

interface UserData {
    email: string;
    id: string;
}

interface AuthFormProps {
    onSignedIn: (userData: UserData) => void;
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
    interface AuthResult {
      success: boolean;
      message: string;
    }
    let result: AuthResult;
      
      if (isSignUp) {
        result = await db.signUp(email, password);
      } else {
        result = await db.signIn(email, password);
      }

      if (result.success) {
        toast.success(result.message);
        onSignedIn({ email, id: email }); // Using email as id for now
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

// Create separate components first
const AuthHeader = ({ isSignUp }: { isSignUp: boolean }) => (
    <h2 className="text-2xl font-medium mb-6 flex items-center">
        {isSignUp ? (
            <>
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
            </>
        ) : (
            <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
            </>
        )}
    </h2>
);

const InputField = ({
    id,
    type,
    value,
    onChange,
    label,
    placeholder,
    minLength,
}: {
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    placeholder: string;
    minLength?: number;
}) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="input input-bordered w-full"
            required
            minLength={minLength}
        />
    </div>
);

const SubmitButton = ({ isLoading, isSignUp }: { isLoading: boolean; isSignUp: boolean }) => (
    <Button
        type="submit"
        disabled={isLoading}
    >
        {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
        ) : isSignUp ? (
            "Sign Up"
        )
        : (
            "Sign In"
        )}
    </Button>
);

const ToggleAuthMode = ({ isSignUp, onToggle }: { isSignUp: boolean; onToggle: () => void }) => (
    <p className="
    mt-4 text-center text-sm text-base-content/60 flex items-center justify-center
    ">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <button
            onClick={onToggle}
            className="ml-1 btn btn-link btn-sm text-primary"
            type="button"
        >
            {isSignUp ? "Sign In" : "Sign Up"}
        </button>
    </p>
);

return (
    <div className="w-full max-w-md mx-auto">
        <div className="card bg-base-100 rounded-xl p-8 shadow-sm">
            <AuthHeader isSignUp={isSignUp} />
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    placeholder="Enter your email"
                />
                
                <InputField
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    placeholder="Enter your password"
                    minLength={6}
                />
                
                <SubmitButton isLoading={isLoading} isSignUp={isSignUp} />
            </form>
            
            <ToggleAuthMode isSignUp={isSignUp} onToggle={() => setIsSignUp(!isSignUp)} />
        </div>
    </div>
);
};

export { AuthForm };
export type { UserData };

