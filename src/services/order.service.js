
import api from "@/lib/axios";

// Place a new order (customer only)
export const createOrder = async ({ items, deliveryAddress, phone }) => {
  const response = await api.post("/orders", {
    items,
    deliveryAddress,
    phone,
  });

  return response.data;
};

// Get logged-in customer's orders
export const getMyOrders = async () => {
  const response = await api.get("/orders/my");

  return response.data;
};

// Cancel a pending order
export const cancelMyOrder = async (orderId) => {
  const response = await api.patch(`/orders/${orderId}/cancel`);

  return response.data;
};
