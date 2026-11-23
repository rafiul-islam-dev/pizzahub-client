"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  UtensilsCrossed,
  CheckCircle,
  Clock,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import { getVendorDashboard } from "@/services/vendor.service";

// Format currency
const formatCurrency = (amount = 0) =>
  `৳${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)}`;

// Format date
const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Order status styles
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  ready: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-700",
};

export default function VendorDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getVendorDashboard();

      setStats(result.stats || {});
      setRecentOrders(
        Array.isArray(result.recentOrders)
          ? result.recentOrders
          : []
      );
    } catch (err) {
      console.error("Vendor dashboard error:", err);

      setError(
        err.message || "Failed to load dashboard data."
      );

      setStats({});
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchDashboard());
  }, [fetchDashboard]);

  // Dashboard cards
  const statCards = [
    {
      title: "My Menu Items",
      value: stats?.totalMenuItems ?? 0,
      icon: UtensilsCrossed,
      color: "text-orange-600",
      bg: "bg-orange-100",
      href: "/dashboard/vendor/menu",
    },
    {
      title: "Approved Items",
      value: stats?.approvedMenuItems ?? 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
      href: "/dashboard/vendor/menu",
    },
    {
      title: "Pending Approval",
      value: stats?.pendingMenuItems ?? 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      href: "/dashboard/vendor/menu",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/dashboard/vendor/orders",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-100",
      href: "/dashboard/vendor/orders",
    },
    {
      title: "Completed Orders",
      value: stats?.completedOrders ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      href: "/dashboard/vendor/orders",
    },
    {
      title: "My Revenue",
      value: formatCurrency(stats?.revenue ?? 0),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      href: "/dashboard/vendor/orders",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#eaded1] border-t-[#b83227]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#27231f] sm:text-3xl">
            Vendor Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your menu and monitor your orders.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#eaded1] bg-white px-4 py-2.5 text-sm transition hover:bg-[#fff8ef] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <p>{error}</p>

          <button
            onClick={fetchDashboard}
            className="mt-2 font-semibold underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-xl border border-[#eaded1] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>

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
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/vendor/menu"
          className="flex items-center justify-between rounded-xl border border-[#eaded1] bg-white p-5 transition hover:shadow-md"
        >
          <div>
            <h3 className="font-semibold text-[#27231f]">
              Manage Menu
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add and manage your pizza items.
            </p>
          </div>

          <ArrowRight
            className="text-[#b83227]"
            size={20}
          />
        </Link>

        <Link
          href="/dashboard/vendor/orders"
          className="flex items-center justify-between rounded-xl border border-[#eaded1] bg-white p-5 transition hover:shadow-md"
        >
          <div>
            <h3 className="font-semibold text-[#27231f]">
              Manage Orders
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage customer orders.
            </p>
          </div>

          <ArrowRight
            className="text-[#b83227]"
            size={20}
          />
        </Link>
      </div>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-xl border border-[#eaded1] bg-white">
        <div className="flex items-center justify-between border-b border-[#eaded1] p-4 sm:p-5">
          <div>
            <h2 className="font-semibold text-[#27231f]">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest customer orders for your menu
            </p>
          </div>

          <Link
            href="/dashboard/vendor/orders"
            className="flex items-center gap-1 text-sm font-medium text-[#b83227] hover:underline"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingBag
              size={38}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 font-medium text-gray-500">
              No orders yet
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fff8ef] text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    Order
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Customer
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Amount
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eaded1]">
                {recentOrders.map((order, index) => {
                  const orderId =
                    order.orderNumber ||
                    order._id ||
                    `Order ${index + 1}`;

                  const customer =
                    order.customerName ||
                    order.customer?.name ||
                    order.customerEmail ||
                    order.customer?.email ||
                    "Customer";

                  const amount =
                    order.totalAmount ??
                    order.total ??
                    order.totalPrice ??
                    0;

                  const status = String(
                    order.status || "pending"
                  ).toLowerCase();

                  return (
                    <tr
                      key={order._id || index}
                      className="hover:bg-[#fffaf5]"
                    >
                      <td className="px-4 py-4 font-medium">
                        {orderId}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {customer}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {formatCurrency(amount)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            statusStyles[status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}