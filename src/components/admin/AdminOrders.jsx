"use client";

import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAdminOrders,
  getAdminOrderDetails,
  updateAdminOrderStatus,
} from "@/services/admin.service";

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
  "rejected",
];

function getStatusStyle(status) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
}

function formatPrice(price) {
  return `৳${Number(price || 0).toLocaleString("en-BD")}`;
}

function getOrderId(order) {
  return order._id || order.id;
}

function getCustomerName(order) {
  return (
    order.customerName ||
    order.customer?.name ||
    order.userName ||
    "Unknown customer"
  );
}

function getCustomerEmail(order) {
  return (
    order.customerEmail ||
    order.customer?.email ||
    order.email ||
    "No email"
  );
}

function getOrderTotal(order) {
  return (
    order.totalAmount ??
    order.totalPrice ??
    order.total ??
    order.grandTotal ??
    0
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  async function fetchOrders() {
    try {
      setLoading(true);

      const result = await getAdminOrders({
        page,
        limit: 10,
        search,
        status,
      });

      setOrders(result.data || []);
      setPagination(
        result.pagination || {
          page: 1,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      toast.error(error.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => fetchOrders());
  }, [page, search, status]);

  async function handleStatusChange(orderId, newStatus) {
    try {
      setUpdatingId(orderId);

      await updateAdminOrderStatus(orderId, newStatus);

      toast.success("Order status updated");

      await fetchOrders();

      if (selectedOrder && getOrderId(selectedOrder) === orderId) {
        await handleViewDetails(orderId);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleViewDetails(orderId) {
    try {
      setDetailsLoading(true);
      setSelectedOrder(null);

      const result = await getAdminOrderDetails(orderId);

      setSelectedOrder(result.data);
    } catch (error) {
      toast.error(error.message || "Failed to load order details");
    } finally {
      setDetailsLoading(false);
    }
  }

  const orderItems = (order) =>
    order.items || order.menuItems || order.pizzas || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27231f]">
            Manage Orders
          </h1>

          <p className="mt-2 text-[#766b60]">
            Monitor customer orders and manage order status.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#eaded1] bg-white px-4 py-3 text-sm font-medium hover:bg-[#f2e8dc] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Total */}
      <div className="rounded-2xl border border-[#eaded1] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
            <ClipboardList size={22} />
          </div>

          <div>
            <p className="text-sm text-[#766b60]">
              Matching Orders
            </p>

            <p className="text-2xl font-bold text-[#27231f]">
              {pagination.total}
            </p>
          </div>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#eaded1] bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#766b60]"
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search order number or customer..."
            className="w-full rounded-xl border border-[#eaded1] py-3 pl-10 pr-4 outline-none focus:border-[#b83227]"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-[#eaded1] bg-white px-4 py-3 outline-none focus:border-[#b83227]"
        >
          <option value="">All Statuses</option>

          {statuses.map((item) => (
            <option key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border border-[#eaded1] bg-white">
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <RefreshCw
              size={30}
              className="animate-spin text-[#b83227]"
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList
              size={42}
              className="mx-auto text-[#b83227]"
            />

            <h3 className="mt-4 text-xl font-semibold text-[#27231f]">
              No orders found
            </h3>

            <p className="mt-2 text-[#766b60]">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-[#f2e8dc] text-sm text-[#51473e]">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const id = getOrderId(order);

                    return (
                      <tr
                        key={id}
                        className="border-t border-[#eaded1]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#27231f]">
                            {order.orderNumber || String(id).slice(-8)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-[#27231f]">
                            {getCustomerName(order)}
                          </p>

                          <p className="text-sm text-[#766b60]">
                            {getCustomerEmail(order)}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-semibold text-[#b83227]">
                          {formatPrice(getOrderTotal(order))}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(order.status)}`}
                          >
                            {order.status || "pending"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#766b60]">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleViewDetails(id)}
                              className="flex items-center justify-center gap-2 rounded-lg bg-[#f2e8dc] px-3 py-2 text-sm font-medium text-[#51473e] hover:bg-[#eaded1]"
                            >
                              <Eye size={16} />
                              Details
                            </button>

                            <select
                              value={order.status || "pending"}
                              disabled={updatingId === id}
                              onChange={(e) =>
                                handleStatusChange(id, e.target.value)
                              }
                              className="rounded-lg border border-[#eaded1] px-2 py-2 text-sm disabled:opacity-50"
                            >
                              {statuses.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="space-y-4 p-4 md:hidden">
              {orders.map((order) => {
                const id = getOrderId(order);

                return (
                  <div
                    key={id}
                    className="rounded-xl border border-[#eaded1] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#27231f]">
                          {order.orderNumber || String(id).slice(-8)}
                        </p>

                        <p className="mt-1 text-sm text-[#766b60]">
                          {getCustomerName(order)}
                        </p>

                        <p className="text-xs text-[#766b60]">
                          {getCustomerEmail(order)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(order.status)}`}
                      >
                        {order.status || "pending"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-[#b83227]">
                        {formatPrice(getOrderTotal(order))}
                      </span>

                      <span className="text-xs text-[#766b60]">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewDetails(id)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#f2e8dc] px-3 py-2 text-sm font-medium"
                      >
                        <Eye size={16} />
                        Details
                      </button>

                      <select
                        value={order.status || "pending"}
                        disabled={updatingId === id}
                        onChange={(e) =>
                          handleStatusChange(id, e.target.value)
                        }
                        className="rounded-lg border border-[#eaded1] px-2 py-2 text-sm"
                      >
                        {statuses.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#766b60]">
            Page {pagination.page} of {pagination.totalPages}
            {" · "}
            {pagination.total} orders
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-xl border border-[#eaded1] bg-white px-4 py-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= pagination.totalPages}
              className="flex items-center gap-1 rounded-xl border border-[#eaded1] bg-white px-4 py-2 disabled:opacity-40"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Order details modal */}
      {(detailsLoading || selectedOrder) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 sm:p-7">
            {detailsLoading ? (
              <div className="flex min-h-48 items-center justify-center">
                <RefreshCw
                  size={30}
                  className="animate-spin text-[#b83227]"
                />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#27231f]">
                      Order Details
                    </h2>

                    <p className="mt-1 text-sm text-[#766b60]">
                      {selectedOrder.orderNumber ||
                        String(getOrderId(selectedOrder))}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-lg p-2 hover:bg-[#f2e8dc]"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#fff8ef] p-4">
                    <p className="text-sm text-[#766b60]">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-[#27231f]">
                      {getCustomerName(selectedOrder)}
                    </p>

                    <p className="mt-1 text-sm text-[#766b60]">
                      {getCustomerEmail(selectedOrder)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#fff8ef] p-4">
                    <p className="text-sm text-[#766b60]">
                      Order Status
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusStyle(selectedOrder.status)}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6">
                  <h3 className="font-bold text-[#27231f]">
                    Ordered Items
                  </h3>

                  <div className="mt-3 space-y-3">
                    {orderItems(selectedOrder).length > 0 ? (
                      orderItems(selectedOrder).map((item, index) => (
                        <div
                          key={item._id || item.id || index}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#eaded1] p-3"
                        >
                          <div>
                            <p className="font-medium text-[#27231f]">
                              {item.name ||
                                item.menuItemName ||
                                item.title ||
                                "Pizza"}
                            </p>

                            <p className="text-sm text-[#766b60]">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>

                          <p className="font-semibold text-[#b83227]">
                            {formatPrice(
                              item.subtotal ??
                                (Number(item.price || 0) *
                                  Number(item.quantity || 1))
                            )}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#766b60]">
                        Order items unavailable.
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                {(selectedOrder.address ||
                  selectedOrder.deliveryAddress) && (
                  <div className="mt-5 rounded-xl bg-[#fff8ef] p-4">
                    <p className="text-sm text-[#766b60]">
                      Delivery Address
                    </p>

                    <p className="mt-1 font-medium text-[#27231f]">
                      {selectedOrder.address ||
                        selectedOrder.deliveryAddress}
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="mt-5 flex items-center justify-between border-t border-[#eaded1] pt-4">
                  <span className="font-semibold text-[#27231f]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#b83227]">
                    {formatPrice(getOrderTotal(selectedOrder))}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}