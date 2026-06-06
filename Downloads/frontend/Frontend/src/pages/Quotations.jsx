import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useVendorBridgeStore } from "@/hooks/useStore"
import { Sparkles, ArrowRight, ShieldCheck, Check, Send } from "lucide-react"

export function Quotations() {
  const { rfqs, quotations, selectQuotationForApproval, isLoaded } = useVendorBridgeStore()
  const navigate = useNavigate()

  // Select RFQ to compare
  const [selectedRfqId, setSelectedRfqId] = useState("")

  // Load first RFQ on mount
  useEffect(() => {
    if (isLoaded && rfqs.length > 0) {
      setSelectedRfqId(rfqs[0].id)
    }
  }, [isLoaded, rfqs])

  const activeRfq = rfqs.find((r) => r.id === selectedRfqId)
  const rfqQuotes = quotations.filter((q) => q.rfqId === selectedRfqId)

  // Find lowest price quote
  const minGrandTotal = rfqQuotes.length > 0 
    ? Math.min(...rfqQuotes.map((q) => q.grandTotal)) 
    : 0

  const handleSelectForApproval = (quoteId) => {
    selectQuotationForApproval(quoteId)
    navigate("/approvals")
  }

  if (!isLoaded || !activeRfq) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        Loading RFQ details...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Title & Submit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bid Matrix</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Quotation Comparison</h2>
          <p className="text-xs text-slate-500 font-medium">
            RFQ: {activeRfq.title} &bull; {rfqQuotes.length} quotations received
          </p>
        </div>
        <button
          onClick={() => navigate("/quotations/submit")}
          className="btn-primary flex items-center justify-center gap-2 py-3 px-5 shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          Submit Quote
        </button>
      </div>

      {/* RFQ Select Dropdown */}
      <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-4 backdrop-blur-md max-w-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400">Select RFQ to Compare</label>
          <select
            value={selectedRfqId}
            onChange={(e) => setSelectedRfqId(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.06] rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-emerald-500/50"
          >
            {rfqs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}: {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {rfqQuotes.length > 0 ? (
        <div className="space-y-4">
          
          {/* Compare Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch stagger-children">
            
            {rfqQuotes.map((quote) => {
              const isLowest = quote.grandTotal === minGrandTotal
              return (
                <div
                  key={quote.id}
                  className={`rounded-2xl border flex flex-col justify-between p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover-glow-emerald ${
                    isLowest
                      ? "border-emerald-500/30 bg-emerald-950/20 shadow-emerald-950/20 relative scale-100 ring-1 ring-emerald-500/20"
                      : "border-white/[0.04] bg-slate-950/40 hover:border-white/[0.08]"
                  }`}
                >
                  {/* Badge for lowest price */}
                  {isLowest && (
                    <span className="absolute -top-3 right-4 bg-emerald-500 text-slate-950 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-glow-pulse">
                      <Sparkles className="h-2.5 w-2.5" /> Best Bid
                    </span>
                  )}

                  {/* Vendor Header */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                      {quote.vendorName}
                      {isLowest && <span className="text-[10px] text-emerald-400 font-medium">(Lowest)</span>}
                    </h3>
                    <p className="text-[10px] text-slate-500">Submitted for approval</p>
                  </div>

                  {/* Criteria Details */}
                  <div className="space-y-4 text-xs mb-8 flex-1">
                    
                    <div className="flex justify-between py-2 border-b border-white/5 items-baseline">
                      <span className="text-slate-400">Grand Total</span>
                      <span className={`text-base font-extrabold font-mono-data ${isLowest ? "text-emerald-400 text-lg" : "text-slate-100"}`}>
                        ${quote.grandTotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400">GST %</span>
                      <span className="text-slate-300 font-semibold font-mono-data">{quote.gstPercent}%</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400">Delivery Timeline</span>
                      <span className="text-slate-300 font-semibold font-mono-data">{quote.deliveryDays} days</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5 items-center">
                      <span className="text-slate-400">Vendor Rating</span>
                      <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                        ★ {quote.vendorRating}/5
                      </span>
                    </div>

                    <div className="flex justify-between py-2 items-start gap-4">
                      <span className="text-slate-400 shrink-0">Payment Terms</span>
                      <span className="text-slate-300 text-right font-medium italic line-clamp-1">{quote.paymentTerms}</span>
                    </div>

                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectForApproval(quote.id)}
                    className={`w-full py-3.5 text-xs font-bold rounded-xl transition duration-150 active:scale-98 flex items-center justify-center gap-2 ${
                      isLowest
                        ? "btn-primary cursor-pointer"
                        : "border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {isLowest ? (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Approve Bid
                      </>
                    ) : (
                      <>
                        Select Bid
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                </div>
              )
            })}

          </div>

          {/* Note caption */}
          <p className="text-[10px] text-slate-500 italic mt-4 flex items-center gap-1 justify-center">
            <Check className="h-3 w-3 text-emerald-400" /> Green highlights indicate lowest grand totals. Selecting a vendor initiates L2 Approval Chain.
          </p>

        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-12 text-center backdrop-blur-md shadow-xl max-w-lg mx-auto">
          <ShieldCheck className="h-10 w-10 text-slate-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-white mb-2">No Quotations Received</h3>
          <p className="text-xs text-slate-400 mb-6">
            You haven't received any quotations for this RFQ yet. Use the Submit button to record a bid.
          </p>
          <button
            onClick={() => navigate("/quotations/submit")}
            className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition"
          >
            Record First Bid
          </button>
        </div>
      )}

    </div>
  )
}
