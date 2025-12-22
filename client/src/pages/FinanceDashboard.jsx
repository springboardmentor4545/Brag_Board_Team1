// pages/FinanceDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, Calendar, Calculator, FileText, LogOut, TrendingUp } from 'lucide-react'; 
import ProfilePictureEditor from './ProfilePictureEditor.jsx'; // 1. IMPORT EDITOR

// Placeholder/Mock Data Structure for Achievements (Finance focus)
const MOCK_FINANCE_ACHIEVEMENTS = [
  { id: 1, title: 'Budget Oversight Master', description: 'Identified and corrected a recurring $50k expense leak.', icon: '🔍' },
  { id: 2, title: 'Quarterly Reporting Wizard', description: 'Delivered Q3 financial reports three days ahead of schedule.', icon: '📅' },
  { id: 3, title: 'Compliance Hero', description: 'Successfully navigated the new international tax regulations.', icon: '🔒' },
  { id: 4, title: 'Process Automation Champion', description: 'Automated monthly reconciliation, saving 40 man-hours.', icon: '🤖' },
];

export default function FinanceDashboard() {
  const navigate = useNavigate();
  
  // Get initial photo URL from localStorage, providing a default if not found
  const initialPhotoUrl = localStorage.getItem('user_profile_photo_url') || 'https://i.pravatar.cc/150?img=12';

  const [profile, setProfile] = useState({
    name: localStorage.getItem('user_name') || 'Guest Finance',
    email: localStorage.getItem('user_email') || 'finance@bragboard.com',
    role: 'Financial Analyst', 
    department: localStorage.getItem('user_department') || 'Finance', 
    joined: '01/01/2023', // Mock joined date
    profilePhotoUrl: initialPhotoUrl, // 2. USE STATE FOR PHOTO URL
    achievements: MOCK_FINANCE_ACHIEVEMENTS,
  });
  
  const userDepartment = profile.department;

  // 3. HANDLER FUNCTION
  const handlePhotoUpdate = (newUrl) => {
    setProfile(prev => ({ ...prev, profilePhotoUrl: newUrl }));
  };

  // 2. Redirect check and Logout Handler
  useEffect(() => {
    if (userDepartment !== 'Finance') {
      navigate('/dashboard', { replace: true });
    }
  }, [userDepartment, navigate]);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Header and Logout Button - Navy Blue/Cyan Theme */}
        <header className="flex justify-between items-center py-5 px-8 bg-white shadow-xl rounded-2xl mb-8 border-t-4 border-cyan-500">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome, <span className="text-cyan-600 tracking-wide">{profile.name.split(' ')[0]}</span>!
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
            
            {/* Profile Photo and Title - Uses the NEW Editor Component */}
            <div className="flex flex-col items-center border-b pb-6 mb-6">
              
              {/* 4. INTEGRATE EDITOR */}
              <ProfilePictureEditor 
                currentPhotoUrl={profile.profilePhotoUrl} 
                onPhotoUpdate={handlePhotoUpdate} 
                accentColor="border-cyan-500" 
              /> 
              
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-cyan-600 font-medium mt-1">{profile.role}</p>
            </div>

            {/* Profile Detail List - Navy Blue/Cyan Accent */}
            <div className="space-y-5 text-gray-700">
              {/* Email */}
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">EMAIL</p>
                  <p className="font-medium text-sm">{profile.email}</p>
                </div>
              </div>
              {/* Department */}
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">DEPARTMENT</p>
                  <p className="font-medium text-sm text-blue-700">{profile.department}</p>
                </div>
              </div>
              {/* Role */}
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">ROLE</p>
                  <p className="font-medium text-sm">{profile.role}</p>
                </div>
              </div>
              {/* Joined */}
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">JOINED</p>
                  <p className="font-medium text-sm">{profile.joined}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 2 & 3: Achievements and Feed */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Achievements Section - Dark Navy Blue Background */}
            <div className="bg-blue-800 p-8 rounded-2xl shadow-2xl text-white">
              <h2 className="text-2xl font-extrabold border-b border-blue-500 pb-3 mb-6 flex items-center space-x-3">
                <Calculator className="w-6 h-6 text-cyan-400" />
                <span>Your Financial Excellence</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-blue-900 p-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                        <p className="text-xl">{achievement.icon}</p>
                        <h3 className="font-bold text-lg">{achievement.title}</h3>
                    </div>
                    <p className="text-sm text-blue-200 mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shoutouts Feed Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Finance Team Shoutouts Feed</span>
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
