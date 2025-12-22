// pages/EngineerDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, Calendar, Award, LogOut } from 'lucide-react';
// Import ProfilePictureEditor at the top
import ProfilePictureEditor from './ProfilePictureEditor'; // Adjusted import path to match component
// Note: Removed the duplicate 'import React, { useState } from 'react';'

// Placeholder/Mock Data Structure for Achievements
const MOCK_ACHIEVEMENTS = [
  { id: 1, title: 'Code Quality Champion', description: 'Zero critical bugs in Q3. Automated 80% of unit tests.', icon: '⭐' },
  { id: 2, title: 'Infrastructure Hero', description: 'Migrated service to new cloud provider in under 48 hours.', icon: '🚀' },
  { id: 3, title: 'Mentor of the Month', description: 'Guided two new junior developers through their first feature deployment.', icon: '💡' },
  { id: 4, title: 'Bug Slayer', description: 'Resolved 15 high-priority production issues in one sprint.', icon: '🐛' },
];

export default function EngineerDashboard() {
  const navigate = useNavigate();

  // 1. Initialize state for user details (excluding photo URL)
  const [profile] = useState({
    name: localStorage.getItem('user_name') || 'Guest User',
    email: localStorage.getItem('user_email') || 'email.missing@bragboard.com',
    role: 'Software Engineer III',
    department: localStorage.getItem('user_department') || 'Engineering',
    joined: '10/24/2025', // Mock joined date
    achievements: MOCK_ACHIEVEMENTS,
  });

  // 2. State Management: Create a state variable for the profilePhotoUrl
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    localStorage.getItem('user_photo') || 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=ENG'
  );
  
  // 3. State Management: Create a function (handlePhotoUpdate) to update that state.
  const handlePhotoUpdate = (newUrl) => {
    console.log('New photo URL received for Engineer:', newUrl);
    setProfilePhotoUrl(newUrl);
    // Optional: Save the new URL back to localStorage or an API
    localStorage.setItem('user_photo', newUrl); 
  };
  
  const userDepartment = profile.department;

  // 4. Redirect check and Logout Handler
  useEffect(() => {
    // Redirect if they somehow landed here without the right department
    if (userDepartment !== 'Engineering') {
      navigate('/dashboard', { replace: true });
    }
  }, [userDepartment, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">

        {/* Header and Logout Button */}
        <header className="flex justify-between items-center py-5 px-8 bg-white shadow-xl rounded-2xl mb-8 border-t-4 border-indigo-600">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Hello, <span className="text-indigo-600 tracking-wide">{profile.name.split(' ')[0]}</span>!
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-5 py-2 text-base font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-lg active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Column 1: Profile Details Card */}
          <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 h-fit sticky top-8">

            {/* Profile Photo and Title */}
            <div className="flex flex-col items-center border-b pb-6 mb-6">
              <div className="w-36 h-36 rounded-full border-4 border-indigo-500 shadow-xl overflow-hidden mb-4">
                {/* Integration: Replace the static <img> tag with <ProfilePictureEditor> */}
                <ProfilePictureEditor
                  initialPhotoUrl={profilePhotoUrl}
                  onPhotoUpdate={handlePhotoUpdate}
                  // Accent Color: Pass the appropriate accentColor prop to match the dashboard's theme.
                  accentColor="#4F46E5" // Indigo theme for Engineering
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-indigo-600 font-medium mt-1">{profile.role}</p>
            </div>

            {/* Profile Detail List */}
            <div className="space-y-5 text-gray-700">
              {/* Email */}
              <div className="flex items-center space-x-3 p-2 bg-indigo-50 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">EMAIL</p>
                  <p className="font-medium text-sm">{profile.email}</p>
                </div>
              </div>
              {/* Department */}
              <div className="flex items-center space-x-3 p-2 bg-indigo-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">DEPARTMENT</p>
                  <p className="font-medium text-sm text-indigo-700">{profile.department}</p>
                </div>
              </div>
              {/* Role (Hardcoded for Engineers) */}
              <div className="flex items-center space-x-3 p-2 bg-indigo-50 rounded-lg">
                <User className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">ROLE</p>
                  <p className="font-medium text-sm">{profile.role}</p>
                </div>
              </div>
              {/* Joined (Mocked) */}
              <div className="flex items-center space-x-3 p-2 bg-indigo-50 rounded-lg">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">JOINED</p>
                  <p className="font-medium text-sm">{profile.joined}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Achievements and Feed */}
          <div className="lg:col-span-2 space-y-8">

            {/* Achievements Section */}
            <div className="bg-indigo-700 p-8 rounded-2xl shadow-2xl text-white">
              <h2 className="text-2xl font-extrabold border-b border-indigo-500 pb-3 mb-6 flex items-center space-x-3">
                <Award className="w-6 h-6 text-yellow-300" />
                <span>Your Engineering Achievements</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-indigo-800 p-4 rounded-xl shadow-lg hover:bg-indigo-600 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                        <p className="text-xl">{achievement.icon}</p>
                        <h3 className="font-bold text-lg">{achievement.title}</h3>
                    </div>
                    <p className="text-sm text-indigo-200 mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shoutouts Feed Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
                Engineering Team Shoutouts Feed
              </h2>
              <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex justify-center items-center h-48">
                  <p className="text-gray-500 text-center italic">
                      The real-time feed of appreciation from your teammates will be displayed here.
                  </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}