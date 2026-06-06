import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import { useVendorBridgeStore } from "@/hooks/useStore"
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  CheckSquare,
  ShoppingBag,
  Receipt,
  PieChart,
  Activity,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Sparkles
} from "lucide-react"

// Floating Particle Component
function FloatingParticles() {
  const particles = [
    { size: 3, x: '10%', y: '20%', color: 'rgba(16,185,129,0.25)', duration: '15s', driftX: '60px', driftY: '-120px' },
    { size: 4, x: '80%', y: '15%', color: 'rgba(6,182,212,0.2)', duration: '18s', driftX: '-80px', driftY: '-100px' },
    { size: 2, x: '30%', y: '70%', color: 'rgba(139,92,246,0.2)', duration: '20s', driftX: '40px', driftY: '-150px' },
    { size: 5, x: '65%', y: '80%', color: 'rgba(16,185,129,0.15)', duration: '12s', driftX: '-60px', driftY: '-180px' },
    { size: 3, x: '90%', y: '50%', color: 'rgba(6,182,212,0.15)', duration: '16s', driftX: '30px', driftY: '-90px' },
    { size: 2, x: '45%', y: '35%', color: 'rgba(139,92,246,0.15)', duration: '22s', driftX: '-50px', driftY: '-130px' },
  ]

  return (
    <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            animationDuration: p.duration,
            '--drift-x': p.driftX,
            '--drift-y': p.driftY,
          }}
        />
      ))}
    </div>
  )
}

