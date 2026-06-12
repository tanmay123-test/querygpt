import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import InputField from '../components/InputField.jsx'
import { DatabaseIcon, KeyIcon, Spinner } from '../components/icons.jsx'
import { loginUser } from '../services/api.js'

function validateLogin({ email, password }) {
  const errors = {}
  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!email.includes('@')) {
    errors.email = 'Invalid email address'
  }
  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 6) {
    errors.password = 'Min 6 characters'
  }
  return errors
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const validationErrors = validateLogin({ email, password })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      const { data } = await loginUser(email, password)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      const message =
        err.response?.data?.detail || 'Login failed. Please check your credentials.'
      setApiError(typeof message === 'string' ? message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar variant="login" />

      <main className="page-dots ml-64 flex min-h-screen flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
          <div className="w-full max-w-[480px] rounded-xl border border-input-border bg-white px-10 py-10 shadow-sm">
            <div className="mb-6 flex items-center justify-center gap-2">
              <DatabaseIcon className="h-5 w-5" color="#2563EB" />
              <span className="text-sm font-semibold text-heading">QueryGPT</span>
            </div>

            <h1 className="mb-1 text-center text-2xl font-bold text-heading">Welcome back</h1>
            <p className="mb-8 text-center text-sm text-subtext">
              Sign in to query your database
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {apiError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{apiError}</p>
              )}
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                error={errors.email}
              />

              <InputField
                id="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                showToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((v) => !v)}
              />

              <div className="mb-6 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-subtext">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-input-border text-primary focus:ring-primary"
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      style={{ width: '16px', height: '16px' }}
                    ></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-input-border" />
                <span className="text-xs font-medium uppercase text-subtext">OR</span>
                <div className="h-px flex-1 bg-input-border" />
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-input-border bg-white py-3 text-sm font-medium text-heading transition-colors hover:bg-slate-50"
              >
                <KeyIcon className="h-4 w-4 shrink-0 text-subtext" />
                Sign in with SSO
              </button>

              <p className="mt-6 text-center text-sm text-subtext">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  Register
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
              Contact Support
            </a>
          </footer>
        </div>
      </main>
    </div>
  )
}
