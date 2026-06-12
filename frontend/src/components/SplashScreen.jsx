import React from 'react'
import { DatabaseIcon } from './icons.jsx'

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="flex flex-col items-center">
        {/* 1. Database Icon */}
        <DatabaseIcon 
          className="splash-icon" 
          color="#2563EB" 
          style={{ width: '64px', height: '64px' }} 
        />
        
        {/* 2. QueryGPT Text */}
        <h1 className="splash-title mt-4 text-[36px] font-bold text-white tracking-tight">
          QueryGPT
        </h1>
        
        {/* 3. Tagline */}
        <p className="splash-tagline mt-2 text-[14px] text-[#94a3b8] uppercase tracking-widest font-medium">
          AI-Driven SQL Workspace
        </p>
        
        {/* 4. Loading Bar */}
        <div className="mt-8 w-[200px] h-[3px] bg-[#1e293b] rounded-full overflow-hidden">
          <div className="splash-loadbar-inner h-full bg-[#2563EB]" />
        </div>
      </div>
      
      {/* 5. Version Info */}
      <div className="absolute bottom-6 text-[11px] text-[#475569] font-mono">
        v1.0.0
      </div>
    </div>
  )
}
