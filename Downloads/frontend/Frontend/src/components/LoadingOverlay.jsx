import React from "react"

export function LoadingOverlay({ message = "Processing operation..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="relative flex items-center justify-center w-24 h-24 mb-4">
        {/* Animated ring glows */}
        <div className="absolute inset-0 border-4 border-cyan-500/10 border-t-cyan-400 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-indigo-500/10 border-b-indigo-400 rounded-full animate-spin-slow"></div>
      </div>
      <p className="text-sm font-semibold text-slate-300 tracking-wider animate-pulse uppercase">{message}</p>
    </div>
  )
}
