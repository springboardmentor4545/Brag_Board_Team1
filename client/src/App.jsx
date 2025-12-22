// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
// --- IMPORT ALL SPECIALIZED DASHBOARDS ---
import EngineerDashboard from './pages/EngineerDashboard.jsx'
import MarketingDashboard from './pages/MarketingDashboard.jsx'
import HRDashboard from './pages/HRDashboard.jsx'
import SalesDashboard from './pages/SalesDashboard.jsx'
import FinanceDashboard from './pages/FinanceDashboard.jsx' 

// ------------------------------------------------------------------
// COMPONENT: DynamicDashboard
// Determines which specialized dashboard to render based on user's department
// ------------------------------------------------------------------
function DynamicDashboard() {
  // Get the user's department saved during login
  const department = localStorage.getItem('user_department')

  if (!department) {
    // If no department is found (user not logged in), redirect to login
    // This is a crucial authentication guard
    return <Navigate to="/" replace />
  }

  // Check for specialized dashboards
  if (department === 'Engineering') {
    return <EngineerDashboard />
  }

  if (department === 'Marketing') {
    return <MarketingDashboard />
  }
  
  if (department === 'HR') {
    return <HRDashboard />
  }
  
  if (department === 'Sales') {
    return <SalesDashboard />
  }
  
  if (department === 'Finance') {
    return <FinanceDashboard />
  }

  // Default dashboard for all other departments (or if department key is missing/unknown)
  return <Dashboard />
}
// ------------------------------------------------------------------

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Route all traffic destined for /dashboard through the dynamic component */}
      <Route path="/dashboard" element={<DynamicDashboard />} /> 
    </Routes>
  )
}
