import { useContext } from "react"
import { StoreContext } from "../context/StoreContext"

export function useVendorBridgeStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useVendorBridgeStore must be used within a StoreProvider")
  }
  return context
}
