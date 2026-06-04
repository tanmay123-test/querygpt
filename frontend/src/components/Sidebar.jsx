import { Link, useLocation } from 'react-router-dom'
import {
  CheckCircleIcon,
  DatabaseIcon,
  LightningIcon,
  LoginNavIcon,
  ShieldIcon,
  UserPlusIcon,
} from './icons.jsx'

const REGISTER_FEATURES = [
  'Intelligent SQL Autocomplete',
  'Natural Language to Query',
  'Enterprise-Grade Security',
]

export default function Sidebar({ variant = 'login' }) {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-sidebar px-6 py-8">
      <div className="flex-1">
        {variant === 'register' ? (
          <>
            <div className="mb-6 flex items-center gap-2">
              <DatabaseIcon className="h-6 w-6" color="#2563EB" />
              <span className="text-lg font-bold text-white">QueryGPT</span>
            </div>
            <p className="mb-8 text-sm leading-relaxed text-slate-400">
              Harness the power of AI to build, optimize, and manage your SQL databases with
              surgical precision.
            </p>
            <ul className="space-y-4">
              {REGISTER_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircleIcon className="h-5 w-5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className="mb-1 flex items-center gap-2">
              <DatabaseIcon className="h-6 w-6" color="#2563EB" />
              <span className="text-lg font-bold text-white">QueryGPT</span>
            </div>
            <p className="mb-10 text-[10px] font-medium uppercase tracking-widest text-slate-500">
              AI-DRIVEN SQL WORKSPACE
            </p>
            <nav className="space-y-2">
              <Link
                to="/login"
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isLogin
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LoginNavIcon />
                Login
              </Link>
              <Link
                to="/register"
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  !isLogin
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlusIcon />
                Register
              </Link>
            </nav>
          </>
        )}
      </div>

      {variant === 'login' && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4 shrink-0 text-[#94a3b8]" />
            <span className="text-[13px] text-[#94a3b8]">Enterprise Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <LightningIcon className="h-4 w-4 shrink-0 text-[#94a3b8]" />
            <span className="text-[13px] text-[#94a3b8]">Real-time AI Insights</span>
          </div>
          <div className="border-t border-slate-700 pt-4" />
        </div>
      )}

      {variant === 'register' && <div className="mb-4 border-t border-slate-700" />}

      <p className="text-[10px] text-slate-600">© 2024 QueryGPT Analytics</p>
    </aside>
  )
}
