import React from "react"
import { cn } from "../utils/cn"

export function InputField({ label, error, className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-300 select-none">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/10 text-white placeholder-slate-500 backdrop-blur-md outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
          error && "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20"
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-rose-400 font-medium mt-0.5 animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  )
}
