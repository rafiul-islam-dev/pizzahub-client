"use client";

import { useEffect, useState } from "react";
import { Package, RefreshCw, XCircle } from "lucide-react";
import { getMyOrders, cancelMyOrder } from "@/services/order.service";

const statuses = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-800",
};

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMyOrders();
      setOrders(result.data || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancelId(id);
      await cancelMyOrder(id);
      await loadOrders();
    } catch (err) {
      alert(err.message || "Unable to cancel order");
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your orders and their status.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="rounded-lg border p-2 hover:bg-gray-50"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {!orders.length ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <Package size={40} className="mx-auto text-gray-300" />
          <h3 className="mt-3 font-semibold">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-xl border bg-white p-4 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">
                    {order.orderNumber || order._id}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statuses[order.status] || "bg-gray-100"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="my-4 space-y-2 border-y py-4">
                {(order.items || []).map((item, index) => (
                  <div
                    key={item.menuItemId || index}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{money(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Total
                </span>
                <span className="text-lg font-bold">
                  {money(order.totalAmount)}
                </span>
              </div>

              {order.status === "pending" && (
                <button
                  onClick={() => handleCancel(order._id)}
                  disabled={cancelId === order._id}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
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