// pages/MarketingDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, Calendar, Zap, TrendingUp, LogOut } from 'lucide-react'; 

// Placeholder/Mock Data Structure for Achievements (Marketing focus)
const MOCK_MARKETING_ACHIEVEMENTS = [
  { id: 1, title: 'Campaign Launch Success', description: 'Launched Q3 campaign resulting in 30% lead growth.', icon: '🎯' },
  { id: 2, title: 'Viral Content Creator', description: 'Produced a post that reached over 1 million impressions.', icon: '🔥' },
  { id: 3, title: 'SEO Optimization Expert', description: 'Improved site search ranking for three core keywords to page 1.', icon: '📈' },
  { id: 4, title: 'Event Planning Rockstar', description: 'Successfully executed the Annual Product Launch Event.', icon: '🎉' },
];

export default function MarketingDashboard() {
  const navigate = useNavigate();
  
  // 1. Initialize state: STRICTLY retrieve details from localStorage
  const [profile] = useState({
    name: localStorage.getItem('user_name') || 'Guest Marketer',
    email: localStorage.getItem('user_email') || 'marketer@bragboard.com',
    role: 'Marketing Specialist', 
    department: localStorage.getItem('user_department') || 'Marketing', 
    joined: '08/15/2024', // Mock joined date
    profilePhotoUrl: 'https://i.pravatar.cc/150?img=33', // Different placeholder image
    achievements: MOCK_MARKETING_ACHIEVEMENTS,
  });
  
  const userDepartment = profile.department;

  // 2. Redirect check and Logout Handler
  useEffect(() => {
    // Redirect if they somehow landed here without the right department
    if (userDepartment !== 'Marketing') {
      navigate('/dashboard', { replace: true });
    }
  }, [userDepartment, navigate]);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-green-50 p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Header and Logout Button - Green/Teal Theme */}
        <header className="flex justify-between items-center py-5 px-8 bg-white shadow-xl rounded-2xl mb-8 border-t-4 border-teal-600">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Hey, <span className="text-teal-600 tracking-wide">{profile.name.split(' ')[0]}</span>!
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
              <div className="w-36 h-36 rounded-full border-4 border-teal-500 shadow-xl overflow-hidden mb-4">
                <img 
                  src={profile.profilePhotoUrl} 
                  alt={`${profile.name} Profile`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-teal-600 font-medium mt-1">{profile.role}</p>
            </div>

            {/* Profile Detail List - Teal Accent */}
            <div className="space-y-5 text-gray-700">
              {/* Email */}
              <div className="flex items-center space-x-3 p-2 bg-teal-50 rounded-lg">
                <Mail className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">EMAIL</p>
                  <p className="font-medium text-sm">{profile.email}</p>
                </div>
              </div>
              {/* Department */}
              <div className="flex items-center space-x-3 p-2 bg-teal-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">DEPARTMENT</p>
                  <p className="font-medium text-sm text-teal-700">{profile.department}</p>
                </div>
              </div>
              {/* Role */}
              <div className="flex items-center space-x-3 p-2 bg-teal-50 rounded-lg">
                <User className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">ROLE</p>
                  <p className="font-medium text-sm">{profile.role}</p>
                </div>
              </div>
              {/* Joined */}
              <div className="flex items-center space-x-3 p-2 bg-teal-50 rounded-lg">
                <Calendar className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">JOINED</p>
                  <p className="font-medium text-sm">{profile.joined}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 2 & 3: Achievements and Feed */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Achievements Section - Dark Teal Background */}
            <div className="bg-teal-700 p-8 rounded-2xl shadow-2xl text-white">
              <h2 className="text-2xl font-extrabold border-b border-teal-500 pb-3 mb-6 flex items-center space-x-3">
                <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <span>Your Marketing Impact</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-teal-800 p-4 rounded-xl shadow-lg hover:bg-teal-600 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                        <p className="text-xl">{achievement.icon}</p>
                        <h3 className="font-bold text-lg">{achievement.title}</h3>
                    </div>
                    <p className="text-sm text-teal-200 mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shoutouts Feed Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
                Marketing Team Shoutouts Feed
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
