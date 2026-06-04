import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DatabaseIcon, GridIcon, ClockIcon, SettingsIcon } from './icons.jsx'

export default function DashboardLayout({ children, title, rightAction }) {
  const location = useLocation()
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Alex Smith' }
  const initials = user.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const navItems = [
    { label: 'Query Workspace', icon: GridIcon, path: '/dashboard' },
    { label: 'Connections', icon: DatabaseIcon, path: '/connections' },
    { label: 'History', icon: ClockIcon, path: '/history' },
    { label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* LEFT SIDEBAR */}
      <aside className="fixed left-0 top-0 z-20 flex h-full w-[260px] flex-col bg-[#0f172a] p-5">
        <div className="mb-8 flex items-center gap-2 px-1">
          <DatabaseIcon className="h-5 w-5" color="#2563EB" />
          <span className="text-lg font-bold text-white">QueryGPT</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all ${
                  isActive
                    ? 'bg-[#1e293b] font-medium text-white'
                    : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#2563EB]' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-4">
          <div className="mb-4 border-t border-slate-800" />
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-[13px] font-bold text-white">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white leading-tight">{user.full_name}</span>
                <span className="text-[11px] text-[#64748b]">Editor Tier</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-[#94a3b8] hover:bg-[#1e293b] hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <div className="ml-[260px] flex flex-1 flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-[#0f172a]">{title}</h1>
          <div className="flex items-center gap-3">
            {rightAction}
            <button className="rounded-lg p-2 text-[#64748b] hover:bg-slate-100">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-[13px] font-bold text-white">
              {initials}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
