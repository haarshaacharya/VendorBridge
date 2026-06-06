import React from "react"
import { cn } from "../utils/cn"

export function AnalysisCard({ title, value, icon, trend, trendType = "positive", color = "cyan", className }) {
  const colorMap = {
    cyan: "from-cyan-500/20 to-blue-500/5 border-cyan-500/20 text-cyan-400",
    indigo: "from-indigo-500/20 to-purple-500/5 border-indigo-500/20 text-indigo-400",
    amber: "from-amber-500/20 to-orange-500/5 border-amber-500/20 text-amber-400",
    emerald: "from-emerald-500/20 to-teal-500/5 border-emerald-500/20 text-emerald-400",
    rose: "from-rose-500/20 to-red-500/5 border-rose-500/20 text-rose-400",
  }

  const badgeColorMap = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    negative: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden p-6 rounded-2xl border bg-gradient-to-br bg-slate-900/40 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]",
        colorMap[color],
        className
      )}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-current shadow-inner">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", badgeColorMap[trendType])}>
            {trend}
          </span>
          <span className="text-xs text-slate-500 font-medium">vs last month</span>
        </div>
      )}
    </div>
  )
}
