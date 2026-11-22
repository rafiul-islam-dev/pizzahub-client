
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