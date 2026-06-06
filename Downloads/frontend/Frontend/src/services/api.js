/**
 * Mock API services for VendorBridge ERP.
 * Suitable for connecting backend REST endpoints/sockets in the future.
 */

export const mockFetch = async (endpoint, options = {}) => {
  console.log(`[API Mock] Call: ${endpoint}`, options)
  return new Promise((resolve) => setTimeout(resolve, 300))
}
