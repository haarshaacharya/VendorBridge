import React, { createContext, useState, useEffect } from "react"

export const StoreContext = createContext(null)

const INITIAL_VENDORS = [
  {
    id: "v1",
    name: "Tech Core LTD",
    category: "IT",
    gstNo: "27AABCT4820B1Z2",
    contactNo: "+91 98200 12345",
    status: "Active",
  },
  {
    id: "v2",
    name: "FastLog Transport",
    category: "logistics",
    gstNo: "27ABCFG8890C2Z3",
    contactNo: "+91 98111 22334",
    status: "Blocked",
  },
  {
    id: "v3",
    name: "Infra Supplies Pvt Ltd",
    category: "construction",
    gstNo: "27ACDFH1204D3Z4",
    contactNo: "+91 97699 88776",
    status: "Active",
  },
  {
    id: "v4",
    name: "OfficeNeed Co",
    category: "office supplies",
    gstNo: "27ADGJK3456E4Z5",
    contactNo: "+91 99300 44556",
    status: "Pending",
  },
]

const INITIAL_RFQS = [
  {
    id: "RFQ-001",
    title: "Office Furniture procurement Q2",
    category: "Furniture",
    deadline: "2026-06-15",
    description: "Ergonomic chairs and standing desks for 3rd floor",
    lineItems: [
      { id: "li1", item: "Ergonomic chair", qty: 25, unit: "NOS" },
      { id: "li2", item: "Standing desks", qty: 10, unit: "NOS" },
    ],
    assignedVendors: ["Infra Supplies Pvt Ltd", "Tech Core LTD", "OfficeNeed Co"],
    status: "Approved",
    createdAt: "2026-05-15",
  },
  {
    id: "RFQ-002",
    title: "Laptops and Monitors for developers",
    category: "IT Hardware",
    deadline: "2026-05-30",
    description: "MacBook Pro laptops and 4K Dell monitors",
    lineItems: [
      { id: "li3", item: "MacBook Pro 16", qty: 15, unit: "NOS" },
      { id: "li4", item: "Dell 27inch 4K Monitor", qty: 20, unit: "NOS" },
    ],
    assignedVendors: ["Tech Core LTD"],
    status: "Approved",
    createdAt: "2026-05-01",
  },
  {
    id: "RFQ-003",
    title: "Supply Chain Freight Logistics",
    category: "Logistics",
    deadline: "2026-04-30",
    description: "Monthly dispatch logistics and delivery service",
    lineItems: [
      { id: "li5", item: "Heavy Duty Freight Trip", qty: 8, unit: "TRIP" },
    ],
    assignedVendors: ["FastLog Transport"],
    status: "Approved",
    createdAt: "2026-04-05",
  },
  {
    id: "RFQ-004",
    title: "Bulk Office Supplies and Stationery",
    category: "Stationery",
    deadline: "2026-03-30",
    description: "High quality printing paper and writing supplies",
    lineItems: [
      { id: "li6", item: "A4 Printing Paper reams", qty: 100, unit: "BOX" },
    ],
    assignedVendors: ["OfficeNeed Co"],
    status: "Approved",
    createdAt: "2026-03-10",
  },
  {
    id: "RFQ-005",
    title: "Server Room Cooling & Network Rack",
    category: "IT Hardware",
    deadline: "2026-02-28",
    description: "Cooling system and patch panels",
    lineItems: [
      { id: "li7", item: "Network Switch 24-Port", qty: 4, unit: "NOS" },
    ],
    assignedVendors: ["Tech Core LTD"],
    status: "Approved",
    createdAt: "2026-02-01",
  },
  {
    id: "RFQ-006",
    title: "Conference Room Seating",
    category: "Furniture",
    deadline: "2026-01-30",
    description: "Premium leather executive chairs",
    lineItems: [
      { id: "li8", item: "Executive Chair", qty: 12, unit: "NOS" },
    ],
    assignedVendors: ["Infra Supplies Pvt Ltd"],
    status: "Approved",
    createdAt: "2026-01-10",
  },
  {
    id: "RFQ-007",
    title: "Tech Support Devices Q4",
    category: "IT Hardware",
    deadline: "2025-12-20",
    description: "Support desk headsets and keyboards",
    lineItems: [
      { id: "li9", item: "Wireless Headsets", qty: 30, unit: "NOS" },
    ],
    assignedVendors: ["Tech Core LTD"],
    status: "Approved",
    createdAt: "2025-11-25",
  },
]

