import React, { useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"
import { cn } from "../utils/cn"

export function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    info: <AlertCircle className="w-5 h-5 text-cyan-400" />,
  }

  const styles = {
    success: "border-emerald-500/20 bg-emerald-950/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    error: "border-rose-500/20 bg-rose-950/40 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
    info: "border-cyan-500/20 bg-cyan-950/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.1)]",
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl transition-all duration-300 animate-slideUp",
        styles[type]
      )}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
