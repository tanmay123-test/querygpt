import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { 
  DatabaseIcon, 
  LinkIcon, 
  CheckCircleIcon, 
  WifiIcon, 
  EyeIcon, 
  EyeOffIcon,
  Spinner
} from '../components/icons.jsx'

const INITIAL_CONNECTIONS = [
  {
    id: 1,
    name: 'ecommerce_db',
    type: 'POSTGRESQL',
    host: 'localhost:5432',
    tables: 20,
    status: 'Connected',
    active: true
  },
  {
    id: 2,
    name: 'analytics_db',
    type: 'MYSQL',
    host: '192.168.1.100:3306',
    tables: 0,
    status: 'Disconnected',
    active: false
  }
]

export default function Connections() {
  const navigate = useNavigate()
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS)
  const [form, setForm] = useState({
    connectionName: '',
    dbType: 'PostgreSQL',
    host: 'localhost',
    port: '5432',
    dbName: '',
    username: 'postgres',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [testStatus, setTestStatus] = useState(null)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const newForm = { ...prev, [name]: value }
      if (name === 'dbType') {
        if (value === 'PostgreSQL') newForm.port = '5432'
        else if (value === 'MySQL') newForm.port = '3306'
        else if (value === 'MongoDB') newForm.port = '27017'
      }
      return newForm
    })
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTestStatus(null)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTestStatus('success')
    setTesting(false)
  }

  const handleSaveConnection = async () => {
    if (!form.connectionName || !form.dbName) {
      alert('Please fill required fields')
      return
    }
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newConn = {
      id: Date.now(),
      name: form.connectionName,
      type: form.dbType.toUpperCase(),
      host: `${form.host}:${form.port}`,
      tables: 5,
      status: 'Connected',
      active: true
    }
    
    setConnections(prev => [...prev, newConn])
    setSaving(false)
    setForm({
      connectionName: '',
      dbType: 'PostgreSQL',
      host: 'localhost',
      port: '5432',
      dbName: '',
      username: 'postgres',
      password: ''
    })
    setTestStatus(null)
    showToast('Connection saved successfully!')
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const scrollToForm = () => {
    document.getElementById('add-connection-form').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <DashboardLayout 
      title="Database Connections"
      rightAction={
        <button 
          onClick={scrollToForm}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <span className="text-lg">+</span> Add Connection
        </button>
      }
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* SECTION 1: Connected Databases */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#0f172a]">Connected Databases</h2>
            <span className="text-sm text-[#64748b]">{connections.filter(c => c.active).length} active connections found</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {connections.map((conn) => (
              <div 
                key={conn.id} 
                className={`relative bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm transition-all hover:shadow-md border-l-4 ${
                  conn.active ? 'border-l-[#22c55e]' : 'border-l-[#94a3b8]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${conn.active ? 'bg-[#22c55e]' : 'bg-[#94a3b8]'}`} />
                    <span className="text-sm font-bold text-[#0f172a]">{conn.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold rounded px-2 py-0.5 ${
                    conn.type === 'POSTGRESQL' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {conn.type}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#64748b] mb-3">
                  <LinkIcon className="h-3 w-3" />
                  {conn.host}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium mb-5">
                  {conn.active ? (
                    <>
                      <CheckCircleIcon className="h-3.5 w-3.5 text-[#22c55e]" />
                      <span className="text-[#22c55e]">{conn.tables} tables • Connected</span>
                    </>
                  ) : (
                    <>
                      <div className="h-3.5 w-3.5 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                        <span className="text-[10px] font-bold">!</span>
                      </div>
                      <span className="text-[#ef4444]">Disconnected</span>
                    </>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  {conn.active ? (
                    <>
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 bg-[#2563EB] text-white rounded-lg py-2 text-sm font-medium transition-colors hover:bg-blue-700"
                      >
                        Query
                      </button>
                      <button className="flex-1 border border-[#e2e8f0] text-[#64748b] rounded-lg py-2 text-sm font-medium transition-colors hover:bg-slate-50">
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 bg-[#2563EB] text-white rounded-lg py-2 text-sm font-medium transition-colors hover:bg-blue-700">
                        Reconnect
                      </button>
                      <button className="flex-1 border border-red-200 text-[#ef4444] rounded-lg py-2 text-sm font-medium transition-colors hover:bg-red-50">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            <div 
              onClick={scrollToForm}
              className="flex flex-col items-center justify-center min-h-[160px] bg-white rounded-xl border-2 border-dashed border-[#e2e8f0] cursor-pointer transition-all hover:bg-slate-50 hover:border-[#2563EB] group"
            >
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] text-2xl transition-all group-hover:scale-110">
                +
              </div>
              <span className="mt-3 text-sm font-medium text-[#64748b]">Add New Database</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Add New Connection Form */}
        <section id="add-connection-form" className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">Add New Connection</h2>
            <p className="text-sm text-[#64748b] mt-1">Configure your database credentials to start querying.</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#475569] mb-1.5 block">Connection Name</label>
                <input 
                  type="text"
                  name="connectionName"
                  value={form.connectionName}
                  onChange={handleInputChange}
                  placeholder="e.g. Production DB"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm text-gray-900 outline-none transition-all"
                />
              </div>

              {form.dbType !== 'SQLite' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-[#475569] mb-1.5 block">Host / IP Address</label>
                    <input 
                      type="text"
                      name="host"
                      value={form.host}
                      onChange={handleInputChange}
                      placeholder="localhost"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm text-gray-900 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#475569] mb-1.5 block">Port</label>
                    <input 
                      type="text"
                      name="port"
                      value={form.port}
                      onChange={handleInputChange}
                      placeholder="5432"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm text-gray-900 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-[#475569] mb-1.5 block">Database Name</label>
                <input 
                  type="text"
                  name="dbName"
                  value={form.dbName}
                  onChange={handleInputChange}
                  placeholder="mydb"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm text-gray-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#475569] mb-1.5 block">Database Type</label>
                <select 
                  name="dbType"
                  value={form.dbType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm text-gray-900 outline-none transition-all appearance-none"
                >
                  <option>PostgreSQL</option>
                  <option>MySQL</option>
                  <option>SQLite</option>
                  <option>MongoDB</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#475569] mb-1.5 block">Username</label>
                <input 
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  placeholder="postgres"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm text-gray-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#475569] mb-1.5 block">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm text-gray-900 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#f1f5f9] pt-6">
            <div>
              {testStatus === 'success' && (
                <div className="flex items-center gap-2 text-sm text-[#22c55e]">
                  <CheckCircleIcon className="h-4 w-4" />
                  Connection successful! 5 tables found.
                </div>
              )}
              {testStatus === 'error' && (
                <div className="flex items-center gap-2 text-sm text-[#ef4444]">
                  <span className="h-4 w-4 flex items-center justify-center rounded-full bg-red-100 font-bold text-[10px]">X</span>
                  Connection failed. Check credentials.
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-2 rounded-lg border border-[#2563EB] bg-white px-5 py-2.5 text-sm font-medium text-[#2563EB] transition-all hover:bg-blue-50 disabled:opacity-50"
              >
                {testing ? <Spinner className="h-4 w-4" /> : <WifiIcon className="h-4 w-4" />}
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              <button 
                onClick={handleSaveConnection}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {saving && <Spinner className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Connection'}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div className="flex items-center gap-3 bg-[#22c55e] text-white px-6 py-3.5 rounded-xl shadow-lg">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="font-medium">✓ {toast}</span>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
