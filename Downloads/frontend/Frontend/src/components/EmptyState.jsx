import React from "react"
import { FolderOpen } from "lucide-react"

export function EmptyState({ title = "No records found", description = "Get started by creating a new entry.", actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <div className="p-4 rounded-full bg-white/5 border border-white/10 text-slate-500 mb-4 shadow-inner">
        <FolderOpen className="w-10 h-10 animate-pulse" />
      </div>
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
