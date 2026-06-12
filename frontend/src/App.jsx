import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Connections from './pages/Connections.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'
import SplashScreen from './components/SplashScreen.jsx'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`transition-opacity duration-300 ${showSplash ? 'opacity-100' : 'opacity-0'}`}>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <div className="opacity-0 animate-[fade-in_0.3s_ease-out_forwards]">
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AuthProvider>
        </div>
      )}
    </div>
  )
}
