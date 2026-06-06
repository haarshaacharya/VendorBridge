import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useVendorBridgeStore } from "@/hooks/useStore"
import { Search, UserPlus, X } from "lucide-react"

export function Vendors() {
  const { vendors, addVendor, isLoaded } = useVendorBridgeStore()
  const [searchParams] = useSearchParams()

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  
  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    gstNo: "",
    contactNo: "",
    status: "Active",
  })

  // Deep linking to open Add Vendor modal
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setIsModalOpen(true)
    }
  }, [searchParams])

  // Count metrics for filters
  const counts = {
    All: vendors.length,
    Active: vendors.filter((v) => v.status === "Active").length,
    Pending: vendors.filter((v) => v.status === "Pending").length,
    Blocked: vendors.filter((v) => v.status === "Blocked").length,
  }

  // Filtered vendor list
  const filteredVendors = vendors.filter((vendor) => {
    const matchesTab = activeTab === "All" || vendor.status === activeTab
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.gstNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactNo.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesTab && matchesSearch
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addVendor(formData)
    setFormData({
      name: "",
      category: "",
      gstNo: "",
      contactNo: "",
      status: "Active",
    })
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      
      {/* Title & Action Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Supplier Registry</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Vendors</h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage supplier profiles and registrations
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 py-3 px-5 shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      {/* Controls: Search & Tabs */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-4 border-t border-white/[0.04]">
        {/* Search bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by vendor name, industry, category, GST number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/40 border border-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-emerald-500/40 focus:bg-slate-900/60 focus:ring-2 focus:ring-emerald-500/5 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap bg-slate-950/45 border border-white/[0.04] p-1 rounded-xl gap-1.5 self-start md:self-auto stagger-children backdrop-blur-md">
          {["All", "Active", "Pending", "Blocked"].map((tab) => {
            const isActive = activeTab === tab
            const count = counts[tab]
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-slate-900 text-emerald-400 border border-white/[0.06] shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab} <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'bg-white/5 text-slate-500'}`}>{isLoaded ? count : "0"}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Vendors Table Card */}
      <div className="rounded-2xl border border-white/[0.04] bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden">
        <div className="overflow-x-auto stagger-rows">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-white/[0.01]">
                <th className="pb-3 px-3 font-bold">Vendor Name</th>
                <th className="pb-3 px-3 font-bold">Industry/Category</th>
                <th className="pb-3 px-3 font-bold">GST No.</th>
                <th className="pb-3 px-3 font-bold">Contact No.</th>
                <th className="pb-3 px-3 font-bold">Status</th>
                <th className="pb-3 px-3 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="group table-row-premium">
                    <td className="py-4 px-3 font-semibold text-slate-200">{vendor.name}</td>
                    <td className="py-4 px-3 text-slate-400 text-xs">
                      <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="py-4 px-3 font-mono-data text-xs text-slate-300">{vendor.gstNo}</td>
                    <td className="py-4 px-3 font-mono-data text-xs text-slate-300">{vendor.contactNo}</td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                          vendor.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover-glow-emerald"
                            : vendor.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full animate-status-pulse ${
                            vendor.status === "Active"
                              ? "bg-emerald-400"
                              : vendor.status === "Pending"
                              ? "bg-yellow-400"
                              : "bg-rose-400"
                          }`}
                        />
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition duration-150 hover:bg-white/5 hover:text-white hover:border-emerald-500/30"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No vendors found matching the filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedVendor(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl animate-scale-in">
            <button
              onClick={() => setSelectedVendor(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold uppercase">
                {selectedVendor.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedVendor.name}</h3>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  {selectedVendor.category}
                </span>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 py-2 border-b border-white/5">
                <span className="text-slate-400">GST Number</span>
                <span className="col-span-2 font-mono text-slate-200">{selectedVendor.gstNo}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-white/5">
                <span className="text-slate-400">Contact No.</span>
                <span className="col-span-2 text-slate-200">{selectedVendor.contactNo}</span>
              </div>
              <div className="grid grid-cols-3 py-2">
                <span className="text-slate-400">Status</span>
                <span className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      selectedVendor.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : selectedVendor.status === "Pending"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {selectedVendor.status}
                  </span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedVendor(null)}
              className="mt-6 w-full rounded-xl bg-slate-900 border border-white/10 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl animate-scale-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            <h3 className="text-base font-bold text-white mb-6">Register New Vendor</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Vendor Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Infra Supplies Pvt Ltd"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Industry / Category *</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-slate-200 outline-none transition focus:border-emerald-500/50"
                  >
                    <option value="" disabled>Select...</option>
                    <option value="IT">IT</option>
                    <option value="Furniture">Furniture</option>
                    <option value="logistics">Logistics</option>
                    <option value="office supplies">Office Supplies</option>
                    <option value="construction">Construction</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-slate-200 outline-none transition focus:border-emerald-500/50"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">GST Number *</label>
                <input
                  type="text"
                  name="gstNo"
                  required
                  pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                  title="Should match a valid Indian GST format e.g. 27AABCS1429Bz0"
                  value={formData.gstNo}
                  onChange={handleInputChange}
                  placeholder="e.g. 27AABCS1429Bz0"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-emerald-500/50 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Contact Number *</label>
                <input
                  type="text"
                  name="contactNo"
                  required
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-emerald-500/50"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-900/50 py-3 text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-500 py-3 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition"
                >
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
