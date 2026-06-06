import React from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  GitCompare,
  CheckSquare,
  Receipt,
  History,
  LogOut,
  Infinity
} from "lucide-react"
import { useStore } from "../hooks/useStore"
import { cn } from "../utils/cn"

export function Sidebar() {
  const { logout, user } = useStore()

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Vendors Directory", path: "/vendors", icon: Users },
    { name: "RFQs Specifications", path: "/rfqs", icon: FileSpreadsheet },
    { name: "Quotations Bids", path: "/quotations", icon: GitCompare },
    { name: "L2 Approvals", path: "/approvals", icon: CheckSquare },
    { name: "POs & Invoices", path: "/invoices", icon: Receipt },
    { name: "Activity Logs", path: "/activity", icon: History },
  ]

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-950/60 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Infinity className="w-6 h-6 text-slate-950 stroke-[3]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white leading-none tracking-tight">VendorBridge</h1>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">ERP Procurement</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/5 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-white")} />
                  <span>{link.name}</span>
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Section / Logout */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl border border-white/5 bg-slate-900/40">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center shrink-0 shadow-md uppercase">
              {user?.username?.charAt(0) || "P"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate leading-tight">{user?.username || "Guest User"}</p>
              <p className="text-[9px] text-indigo-300 truncate font-semibold uppercase tracking-wider">{user?.role || "Vendor Manager"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 shrink-0"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
