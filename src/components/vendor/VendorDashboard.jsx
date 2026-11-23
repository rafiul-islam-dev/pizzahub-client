"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import VendorHeader from "@/components/vendor/VendorHeader";
import { getVendorDashboard } from "@/services/vendor.service";

const money = (value) =>
  `$${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)}`;

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

export default function VendorDashboard() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const firstName = (session?.user?.name || "there").split(" ")[0];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getVendorDashboard();

      setData({
        stats: result.stats || {},
        orders: Array.isArray(result.recentOrders)
          ? result.recentOrders
          : [],
      });
    } catch (err) {
      console.error("Vendor dashboard error:", err);
      setError(err.message || "Failed to load dashboard data.");
      setData({ stats: {}, orders: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchDashboard());
  }, [fetchDashboard]);

  const stats = data?.stats || {};
  const orders = data?.orders || [];

  const statCards = [
    {
      label: "Menu Items",
      value: stats.totalMenuItems ?? 0,
      caption: "your full menu",
    },
    {
      label: "Active items",
      value: stats.approvedMenuItems ?? 0,
      caption: "Unlimited on Premium",
    },
    {
      label: "Pending orders",
      value: stats.pendingOrders ?? 0,
      caption: "waiting for your review",
    },
    {
      label: "Accepted orders",
      value: stats.acceptedOrders ?? stats.totalOrders ?? 0,
      caption: "On the way to happy",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#e9ddcd] border-t-[#b83227]" />
      </div>
    );
  }

  return (
    <div>
      <VendorHeader title={`Good ${firstName}, here's the scoop.`} />

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[#ece2d6] bg-white px-4 py-4"
          >
            <p className="text-[11px] text-[#9a8f84]">{card.label}</p>

            <p className="mt-1 font-serif text-[26px] font-semibold leading-none text-[#332c27]">
              {card.value}
            </p>

            <p className="mt-2 text-[10px] text-[#b4a89c]">
              {card.caption}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        {/* Recent orders */}
        <section className="rounded-lg border border-[#ece2d6] bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#332c27]">
                Recent customer orders
              </h2>

              <p className="mt-1 text-[11px] text-[#9a8f84]">
                A quick look at what&apos;s happening.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/orders"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b83227] hover:underline"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[#efe7dd]">
            {orders.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#9a8f84]">
                No orders yet.
              </p>
            ) : (
              orders.slice(0, 4).map((order, index) => {
                const item = order.items?.[0];
                const name = item?.name || "Pizza order";
                const image =
                  item?.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&q=70";
                const status = String(order.status || "pending");

                return (
                  <button
                    key={order._id || index}
                    onClick={() => router.push("/dashboard/vendor/orders")}
                    className="flex w-full items-center gap-3 py-2.5 text-left"
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-md object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-[#332c27]">
                        {name}
                      </p>

                      <p className="truncate text-[10px] text-[#9a8f84]">
                        {order.customerName || "Customer"} ·{" "}
                        {dateLabel(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${statusClass(status)}`}
                    >
                      {status}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Premium promo */}
        <section className="flex flex-col justify-between rounded-lg bg-[#b8452f] p-5 text-white">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
              <Sparkles size={14} />
              Grow your pizzeria
            </div>

            <h2 className="mt-4 font-serif text-[22px] font-semibold leading-snug">
              You&apos;re on the Premium plan.
            </h2>

            <p className="mt-2 text-[11px] leading-5 text-white/80">
              Enjoy unlimited items, a premium badge, and featured
              placement.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/subscription"
            className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-md bg-[#f7e7db] px-3.5 py-2 text-[11px] font-semibold text-[#8f3826] transition hover:bg-white"
          >
            View plan
            <ArrowRight size={13} />
          </Link>
        </section>
      </div>
    </div>
  );
}