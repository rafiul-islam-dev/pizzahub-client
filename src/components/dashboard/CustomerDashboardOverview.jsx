"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CustomerSidebar from "@/components/dashboard/CustomerSidebar";
import DashboardShell from "@/components/shared/DashboardShell";
import { authClient } from "@/lib/auth-client";
import { getMyOrders } from "@/services/order.service";

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

export default function CustomerDashboardOverview() {
  const { data: session } = authClient.useSession();
  const firstName = (session?.user?.name || "there").split(" ")[0];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Dashboard error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => loadOrders());
  }, [loadOrders]);

  const counts = {
    total: orders.length,
    pending: 0,
    accepted: 0,
    rejected: 0,
  };

  orders.forEach((order) => {
    const status = String(order.status || "").toLowerCase();

    if (status === "pending") counts.pending += 1;
    else if (
      status === "accepted" ||
      status === "confirmed"
    )
      counts.accepted += 1;
    else if (status === "rejected") counts.rejected += 1;
  });

  const statCards = [
    { label: "Total orders", value: counts.total, caption: "your full menu" },
    { label: "Pending", value: counts.pending, caption: "waiting for your review" },
    { label: "Accepted", value: counts.accepted, caption: "on the way to happy" },
    { label: "Rejected", value: counts.rejected, caption: "better luck next time" },
  ];

  return (
    <DashboardShell sidebar={<CustomerSidebar />}>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b83227]">
              Your Pizzeria
            </p>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#332c27] sm:text-[34px]">
              Good {firstName}, here&apos;s the scoop.
            </h1>

            <p className="mt-1.5 text-sm text-[#8a8076]">
              Here&apos;s what&apos;s happening at your shop today.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-lg border border-[#ece2d6] bg-white px-4 py-4"
                >
                  <p className="text-[11px] text-[#9a8f84]">
                    {card.label}
                  </p>

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
              <section className="rounded-lg border border-[#ece2d6] bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-[#332c27]">
                      Recent orders
                    </h2>

                    <p className="mt-1 text-[11px] text-[#9a8f84]">
                      A quick look at what&apos;s happening.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/orders"
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
                    orders.slice(0, 4).map((order) => {
                      const item = order.items?.[0];

                      return (
                        <div
                          key={order._id}
                          className="flex items-center gap-3 py-2.5"
                        >
                          <img
                            src={
                              item?.image ||
                              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&q=70"
                            }
                            alt=""
                            className="h-9 w-9 rounded-md object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-semibold text-[#332c27]">
                              {item?.name || "Pizza order"}
                            </p>

                            <p className="truncate text-[10px] text-[#9a8f84]">
                              {dateLabel(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>

              <section className="flex flex-col justify-between rounded-lg bg-[#b8452f] p-5 text-white">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                    A little something for everyone
                  </p>

                  <h2 className="mt-4 font-serif text-[22px] font-semibold leading-snug">
                    What sounds good?
                  </h2>

                  <p className="mt-2 text-[11px] leading-5 text-white/80">
                    Explore our menu and find your next favorite pizza.
                  </p>
                </div>

                <Link
                  href="/browse"
                  className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-md bg-[#f7e7db] px-3.5 py-2 text-[11px] font-semibold text-[#8f3826] transition hover:bg-white"
                >
                  Find a pizza
                  <ArrowRight size={13} />
                </Link>
              </section>
            </div>
      </div>
    </DashboardShell>
  );
}