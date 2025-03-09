import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
    username: string;
    email: string;
    profilePicture: string;
    notesCount: number;
}

// Mock data (replace with actual data from your backend)
const mockProfile: ProfileData = {
    username: "JohnDoe",
    email: "john@example.com",
    profilePicture: "https://via.placeholder.com/150",
    notesCount: 42
};

const Profile: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
                ← Go Back
            </button>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center">
                    <img
                        src={mockProfile.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mb-4"
                    />
                    
                    <h1 className="text-2xl font-bold mb-2">
                        {mockProfile.username}
                    </h1>
                    
                    <p className="text-gray-600 mb-2">
                        {mockProfile.email}
                    </p>
                    
                    <div className="text-gray-700">
                        Notes written: {mockProfile.notesCount}
                    </div>
                </div>
            </div>
        </div>
    );
};

export {Profile};