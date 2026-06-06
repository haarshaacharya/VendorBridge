import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useVendorBridgeStore } from "@/hooks/useStore"
import {
  FileText,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Plus,
  UserPlus,
  Receipt,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  ArrowUpRight
} from "lucide-react"

// Animated Counter Hook
function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const frameRef = useRef()

  useEffect(() => {
    const start = performance.now()
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return count
}

// Counter display component
function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const count = useCounter(parseFloat(value) || 0)
  return <span>{prefix}{count}{suffix}</span>
}

export function Dashboard() {
  const { rfqs, pos, invoices, isLoaded } = useVendorBridgeStore()
  const [activeTab, setActiveTab] = useState("line")
  const [toastMessage, setToastMessage] = useState(null)
  const [chartsReady, setChartsReady] = useState(false)

  // Trigger chart animations after mount
  useEffect(() => {
    const timer = setTimeout(() => setChartsReady(true), 400)
    return () => clearTimeout(timer)
  }, [])

  // Reactive Stats
  const activeRfqsCount = rfqs.length
  const pendingApprovalsCount = pos.filter((p) => p.status === "Pending").length
  
  // Spend this month (May 2026)
  const currentMonthPOs = pos.filter((p) => p.status === "Approved" && p.createdAt.startsWith("2026-05"))
  const totalPoAmount = currentMonthPOs.reduce((sum, item) => sum + item.amount, 0)
  const totalPoLakhs = (totalPoAmount / 100000).toFixed(1)
  const overdueInvoicesCount = invoices ? invoices.filter((i) => i.status === "Overdue").length : 0

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const statCards = [
    {
      label: "Active RFQ's",
      value: isLoaded ? activeRfqsCount : 0,
      badge: "Live",
      badgeColor: "emerald",
      icon: FileText,
      glowClass: "hover-glow-emerald",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      borderHover: "hover:border-emerald-500/25",
      badgeBg: "bg-emerald-500/10",
      badgeText: "text-emerald-400",
    },
    {
      label: "Pending Approvals",
      value: isLoaded ? pendingApprovalsCount : 0,
      badge: "Review",
      badgeColor: "amber",
      icon: CheckCircle2,
      glowClass: "hover-glow-amber",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      borderHover: "hover:border-amber-500/25",
      badgeBg: "bg-amber-500/10",
      badgeText: "text-amber-400",
    },
    {
      label: "PO's This Month",
      value: isLoaded ? parseFloat(totalPoLakhs) : 0,
      prefix: "₹",
      suffix: "L",
      badge: "Spend",
      badgeColor: "sky",
      icon: DollarSign,
      glowClass: "hover-glow-sky",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
      borderHover: "hover:border-sky-500/25",
      badgeBg: "bg-sky-500/10",
      badgeText: "text-sky-400",
    },
    {
      label: "Overdue Invoices",
      value: isLoaded ? overdueInvoicesCount : 0,
      badge: "Alert",
      badgeColor: "rose",
      icon: AlertTriangle,
      glowClass: "hover-glow-rose",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
      borderHover: "hover:border-rose-500/25",
      badgeBg: "bg-rose-500/10",
      badgeText: "text-rose-400",
    },
  ]

  // Monthly trends calculations
  const monthlySpend = {
    "2025-12": 0,
    "2026-01": 0,
    "2026-02": 0,
    "2026-03": 0,
    "2026-04": 0,
    "2026-05": 0,
  }

  pos.filter((po) => po.status === "Approved").forEach((po) => {
    const yyyymm = po.createdAt.substring(0, 7) // "YYYY-MM"
    if (monthlySpend[yyyymm] !== undefined) {
      monthlySpend[yyyymm] += po.amount
    }
  })

  const maxSpend = Math.max(...Object.values(monthlySpend), 1)

  // Line Chart coordinates
  const linePoints = [
    { x: 10, y: 160 - (monthlySpend["2025-12"] / maxSpend) * 120, delay: '0.8s' },
    { x: 86, y: 160 - (monthlySpend["2026-01"] / maxSpend) * 120, delay: '0.9s' },
    { x: 162, y: 160 - (monthlySpend["2026-02"] / maxSpend) * 120, delay: '1.0s' },
    { x: 238, y: 160 - (monthlySpend["2026-03"] / maxSpend) * 120, delay: '1.1s' },
    { x: 314, y: 160 - (monthlySpend["2026-04"] / maxSpend) * 120, delay: '1.2s' },
    { x: 390, y: 160 - (monthlySpend["2026-05"] / maxSpend) * 120, delay: '1.3s' },
  ]
  const pathD = `M ${linePoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
  const areaD = `${pathD} L 390 160 L 10 160 Z`

  // Donut chart segments
  const approvedPOs = pos.filter((po) => po.status === "Approved")
  const rfqMap = rfqs.reduce((acc, rfq) => {
    acc[rfq.id] = rfq
    return acc
  }, {})

  const categorySpend = {}
  let totalSpendVal = 0
  approvedPOs.forEach((po) => {
    const rfq = rfqMap[po.rfqId]
    const category = rfq ? rfq.category : "Other"
    categorySpend[category] = (categorySpend[category] || 0) + po.amount
    totalSpendVal += po.amount
  })

  const categoriesData = Object.entries(categorySpend).map(([label, amt]) => ({
    label,
    pct: totalSpendVal > 0 ? Math.round((amt / totalSpendVal) * 100) : 0,
    amt
  })).sort((a, b) => b.amt - a.amt).slice(0, 3)

  const colorMap = {
    0: { color: "bg-emerald-500", stroke: "#10b981", shadow: "rgba(16,185,129,0.3)" },
    1: { color: "bg-cyan-400", stroke: "#06b6d4", shadow: "rgba(6,182,212,0.3)" },
    2: { color: "bg-amber-500", stroke: "#f59e0b", shadow: "rgba(245,158,11,0.3)" },
  }

  let currentOffset = 0
  const pieSegments = categoriesData.map((item, index) => {
    const dashSize = Math.round((item.pct / 100) * 377)
    const segment = {
      ...item,
      stroke: colorMap[index]?.stroke || "#8b5cf6",
      shadow: colorMap[index]?.shadow || "rgba(139,92,246,0.3)",
      colorClass: colorMap[index]?.color || "bg-violet-500",
      dashArray: `${dashSize} 377`,
      dashOffset: `-${currentOffset}`
    }
    currentOffset += dashSize
    return segment
  })

  // Bar chart bars
  const barChartData = [
    { month: "Dec", amount: monthlySpend["2025-12"], key: "2025-12" },
    { month: "Jan", amount: monthlySpend["2026-01"], key: "2026-01" },
    { month: "Feb", amount: monthlySpend["2026-02"], key: "2026-02" },
    { month: "Mar", amount: monthlySpend["2026-03"], key: "2026-03" },
    { month: "Apr", amount: monthlySpend["2026-04"], key: "2026-04" },
    { month: "May", amount: monthlySpend["2026-05"], key: "2026-05" },
  ].map((item, idx) => {
    const pct = maxSpend > 0 ? Math.round((item.amount / maxSpend) * 90) : 5
    const amtStr = item.amount >= 100000 ? `₹${(item.amount / 100000).toFixed(1)}L` : `₹${(item.amount / 1000).toFixed(0)}k`
    return {
      month: item.month,
      pct: Math.max(pct, 5),
      amt: amtStr,
      delay: `${idx * 0.08}s`
    }
  })

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-500/30 bg-slate-950/90 px-6 py-4 shadow-2xl backdrop-blur-xl animate-slideUp">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-sm font-medium text-slate-100">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="space-y-6">
        
        {/* Title Section */}
        <div className="flex flex-col gap-1.5 animate-slideUp">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Control Center</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-xs text-slate-500 font-medium">
            Welcome back, Procurement Officer &bull; Real-time system monitoring
          </p>
        </div>

        {/* Stats Grid - Staggered Entrance */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {statCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className={`group relative rounded-2xl border border-white/[0.04] bg-slate-950/45 p-5 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-500 hover:border-white/[0.08] hover:-translate-y-1.5 ${card.glowClass}`}
              >
                {/* Gradient top accent line */}
                <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
                  card.badgeColor === 'emerald' ? 'from-emerald-500 to-cyan-500' :
                  card.badgeColor === 'amber' ? 'from-amber-500 to-orange-500' :
                  card.badgeColor === 'sky' ? 'from-sky-500 to-blue-500' :
                  'from-rose-500 to-pink-500'
                }`} />

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{card.label}</span>
                  <div className={`rounded-xl ${card.iconBg} p-2.5 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white font-mono-data">
                    <AnimatedNumber value={card.value} prefix={card.prefix || ""} suffix={card.suffix || ""} />
                  </span>
                  <span className={`text-[10px] ${card.badgeText} font-semibold ${card.badgeBg} px-2 py-0.5 rounded-full flex items-center gap-1`}>
                    {card.badgeColor === 'emerald' && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                    )}
                    {card.badge}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Content Section: Purchase Orders & Charts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          
          {/* Recent Purchase Orders Table Card */}
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 lg:col-span-7 flex flex-col justify-between animate-slideUp" style={{ animationDelay: '0.15s' }}>
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Recent Purchase Orders</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Track PO values and lifecycle status</p>
                </div>
                <button
                  onClick={() => showToast("Navigating to PO archives")}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-all duration-200 flex items-center gap-0.5 hover:gap-1.5"
                >
                  View All <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto stagger-rows">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04] text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-white/[0.01]">
                      <th className="pb-3 px-3 font-bold">PO#</th>
                      <th className="pb-3 px-3 font-bold">Vendor</th>
                      <th className="pb-3 px-3 font-bold">Amount</th>
                      <th className="pb-3 px-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {pos.slice(0, 5).map((po) => (
                      <tr key={po.poNo} className="group table-row-premium">
                        <td className="py-3.5 px-3 font-semibold text-slate-200 font-mono-data text-xs">{po.poNo}</td>
                        <td className="py-3.5 px-3 text-slate-300 text-xs">{po.vendorName}</td>
                        <td className="py-3.5 px-3 text-slate-100 font-mono-data text-xs">₹{po.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold border ${
                              po.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : po.status === "Pending"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                            }`}
                          >
                            <span className="relative flex h-1.5 w-1.5">
                              {po.status === "Pending" && (
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75`} />
                              )}
                              <span
                                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                  po.status === "Approved"
                                    ? "bg-emerald-400"
                                    : po.status === "Pending"
                                    ? "bg-amber-400"
                                    : "bg-slate-400"
                                }`}
                              />
                            </span>
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Interactive Chart Widget Card */}
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 lg:col-span-5 flex flex-col justify-between animate-slideUp" style={{ animationDelay: '0.25s' }}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Spending Trends</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Analysis for last 6 months</p>
                </div>
                {/* Tab Pills */}
                <div className="flex bg-slate-900/80 border border-white/[0.06] p-0.5 rounded-xl">
                  {[
                    { id: "line", icon: TrendingUp },
                    { id: "pie", icon: PieIcon },
                    { id: "bar", icon: BarChart2 },
                  ].map((tab) => {
                    const TabIcon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`p-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/15 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                        aria-label={`Show ${tab.id} chart`}
                      >
                        <TabIcon className="h-3.5 w-3.5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Chart Render Area */}
              <div className="h-56 flex items-center justify-center relative mt-6">
                
                {/* LINE CHART - with drawing animation */}
                {activeTab === "line" && (
                  <div className="w-full h-full flex flex-col justify-between animate-fadeIn" style={{ animationDuration: '0.4s' }}>
                    <svg viewBox="0 0 400 180" className="w-full overflow-visible">
                      <defs>
                        <linearGradient id="gradient-area" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.03)" />
                      <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.03)" />
                      <line x1="0" y1="130" x2="400" y2="130" stroke="rgba(255,255,255,0.03)" />
                      {/* Area */}
                      <path
                        d={areaD}
                        fill="url(#gradient-area)"
                        className={chartsReady ? "animate-fadeIn" : "opacity-0"}
                        style={{ animationDuration: '1s' }}
                      />
                      {/* Main Line with gradient */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="url(#gradient-line)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className={chartsReady ? "chart-draw" : ""}
                        style={{ '--path-length': 600, animationDuration: '1.5s' }}
                      />
                      {/* Points - appear after line draws */}
                      {chartsReady && linePoints.map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.x} cy={pt.y} r="6" fill="#10b981" fillOpacity="0.15" className="animate-scale-in" style={{ animationDelay: pt.delay, transformOrigin: `${pt.x}px ${pt.y}px` }} />
                          <circle cx={pt.x} cy={pt.y} r="3.5" fill="#10b981" stroke="#020617" strokeWidth="1.5" className="animate-scale-in" style={{ animationDelay: pt.delay, transformOrigin: `${pt.x}px ${pt.y}px` }} />
                        </g>
                      ))}
                    </svg>
                    <div className="flex justify-between text-[10px] text-slate-500 px-2 font-medium">
                      <span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                    </div>
                  </div>
                )}

                {/* PIE / DONUT CHART */}
                {activeTab === "pie" && (
                  <div className="w-full h-full flex items-center justify-around animate-fadeIn" style={{ animationDuration: '0.4s' }}>
                    {pieSegments.length > 0 ? (
                      <>
                        <svg viewBox="0 0 200 200" className="w-40 h-40 transform -rotate-90">
                          {pieSegments.map((segment, i) => (
                            <circle
                              key={i}
                              cx="100"
                              cy="100"
                              r="60"
                              fill="transparent"
                              stroke={segment.stroke}
                              strokeWidth="22"
                              strokeDasharray={chartsReady ? segment.dashArray : "0 377"}
                              strokeDashoffset={segment.dashOffset}
                              className="transition-all duration-1000"
                              style={{
                                transitionDelay: `${i * 0.2}s`,
                                filter: `drop-shadow(0 0 6px ${segment.shadow})`
                              }}
                            />
                          ))}
                        </svg>
                        <div className="text-xs space-y-3">
                          {pieSegments.map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5 animate-slide-in-left" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                              <span className={`h-2.5 w-2.5 rounded-sm ${item.colorClass} shadow-sm`} />
                              <span className="text-slate-400 font-medium">
                                {item.label} <span className="text-slate-300">({item.pct}%)</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500">No spend category data available</p>
                    )}
                  </div>
                )}

                {/* BAR CHART */}
                {activeTab === "bar" && (
                  <div className="w-full h-full flex flex-col justify-between animate-fadeIn" style={{ animationDuration: '0.4s' }}>
                    <div className="flex-1 flex items-end justify-between px-4 gap-3">
                      {barChartData.map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar">
                          <span className="text-[9px] text-slate-400 font-mono-data opacity-0 group-hover/bar:opacity-100 transition-all duration-200 bg-slate-900/90 border border-white/10 px-1.5 py-0.5 rounded -translate-y-1">
                            {bar.amt}
                          </span>
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover/bar:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-shadow duration-300 animate-bar-grow"
                            style={{ height: `${bar.pct}%`, animationDelay: bar.delay, animationDuration: '0.8s' }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 px-4 mt-2 font-medium">
                      <span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Action Button Footer Row */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-3 items-center animate-slideUp" style={{ animationDelay: '0.3s' }}>
        
        <Link
          to="/rfqs"
          className="btn-primary flex items-center gap-2 px-6 py-3"
        >
          <Plus className="h-4 w-4" />
          New RFQ
        </Link>

        <Link
          to="/vendors"
          className="btn-secondary flex items-center gap-2 px-6 py-3"
        >
          <UserPlus className="h-4 w-4" />
          Add Vendor
        </Link>

        <button
          onClick={() => showToast("Opening invoice management")}
          className="btn-secondary flex items-center gap-2 px-6 py-3"
        >
          <Receipt className="h-4 w-4" />
          View Invoices
        </button>

      </div>

    </div>
  )
}
