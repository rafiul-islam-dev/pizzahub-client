"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { getMyOrders } from "@/services/order.service";

export default function CustomerDashboardOverview() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

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
      console.error("Customer dashboard error:", error);
      setError(
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

  const stats = {
    total: orders.length,
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
    delivered: 0,
  };

  orders.forEach((order) => {
    const status = String(order.status || "").toLowerCase();

    if (status === "pending") stats.pending += 1;
    else if (status === "accepted" || status === "confirmed")
      stats.accepted += 1;
    else if (status === "rejected") stats.rejected += 1;
    else if (status === "cancelled") stats.cancelled += 1;
    else if (status === "delivered") stats.delivered += 1;
  });

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#eaded1] border-t-[#b83227]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#27231f] sm:text-3xl">
            Customer Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track your orders and account activity.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#eaded1] bg-white px-4 py-2.5 text-sm hover:bg-[#fff8ef]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Orders",
            value: stats.total,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            title: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
          },
          {
            title: "Accepted",
            value: stats.accepted,
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            title: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-100",
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-[#eaded1] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>

                  <p className="mt-2 text-2xl font-bold text-[#27231f]">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-3 ${card.bg} ${card.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/orders"
          className="flex items-center justify-between rounded-xl border border-[#eaded1] bg-white p-5 transition hover:shadow-md"
        >
          <div>
            <h3 className="font-semibold text-[#27231f]">
              My Orders
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View and cancel your orders.
            </p>
          </div>

          <TrendingUp className="text-[#b83227]" size={20} />
        </Link>

        <Link
          href="/dashboard/profile-settings"
          className="flex items-center justify-between rounded-xl border border-[#eaded1] bg-white p-5 transition hover:shadow-md"
        >
          <div>
            <h3 className="font-semibold text-[#27231f]">
              Profile Settings
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Update your name and profile image.
            </p>
          </div>

          <TrendingUp className="text-[#b83227]" size={20} />
        </Link>
      </div>
    </div>
  );
}