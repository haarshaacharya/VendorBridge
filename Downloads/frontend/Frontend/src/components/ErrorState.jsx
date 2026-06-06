import React from "react"
import { AlertOctagon } from "lucide-react"

export function ErrorState({ title = "Something went wrong", description = "An error occurred while loading this view.", actionLabel = "Try Again", onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-rose-500/10 bg-rose-950/10 backdrop-blur-md">
      <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
        <AlertOctagon className="w-10 h-10 animate-bounce" />
      </div>
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-rose-300/80 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
