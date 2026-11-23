
"use client";

import { useCallback, useEffect, useState } from "react";
import { Package, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getMyOrders, cancelMyOrder } from "@/services/order.service";

const statuses = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-800",
};

const money = (value) =>
  `৳${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)}`;

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Failed to load orders."
  );
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState("");

  const loadOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result = await getMyOrders();

      // Support different API response structures
      const orderList = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.orders)
            ? result.orders
            : Array.isArray(result?.data?.orders)
              ? result.data.orders
              : [];

      setOrders(orderList);
    } catch (err) {
      console.error("Load orders error:", err);

      setError(getErrorMessage(err));
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => loadOrders());
  }, [loadOrders]);

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelId(id);

      await cancelMyOrder(id);

      await loadOrders(true);
    } catch (err) {
      console.error("Cancel order error:", err);

      toast.error(getErrorMessage(err));
    } finally {
      setCancelId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-red-600" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your orders and their status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadOrders(true)}
          disabled={refreshing}
          className="rounded-lg border p-2 transition hover:bg-gray-50 disabled:opacity-50"
          title="Refresh orders"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <p className="font-semibold">Unable to load orders</p>
          <p className="mt-1">{error}</p>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            className="mt-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!error && orders.length === 0 && (
        <div className="rounded-xl border bg-white p-12 text-center">
          <Package
            size={40}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-3 font-semibold">
            No orders yet
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Your orders will appear here after you place an order.
          </p>
        </div>
      )}

      {/* Orders */}
      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-xl border bg-white p-4 sm:p-6"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">
                    {order.orderNumber || order._id}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statuses[order.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status || "unknown"}
                </span>
              </div>

              {/* Items */}
              <div className="my-4 space-y-2 border-y py-4">
                {(order.items || []).map((item, index) => (
                  <div
                    key={item.menuItemId || index}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      {money(
                        item.subtotal ??
                          item.price * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Total
                </span>

                <span className="text-lg font-bold">
                  {money(order.totalAmount)}
                </span>
              </div>

              {/* Delivery details */}
              {(order.deliveryDate || order.message) && (
                <div className="mt-3 space-y-1 rounded-lg bg-[#fff8ef] p-3 text-xs text-gray-600">
                  {order.deliveryDate && (
                    <p>
                      <strong>Delivery date:</strong>{" "}
                      {new Date(
                        order.deliveryDate
                      ).toLocaleDateString()}
                    </p>
                  )}

                  {order.message && (
                    <p>
                      <strong>Instructions:</strong> {order.message}
                    </p>
                  )}
                </div>
              )}

              {/* Cancel */}
              {order.status === "pending" && (
                <button
                  type="button"
                  onClick={() => handleCancel(order._id)}
                  disabled={cancelId === order._id}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle size={16} />

                  {cancelId === order._id
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
