import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useVendorBridgeStore } from "@/hooks/useStore"
import { FileText, ArrowLeft, Percent, Save, Send } from "lucide-react"

export function SubmitQuotation() {
  const { rfqs, vendors, addQuotation, isLoaded } = useVendorBridgeStore()
  const navigate = useNavigate()

  // Selection state
  const [selectedRfqId, setSelectedRfqId] = useState("")
  const [submittingVendorName, setSubmittingVendorName] = useState("")

  // Form inputs state
  const [itemPrices, setItemPrices] = useState({})
  const [gstPercent, setGstPercent] = useState(18)
  const [notes, setNotes] = useState("Payment terms: 20 days net. Delivery schedule subject to immediate confirmation.")

  // Load first RFQ by default
  useEffect(() => {
    if (isLoaded && rfqs.length > 0) {
      setSelectedRfqId(rfqs[0].id)
    }
  }, [isLoaded, rfqs])

  // Get current selected RFQ details
  const activeRfq = rfqs.find((r) => r.id === selectedRfqId)

  // Initialize form item inputs when RFQ changes
  useEffect(() => {
    if (activeRfq) {
      const initialPrices = {}
      
      // Seed realistic defaults based on item names
      activeRfq.lineItems.forEach((li) => {
        let defaultPrice = 3500
        let defaultDelivery = 7
        
        if (li.item.toLowerCase().includes("chair")) {
          defaultPrice = 3500
          defaultDelivery = 7
        } else if (li.item.toLowerCase().includes("desk")) {
          defaultPrice = 8200
          defaultDelivery = 14
        } else if (li.item.toLowerCase().includes("laptop")) {
          defaultPrice = 65000
          defaultDelivery = 5
        } else if (li.item.toLowerCase().includes("monitor")) {
          defaultPrice = 15000
          defaultDelivery = 7
        }

        initialPrices[li.id] = { price: defaultPrice, delivery: defaultDelivery }
      })
      setItemPrices(initialPrices)
      
      // Set submitting vendor default if any
      const activeVendors = vendors.filter((v) => v.status === "Active")
      if (activeVendors.length > 0) {
        setSubmittingVendorName(activeVendors[0].name)
      }
    }
  }, [selectedRfqId, activeRfq, vendors])

  if (!isLoaded || !activeRfq) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        Loading RFQ details...
      </div>
    )
  }

  // Calculate Subtotals & Totals
  const lineItemTotals = activeRfq.lineItems.map((li) => {
    const inputs = itemPrices[li.id] || { price: 0, delivery: 0 }
    return {
      ...li,
      unitPrice: inputs.price,
      total: li.qty * inputs.price,
      deliveryDays: inputs.delivery
    }
  })

  const subtotal = lineItemTotals.reduce((sum, item) => sum + item.total, 0)
  const gstAmount = Math.round(subtotal * (gstPercent / 100))
  const grandTotal = subtotal + gstAmount

  const handlePriceChange = (id, field, value) => {
    setItemPrices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!submittingVendorName) {
      alert("Please select a vendor submitting this quotation.")
      return
    }

    addQuotation({
      rfqId: selectedRfqId,
      vendorName: submittingVendorName,
      grandTotal,
      gstPercent,
      deliveryDays: Math.max(...lineItemTotals.map((item) => item.deliveryDays)),
      vendorRating: submittingVendorName.toLowerCase().includes("infra") ? 4.5 : 4.0, // rating helper
      paymentTerms: notes,
      status: "Pending",
      notes,
      lineItems: lineItemTotals
    })

    // Navigate to Comparison page
    navigate("/quotations")
  }

  return (
    <div className="space-y-6">
      
      {/* Navigation / Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.04] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/quotations")}
            className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Back to quotations"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bid Matrix</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Submit Quotations</h2>
            <p className="text-xs text-slate-500 font-medium">
              RFQ: {activeRfq.title} &bull; Deadline {activeRfq.deadline}
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Setup Selection Card */}
      <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-5 backdrop-blur-md shadow-2xl shadow-black/20 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400">Select RFQ to Quote For</label>
          <select
            value={selectedRfqId}
            onChange={(e) => setSelectedRfqId(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.06] rounded-xl py-2.5 px-3.5 text-xs text-slate-200 outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
          >
            {rfqs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}: {r.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400">Submitting as Vendor *</label>
          <select
            value={submittingVendorName}
            onChange={(e) => setSubmittingVendorName(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.06] rounded-xl py-2.5 px-3.5 text-xs text-slate-200 outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
          >
            {vendors.filter((v) => v.status === "Active").map((v) => (
              <option key={v.id} value={v.name}>
                {v.name} ({v.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RFQ Brief Card */}
      <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 px-5 py-3 backdrop-blur-md text-xs text-slate-400 flex items-center gap-2">
        <FileText className="h-4.5 w-4.5 text-emerald-400" />
        <span>
          <strong>RFQ Summary:</strong>{" "}
          {activeRfq.lineItems.map((li) => `${li.item} * ${li.qty}`).join(", ")} – Category:{" "}
          <span className="uppercase">{activeRfq.category}</span>
        </span>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
               {/* Left Column: Pricing Input Table */}
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 lg:col-span-8 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-white/[0.04] pb-2">
              Your Quotation
            </h3>
            
            <div className="overflow-x-auto stagger-rows">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-white/[0.01]">
                    <th className="pb-3 px-3 font-bold w-1/3">Item</th>
                    <th className="pb-3 px-3 font-bold">Qty</th>
                    <th className="pb-3 px-3 font-bold">Unit Price ($)</th>
                    <th className="pb-3 px-3 font-bold">Total ($)</th>
                    <th className="pb-3 px-3 font-bold">Delivery (Days)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {lineItemTotals.map((li) => {
                    const inputs = itemPrices[li.id] || { price: 0, delivery: 0 }
                    return (
                      <tr key={li.id} className="group table-row-premium">
                        <td className="py-4 px-3 font-semibold text-slate-200">{li.item}</td>
                        <td className="py-4 px-3 text-slate-400 font-mono-data">{li.qty}</td>
                        <td className="py-4 px-3 pr-4">
                          <input
                            type="number"
                            required
                            min={1}
                            value={inputs.price || ""}
                            onChange={(e) => handlePriceChange(li.id, "price", parseFloat(e.target.value) || 0)}
                            className="w-24 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                          />
                        </td>
                        <td className="py-4 px-3 font-bold text-slate-100 font-mono-data">
                          ${li.total.toLocaleString()}
                        </td>
                        <td className="py-4 px-3">
                          <input
                            type="number"
                            required
                            min={1}
                            value={inputs.delivery || ""}
                            onChange={(e) => handlePriceChange(li.id, "delivery", parseInt(e.target.value) || 0)}
                            className="w-16 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Taxes and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Tax / GST %</label>
              <div className="relative">
                <Percent className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  value={gstPercent}
                  onChange={(e) => setGstPercent(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-xs text-slate-200 outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Note / terms</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)] resize-none"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Pricing Computations Card */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 space-y-4">
            <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full mb-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/[0.04] pb-2">
              Summary
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-200 font-semibold font-mono-data">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">GST ({gstPercent}%)</span>
                <span className="text-slate-200 font-semibold font-mono-data">${gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-slate-300 font-bold">Grand total</span>
                <span className="text-emerald-400 font-extrabold text-sm font-mono-data">${grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full rounded-xl btn-primary py-3.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              Submit Quotation
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/quotations")}
              className="w-full rounded-xl btn-secondary py-3.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
          </div>
        </div>

      </form>

    </div>
  )
}
