import { useState} from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import DashboardLayout from './components/DashboardLayout'
import DailyTracker from './components/DailyTracker'
import ReportsPage from './components/ReportsPage'
import TaskManagementPage from './components/TaskManagementPage'

// 1. Protected Route Component
// Checks if token exists. If not, redirects to Login.
const ProtectedRoute = () => {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        
        {/* Protected Routes (The App) */}
        <Route element={<ProtectedRoute />}>
           <Route path="/" element={<Navigate to="/dashboard" replace />} />
           
           {/* The Layout wraps these pages */}
          <Route element={<DashboardLayout />}>
           <Route path="/dashboard" element={<DailyTracker />} />
           {/* New Routes */}
             <Route path="/reports" element={<ReportsPage />} />
             <Route path="/tasks" element={<TaskManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

// Helper to toggle between Login/Register easily
const AuthPage = ({ mode }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  
  // Toggle logic moved here
  if (isLogin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      </div>
    </div>
  )
}

export default App