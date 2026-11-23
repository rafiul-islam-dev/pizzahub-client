
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthToken() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  return data.token;
}

async function adminRequest(endpoint, options = {}) {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Admin request failed");
  }

  return result;
}

// Get vendor applications
export async function getVendorApplications(status = "pending") {
  const result = await adminRequest(
    `/admin/vendor-applications?status=${status}`
  );

  return result.data;
}

// Approve or reject application
export async function reviewVendorApplication(id, status) {
  return adminRequest(`/admin/vendor-applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getAdminMenuItems(status = "pending") {
  return adminRequest(`/admin/menu-items?status=${status}`);
}

export async function reviewMenuItem(id, status) {
  return adminRequest(`/admin/menu-items/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteAdminMenuItem(id) {
  return adminRequest(`/admin/menu-items/${id}`, {
    method: "DELETE",
  });
}

export async function setAdminMenuItemAvailability(id, isAvailable) {
  return adminRequest(`/admin/menu-items/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isAvailable }),
  });
}
export async function getAdminUsers({
  page = 1,
  limit = 10,
  search = "",
  role = "",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    role,
  });

  return adminRequest(`/admin/users?${params.toString()}`);
}

export async function updateUserRole(id, role) {
  return adminRequest(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function updateUserStatus(id, isActive) {
  return adminRequest(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}
export async function getAdminOrders({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    status,
  });

  return adminRequest(`/admin/orders?${params.toString()}`);
}

export async function getAdminOrderDetails(id) {
  return adminRequest(`/admin/orders/${id}`);
}

export async function updateAdminOrderStatus(id, status) {
  return adminRequest(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
// Get transaction summary
export const getAdminTransactionSummary = async () => {
  const response = await adminRequest(
    "/admin/transactions/summary"
  );

  return response;
};

// Get transactions
export const getAdminTransactions = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "all",
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    status,
  });

  const response = await adminRequest(
    `/admin/transactions?${params.toString()}`
  );

  return response;
};
// Get monthly analytics
export const getAdminMonthlyAnalytics = async () => {
  const response = await adminRequest(
    "/admin/analytics/monthly"
  );

  return response;
};
// Get admin dashboard statistics
export const getAdminDashboardStats = async () => {
  return await adminRequest("/admin/dashboard/stats");
};

// Get recent orders
export const getAdminRecentOrders = async () => {
  return await adminRequest("/admin/dashboard/recent-orders");
};