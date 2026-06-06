import React, { useState } from "react"
import { useVendorBridgeStore } from "@/hooks/useStore"
import {
  FileText,
  ShieldCheck,
  Receipt,
  UserCheck,
  Clock,
  Filter,
  Activity as ActivityIcon
} from "lucide-react"

export function Activity() {
  const { activities, isLoaded } = useVendorBridgeStore()
  const [activeFilter, setActiveFilter] = useState("all")

  // Filter list
  const filteredLogs = activities.filter((log) => {
    return activeFilter === "all" || log.type === activeFilter
  })

  // Get log category icon & styles
  const getLogMeta = (type) => {
    switch (type) {
      case "rfq":
        return {
          icon: FileText,
          bg: "bg-sky-500/10 border-sky-500/20",
          color: "text-sky-400"
        }
      case "approvals":
        return {
          icon: ShieldCheck,
          bg: "bg-emerald-500/10 border-emerald-500/20",
          color: "text-emerald-400"
        }
      case "invoices":
        return {
          icon: Receipt,
          bg: "bg-purple-500/10 border-purple-500/20",
          color: "text-purple-400"
        }
      case "vendors":
        return {
          icon: UserCheck,
          bg: "bg-amber-500/10 border-amber-500/20",
          color: "text-amber-400"
        }
      default:
        return {
          icon: ActivityIcon,
          bg: "bg-slate-500/10 border-slate-500/20",
          color: "text-slate-400"
        }
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Title Section */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.04] pb-4 animate-slideUp">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security & Compliance</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Activity & Logs</h2>
        <p className="text-xs text-slate-500 font-medium">Procurement audit trail and system logs</p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mr-2">
          <Filter className="h-3.5 w-3.5" /> Filter Logs:
        </span>
        {[
          { id: "all", label: "All Logs" },
          { id: "rfq", label: "RFQs" },
          { id: "approvals", label: "Approvals" },
          { id: "invoices", label: "Invoices" },
          { id: "vendors", label: "Vendors" }
        ].map((pill) => (
          <button
            key={pill.id}
            onClick={() => setActiveFilter(pill.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-300 cursor-pointer ${
              activeFilter === pill.id
                ? "bg-slate-900 text-emerald-400 border-white/[0.06] shadow-sm shadow-emerald-500/5 border-b-2 border-b-emerald-400"
                : "border-white/[0.04] bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-950/60"
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Timeline audit log container */}
      <div className="rounded-3xl border border-white/[0.04] bg-slate-950/40 p-6 md:p-8 backdrop-blur-2xl shadow-2xl shadow-black/80 max-w-3xl">
        
        {isLoaded ? (
          filteredLogs.length > 0 ? (
            <div className="relative border-l border-white/[0.06] ml-4 pl-8 space-y-6 py-2">
              
              {filteredLogs.map((log, index) => {
                const meta = getLogMeta(log.type)
                const IconComponent = meta.icon

                return (
                  <div key={log.id} className="relative group animate-slide-in-left" style={{ animationDelay: `${index * 0.08}s` }}>
                    
                    {/* Timeline Pulse Dot */}
                    <span className="absolute -left-[41px] top-[14px] h-1.5 w-1.5 rounded-full bg-current animate-status-pulse" style={{ color: meta.color === 'text-sky-400' ? '#38bdf8' : meta.color === 'text-emerald-400' ? '#34d399' : meta.color === 'text-purple-400' ? '#c084fc' : meta.color === 'text-amber-400' ? '#fbbf24' : '#94a3b8' }} />
                    {/* Timeline Node Icon */}
                    <span className={`absolute -left-[50px] top-1.5 flex h-9 w-9 items-center justify-center rounded-xl border ${meta.bg} shadow-md backdrop-blur-md transition group-hover:scale-105`}>
                      <IconComponent className={`h-4.5 w-4.5 ${meta.color}`} />
                    </span>

                    {/* Log Entry Details */}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
                        {log.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="font-mono-data">{log.time}</span>
                      </div>
                    </div>

                  </div>
                )
              })}

            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              No activity logs found for the selected filter
            </div>
          )
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading system audit logs...
          </div>
        )}

      </div>

    </div>
  )
}
