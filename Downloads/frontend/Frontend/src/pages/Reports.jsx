import React, { useState } from "react"
import { useVendorBridgeStore } from "@/hooks/useStore"
import { ChevronDown, Download } from "lucide-react"

export function Reports() {
  const { vendors, pos, rfqs, invoices, isLoaded } = useVendorBridgeStore()
  const [selectedMonth, setSelectedMonth] = useState("May 2026")
  const [toastMessage, setToastMessage] = useState(null)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Calculate dynamic active vendors count
  const activeVendorsCount = vendors.filter((v) => v.status === "Active").length

  // Calculate total spend
  const totalSpend = pos.filter((item) => item.status === "Approved").reduce((sum, item) => sum + item.amount, 0)
  const totalSpendDisplay = totalSpend >= 100000 ? (totalSpend / 100000).toFixed(2) + "L" : (totalSpend / 1000).toFixed(1) + "K"

  // Calculate PO Fulfillment Rate
  const approvedCount = pos.filter((po) => po.status === "Approved").length
  const pendingCount = pos.filter((po) => po.status === "Pending").length
  const totalNonDraft = approvedCount + pendingCount
  const fulfillmentRate = totalNonDraft > 0 ? Math.round((approvedCount / totalNonDraft) * 100) : 100

  // Calculate Overdue Invoices
  const overdueInvoicesCount = invoices.filter((inv) => inv.status === "Overdue").length

  // Calculate Spend by Category dynamically
  const approvedPOs = pos.filter((po) => po.status === "Approved")
  const rfqMap = rfqs.reduce((acc, rfq) => {
    acc[rfq.id] = rfq
    return acc
  }, {})

  const categorySpendMap = {}
  let totalApprovedSpend = 0

  approvedPOs.forEach((po) => {
    const rfq = rfqMap[po.rfqId]
    const category = rfq ? rfq.category : "Other"
    categorySpendMap[category] = (categorySpendMap[category] || 0) + po.amount
    totalApprovedSpend += po.amount
  })

  const categoryColors = {
    "IT Hardware": { bg: "bg-sky-500", shadow: "shadow-[0_0_8px_rgba(56,189,248,0.4)]" },
    "Furniture": { bg: "bg-emerald-500", shadow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]" },
    "Stationery": { bg: "bg-amber-300", shadow: "shadow-[0_0_8px_rgba(252,211,77,0.4)]" },
    "Logistics": { bg: "bg-rose-500", shadow: "shadow-[0_0_8px_rgba(244,63,94,0.4)]" },
    "Other": { bg: "bg-violet-500", shadow: "shadow-[0_0_8px_rgba(139,92,246,0.4)]" }
  }

  const categorySpendList = Object.entries(categorySpendMap).map(([category, amount]) => {
    const percent = totalApprovedSpend > 0 ? Math.round((amount / totalApprovedSpend) * 100) : 0
    const displayAmount = amount >= 100000 ? `₹${(amount / 100000).toFixed(2)}L` : `₹${amount.toLocaleString('en-IN')}`
    const colors = categoryColors[category] || categoryColors["Other"]
    return {
      category,
      amount,
      percent,
      displayAmount,
      bg: colors.bg,
      shadow: colors.shadow
    }
  }).sort((a, b) => b.amount - a.amount)

  // Calculate Top Vendors by Spend
  const vendorSpendMap = {}
  pos.forEach((po) => {
    if (po.status === "Approved") {
      if (!vendorSpendMap[po.vendorName]) {
        vendorSpendMap[po.vendorName] = { spend: 0, poCount: 0 }
      }
      vendorSpendMap[po.vendorName].spend += po.amount
      vendorSpendMap[po.vendorName].poCount += 1
    }
  })

  const topVendorsList = Object.entries(vendorSpendMap).map(([name, data]) => ({
    name,
    spend: data.spend,
    poCount: data.poCount
  })).sort((a, b) => b.spend - a.spend).slice(0, 3)

  // Calculate Monthly Trend
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

  const barChartData = [
    { month: "Dec", amount: monthlySpend["2025-12"], key: "2025-12" },
    { month: "Jan", amount: monthlySpend["2026-01"], key: "2026-01" },
    { month: "Feb", amount: monthlySpend["2026-02"], key: "2026-02" },
    { month: "Mar", amount: monthlySpend["2026-03"], key: "2026-03" },
    { month: "Apr", amount: monthlySpend["2026-04"], key: "2026-04" },
    { month: "May", amount: monthlySpend["2026-05"], key: "2026-05" },
  ].map((item) => {
    const percentage = Math.round((item.amount / maxSpend) * 90)
    const isMonthActive = (
      (selectedMonth === "May 2026" && item.key === "2026-05") ||
      (selectedMonth === "April 2026" && item.key === "2026-04") ||
      (selectedMonth === "March 2026" && item.key === "2026-03") ||
      (selectedMonth === "February 2026" && item.key === "2026-02") ||
      (selectedMonth === "January 2026" && item.key === "2026-01") ||
      (selectedMonth === "December 2025" && item.key === "2025-12")
    )
    return {
      month: item.month,
      heightPct: Math.max(percentage, 5),
      amount: item.amount,
      active: isMonthActive
    }
  })

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-500/30 bg-slate-950/90 px-6 py-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-sm font-medium text-slate-100">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Title, Month Selector & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-4">
        <div className="flex flex-col gap-1.5 animate-slideUp">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Procurement Intelligence</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Reports & analytics</h2>
          <p className="text-xs text-slate-500 font-medium">
            Procurement Insights &bull; {selectedMonth}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Month Picker dropdown */}
          <div className="relative bg-slate-950/45 border border-white/[0.04] rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition hover:border-white/20 backdrop-blur-md">
            <span>{selectedMonth}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              <option value="May 2026">May 2026</option>
              <option value="April 2026">April 2026</option>
              <option value="March 2026">March 2026</option>
              <option value="February 2026">February 2026</option>
              <option value="January 2026">January 2026</option>
              <option value="December 2025">December 2025</option>
            </select>
          </div>

          {/* Export button */}
          <button
            onClick={() => triggerToast("Exporting procurement spreadsheet...")}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-slate-950/40 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-white transition cursor-pointer backdrop-blur-md"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Wireframe-matched Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        
        {/* Card 1: Total Spend (Blue Accent) */}
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/45 p-6 backdrop-blur-md shadow-2xl shadow-black/30 transition hover-glow-sky">
          <span className="text-3xl font-extrabold text-sky-400 block mb-1 font-mono-data">
            ₹{isLoaded ? totalSpendDisplay : "0.0L"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">total spend</span>
        </div>

        {/* Card 2: Active Vendors (Green Accent) */}
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/45 p-6 backdrop-blur-md shadow-2xl shadow-black/30 transition hover-glow-emerald">
          <span className="text-3xl font-extrabold text-emerald-400 block mb-1 font-mono-data">
            {isLoaded ? activeVendorsCount : "0"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active vendors</span>
        </div>

        {/* Card 3: PO Fulfillment (Orange Accent) */}
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/45 p-6 backdrop-blur-md shadow-2xl shadow-black/30 transition hover-glow-amber">
          <span className="text-3xl font-extrabold text-amber-500 block mb-1 font-mono-data">
            {isLoaded ? `${fulfillmentRate}%` : "0%"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">PO Fulfillment</span>
        </div>

        {/* Card 4: Overdue Invoices (Red/Rose Accent) */}
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/45 p-6 backdrop-blur-md shadow-2xl shadow-black/30 transition hover-glow-rose">
          <span className="text-3xl font-extrabold text-rose-500 block mb-1 font-mono-data">
            {isLoaded ? overdueInvoicesCount : "0"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">overdue invoices</span>
        </div>

      </div>

      {/* Content Section: Category Spend, Top Vendors & Trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Panel: Spend by Category */}
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 lg:col-span-5 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5 border-b border-white/[0.04] pb-2">
              Spend by Category
            </h3>

            <div className="space-y-5">
              {categorySpendList.length > 0 ? (
                categorySpendList.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 animate-slideUp" style={{ animationDelay: `${idx * 0.08}s` }}>
                    <div className="flex justify-between text-xs font-medium text-slate-300">
                      <span>{item.category}</span>
                      <span className="font-mono-data">{item.displayAmount}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.bg} h-full rounded-full progress-animated ${item.shadow}`}
                        style={{ "--progress-width": `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No spend data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Top Vendors Table & Monthly Bar Chart */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          
          {/* Top Vendors Table */}
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/[0.04] pb-2 mb-4">
              Top Vendors by Spend
            </h3>

            <div className="overflow-x-auto stagger-rows">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-white/[0.01]">
                    <th className="pb-3 px-3 font-bold">Vendor</th>
                    <th className="pb-3 px-3 font-bold">Spend (₹)</th>
                    <th className="pb-3 px-3 font-bold text-center">POs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {topVendorsList.length > 0 ? (
                    topVendorsList.map((vendor, idx) => (
                      <tr key={idx} className="group table-row-premium">
                        <td className="py-3 px-3 font-semibold text-slate-200">{vendor.name}</td>
                        <td className="py-3 px-3 text-slate-300 font-mono-data">
                          {vendor.spend.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-400 font-mono-data">{vendor.poCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-4 text-center text-slate-500">No vendor spend data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Trend Bar Chart */}
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/[0.04] pb-2 mb-5">
              Monthly Trend
            </h3>

            <div className="h-28 flex items-end justify-between px-6 gap-4">
              {barChartData.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 animate-bar-grow ${
                      bar.active
                        ? "bg-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                        : "bg-slate-700/60 hover:bg-slate-600"
                    }`}
                    style={{
                      height: `${bar.heightPct}%`,
                      animationDelay: `${idx * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  />
                  <span className={`text-[10px] font-semibold ${bar.active ? 'text-sky-400 font-bold' : 'text-slate-400'}`}>
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
