import { useState, useEffect } from "react";
import { User, LogOut, Save, Edit, X } from "lucide-react";
import { db } from "@/database/dexie";
import { toast } from "sonner";

interface ProfileCardProps {
    onSignOut: () => void;
}

const ProfileCard = ({ onSignOut }: ProfileCardProps) => {
    const [displayName, setDisplayName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<{ display_name?: string } | null>(null);

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
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <User size={20} className="text-primary" />
                </div>
                <div>
                    <h3 className="font-medium">{displayName || email}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                </div>
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Display Name"
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />

                    {/* Mobile-friendly button row for editing mode */}
                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            onClick={handleSaveProfile}
                            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-50 shadow hover:shadow-md transition-shadow"
                            disabled={isLoading}
                            title="Save"
                        >
                            <Save size={20} />
                        </button>

                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setDisplayName(profile?.display_name || "");
                            }}
                            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground disabled:opacity-50 shadow hover:shadow-md transition-shadow"
                            disabled={isLoading}
                            title="Cancel"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow hover:shadow-md transition-shadow"
                        title="Edit Profile"
                    >
                        <Edit size={20} />
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive shadow hover:shadow-md transition-shadow"
                        disabled={isLoading}
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export { ProfileCard };
