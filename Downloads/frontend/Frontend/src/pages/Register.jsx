import React from "react"
import { RegisterCard } from "@/components/RegisterCard"

export function Register() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <img
        src="/sky-clouds.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-emerald-950/20 to-cyan-950/30 z-[1]" />
      <div className="absolute inset-0 z-[2] overflow-hidden">
        <div className="particle absolute" style={{ top: '12%', left: '8%', width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(52,211,153,0.4)', animationDuration: '12s', '--drift-x': '40px', '--drift-y': '-30px' }} />
        <div className="particle absolute" style={{ top: '68%', left: '85%', width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(103,232,249,0.4)', animationDuration: '16s', '--drift-x': '-35px', '--drift-y': '25px' }} />
        <div className="particle absolute" style={{ top: '35%', left: '72%', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.4)', animationDuration: '10s', '--drift-x': '20px', '--drift-y': '-45px' }} />
        <div className="particle absolute" style={{ top: '82%', left: '22%', width: 3, height: 3, borderRadius: '50%', backgroundColor: 'rgba(52,211,153,0.4)', animationDuration: '20s', '--drift-x': '-25px', '--drift-y': '-20px' }} />
        <div className="particle absolute" style={{ top: '48%', left: '92%', width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(103,232,249,0.4)', animationDuration: '8s', '--drift-x': '30px', '--drift-y': '35px' }} />
        <div className="particle absolute" style={{ top: '20%', left: '45%', width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.4)', animationDuration: '14s', '--drift-x': '-40px', '--drift-y': '15px' }} />
      </div>
      <div className="relative z-[5]">
        <RegisterCard />
        <p className="text-center text-xs text-white/40 mt-6 tracking-wider">Smart Procurement Platform</p>
      </div>
    </main>
  )
}
