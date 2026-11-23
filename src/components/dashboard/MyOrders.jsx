"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import CustomerSidebar from "@/components/dashboard/CustomerSidebar";
import DashboardShell from "@/components/shared/DashboardShell";
import OrderTimeline from "@/components/order/OrderTimeline";
import { getMyOrders, cancelMyOrder } from "@/services/order.service";

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const dateLabel = (date) => {
  if (!date) return "—";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const statusClass = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "accepted":
    case "confirmed":
    case "preparing":
    case "ready":
    case "delivered":
      return "bg-[#e7f3e9] text-[#417a4d]";
    case "rejected":
    case "cancelled":
      return "bg-[#fbe9e7] text-[#b83227]";
    default:
      return "bg-[#fbf0dc] text-[#9a6b1f]";
  }
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getMyOrders();

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.orders)
        ? result.orders
        : [];

      setOrders(list);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load orders"
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => loadOrders());
  }, [loadOrders]);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this order?")) return;

    try {
      setCancelId(id);
      await cancelMyOrder(id);
      toast.success("Order cancelled");
      await loadOrders();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel order"
      );
    } finally {
      setCancelId(null);
    }
  }

  return (
    <DashboardShell sidebar={<CustomerSidebar />}>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b83227]">
              Your Pizzeria
            </p>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#332c27] sm:text-[34px]">
              Subscription
            </h1>

            <p className="mt-1.5 text-sm text-[#8a8076]">
              Your orders and all the good stuff you&apos;ve ordered.
            </p>

            <section className="mt-7 rounded-lg border border-[#ece2d6] bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#332c27]">
                    Your orders
                  </h2>

                  <p className="mt-1 text-[11px] text-[#9a8f84]">
                    All the good stuff you&apos;ve ordered.
                  </p>
                </div>

                <Link
                  href="/browse"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#b83227] px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-[#98291f]"
                >
                  Find a pizza
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-4 divide-y divide-[#efe7dd]">
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#e9ddcd] border-t-[#b83227]" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-[#9a8f84]">
                      No orders yet. Find a pizza you love!
                    </p>
                  </div>
                ) : (
                  orders.map((order) => {
                    const item = order.items?.[0];
                    const name = item?.name || "Pizza order";
                    const image =
                      item?.image ||
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&q=70";
                    const status = String(order.status || "pending");
                    const canCancel = status === "pending";

                    return (
                      <div key={order._id} className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-md object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-semibold text-[#332c27]">
                              {name}
                            </p>

                            <p className="truncate text-[10px] text-[#9a8f84]">
                              {order.vendorName ||
                                item?.vendorName ||
                                "PizzaHub"}{" "}
                              · Delivery {dateLabel(order.deliveryDate)}
                            </p>

                            <p className="mt-0.5 text-[10px] font-medium text-[#6c6359]">
                              {money(order.totalAmount)}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${statusClass(status)}`}
                          >
                            {status}
                          </span>

                          <button
                            onClick={() =>
                              setExpandedId(
                                expandedId === order._id
                                  ? null
                                  : order._id
                              )
                            }
                            className="shrink-0 rounded-md border border-[#e3d7c8] px-2.5 py-1.5 text-[10px] font-medium text-[#6c6359] transition hover:border-[#b83227] hover:text-[#b83227]"
                          >
                            {expandedId === order._id
                              ? "Hide"
                              : "Track"}
                          </button>

                          {canCancel && (
                            <button
                              onClick={() => handleCancel(order._id)}
                              disabled={cancelId === order._id}
                              className="shrink-0 rounded-md border border-[#e3d7c8] px-2.5 py-1.5 text-[10px] font-medium text-[#6c6359] transition hover:border-[#b83227] hover:text-[#b83227] disabled:opacity-50"
                            >
                              {cancelId === order._id ? "..." : "Cancel"}
                            </button>
                          )}
                        </div>

                        {expandedId === order._id && (
                          <OrderTimeline status={order.status} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
      </div>
    </DashboardShell>
  );
}