
import api from "@/lib/axios";

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
