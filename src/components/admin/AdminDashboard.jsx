"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  Pizza,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  ClipboardList,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import {
  getAdminDashboardStats,
  getAdminRecentOrders,
} from "@/services/admin.service";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  ready: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResult, ordersResult] = await Promise.all([
        getAdminDashboardStats(),
        getAdminRecentOrders(),
      ]);

      setStats(statsResult.data);
      setRecentOrders(ordersResult.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/admin/users",
    },
    {
      title: "Approved Vendors",
      value: stats?.totalVendors ?? 0,
      icon: Store,
      color: "text-purple-600",
      bg: "bg-purple-100",
      href: "/admin/vendor-applications",
    },
    {
      title: "Menu Items",
      value: stats?.totalMenuItems ?? 0,
      icon: Pizza,
      color: "text-orange-600",
      bg: "bg-orange-100",
      href: "/admin/menu-approval",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-100",
      href: "/admin/orders",
    },
    {
      title: "Premium Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      href: "/admin/transactions",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      href: "/admin/orders",
    },
  ];

  const quickActions = [
    {
      title: "Vendor Applications",
      description: "Review vendor applications",
      count: stats?.pendingVendorApplications ?? 0,
      href: "/admin/vendor-applications",
      icon: Store,
    },
    {
      title: "Menu Approval",
      description: "Review submitted menu items",
      count: stats?.pendingMenuItems ?? 0,
      href: "/admin/menu-approval",
      icon: Pizza,
    },
    {
      title: "Manage Orders",
      description: "Monitor and manage orders",
      count: stats?.pendingOrders ?? 0,
      href: "/admin/orders",
      icon: ClipboardList,
    },
  ];

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
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Overview of your PizzaHub platform.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#eaded1] bg-white px-4 py-2.5 text-sm hover:bg-[#fff8ef]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Statistics */}
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

                <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Extra Statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#eaded1] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <CheckCircle size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Delivered Orders
              </p>

              <p className="text-2xl font-bold text-[#27231f]">
                {stats?.completedOrders ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#eaded1] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Pizza size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Approved Menu Items
              </p>

              <p className="text-2xl font-bold text-[#27231f]">
                {stats?.approvedMenuItems ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#27231f]">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Items that need your attention.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-center justify-between gap-4 rounded-xl border border-[#eaded1] bg-white p-5 transition hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-[#fff1e5] p-2.5 text-[#b83227]">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#27231f]">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {action.description}
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#b83227]">
                      {action.count} pending
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-gray-400"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-xl border border-[#eaded1] bg-white">
        <div className="flex items-center justify-between border-b border-[#eaded1] p-4 sm:p-5">
          <div>
            <h2 className="font-semibold text-[#27231f]">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest orders on the platform
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-medium text-[#b83227] hover:underline"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No orders yet.
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

                  const status =
                    String(order.status || "pending").toLowerCase();

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