const INITIAL_QUOTATIONS = [
  {
    id: "q-1",
    rfqId: "RFQ-001",
    vendorName: "Infra Supplies Pvt Ltd",
    grandTotal: 185400,
    gstPercent: 18,
    deliveryDays: 10,
    vendorRating: 4.5,
    paymentTerms: "30 days net",
    status: "Pending",
    notes: "Best quality wood frame chairs.",
    lineItems: [
      { item: "Ergonomic chair", qty: 25, unitPrice: 3200, total: 80000, deliveryDays: 8 },
      { item: "Standing desks", qty: 10, unitPrice: 7700, total: 77000, deliveryDays: 10 }
    ]
  },
  {
    id: "q-2",
    rfqId: "RFQ-001",
    vendorName: "Tech Core LTD",
    grandTotal: 200010,
    gstPercent: 18,
    deliveryDays: 14,
    vendorRating: 4.2,
    paymentTerms: "20 days net",
    status: "Pending",
    notes: "Includes 2 year manufacturing warranty.",
    lineItems: [
      { item: "Ergonomic chair", qty: 25, unitPrice: 3500, total: 87500, deliveryDays: 7 },
      { item: "Standing desks", qty: 10, unitPrice: 8200, total: 82000, deliveryDays: 14 }
    ]
  },
  {
    id: "q-3",
    rfqId: "RFQ-001",
    vendorName: "OfficeNeed Co",
    grandTotal: 214800,
    gstPercent: 18,
    deliveryDays: 7,
    vendorRating: 3.8,
    paymentTerms: "15 days net",
    status: "Pending",
    notes: "Quick delivery from local inventory.",
    lineItems: [
      { item: "Ergonomic chair", qty: 25, unitPrice: 3800, total: 95000, deliveryDays: 5 },
      { item: "Standing desks", qty: 10, unitPrice: 8700, total: 87000, deliveryDays: 7 }
    ]
  }
]

const INITIAL_POS = [
  { poNo: "PO-2025-001", rfqId: "RFQ-001", vendorName: "Infra Supplies Pvt Ltd", amount: 185400, status: "Approved", createdAt: "2026-05-20", dueDate: "2026-06-20" },
  { poNo: "PO-2025-002", rfqId: "RFQ-002", vendorName: "Tech Core LTD", amount: 480000, status: "Approved", createdAt: "2026-05-10", dueDate: "2026-06-10" },
  { poNo: "PO-2025-003", rfqId: "RFQ-003", vendorName: "FastLog Transport", amount: 230000, status: "Approved", createdAt: "2026-04-15", dueDate: "2026-05-15" },
  { poNo: "PO-2025-004", rfqId: "RFQ-004", vendorName: "OfficeNeed Co", amount: 210000, status: "Approved", createdAt: "2026-03-20", dueDate: "2026-04-20" },
  { poNo: "PO-2025-005", rfqId: "RFQ-005", vendorName: "Tech Core LTD", amount: 320000, status: "Approved", createdAt: "2026-02-12", dueDate: "2026-03-12" },
  { poNo: "PO-2025-006", rfqId: "RFQ-006", vendorName: "Infra Supplies Pvt Ltd", amount: 270000, status: "Approved", createdAt: "2026-01-18", dueDate: "2026-02-18" },
  { poNo: "PO-2025-007", rfqId: "RFQ-007", vendorName: "Tech Core LTD", amount: 190000, status: "Approved", createdAt: "2025-12-05", dueDate: "2026-01-05" },
  { poNo: "PO-2025-008", rfqId: "RFQ-008", vendorName: "Tech Core LTD", amount: 140000, status: "Pending", createdAt: "2026-05-22", dueDate: "2026-06-22" },
  { poNo: "PO-2025-009", rfqId: "RFQ-009", vendorName: "OfficeNeed Co", amount: 34900, status: "draft", createdAt: "2026-05-23", dueDate: "2026-06-23" },
]

