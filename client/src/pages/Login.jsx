import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// --- CONFIGURATION ---
// IMPORTANT: Ensure your FastAPI server is running at this URL.
const API_BASE_URL = 'http://127.0.0.1:8000'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false) 
  const [feedback, setFeedback] = useState({ message: '', isError: false }) 

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback({ message: '', isError: false }) 

    let hasError = false
    if (!email) {
      setEmailError('Please enter your email.')
      hasError = true
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.')
      hasError = true
    } else {
      setEmailError('')
    }

    if (!password) {
      setPasswordError('Please enter your password.')
      hasError = true
    } else {
      setPasswordError('')
    }

    if (hasError) return

    setIsLoading(true)

    // --- API CALL IMPLEMENTATION ---
    try {
      // 1. Prepare data for the OAuth2PasswordRequestForm expected by FastAPI
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI OAuth2 form uses 'username' for email
      formData.append('password', password);

      // 2. Make the POST request to the /login endpoint
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          // Required for FastAPI's OAuth2PasswordRequestForm
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        body: formData.toString(),
      })

      const data = await response.json()

      if (response.ok) {
        // Success: Store token and user details
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('token_type', data.token_type)
        
        // Store user-specific data returned by the API (like name, email, department)
        if (data.user_name) {
          localStorage.setItem('user_name', data.user_name) 
        }
        if (data.user_email) {
          localStorage.setItem('user_email', data.user_email) 
        }
        if (data.user_department) {
          localStorage.setItem('user_department', data.user_department) 
        }

        // ⭐ NEW STEP: Store the profile photo URL if it exists
        if (data.profile_photo_url) {
          localStorage.setItem('profile_photo_url', data.profile_photo_url) 
        } else {
          // Ensure it's cleared or set to an empty string if null/missing
          localStorage.removeItem('profile_photo_url') 
        }

        setFeedback({ message: 'Login successful! Redirecting...', isError: false })
        
        // Redirect to dashboard after success
        setTimeout(() => navigate('/dashboard'), 500)
      } else {
        // Handle API errors (e.g., 400 Invalid credentials)
        const errorMessage = data.detail || 'Invalid email or password. Please try again.'
        setFeedback({ message: errorMessage, isError: true })
        // Clear password on failed attempt
        setPassword('')
      }
    } catch (error) {
      console.error("Login Error:", error)
      setFeedback({ 
        message: `Connection failed. Is the FastAPI server running at ${API_BASE_URL}?`, 
        isError: true 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5ff] to-white flex items-center justify-center p-4 sm:p-6 font-[Inter]">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-8 sm:p-10 transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
        {/* Branding & Headings */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              BragBoard
            </h1>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
            Welcome back
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Sign in to start appreciating your teammates.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
              }}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
              aria-invalid={emailError ? 'true' : 'false'}
              aria-describedby={emailError ? 'email-error' : undefined}
              disabled={isLoading}
            />
            {emailError && (
              <p id="email-error" className="text-sm text-red-500 mt-1">
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) setPasswordError('')
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                aria-invalid={passwordError ? 'true' : 'false'}
                aria-describedby={passwordError ? 'password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors duration-200 disabled:opacity-70"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.988 5.86a1.232 1.232 0 0 1 1.745-1.744l2.585 2.585M16.033 9.948l1.768-1.768M6.54 6.54a7.5 7.5 0 0 0 11.23 11.23l2.585 2.585-1.744 1.744L3.988 5.86zM12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.2 1.2 0 0 1 0-.644C3.899 6.27 7.5 3.5 12 3.5c4.5 0 8.1 2.77 9.964 8.178a1.2 1.2 0 0 1 0 .644C20.1 17.73 16.5 20.5 12 20.5c-4.5 0-8.1-2.77-9.964-8.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="text-sm text-red-500 mt-1">
                {passwordError}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-base shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:shadow-none"
          > 
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : 'Sign In'} 
          </button>
          
        </form>

        {/* Feedback Message */}
        {feedback.message && (
          <div 
            role={feedback.isError ? "alert" : "status"}
            className={`mt-6 p-4 rounded-xl text-sm font-semibold border ${feedback.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}
          >
            <p>{feedback.message}</p>
          </div>
        )}

        {/* Bottom Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-indigo-500 hover:text-indigo-600 transition-colors duration-200 underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
