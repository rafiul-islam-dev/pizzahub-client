import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get authentication token
async function getAuthToken() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  return data.token;
}

// Common vendor API request helper
async function vendorRequest(endpoint, options = {}) {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "API request failed");
  }

  return result;
}

// ========================================
// VENDOR APPLICATION
// ========================================

// Get my vendor application
export async function getMyVendorApplication() {
  const result = await vendorRequest("/vendor/applications/me");
  return result.data;
}

// Submit vendor application
export async function submitVendorApplication(applicationData) {
  return await vendorRequest("/vendor/applications", {
    method: "POST",
    body: JSON.stringify(applicationData),
  });
}

// ========================================
// VENDOR MENU
// ========================================

// Get my menu items
export async function getMyMenuItems() {
  const result = await vendorRequest("/vendor/menu");
  return result.data;
}

// Create menu item
export async function createMenuItem(menuItemData) {
  return await vendorRequest("/vendor/menu", {
    method: "POST",
    body: JSON.stringify(menuItemData),
  });
}

// ========================================
// VENDOR DASHBOARD
// ========================================

// Get dashboard statistics
export async function getVendorDashboardStats() {
  return await vendorRequest("/vendor/dashboard/stats");
}

// Get recent orders
export async function getVendorRecentOrders() {
  return await vendorRequest("/vendor/dashboard/recent-orders");
}

// Get combined dashboard data
export async function getVendorDashboard() {
  const [statsResponse, ordersResponse] = await Promise.all([
    getVendorDashboardStats(),
    getVendorRecentOrders(),
  ]);

  return {
    stats: statsResponse.data,
    recentOrders: ordersResponse.data,
  };
}

// ========================================
// VENDOR ORDERS
// ========================================

// Get vendor orders
export async function getVendorOrders(status = "all") {
  return await vendorRequest(`/vendor/orders?status=${status}`);
}

// Accept or reject order
export async function decideVendorOrder(
  orderId,
  decision,
  rejectionReason = ""
) {
  return await vendorRequest(`/vendor/orders/${orderId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({
      decision,
      rejectionReason,
    }),
  });
}

// Update order status
export async function updateVendorOrderStatus(orderId, status) {
  return await vendorRequest(`/vendor/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}