const INITIAL_INVOICES = [
  { invoiceNo: "INV-2025-0068", poNo: "PO-2025-001", vendorName: "Infra Supplies Pvt Ltd", amount: 185400, status: "Pending Payment", dateCreated: "2026-05-22", dueDate: "2026-06-21" },
  { invoiceNo: "INV-2025-0069", poNo: "PO-2025-002", vendorName: "Tech Core LTD", amount: 480000, status: "Pending Payment", dateCreated: "2026-05-23", dueDate: "2026-06-23" },
  { invoiceNo: "INV-2025-0070", poNo: "PO-2025-003", vendorName: "FastLog Transport", amount: 230000, status: "Paid", dateCreated: "2026-04-18", dueDate: "2026-05-18" },
  { invoiceNo: "INV-2025-0071", poNo: "PO-2025-004", vendorName: "OfficeNeed Co", amount: 210000, status: "Overdue", dateCreated: "2026-03-22", dueDate: "2026-04-22" },
  { invoiceNo: "INV-2025-0072", poNo: "PO-2025-005", vendorName: "Tech Core LTD", amount: 320000, status: "Overdue", dateCreated: "2026-02-15", dueDate: "2026-03-15" },
  { invoiceNo: "INV-2025-0073", poNo: "PO-2025-006", vendorName: "Infra Supplies Pvt Ltd", amount: 270000, status: "Overdue", dateCreated: "2026-01-20", dueDate: "2026-02-20" },
]

const INITIAL_ACTIVITIES = [
  { id: "act1", message: "Quotation selected - Infra Supplies Pvt Ltd selected for office furniture Q2", time: "23 May 2026, 4:15 PM", type: "approvals" },
  { id: "act2", message: "Approval pending - PO-2026 awaiting L2 approval by Priya Shah", time: "22 May 2026, 09:15 AM", type: "approvals" },
  { id: "act3", message: "RFQ published - office furniture Q2 sent to 3 vendors", time: "19 May 2026, 11:30 AM", type: "rfq" },
  { id: "act4", message: "Vendor added - FastLog Transport registered and pending verification", time: "18 May 2026, 3:20 PM", type: "vendors" },
]

