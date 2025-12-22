// pages/HRDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, Calendar, Users, Heart, LogOut } from 'lucide-react'; 

// Placeholder/Mock Data Structure for Achievements (HR focus)
const MOCK_HR_ACHIEVEMENTS = [
  { id: 1, title: 'Employee Satisfaction Booster', description: 'Led initiative resulting in a 15% increase in annual survey satisfaction scores.', icon: '❤️' },
  { id: 2, title: 'Compliance Master', description: 'Achieved 100% compliance rate on mandatory annual training rollouts.', icon: '🛡️' },
  { id: 3, title: 'Rapid Recruiter', description: 'Reduced average time-to-hire by 10 days for critical roles.', icon: '⚡' },
  { id: 4, title: 'Wellness Advocate', description: 'Successfully launched the Q4 Mental Wellness Program.', icon: '🧘' },
];

export default function HRDashboard() {
  const navigate = useNavigate();
  
  // 1. Initialize state: STRICTLY retrieve details from localStorage
  const [profile] = useState({
    name: localStorage.getItem('user_name') || 'Guest HR',
    email: localStorage.getItem('user_email') || 'hr@bragboard.com',
    role: 'HR Manager', 
    department: localStorage.getItem('user_department') || 'HR', 
    joined: '03/10/2023', // Mock joined date
    profilePhotoUrl: 'https://i.pravatar.cc/150?img=17', // Different placeholder image
    achievements: MOCK_HR_ACHIEVEMENTS,
  });
  
  const userDepartment = profile.department;

  // 2. Redirect check and Logout Handler
  useEffect(() => {
    // Redirect if they somehow landed here without the right department
    if (userDepartment !== 'HR') {
      navigate('/dashboard', { replace: true });
    }
  }, [userDepartment, navigate]);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Header and Logout Button - Burgundy/Gold Theme */}
        <header className="flex justify-between items-center py-5 px-8 bg-white shadow-xl rounded-2xl mb-8 border-t-4 border-red-700">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome, <span className="text-red-700 tracking-wide">{profile.name.split(' ')[0]}</span>!
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
              <div className="w-36 h-36 rounded-full border-4 border-amber-500 shadow-xl overflow-hidden mb-4">
                <img 
                  src={profile.profilePhotoUrl} 
                  alt={`${profile.name} Profile`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-red-700 font-medium mt-1">{profile.role}</p>
            </div>

            {/* Profile Detail List - Gold/Red Accent */}
            <div className="space-y-5 text-gray-700">
              {/* Email */}
              <div className="flex items-center space-x-3 p-2 bg-amber-50 rounded-lg">
                <Mail className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">EMAIL</p>
                  <p className="font-medium text-sm">{profile.email}</p>
                </div>
              </div>
              {/* Department */}
              <div className="flex items-center space-x-3 p-2 bg-amber-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">DEPARTMENT</p>
                  <p className="font-medium text-sm text-red-700">{profile.department}</p>
                </div>
              </div>
              {/* Role */}
              <div className="flex items-center space-x-3 p-2 bg-amber-50 rounded-lg">
                <User className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">ROLE</p>
                  <p className="font-medium text-sm">{profile.role}</p>
                </div>
              </div>
              {/* Joined */}
              <div className="flex items-center space-x-3 p-2 bg-amber-50 rounded-lg">
                <Calendar className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">JOINED</p>
                  <p className="font-medium text-sm">{profile.joined}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 2 & 3: Achievements and Feed */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Achievements Section - Dark Burgundy Background */}
            <div className="bg-red-700 p-8 rounded-2xl shadow-2xl text-white">
              <h2 className="text-2xl font-extrabold border-b border-red-500 pb-3 mb-6 flex items-center space-x-3">
                <Users className="w-6 h-6 text-amber-300" />
                <span>Your People & Culture Impact</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-red-800 p-4 rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                        <p className="text-xl">{achievement.icon}</p>
                        <h3 className="font-bold text-lg">{achievement.title}</h3>
                    </div>
                    <p className="text-sm text-red-200 mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shoutouts Feed Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
                HR Team Shoutouts Feed
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
