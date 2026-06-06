import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useVendorBridgeStore } from "@/hooks/useStore"
import { Plus, Trash2, X, UploadCloud, File, AlertCircle } from "lucide-react"

export function RFQs() {
  const { vendors, addRFQ } = useVendorBridgeStore()
  const navigate = useNavigate()

  // Form general state
  const [title, setTitle] = useState("Office Furniture procurement Q2")
  const [category, setCategory] = useState("Furniture")
  const [deadline, setDeadline] = useState("2025-06-15")
  const [description, setDescription] = useState("Ergonomic chairs and standing desks for 3rd floor")

  // Line items state
  const [lineItems, setLineItems] = useState([
    { id: "li-1", item: "Ergonomic chair", qty: 25, unit: "NOS" },
    { id: "li-2", item: "Standing desks", qty: 10, unit: "NOS" },
  ])
  const [newItem, setNewItem] = useState("")
  const [newQty, setNewQty] = useState(1)
  const [newUnit, setNewUnit] = useState("NOS")
  const [isAddingLineItem, setIsAddingLineItem] = useState(false)

  // Assigned vendors state (store vendor names)
  const [assignedVendors, setAssignedVendors] = useState([
    "Infra Supplies Pvt Ltd",
    "Tech Core LTD"
  ])
  const [isAddingVendor, setIsAddingVendor] = useState(false)

  // Attachments state
  const [attachments, setAttachments] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Active vendors from store that are not already assigned
  const availableVendors = vendors
    .filter((v) => v.status === "Active")
    .filter((v) => !assignedVendors.includes(v.name))

  // Handle line item actions
  const handleAddLineItem = () => {
    if (!newItem.trim()) return
    const id = "li-" + Date.now()
    setLineItems([...lineItems, { id, item: newItem, qty: newQty, unit: newUnit }])
    setNewItem("")
    setNewQty(1)
    setNewUnit("NOS")
    setIsAddingLineItem(false)
  }

  const handleRemoveLineItem = (id) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  // Handle vendor assign actions
  const handleAssignVendor = (vendorName) => {
    if (!assignedVendors.includes(vendorName)) {
      setAssignedVendors([...assignedVendors, vendorName])
    }
    setIsAddingVendor(false)
  }

  const handleRemoveVendor = (vendorName) => {
    setAssignedVendors(assignedVendors.filter((name) => name !== vendorName))
  }

  // Handle file attachment drag-and-drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const names = Array.from(e.dataTransfer.files).map((file) => file.name)
      setAttachments([...attachments, ...names])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const names = Array.from(e.target.files).map((file) => file.name)
      setAttachments([...attachments, ...names])
    }
  }

  const handleRemoveAttachment = (index) => {
    setAttachments(attachments.filter((_, idx) => idx !== index))
  }

  // Submit RFQ
  const handleSave = (status) => {
    if (!title.trim() || !deadline) {
      alert("Please fill in all required fields (Title, Deadline)")
      return
    }

    addRFQ({
      title,
      category,
      deadline,
      description,
      lineItems,
      assignedVendors,
      status,
      attachments,
    })

    // Redirect to dashboard
    navigate("/dashboard")
  }

  return (
    <div className="space-y-6">
      
      {/* Title Section */}
      <div className="flex flex-col gap-1.5 animate-slideUp">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Procurement Intake</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Create RFQs</h2>
        <p className="text-xs text-slate-500 font-medium">New request for quotation specification builder</p>
      </div>

      {/* Stepper Header */}
      <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-5 backdrop-blur-md shadow-2xl shadow-black/20">
        <div className="relative flex items-center justify-between max-w-xl mx-auto">
          {/* Stepper progress connector line */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          <div className="absolute left-0 w-1/2 top-1/2 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 -translate-y-1/2 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.25)] animate-glow-pulse">
              1
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Specifications</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-slate-950/60 text-slate-400 text-sm">
              2
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Review</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-slate-950/60 text-slate-400 text-sm">
              3
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Publish</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Details Form & Items/Vendors */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Side: General Specifications Form */}
        <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 lg:col-span-6 space-y-4 transition-all duration-300 hover:border-white/[0.08]">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/[0.04] pb-2">RFQ Details</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">RFQ's title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Office Furniture procurement Q2"
              className="w-full bg-slate-900/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none transition focus:border-emerald-500/50 focus:bg-slate-900/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none transition focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
              >
                <option value="Furniture">Furniture</option>
                <option value="IT">IT</option>
                <option value="logistics">Logistics</option>
                <option value="office supplies">Office Supplies</option>
                <option value="construction">Construction</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Deadline *</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none transition focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about quality requirements, shipping expectations, or scope of services..."
              className="w-full bg-slate-900/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none transition focus:border-emerald-500/50 focus:bg-slate-900/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)] resize-none"
            />
          </div>
        </div>

        {/* Right Side: Line Items & Vendor Assignment */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Line Items Container */}
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 space-y-4 transition-all duration-300 hover:border-white/[0.08]">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Line Items</h3>
              {!isAddingLineItem && (
                <button
                  onClick={() => setIsAddingLineItem(true)}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-1 text-xs text-emerald-400 transition hover:bg-white/5 hover:text-emerald-300"
                >
                  <Plus className="h-3.5 w-3.5" /> add line item
                </button>
              )}
            </div>

            {/* Inline Add Form */}
            {isAddingLineItem && (
              <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-3 animate-in slide-in-from-top-2 duration-150">
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="col-span-6 bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min={1}
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
                    className="col-span-3 bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                  />
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="col-span-3 bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="NOS">NOS</option>
                    <option value="KG">KG</option>
                    <option value="PCS">PCS</option>
                    <option value="BOX">BOX</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsAddingLineItem(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLineItem}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-semibold hover:bg-emerald-400 transition"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}

            {/* Line Items Table */}
            <div className="overflow-x-auto stagger-rows">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-white/[0.01]">
                    <th className="pb-2 px-3 font-bold">Item</th>
                    <th className="pb-2 px-3 font-bold">Qty</th>
                    <th className="pb-2 px-3 font-bold">Unit</th>
                    <th className="pb-2 px-3 font-bold text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {lineItems.map((item) => (
                    <tr key={item.id} className="group table-row-premium">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{item.item}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono-data">{item.qty}</td>
                      <td className="py-2.5 px-3 font-mono-data text-slate-400">{item.unit}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                          aria-label={`Remove item ${item.item}`}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assign Vendors Container */}
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 space-y-4 transition-all duration-300 hover:border-white/[0.08]">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Assign Vendors</h3>
              {!isAddingVendor && (
                <button
                  onClick={() => setIsAddingVendor(true)}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-1 text-xs text-emerald-400 transition hover:bg-white/5 hover:text-emerald-300"
                >
                  <Plus className="h-3.5 w-3.5" /> add vendor
                </button>
              )}
            </div>

            {/* Vendor assign popover/dropdown */}
            {isAddingVendor && (
              <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 animate-in slide-in-from-top-2 duration-150 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Available Active Vendors:</span>
                {availableVendors.length > 0 ? (
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {availableVendors.map((vendor) => (
                      <button
                        key={vendor.id}
                        onClick={() => handleAssignVendor(vendor.name)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition"
                      >
                        {vendor.name} ({vendor.category})
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> No additional active vendors found
                  </p>
                )}
                <button
                  onClick={() => setIsAddingVendor(false)}
                  className="w-full mt-2 text-center text-slate-500 hover:text-slate-300 text-xs py-1 transition border-t border-white/5"
                >
                  Close
                </button>
              </div>
            )}

            {/* Assigned Vendors list */}
            <div className="flex flex-col gap-2">
              {assignedVendors.map((vendorName, idx) => (
                <div
                  key={vendorName}
                  className="flex items-center justify-between px-3 py-2 bg-slate-900/30 border border-white/5 rounded-xl text-xs animate-fadeIn"
                  style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
                >
                  <span className="text-slate-200 font-semibold">{vendorName}</span>
                  <button
                    onClick={() => handleRemoveVendor(vendorName)}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/5 transition"
                    aria-label={`Remove vendor ${vendorName}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Stepper Footer: Attachments & Form Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 pt-6 border-t border-white/10 items-start">
        
        {/* Action Buttons: Save & Send / Save as Draft */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleSave("Sent")}
            className="flex-1 rounded-xl btn-primary py-3.5 text-xs font-semibold"
          >
            Save & Send to Vendors
          </button>
          <button
            onClick={() => handleSave("Draft")}
            className="flex-1 rounded-xl btn-secondary py-3.5 text-xs font-semibold"
          >
            Save as Draft
          </button>
        </div>

        {/* Right Side: Attachments Dropzone */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Attachments</span>
          
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-500 ${
              dragActive
                ? "border-emerald-400 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                : "border-white/10 bg-slate-900/10 hover:border-white/20 hover:bg-slate-900/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload attachments"
            />
            <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-200 font-medium">Drag & drop files here, or click to upload</p>
            <p className="text-[10px] text-slate-500 mt-1">PDF, DOC, XLS, PNG, JPG up to 10MB</p>
          </div>

          {/* List of Attached files */}
          {attachments.length > 0 && (
            <div className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-200">
              {attachments.map((fileName, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 bg-slate-900/40 border border-white/5 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-300">
                    <File className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{fileName}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAttachment(idx)}
                    className="p-1 rounded text-slate-500 hover:text-white"
                    aria-label={`Remove attachment ${fileName}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
