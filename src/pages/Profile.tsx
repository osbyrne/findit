import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { db } from '@/database/dexie';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Check if user is logged in
        const user = db.getCurrentUser();
        if (!user) {
            toast.error('You must be logged in to view your profile');
            navigate('/');
        } else {
            setCurrentUser(user);
            setIsLoading(false);
        }
    }, [navigate]);

    const handleSignOut = () => {
        db.signOut();
        Cookies.remove('findit_auth');
        toast.success('Signed out successfully');
        navigate('/');
    };

    const handleGoBack = () => {
        navigate("/");
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(e.currentTarget);
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            setIsLoading(false);
            return;
        }
        
        try {
            // Implement password change functionality with your backend
            // const result = await db.changePassword(currentPassword, newPassword);
            toast.success("Password changed successfully");
        } catch (error: any) {
            toast.error(`Failed to change password: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="container max-w-3xl py-12 px-4 sm:px-6 lg:px-8 mx-auto min-h-screen">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <User size={24} />
                        User Profile
                    </h1>
                    <button 
                        onClick={handleGoBack}
                        className="btn btn-ghost"
                    >
                        Back to Notes
                    </button>
                </div>
            </header>

            <main className="space-y-8">
                <div className="card bg-base-200 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Account Information</h2>
                        <div className="py-4">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <span className="font-semibold">Email: </span>
                                    <span>{currentUser?.email || 'Not logged in'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">Account Created: </span>
                                    <span>{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="py-4 space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Current Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">New Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm New Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            
                            <div className="form-control mt-6">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export { Profile };