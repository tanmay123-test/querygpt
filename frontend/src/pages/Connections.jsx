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
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
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
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/connections`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const data = await res.json()
      setConnections(Array.isArray(data) ? data : [])
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const newForm = { ...prev, [name]: value }
      if (name === 'dbType') {
        if (value === 'PostgreSQL') newForm.port = '5432'
        else if (value === 'MySQL') newForm.port = '3306'
        else if (value === 'MongoDB') newForm.port = '27017'
        else if (value === 'SQLite') {
          newForm.port = ''
          newForm.host = ''
        }
      }
      return newForm
    })
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/connections/test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            db_type: form.dbType.toLowerCase(),
            host: form.host,
            port: form.port ? parseInt(form.port) : 0,
            database_name: form.dbName,
            username: form.username,
            password: form.password
          })
        }
      )
      const data = await res.json()
      setTestResult(data)
    } catch(e) {
      setTestResult({
        success: false,
        message: 'Network error'
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSaveConnection = async () => {
    if (!form.connectionName || !form.dbName) {
      alert('Please fill Connection Name and Database Name')
      return
    }
    if (!testResult || !testResult.success) {
      alert('Please test connection first and ensure it succeeds')
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/connections`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: form.connectionName,
            db_type: form.dbType.toLowerCase(),
            host: form.host,
            port: form.port ? parseInt(form.port) : 0,
            database_name: form.dbName,
            username: form.username,
            password: form.password
          })
        }
      )
      if (res.ok) {
        await fetchConnections()
        setForm({
          connectionName: '',
          dbType: 'PostgreSQL',
          host: 'localhost',
          port: '5432',
          dbName: '',
          username: 'postgres',
          password: ''
        })
        setTestResult(null)
        showToast('Connection saved successfully!')
      } else {
        const err = await res.json()
        alert(`Failed to save: ${err.detail || 'Unknown error'}`)
      }
    } catch(e) {
      alert('Failed to save connection')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteConnection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this connection?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/connections/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      if (res.ok) {
        setConnections(prev => prev.filter(c => c.id !== id))
        showToast('Connection deleted')
      }
    } catch(e) {
      console.error(e)
    }
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
            {loading ? (
              <div className="col-span-3 flex justify-center py-12">
                <Spinner className="h-8 w-8 text-[#2563EB]" />
              </div>
            ) : connections.length === 0 ? (
              <div className="col-span-3 text-center py-12 bg-white rounded-xl border-2 border-dashed border-[#e2e8f0]">
                <p className="text-sm text-[#64748b]">No connections found. Add your first database below.</p>
              </div>
            ) : connections.map((conn) => (
              <div 
                key={conn.id} 
                className={`relative bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm transition-all hover:shadow-md border-l-4 ${
                  conn.is_active ? 'border-l-[#22c55e]' : 'border-l-[#94a3b8]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${conn.is_active ? 'bg-[#22c55e]' : 'bg-[#94a3b8]'}`} />
                    <span className="text-sm font-bold text-[#0f172a]">{conn.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold rounded px-2 py-0.5 ${
                    conn.db_type === 'postgresql' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {conn.db_type.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#64748b] mb-3">
                  <LinkIcon className="h-3 w-3" />
                  {conn.db_type === 'sqlite' ? 'Local File' : `${conn.host}:${conn.port}`}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium mb-5">
                  {conn.is_active ? (
                    <>
                      <CheckCircleIcon className="h-3.5 w-3.5 text-[#22c55e]" />
                      <span className="text-[#22c55e]">{conn.database_name} • Connected</span>
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
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-[#2563EB] text-white rounded-lg py-2 text-sm font-medium transition-colors hover:bg-blue-700"
                  >
                    Query
                  </button>
                  <button 
                    onClick={() => handleDeleteConnection(conn.id)}
                    className="flex-1 border border-red-200 text-[#ef4444] rounded-lg py-2 text-sm font-medium transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
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

              {form.dbType !== 'SQLite' ? (
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
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700"> 
                  For SQLite, enter the full file path in Database Name field. 
                  Example: C:/Users/Admin/mydata.db or: /home/user/mydata.db 
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
              {testResult && testResult.success && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-[#22c55e]">
                    <CheckCircleIcon className="h-4 w-4" />
                    {testResult.message}
                  </div>
                  {testResult.tables && testResult.tables.length > 0 && (
                    <p className="text-xs text-[#64748b] ml-6 max-w-[400px] truncate">
                      Tables: {testResult.tables.join(', ')}
                    </p>
                  )}
                </div>
              )}
              {testResult && !testResult.success && (
                <div className="flex items-center gap-2 text-sm text-[#ef4444]">
                  <span className="h-4 w-4 flex items-center justify-center rounded-full bg-red-100 font-bold text-[10px]">X</span>
                  {testResult.message}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-2 rounded-lg border border-[#2563EB] bg-white px-5 py-2.5 text-sm font-medium text-[#2563EB] transition-all hover:bg-blue-50 disabled:opacity-50"
              >
                {testing ? <Spinner className="h-4 w-4 animate-spin" /> : <WifiIcon className="h-4 w-4" />}
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              <button 
                onClick={handleSaveConnection}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {saving && <Spinner className="h-4 w-4 animate-spin" />}
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
