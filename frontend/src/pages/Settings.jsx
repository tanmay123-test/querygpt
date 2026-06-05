import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { 
  UserIcon, 
  KeyIcon, 
  PaletteIcon, 
  BellIcon, 
  ShieldIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  MonitorIcon,
  SmartphoneIcon,
  Spinner
} from '../components/icons.jsx'

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [toast, setToast] = useState(null)
  
  // Profile State
  const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Alex Smith', email: 'alex@querygpt.com' }
  const [fullName, setFullName] = useState(user.full_name)
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  // API State
  const [showApiKey, setShowApiKey] = useState(false)
  const [testingApi, setTestingApi] = useState(false)
  const [apiStatus, setApiStatus] = useState(null)
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile')

  // Appearance State
  const [sidebarColor, setSidebarColor] = useState('#0f172a')
  const [fontSize, setFontSize] = useState('medium')

  // Notifications State
  const [notifications, setNotifications] = useState({
    queryCompletion: true,
    errorAlerts: true,
    weeklySummary: false,
    productUpdates: true,
    securityAlerts: true
  })

  // Security State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const showSuccessToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleTestApi = async () => {
    setTestingApi(true)
    setApiStatus(null)
    await new Promise(r => setTimeout(resolve, 1000))
    setApiStatus('API working!')
    setTestingApi(false)
  }

  const navItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'api', label: 'API Keys', icon: KeyIcon },
    { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
  ]

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-5xl mx-auto flex gap-8">
        {/* LEFT NAV */}
        <div className="w-[240px] shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-all rounded-lg border-l-3 ${
                    isActive 
                      ? 'bg-[#1e293b] text-white border-[#2563EB]' 
                      : 'text-gray-500 border-transparent hover:bg-[#1e293b]/50 hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 min-w-0">
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                <p className="text-sm text-gray-500">Manage your account information</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 bg-[#2563EB] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3">
                    {initials}
                  </div>
                  <button className="text-sm text-gray-500 hover:text-[#2563EB]">Change Avatar</button>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">{fullName}</h3>
                </div>

                <div className="space-y-5 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:ring-1 focus:ring-[#2563EB] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={user.email}
                      readOnly
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed outline-none"
                    />
                    <p className="mt-1.5 text-xs text-gray-400">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-[#2563EB]">
                      Editor Tier
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Member since June 2024</span>
                    <button 
                      onClick={() => showSuccessToast('Profile updated!')}
                      className="bg-[#2563EB] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">API Configuration</h2>
                <p className="text-sm text-gray-500">Manage your AI provider settings</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">GROQ</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">GROQ</h4>
                      <p className="text-xs text-gray-500">AI Provider</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Connected
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
                    <div className="relative">
                      <input 
                        type={showApiKey ? 'text' : 'password'}
                        value="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"
                        readOnly
                        className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm font-mono outline-none"
                      />
                      <button 
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
                      <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-[#2563EB]"
                      >
                        <option>llama-3.3-70b-versatile</option>
                        <option>llama-3.1-8b-instant</option>
                        <option>mixtral-8x7b-32768</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={handleTestApi}
                        disabled={testingApi}
                        className="flex-1 bg-white border border-[#2563EB] text-[#2563EB] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {testingApi ? <Spinner className="h-4 w-4" /> : null}
                        {testingApi ? 'Testing...' : 'Test Connection'}
                      </button>
                    </div>
                  </div>
                  {apiStatus && <p className="text-xs text-green-600 font-medium">{apiStatus}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center opacity-60">
                  <h4 className="font-bold text-gray-400 text-sm">OpenAI</h4>
                  <span className="mt-2 px-2 py-0.5 rounded bg-gray-200 text-[10px] font-bold text-gray-500">COMING SOON</span>
                </div>
                <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center opacity-60">
                  <h4 className="font-bold text-gray-400 text-sm">Anthropic Claude</h4>
                  <span className="mt-2 px-2 py-0.5 rounded bg-gray-200 text-[10px] font-bold text-gray-500">COMING SOON</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                <p className="text-sm text-gray-500">Customize your workspace</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Theme</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border-2 border-[#2563EB] rounded-xl p-4 bg-white cursor-pointer shadow-sm">
                      <div className="w-full h-12 bg-gray-100 rounded mb-2" />
                      <span className="text-xs font-bold text-gray-900">Light</span>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 opacity-60 cursor-not-allowed">
                      <div className="w-full h-12 bg-gray-800 rounded mb-2" />
                      <span className="text-xs font-bold text-gray-400">Dark (Soon)</span>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 opacity-60 cursor-not-allowed">
                      <div className="w-full h-12 bg-gradient-to-r from-gray-100 to-gray-800 rounded mb-2" />
                      <span className="text-xs font-bold text-gray-400">System</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Sidebar Color</h4>
                  <div className="flex gap-4">
                    {[
                      { name: 'Navy', hex: '#0f172a' },
                      { name: 'Gray', hex: '#1f2937' },
                      { name: 'Purple', hex: '#1e1b4b' },
                      { name: 'Green', hex: '#052e16' },
                      { name: 'Black', hex: '#000000' }
                    ].map(color => (
                      <button 
                        key={color.hex}
                        onClick={() => setSidebarColor(color.hex)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${sidebarColor === color.hex ? 'border-[#2563EB] scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Font Size</h4>
                  <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
                    {['small', 'medium', 'large'].map(size => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`px-6 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${fontSize === size ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">Control your notification preferences</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
                {[
                  { id: 'queryCompletion', label: 'Query completion alerts', desc: 'Notify when long queries finish' },
                  { id: 'errorAlerts', label: 'Error notifications', desc: 'Alert on query failures' },
                  { id: 'weeklySummary', label: 'Weekly summary email', desc: 'Receive weekly usage report' },
                  { id: 'productUpdates', label: 'Product updates', desc: 'News about new features' },
                  { id: 'securityAlerts', label: 'Security alerts', desc: 'Login from new devices' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${notifications[item.id] ? 'bg-[#2563EB]' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 ease-in-out ${notifications[item.id] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-500">Keep your account secure</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-6">Change Password</h4>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none" />
                  </div>
                  <button 
                    onClick={() => showSuccessToast('Password updated!')}
                    className="w-full bg-[#2563EB] text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-6">Active Sessions</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MonitorIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Windows • Chrome</p>
                        <p className="text-xs text-gray-500">Mumbai, India • Current session</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-green-100 text-[10px] font-bold text-green-700 uppercase">Active now</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <SmartphoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Android • Mobile App</p>
                        <p className="text-xs text-gray-500">Mumbai, India • 2 days ago</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-gray-400 hover:text-red-500">Revoke</button>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl border border-red-200 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-red-700 mb-2">Danger Zone</h4>
                <p className="text-xs text-red-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div className="flex items-center gap-3 bg-[#22c55e] text-white px-6 py-3.5 rounded-xl shadow-lg">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="font-medium">✓ {toast}</span>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900">Delete Account?</h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure? This cannot be undone. All your data will be permanently removed.</p>
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
