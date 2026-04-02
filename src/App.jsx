import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { FaEthernet, FaVideo } from 'react-icons/fa'

const TABS = [
  { id: 'network', label: 'NETWORK MONITORING', icon: FaEthernet},
  { id: 'surveillance', label: 'SURVEILLANCE', icon: FaVideo}
]

function App() {
  const [activeTab, setActiveTab] = useState('network')
  const now = new Date()

  return (
    <div className="min-h-screen flex flex-col bg-[#050608]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-7 py-3 border-b border-[#1e2d3d] bg-[#090b0e] backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-baseline font-cond font-bold text-xl tracking-[0.04em]">
            <span className="text-[#00ff88] text-glow-green">OPS</span>
            <span className="text-[#2a3f55] font-light mx-0.5">//</span>
            <span className="text-[#e8f0f8]">MONITOR</span>
          </div>
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-mono text-[0.63rem] text-[#3d5570] tracking-[0.08em]">
              <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full glow-green-sm animate-pulse-dot" />
              SYSTEM ONLINE
            </div>
            <span className="text-[#2a3f55]">|</span>
            <span className="font-mono text-[0.63rem] text-[#3d5570] tracking-[0.08em]">
              {now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </span>
          </div>
        </div>
 
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.6rem] tracking-[0.1em] text-[#00ff88] bg-[rgba(0,255,136,0.06)] border border-[#007a40] rounded-sm px-2.5 py-1">
            REAL-TIME
          </span>
          <span className="font-mono text-[0.6rem] tracking-[0.1em] text-[#00d4ff] bg-[rgba(0,212,255,0.06)] border border-[#00aacc] rounded-sm px-2.5 py-1">
            v1.0.0
          </span>
        </div>
      </header>
 
      {/* Nav */}
      <nav className="bg-[#090b0e] px-7 border-b border-[#1e2d3d]">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-3 border-b-2 transition-all duration-150 relative top-px',
                activeTab === tab.id
                  ? 'text-[#00ff88] border-[#00ff88]'
                  : 'text-[#3d5570] border-transparent hover:text-[#7a99b8] hover:border-[#2a3f55]'
              ].join(' ')}
            >
              <span className="text-[0.8rem]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
 
      {/* Main */}
      <main className="flex-1 p-7 max-w-[1600px] w-full mx-auto">
        {activeTab === 'network' && <NetworkPage />}
        {/* {activeTab === 'surveillance' && <SurveillancePage />} */}
      </main>
 
      {/* Footer */}
      <footer className="flex justify-between px-7 py-2.5 border-t border-[#1e2d3d] bg-[#090b0e] font-mono text-[0.6rem] text-[#1e3347] tracking-[0.06em]">
        <span>OPS//MONITOR · DASHBOARD SURVEILLANCE & NETWORK MONITORING SYSTEM</span>
        <span className="hidden sm:block">DATA REFRESHES AUTOMATICALLY · FRONTEND ONLY</span>
      </footer>
    </div>
  )
}

export default App
