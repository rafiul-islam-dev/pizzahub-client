const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMenuItems() {
  try {
    const response = await fetch(`${API_URL}/menu`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch menu items");
    }

    const result = await response.json();

    return result.data || [];
  } catch (error) {
    console.error("Menu API error:", error.message);

    return [];
  }
}

export async function getMenuItemById(id) {
  try {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch menu item");
    }

    const result = await response.json();

    return result.data || null;
  } catch (error) {
    console.error("Single menu API error:", error.message);
    return null;
  }
}