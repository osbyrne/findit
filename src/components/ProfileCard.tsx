
import { useState, useEffect } from "react";
import { User, LogOut, Save } from "lucide-react";
import { db } from "@/lib/db";
import { toast } from "sonner";

interface ProfileCardProps {
  onSignOut: () => void;
}

const ProfileCard = ({ onSignOut }: ProfileCardProps) => {
  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const result = await db.getProfile();
    if (result.success && result.data) {
      setProfile(result.data);
      setDisplayName(result.data.display_name || "");
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const result = await db.updateProfile(displayName);
      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
        await fetchProfile();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const result = await db.signOut();
      if (result.success) {
        toast.success(result.message);
        onSignOut();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const currentUser = db.getCurrentUser();
  const email = currentUser?.email || "No email";

  return (
    <div className="glass-card rounded-xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{displayName || email}</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="btn-secondary inline-flex items-center gap-2"
          disabled={isLoading}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
      
      {isEditing ? (
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <button
            onClick={handleSaveProfile}
            className="btn-primary inline-flex items-center gap-2"
            disabled={isLoading}
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setDisplayName(profile?.display_name || "");
            }}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-primary hover:underline mt-2"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export {ProfileCard};
