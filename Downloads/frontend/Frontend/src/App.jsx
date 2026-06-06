import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { Vendors } from "./pages/Vendors"
import { RFQs } from "./pages/RFQs"
import { Quotations } from "./pages/Quotations"
import { SubmitQuotation } from "./pages/SubmitQuotation"
import { Approvals } from "./pages/Approvals"
import { Invoices } from "./pages/Invoices"
import { Reports } from "./pages/Reports"
import { Activity } from "./pages/Activity"

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Secured Dashboard Shell */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/rfqs" element={<RFQs />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/quotations/submit" element={<SubmitQuotation />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/activity" element={<Activity />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
export { App }
