"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom" // <--- 1. Import Router Hook
import api from "../axios" 

export default function RegisterForm({ onSwitchToLogin }) {
  const navigate = useNavigate() // <--- 2. Initialize Hook

  // --- STATE VARIABLES ---
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // Feedback State
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  // --- LOGIC: Password Strength ---
  const getPasswordStrength = (pwd) => {
    if (!pwd) return ""
    if (pwd.length < 6) return "weak"
    if (pwd.length < 8) return "fair"
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "strong"
    return "good"
  }

  const passwordStrength = getPasswordStrength(password)

  // --- LOGIC: Handle Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // 1. Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service")
      return
    }

    // 2. Prepare Data
    setIsLoading(true)

    try {
      const payload = {
        name: `${firstName} ${lastName}`,
        email: email,
        password: password,
        password_confirmation: confirmPassword
      }

      // 3. Send to Backend
      const response = await api.post('/register', payload)

      // 4. AUTO-LOGIN LOGIC (The New Part)
      // The backend returns { user: {...}, token: "..." }
      const { token, user } = response.data

      // Save credentials immediately
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setSuccess(`✓ Account created! Entering Dashboard...`)
      
      // 5. Redirect straight to Dashboard
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)

    } catch (err) {
      console.error("Registration error:", err)
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Registration failed. Please check your connection.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // --- UI: The HTML Form ---
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600 text-sm">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {success}
            </div>
          )}

          {/* First Name */}
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength ? "bg-red-500" : "bg-gray-300"}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${["good", "strong"].includes(passwordStrength) ? "bg-yellow-500" : "bg-gray-300"}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength === "strong" ? "bg-green-500" : "bg-gray-300"}`}></div>
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  Strength: {passwordStrength}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
             {/* Match Feedback */}
             {confirmPassword && (
              <p className={`text-xs mt-1 ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the Terms of Service
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                 Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}