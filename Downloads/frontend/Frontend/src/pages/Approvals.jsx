import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVendorBridgeStore } from "@/hooks/useStore"
import { Check, Clock, UserCheck, AlertTriangle, ArrowLeft, Star } from "lucide-react"

export function Approvals() {
  const { quotations, selectedQuotationId, approveQuotation, isLoaded } = useVendorBridgeStore()
  const navigate = useNavigate()
  const [remarks, setRemarks] = useState("")
  const [toastMessage, setToastMessage] = useState(null)

  // Find the selected quotation, fallback to the first one if not set
  const activeQuotation = quotations.find((q) => q.id === selectedQuotationId) || quotations[0]

  const handleApprove = () => {
    if (!activeQuotation) return
    
    // Call approve action which returns the generated PO number
    const poNum = approveQuotation(activeQuotation.id, remarks)
    
    setToastMessage(`Approved! Generated PO: ${poNum}`)
    setTimeout(() => {
      // Redirect to invoices page
      navigate("/invoices")
    }, 1500)
  }

  const handleReject = () => {
    if (!activeQuotation) return
    setToastMessage("Quotation rejected")
    setTimeout(() => {
      navigate("/quotations")
    }, 1500)
  }

  if (!isLoaded || !activeQuotation) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        Loading approval workflow...
      </div>
    )
  }

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

      <div className="space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.04] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/quotations")}
              className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Back to comparison"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-col gap-1.5 animate-slideUp">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Approval Chain</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Approval Workflow</h2>
              <p className="text-xs text-slate-500 font-medium">
                RFQ: {activeQuotation.rfqId} &bull; Vendor: {activeQuotation.vendorName} &bull; <span className="font-mono-data text-emerald-400 font-semibold">${activeQuotation.grandTotal.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stepper progress bar */}
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-5 backdrop-blur-md shadow-2xl shadow-black/20">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            {/* Background line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/15 -translate-y-1/2 z-0" />
            {/* Active progress line */}
            <div className="absolute left-0 w-[70%] top-1/2 h-0.5 bg-emerald-500 -translate-y-1/2 z-0" />

            {/* Step 1: Submitted */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Submitted</span>
            </div>

            {/* Step 2: L1 Review */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">L1 Review</span>
            </div>

            {/* Step 3: L2 Approval */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold text-sm animate-glow-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                3
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider animate-pulse">L2 Approval</span>
            </div>

            {/* Step 4: Generate PO */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-slate-950/60 text-slate-400 text-sm">
                4
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generate PO</span>
            </div>
          </div>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Column: Approval Chain details & remarks */}
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-white/[0.04] pb-2">
                Approval Chain
              </h3>
              
              <div className="space-y-4">
                
                {/* L1 Approver: Rahul Mehta */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 animate-slide-in-left" style={{ animationDelay: '0s' }}>
                  <div className="h-9 w-9 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    <UserCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Rahul Mehta</h4>
                    <p className="text-[10px] text-slate-400">Procurement Head (L1)</p>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Approved on May 20, 10:32 AM
                    </p>
                  </div>
                </div>

                {/* L2 Approver: Priya Shah */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] bg-slate-950/20 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                  <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
                    <Clock className="h-4.5 w-4.5 animate-spin-slow" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white leading-tight">Priya Shah</h4>
                    <p className="text-[10px] text-slate-400">Finance Manager (L2)</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-yellow-400 font-semibold animate-pulse">Awaiting L2 sign-off</span>
                      <span className="text-[9px] text-slate-500">Assigned May 21</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Remarks input */}
            <div className="flex flex-col gap-1.5 pt-4 border-t border-white/[0.04]">
              <label className="text-xs font-semibold text-slate-400">Approval Remarks</label>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks, conditions, or notes for record audit logs..."
                className="w-full bg-slate-900/40 border border-white/[0.06] rounded-xl py-3 px-4 text-xs text-slate-200 outline-none transition focus:border-emerald-500/40 focus:bg-slate-900/60 resize-none"
              />
            </div>
          </div>

          {/* Right Column: Bid summary & actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Summarized quotation card */}
            <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/[0.04] pb-2">
                Quotations Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Vendor</span>
                  <span className="text-slate-200 font-bold">{activeQuotation.vendorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5 font-semibold">
                  <span className="text-slate-400">Total Price</span>
                  <span className="text-emerald-400 font-bold text-sm font-mono-data">
                    ${activeQuotation.grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Delivery Leadtime</span>
                  <span className="text-slate-200 font-semibold font-mono-data">{activeQuotation.deliveryDays} days</span>
                </div>
                <div className="flex justify-between py-1 items-center">
                  <span className="text-slate-400">Rating score</span>
                  <span className="text-amber-400 font-semibold font-mono-data">★ {activeQuotation.vendorRating}/5</span>
                </div>
              </div>
            </div>

            {/* Approval Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleApprove}
                className="w-full rounded-xl btn-primary py-3.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="h-4.5 w-4.5" />
                Approve & Generate PO
              </button>

              <button
                onClick={handleReject}
                className="w-full rounded-xl border border-rose-500/30 bg-rose-500/5 py-3.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4" />
                Reject Quotation
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