export function StoreProvider({ children }) {
  const [vendors, setVendors] = useState([])
  const [rfqs, setRfqs] = useState([])
  const [quotations, setQuotations] = useState([])
  const [pos, setPos] = useState([])
  const [invoices, setInvoices] = useState([])
  const [activities, setActivities] = useState([])
  const [selectedQuotationId, setSelectedQuotationId] = useState("q-1")
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from LocalStorage
  useEffect(() => {
    const storedVendors = localStorage.getItem("vb_vendors")
    const storedRfqs = localStorage.getItem("vb_rfqs")
    const storedQuotations = localStorage.getItem("vb_quotations")
    const storedPos = localStorage.getItem("vb_pos")
    const storedInvoices = localStorage.getItem("vb_invoices")
    const storedActivities = localStorage.getItem("vb_activities")
    const storedSelQuoId = localStorage.getItem("vb_selected_quotation_id")

    if (storedVendors) setVendors(JSON.parse(storedVendors))
    else {
      setVendors(INITIAL_VENDORS)
      localStorage.setItem("vb_vendors", JSON.stringify(INITIAL_VENDORS))
    }

    if (storedRfqs) setRfqs(JSON.parse(storedRfqs))
    else {
      setRfqs(INITIAL_RFQS)
      localStorage.setItem("vb_rfqs", JSON.stringify(INITIAL_RFQS))
    }

    if (storedQuotations) setQuotations(JSON.parse(storedQuotations))
    else {
      setQuotations(INITIAL_QUOTATIONS)
      localStorage.setItem("vb_quotations", JSON.stringify(INITIAL_QUOTATIONS))
    }

    if (storedPos) setPos(JSON.parse(storedPos))
    else {
      setPos(INITIAL_POS)
      localStorage.setItem("vb_pos", JSON.stringify(INITIAL_POS))
    }

    if (storedInvoices) setInvoices(JSON.parse(storedInvoices))
    else {
      setInvoices(INITIAL_INVOICES)
      localStorage.setItem("vb_invoices", JSON.stringify(INITIAL_INVOICES))
    }

    if (storedActivities) setActivities(JSON.parse(storedActivities))
    else {
      setActivities(INITIAL_ACTIVITIES)
      localStorage.setItem("vb_activities", JSON.stringify(INITIAL_ACTIVITIES))
    }

    if (storedSelQuoId) setSelectedQuotationId(storedSelQuoId)
    else {
      setSelectedQuotationId("q-1")
      localStorage.setItem("vb_selected_quotation_id", "q-1")
    }

    setIsLoaded(true)
  }, [])

  // Actions
  const addVendor = (vendor) => {
    const newVendor = {
      ...vendor,
      id: "v" + (vendors.length + 1),
    }
    const updated = [newVendor, ...vendors]
    setVendors(updated)
    localStorage.setItem("vb_vendors", JSON.stringify(updated))
    logActivity(`Registered new vendor: ${vendor.name}`, "vendors")
  }

  const addRFQ = (rfq) => {
    const newRFQ = {
      ...rfq,
      id: `RFQ-00${rfqs.length + 1}`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    const updated = [newRFQ, ...rfqs]
    setRfqs(updated)
    localStorage.setItem("vb_rfqs", JSON.stringify(updated))
    logActivity(`Created RFQ: ${rfq.title} (${rfq.status})`, "rfq")
  }

  const addQuotation = (quotation) => {
    const newQuotation = {
      ...quotation,
      id: `q-${quotations.length + 1}`,
      status: "Pending"
    }
    const updated = [newQuotation, ...quotations]
    setQuotations(updated)
    localStorage.setItem("vb_quotations", JSON.stringify(updated))
    logActivity(`Quotation submitted by ${quotation.vendorName} for RFQ ${quotation.rfqId}`, "rfq")
  }

  const selectQuotationForApproval = (id) => {
    setSelectedQuotationId(id)
    localStorage.setItem("vb_selected_quotation_id", id)
  }

  const approveQuotation = (id, remarks) => {
    const qIndex = quotations.findIndex((q) => q.id === id)
    if (qIndex === -1) return

    const updatedQuotations = [...quotations]
    updatedQuotations[qIndex].status = "Approved"
    setQuotations(updatedQuotations)
    localStorage.setItem("vb_quotations", JSON.stringify(updatedQuotations))

    const activeQuotation = updatedQuotations[qIndex]

    const poNum = `PO-2025-00${pos.length + 68}`
    const newPO = {
      poNo: poNum,
      rfqId: activeQuotation.rfqId,
      vendorName: activeQuotation.vendorName,
      amount: activeQuotation.grandTotal,
      status: "Approved",
      createdAt: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    }
    const updatedPos = [newPO, ...pos]
    setPos(updatedPos)
    localStorage.setItem("vb_pos", JSON.stringify(updatedPos))

    const invoiceNum = `INV-2025-00${invoices.length + 68}`
    const newInvoice = {
      invoiceNo: invoiceNum,
      poNo: poNum,
      vendorName: activeQuotation.vendorName,
      amount: activeQuotation.grandTotal,
      status: "Pending Payment",
      dateCreated: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    }
    const updatedInvoices = [newInvoice, ...invoices]
    setInvoices(updatedInvoices)
    localStorage.setItem("vb_invoices", JSON.stringify(updatedInvoices))

    logActivity(`Quotation selected - ${activeQuotation.vendorName} selected for RFQ ${activeQuotation.rfqId}`, "approvals")
    logActivity(`PO ${poNum} approved and Invoice ${invoiceNum} generated`, "invoices")
    
    return poNum
  }

  const markInvoiceAsPaid = (invoiceNo) => {
    const invIndex = invoices.findIndex((i) => i.invoiceNo === invoiceNo)
    if (invIndex === -1) return

    const updatedInvoices = [...invoices]
    updatedInvoices[invIndex].status = "Paid"
    setInvoices(updatedInvoices)
    localStorage.setItem("vb_invoices", JSON.stringify(updatedInvoices))

    const poNo = updatedInvoices[invIndex].poNo
    const poIndex = pos.findIndex((p) => p.poNo === poNo)
    if (poIndex !== -1) {
      const updatedPos = [...pos]
      updatedPos[poIndex].status = "Approved"
      setPos(updatedPos)
      localStorage.setItem("vb_pos", JSON.stringify(updatedPos))
    }

    logActivity(`Invoice ${invoiceNo} paid to ${updatedInvoices[invIndex].vendorName}`, "invoices")
  }

  const logActivity = (message, type = "all") => {
    const now = new Date()
    const timeString = now.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    const newLog = {
      id: "act" + Date.now() + Math.random().toString(36).substr(2, 5),
      message,
      time: timeString,
      type
    }

    setActivities((prev) => [newLog, ...prev])

    const currentLogs = JSON.parse(localStorage.getItem("vb_activities") || "[]")
    const updatedLogs = [newLog, ...currentLogs.slice(0, 49)]
    localStorage.setItem("vb_activities", JSON.stringify(updatedLogs))
  }

  return (
    <StoreContext.Provider
      value={{
        vendors,
        rfqs,
        quotations,
        pos,
        invoices,
        activities,
        selectedQuotationId,
        isLoaded,
        addVendor,
        addRFQ,
        addQuotation,
        selectQuotationForApproval,
        approveQuotation,
        markInvoiceAsPaid,
        logActivity,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
