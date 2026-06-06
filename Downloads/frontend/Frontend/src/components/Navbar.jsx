import React, { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { Bell, Search, Info, HelpCircle } from "lucide-react"
import { useStore } from "../hooks/useStore"
import { cn } from "../utils/cn"

export function Navbar() {
  const { activities } = useStore()
  const location = useLocation()
  const [showBellDropdown, setShowBellDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const pathSegments = location.pathname.split("/").filter(Boolean)
  const currentViewName = pathSegments.length
    ? pathSegments[pathSegments.length - 1].replace(/-/g, " ")
    : "Dashboard"

  // Close dropdown on click outside
  useEffect(() => {
    const handleClose = () => setShowBellDropdown(false)
    window.addEventListener("click", handleClose)
    return () => window.removeEventListener("click", handleClose)
  }, [])

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-xl px-8 py-4 flex items-center justify-between gap-4">
      {/* Breadcrumb Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">VendorBridge</Link>
          {pathSegments.map((seg, idx) => (
            <React.Fragment key={seg}>
              <span>/</span>
              <span className={idx === pathSegments.length - 1 ? "text-slate-400" : ""}>
                {seg.replace(/-/g, " ")}
              </span>
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-xl font-extrabold text-white capitalize tracking-tight mt-0.5">{currentViewName}</h2>
      </div>

      {/* Action Operations */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 md:w-80 group">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search transactions, bids..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-900/40 border border-white/5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/10 focus:bg-slate-900/60"
          />
          <kbd className="absolute right-3.5 top-2.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-slate-400 font-mono font-bold select-none uppercase pointer-events-none tracking-wide">
            Ctrl+K
          </kbd>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowBellDropdown(!showBellDropdown)}
            className="relative p-2.5 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
            {activities.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-950 animate-pulse shadow-[0_0_8px_#f43f5e]" />
            )}
          </button>

          {showBellDropdown && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] overflow-hidden animate-slideUp">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Procurement Feeds</h4>
                <Link
                  to="/activity"
                  onClick={() => setShowBellDropdown(false)}
                  className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wide transition-colors"
                >
                  View All logs
                </Link>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="p-3.5 hover:bg-white/5 transition-colors">
                    <p className="text-xs text-slate-300 leading-normal font-medium">{act.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block font-semibold">{act.time}</span>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 font-semibold">
                    No activity registered yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/40 text-slate-400 hover:text-white cursor-pointer hover:bg-white/5 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </div>
      </div>
    </header>
  )
}