export function DashboardLayout() {
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()
  const { activities, isLoaded } = useVendorBridgeStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [pageKey, setPageKey] = useState(pathname)

  // Animate page transitions
  useEffect(() => {
    setPageKey(pathname)
  }, [pathname])

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vendors", href: "/vendors", icon: Users },
    { name: "RFQ's", href: "/rfqs", icon: FileText },
    { name: "Quotations", href: "/quotations", icon: MessageSquare },
    { name: "Approvals", href: "/approvals", icon: CheckSquare },
    { name: "Purchase Orders", href: "/invoices", icon: ShoppingBag },
    { name: "Invoices", href: "/invoices", icon: Receipt },
    { name: "Reports", href: "/reports", icon: PieChart },
    { name: "Activity", href: "/activity", icon: Activity },
  ]

  const handleSignOut = (e) => {
    e.preventDefault()
    navigate("/login")
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-slate-100">
      {/* Sleek Mesh Gradient Background */}
      <div className="fixed inset-0 bg-[#020617] z-0 overflow-hidden">
        {/* Glowing gradient blobs */}
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] min-w-[350px] min-h-[350px] rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 blur-[120px] animate-pulse-slow" style={{ animationDuration: '16s' }} />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] min-w-[400px] min-h-[400px] rounded-full bg-gradient-to-tr from-violet-600/10 to-emerald-500/5 blur-[140px] animate-pulse-slow" style={{ animationDuration: '22s' }} />
        <div className="absolute top-[35%] right-[15%] w-[45vw] h-[45vw] min-w-[300px] min-h-[300px] rounded-full bg-gradient-to-bl from-cyan-500/10 to-violet-500/5 blur-[130px] animate-pulse-slow" style={{ animationDuration: '18s' }} />
        {/* Subtle grid line overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>


      {/* Floating particles */}
      <FloatingParticles />

      {/* App wrapper */}
      <div className="relative z-10 flex min-h-screen p-3 md:p-5 gap-5">
        
        {/* SIDEBAR - Desktop */}
        <aside className="hidden lg:flex flex-col w-68 shrink-0 rounded-2xl border border-white/[0.04] bg-slate-950/40 p-5 shadow-2xl shadow-black/80 backdrop-blur-2xl transition-all duration-500 hover:border-white/[0.08]">
          {/* Logo / Title */}
          <div className="mb-8 flex items-center gap-3">
            <img src="/logo.png" className="h-9 w-9 object-contain rounded-xl shadow-lg shadow-emerald-500/10 border border-white/5" alt="VB Logo" />
            <span className="text-lg font-bold tracking-tight gradient-text">
              VendorBridge
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-300 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 text-emerald-400 border border-white/[0.05] shadow-[0_4px_20px_rgba(16,185,129,0.05)]"
                      : "text-slate-400 hover:bg-white/[0.02] hover:text-slate-200 hover:translate-x-1"
                  }`}
                >
                  {/* Animated gradient active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-emerald-400 to-cyan-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  )}
                  <Icon className={`h-[18px] w-[18px] transition-all duration-300 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-110'}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer - User Info & Logout */}
          <div className="mt-auto pt-5 border-t border-white/[0.06] space-y-3">
            {/* User card */}
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-lg">
                  PO
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-white leading-tight truncate">Procurement Officer</p>
                <p className="text-[10px] text-slate-500 truncate">Purchasing Dept.</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-medium text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/[0.06] transition-all duration-300 text-left"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative flex flex-col w-72 h-full bg-slate-950/95 border-r border-white/[0.08] p-5 backdrop-blur-xl animate-slideLeft shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" className="h-8 w-8 object-contain rounded-lg shadow-md border border-white/5" alt="VB Logo" />
                  <span className="text-lg font-bold tracking-tight gradient-text">
                    VendorBridge
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-0.5">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 text-emerald-400"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      }`}
                    >
                      <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto pt-5 border-t border-white/[0.06]">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/[0.06] transition-all text-left w-full"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* MAIN PANEL CONTENT */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Panel */}
          <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 rounded-2xl border border-white/[0.04] bg-slate-950/35 shadow-2xl shadow-black/30 backdrop-blur-2xl mb-5 transition-all duration-300">
            
            {/* Mobile Hamburger menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden rounded-lg p-2 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-base font-bold tracking-tight gradient-text-static hidden sm:block">
                VendorBridge
              </h1>
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className={`relative hidden md:block transition-all duration-500 ease-out ${searchFocused ? 'w-72' : 'w-48 lg:w-56'}`}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full bg-slate-900/40 border rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-500 ${
                    searchFocused 
                      ? 'border-emerald-500/40 bg-slate-900/60 shadow-[0_0_25px_rgba(16,185,129,0.08)]' 
                      : 'border-white/[0.06] hover:border-white/10'
                  }`}
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative rounded-xl p-2.5 hover:bg-white/[0.06] text-slate-400 hover:text-white transition-all duration-200"
                  aria-label="View notifications"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                </button>
                
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 z-50 rounded-2xl border border-white/[0.05] bg-slate-950/90 shadow-2xl backdrop-blur-2xl p-4 animate-scale-in">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
                        <span className="text-xs font-semibold text-slate-300">Notifications</span>
                        <span className="text-[10px] text-emerald-400 hover:underline cursor-pointer transition-colors">Mark all read</span>
                      </div>
                      <div className="space-y-1.5 max-h-60 overflow-y-auto">
                        {activities.slice(0, 5).map((log, i) => (
                          <div key={log.id} className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-all duration-200 animate-slide-in-left" style={{ animationDelay: `${i * 0.05}s` }}>
                            <p className="text-xs font-medium text-slate-200">{log.message}</p>
                            <span className="text-[9px] text-emerald-400/80">{log.time}</span>
                          </div>
                        ))}
                        {activities.length === 0 && (
                          <p className="text-xs text-slate-500 py-3 text-center">No active notifications</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2.5 border-l border-white/[0.06] pl-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-[11px] text-white shadow-lg">
                    PO
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-[1.5px] border-slate-950" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">Procurement Officer</p>
                  <p className="text-[10px] text-slate-500">Purchasing Dept.</p>
                </div>
              </div>

            </div>
          </header>

          {/* Main page content with transition */}
          <main className="flex-1 min-h-0 relative" key={pageKey}>
            <div className="animate-fadeIn" style={{ animationDuration: '0.3s' }}>
              <Outlet />
            </div>
          </main>
        </div>

      </div>
    </div>
  )
}
