import React from "react"
import { cn } from "../utils/cn"

export function ProgressBar({ value, max = 100, label, color = "cyan", className }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const colorMap = {
    cyan: "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]",
    indigo: "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]",
    amber: "bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    rose: "bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]",
  }

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || value !== undefined) && (
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-slate-800 border border-white/5 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", colorMap[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
