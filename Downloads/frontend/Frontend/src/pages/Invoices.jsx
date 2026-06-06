import React, { useState } from "react"
import { useVendorBridgeStore } from "@/hooks/useStore"
import { Download, Printer, Mail, CheckCircle, Clock } from "lucide-react"

export function Invoices() {
  const { invoices, markInvoiceAsPaid, isLoaded } = useVendorBridgeStore()
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState("")
  const [toastMessage, setToastMessage] = useState(null)

  // Load first invoice by default if no selection
  const activeInvoice = invoices.find((i) => i.invoiceNo === selectedInvoiceNo) || invoices[0]

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleMarkAsPaid = () => {
    if (!activeInvoice) return
    markInvoiceAsPaid(activeInvoice.invoiceNo)
    triggerToast(`Invoice ${activeInvoice.invoiceNo} status updated to Paid!`)
  }

  if (!isLoaded || invoices.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        No generated invoices found. Build and approve an RFQ first to generate invoices.
      </div>
    )
  }

  // Dynamic calculations based on invoice amount
  // Assume GST is 18%, split into CGST (9%) and SGST (9%)
  const grandTotal = activeInvoice.amount
  const subtotal = Math.round(grandTotal / 1.18)
  const taxAmount = grandTotal - subtotal
  const halfTax = Math.round(taxAmount / 2)

  // Seed items list based on PO value to make invoice look complete
  const isFurniture = activeInvoice.amount === 185400 || activeInvoice.amount === 200010 || activeInvoice.amount === 214800
  
  const invoiceItems = isFurniture 
    ? [
        { item: "Ergonomic chair", qty: 25, unitPrice: activeInvoice.amount === 185400 ? 3200 : 3500, total: activeInvoice.amount === 185400 ? 80000 : 87500 },
        { item: "Standing desks", qty: 10, unitPrice: activeInvoice.amount === 185400 ? 7700 : 8200, total: activeInvoice.amount === 185400 ? 77000 : 82000 },
      ]
    : [
        { item: "Standard Procurement Service", qty: 1, unitPrice: subtotal, total: subtotal }
      ]

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
        
        {/* Title & Document Switcher */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.04] pb-4">
          <div className="flex flex-col gap-1.5 animate-slideUp">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Accounting Vault</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Purchase Order & Invoice</h2>
            <p className="text-xs text-slate-500 font-medium">
              PO document auto-generated after approval sign-off
            </p>
          </div>

          {/* Invoice Picker dropdown */}
          <div className="flex bg-slate-950/45 border border-white/[0.04] p-0.5 rounded-lg self-start sm:self-auto backdrop-blur-md">
            <select
              value={activeInvoice.invoiceNo}
              onChange={(e) => setSelectedInvoiceNo(e.target.value)}
              className="bg-transparent text-xs text-slate-200 py-1.5 px-3.5 outline-none font-semibold cursor-pointer font-mono-data"
            >
              {invoices.map((inv) => (
                <option key={inv.invoiceNo} value={inv.invoiceNo} className="bg-slate-950">
                  {inv.invoiceNo} – {inv.vendorName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Invoice Actions Row */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => triggerToast(`Downloading PDF for ${activeInvoice.invoiceNo}`)}
            className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            Print
          </button>
          <button
            onClick={() => triggerToast(`Invoice sent via email to: account@${activeInvoice.vendorName.toLowerCase().replace(/\s/g, "")}.com`)}
            className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            Email Invoice
          </button>
        </div>

        {/* Main Document Body */}
        <div className="rounded-3xl border border-white/[0.04] bg-slate-950/40 p-6 md:p-8 backdrop-blur-2xl shadow-2xl shadow-black/80 hover:border-white/[0.08] transition-all duration-300 text-slate-300 space-y-8 print:bg-white print:text-black print:border-none">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:justify-between border-b border-white/15 pb-6 gap-6">
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent print:text-emerald-600">
                VendorBridge
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Enterprise Procurement System</p>
            </div>
            <div className="text-left md:text-right text-xs space-y-1">
              <p className="font-semibold text-white">Purchase Order: {activeInvoice.poNo}</p>
              <p className="text-slate-400">Invoice: {activeInvoice.invoiceNo}</p>
              <p className="text-slate-400">Date: {activeInvoice.dateCreated}</p>
              <p className="text-slate-400">Due Date: {activeInvoice.dueDate}</p>
            </div>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-white/10 pb-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bill To:</span>
              <p className="font-bold text-white text-sm">Your Organization Name</p>
              <p className="text-slate-400 leading-relaxed">
                123 Business Park, SG Road,<br />
                Ahmedabad, Gujarat, 380054
              </p>
              <p className="text-slate-400"><strong>GSTIN:</strong> 2583939384P1</p>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vendor Partner:</span>
              <p className="font-bold text-white text-sm">{activeInvoice.vendorName}</p>
              <p className="text-slate-400 leading-relaxed">
                456, Industrial Estate, Ring Road,<br />
                Surat, Gujarat, 395003
              </p>
              <p className="text-slate-400"><strong>GSTIN:</strong> 34AABCS1429Bz0</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-4">
            <div className="overflow-x-auto stagger-rows">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-white/[0.01]">
                    <th className="pb-3 px-3 font-bold">Item Description</th>
                    <th className="pb-3 px-3 font-bold">Qty</th>
                    <th className="pb-3 px-3 font-bold">Unit Price ($)</th>
                    <th className="pb-3 px-3 font-bold text-right">Total ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {invoiceItems.map((item, idx) => (
                    <tr key={idx} className="group table-row-premium">
                      <td className="py-4 px-3 font-semibold text-slate-200">{item.item}</td>
                      <td className="py-4 px-3 text-slate-400 font-mono-data">{item.qty}</td>
                      <td className="py-4 px-3 text-slate-400 font-mono-data">${item.unitPrice.toLocaleString()}</td>
                      <td className="py-4 px-3 font-bold text-slate-100 text-right font-mono-data">
                        ${item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col items-end gap-1.5 pt-4 border-t border-white/10 text-xs">
              <div className="flex w-64 justify-between">
                <span className="text-slate-400">Subtotal:</span>
                <span className="text-slate-200 font-semibold font-mono-data">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex w-64 justify-between">
                <span className="text-slate-400">CGST (9%):</span>
                <span className="text-slate-200 font-semibold font-mono-data">${halfTax.toLocaleString()}</span>
              </div>
              <div className="flex w-64 justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">SGST (9%):</span>
                <span className="text-slate-200 font-semibold font-mono-data">${halfTax.toLocaleString()}</span>
              </div>
              <div className="flex w-64 justify-between py-2 items-baseline">
                <span className="text-white font-bold">Grand Total:</span>
                <span className="text-emerald-400 font-extrabold text-sm font-mono-data">${grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status & Control Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-6 gap-4">
            
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Billing Status:</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                  activeInvoice.status === "Paid"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse"
                }`}
              >
                {activeInvoice.status === "Paid" ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    Paid
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5" />
                    Pending Payment
                  </>
                )}
              </span>
            </div>

            {/* Mark as Paid Action button */}
            {activeInvoice.status !== "Paid" && (
              <button
                onClick={handleMarkAsPaid}
                className="rounded-xl btn-primary px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                Mark as Paid
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}
