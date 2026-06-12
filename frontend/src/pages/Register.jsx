import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import InputField from '../components/InputField.jsx'
import {
  DatabaseIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  Spinner,
  UserIcon,
} from '../components/icons.jsx'
import { registerUser } from '../services/api.js'

function validateRegister({ fullName, email, password, confirmPassword }) {
  const errors = {}
  if (!fullName.trim()) {
    errors.fullName = 'Name is required'
  }
  if (!email.trim() || !email.includes('@')) {
    errors.email = 'Invalid email address'
  }
  if (!password || password.length < 6) {
    errors.password = 'Min 6 characters'
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match'
  }
  return errors
}

export default function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const validationErrors = validateRegister({
      fullName,
      email,
      password,
      confirmPassword,
    })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      const { data } = await registerUser({
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      })
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      const detail = err.response?.data?.detail
      let message = 'Registration failed. Please try again.'
      if (typeof detail === 'string') {
        message = detail
      } else if (Array.isArray(detail)) {
        message = detail.map((item) => item.msg).join(', ')
      }
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar variant="register" />

      <main className="ml-64 flex min-h-screen flex-1 flex-col bg-page">
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
          <div className="w-full max-w-[520px] rounded-xl border border-input-border bg-white px-10 py-10 shadow-sm">
            <div className="mb-6 flex items-center justify-center gap-2">
              <DatabaseIcon className="h-5 w-5" color="#2563EB" />
              <span className="text-sm font-semibold text-heading">QueryGPT</span>
            </div>

            <h1 className="mb-1 text-center text-2xl font-bold text-heading">Create account</h1>
            <p className="mb-8 text-center text-sm text-subtext">
              Start your AI-driven data journey today.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {apiError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{apiError}</p>
              )}
              <InputField
                id="fullName"
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                error={errors.fullName}
                leftIcon={<UserIcon />}
              />

              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                error={errors.email}
                leftIcon={<MailIcon />}
              />

              <InputField
                id="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                leftIcon={<LockIcon />}
                showToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((v) => !v)}
              />

              <InputField
                id="confirmPassword"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.confirmPassword}
                leftIcon={<ShieldCheckIcon />}
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      style={{ width: '16px', height: '16px' }}
                    ></span>
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create Account
                    <span aria-hidden>→</span>
                  </>
                )}
              </button>

              <p className="mt-6 text-center text-sm text-subtext">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>

          <footer className="mt-8 text-center text-xs text-subtext">
            <a href="#" className="hover:text-heading">
              Privacy Policy
            </a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-heading">
              Terms of Service
            </a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-heading">
              Security
            </a>
          </footer>
        </div>
      </main>
    </div>
  )
}
