"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom" // <--- 1. Import this
import api from "../axios" 

export default function LoginForm({ onSwitchToRegister }) {
  const navigate = useNavigate() // <--- 2. Initialize the hook

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/login', {
        email: email,
        password: password
      })

      const { token, user } = response.data

      // Save token (Crucial for ProtectedRoute)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setSuccess(`✓ Logged in as ${user.name}!`)
      
      // <--- 3. THIS IS THE FIX: Actually navigate to the dashboard
      console.log("Redirecting to dashboard...")
      setTimeout(() => {
        navigate('/dashboard') 
      }, 500) // Small delay so user sees the success message

    } catch (err) {
      console.error("Login error:", err)
      if (err.response && err.response.status === 401) {
          setError("Invalid email or password.")
      } else if (err.code === "ERR_NETWORK") {
          setError("Cannot connect to server. Is Laravel running?")
      } else {
          setError("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ... (The rest of the UI is exactly the same) ...
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">{success}</div>
          )}

          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6">
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account? <button type="button" onClick={onSwitchToRegister} className="text-blue-600 hover:text-blue-700 font-semibold">Sign up</button>
        </p>
      </div>
    </div>
  )
}