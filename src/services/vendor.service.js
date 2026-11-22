import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthToken() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  return data.token;
}

// Get my vendor application
export async function getMyVendorApplication() {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/applications/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch application");
  }

  return result.data;
}

// Submit vendor application
export async function submitVendorApplication(applicationData) {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/applications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit application");
  }

  return result;
}


export async function getMyMenuItems() {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/menu`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch menu items");
  }

  return result.data;
}

export async function createMenuItem(menuItemData) {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/menu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menuItemData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create menu item");
  }

  return result;
}
// Get vendor dashboard statistics
export const getVendorDashboardStats = async () => {
  return await vendorRequest("/vendor/dashboard/stats");
};

// Get recent vendor orders
export const getVendorRecentOrders = async () => {
  return await vendorRequest("/vendor/dashboard/recent-orders");
};