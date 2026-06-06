import React from "react"
import { Check } from "lucide-react"
import { cn } from "../utils/cn"

export function StepCard({ steps = [], currentStep = 0, className }) {
  return (
    <div className={cn("w-full flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/20 backdrop-blur-md", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep
        const isActive = idx === currentStep

        return (
          <React.Fragment key={step}>
            {/* Step Node */}
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-350 z-10",
                  isCompleted && "bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
                  isActive && "bg-slate-950 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-4 ring-cyan-500/10",
                  !isCompleted && !isActive && "bg-slate-900 border-slate-800 text-slate-500"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <span className="text-sm font-bold">{idx + 1}</span>}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold mt-2 text-center transition-colors duration-300",
                  isActive && "text-cyan-400",
                  isCompleted && "text-slate-300",
                  !isCompleted && !isActive && "text-slate-500"
                )}
              >
                {step}
              </span>
            </div>

            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div className="h-0.5 flex-1 -mt-5 bg-slate-800 overflow-hidden min-w-[30px]">
                <div
                  className={cn("h-full bg-emerald-500 transition-all duration-500 ease-in-out", isCompleted ? "w-full" : "w-0")}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
