"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  ShoppingBag,
  Eye,
  Check,
  X,
  Clock,
} from "lucide-react";

import {
  getVendorOrders,
  decideVendorOrder,
} from "@/services/vendor.service";

const filters = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "rejected",
  "cancelled",
];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  ready: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getVendorOrders(activeFilter);

      setOrders(result.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const handleDecision = async (order, decision) => {
    let rejectionReason = "";

    if (decision === "rejected") {
      rejectionReason =
        window.prompt("Enter rejection reason (optional):") || "";
    }

    try {
      setProcessingId(order._id);

      await decideVendorOrder(
        order._id,
        decision,
        rejectionReason
      );

      await fetchOrders();

      if (selectedOrder?._id === order._id) {
        setSelectedOrder(null);
      }
    } catch (err) {
      alert(err.message || "Failed to update order");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#27231f] sm:text-3xl">
            Manage Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and manage orders received by your restaurant.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#eaded1] bg-white px-4 py-2.5 hover:bg-[#fff8ef] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              activeFilter === filter
                ? "bg-[#b83227] text-white"
                : "border border-[#eaded1] bg-white text-gray-600 hover:bg-[#fff8ef]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}

          <button
            onClick={fetchOrders}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-60 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#eaded1] border-t-[#b83227]" />
        </div>
      ) : orders.length === 0 ? (
        /* Empty */
        <div className="rounded-xl border border-[#eaded1] bg-white px-6 py-16 text-center">
          <ShoppingBag
            size={42}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 font-semibold text-[#27231f]">
            No orders found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            There are no orders under this status yet.
          </p>
        </div>
      ) : (
        /* Orders */
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              processing={processingId === order._id}
              onView={() => setSelectedOrder(order)}
              onDecision={handleDecision}
            />
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDecision={handleDecision}
          processing={processingId === selectedOrder._id}
        />
      )}
    </div>
  );
}

function OrderCard({
  order,
  processing,
  onView,
  onDecision,
}) {
  const isPending = order.status === "pending";

  return (
    <div className="rounded-xl border border-[#eaded1] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Info */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[#27231f]">
              {order.orderNumber || order._id}
            </h3>

            <StatusBadge status={order.status} />
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {order.customerName || "Customer"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Amount */}
        <div className="sm:text-right">
          <p className="text-xs text-gray-500">Order Total</p>

          <p className="mt-1 text-xl font-bold text-[#27231f]">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-2 border-t border-[#eaded1] pt-4">
        {(order.items || []).map((item, index) => (
          <div
            key={item.menuItemId || index}
            className="flex justify-between gap-3 text-sm"
          >
            <span className="text-gray-600">
              {item.name} × {item.quantity}
            </span>

            <span className="font-medium text-[#27231f]">
              {formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onView}
          className="flex items-center gap-2 rounded-lg border border-[#eaded1] px-4 py-2 text-sm hover:bg-[#fff8ef]"
        >
          <Eye size={16} />
          Details
        </button>

        {isPending && (
          <>
            <button
              disabled={processing}
              onClick={() => onDecision(order, "accepted")}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Check size={16} />
              {processing ? "Processing..." : "Accept"}
            </button>

            <button
              disabled={processing}
              onClick={() => onDecision(order, "rejected")}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              <X size={16} />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  onDecision,
  processing,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#27231f]">
              Order Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {order.orderNumber || order._id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer */}
        <div className="mt-5 rounded-xl bg-[#fff8ef] p-4">
          <h3 className="font-semibold text-[#27231f]">
            Customer Information
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            {order.customerName || "Customer"}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {order.customerEmail || "No email"}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {order.phone || "No phone"}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Delivery Address: {order.deliveryAddress || "N/A"}
          </p>
        </div>

        {/* Items */}
        <div className="mt-5">
          <h3 className="font-semibold text-[#27231f]">
            Order Items
          </h3>

          <div className="mt-3 space-y-3">
            {(order.items || []).map((item, index) => (
              <div
                key={item.menuItemId || index}
                className="flex items-center justify-between gap-3 border-b border-[#eaded1] pb-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#27231f]">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mt-5 flex justify-between border-t border-[#eaded1] pt-4">
          <span className="font-semibold">Total</span>

          <span className="text-lg font-bold text-[#b83227]">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          {formatDate(order.createdAt)}
        </div>

        {/* Decision */}
        {order.status === "pending" && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              disabled={processing}
              onClick={() => onDecision(order, "accepted")}
              className="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Accept Order
            </button>

            <button
              disabled={processing}
              onClick={() => onDecision(order, "rejected")}
              className="rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Reject Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}