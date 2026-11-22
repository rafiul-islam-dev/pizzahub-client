
"use client";

import Link from "next/link";
import {
  Store,
  Pizza,
  ShoppingBag,
  DollarSign,
  Plus,
  ArrowRight,
  ClipboardList,
  Settings,
} from "lucide-react";

const stats = [
  {
    title: "Total Menu Items",
    value: "—",
    description: "Your listed pizzas",
    icon: Pizza,
  },
  {
    title: "Total Orders",
    value: "—",
    description: "Orders received",
    icon: ShoppingBag,
  },
  {
    title: "Total Revenue",
    value: "—",
    description: "Your sales revenue",
    icon: DollarSign,
  },
];

const quickActions = [
  {
    title: "Manage Menu",
    description: "Add, edit or remove your pizza items.",
    icon: Pizza,
    href: "/dashboard/vendor/menu",
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Manage Orders",
    description: "View and manage customer orders.",
    icon: ClipboardList,
    href: "/dashboard/vendor/orders",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Business Settings",
    description: "Manage your business information.",
    icon: Settings,
    href: "/dashboard/vendor/settings",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function VendorDashboard() {
  return (
    <div className="min-h-screen bg-[#fff8ef]">
      <div className="container-custom space-y-8 py-8 md:py-10">

        {/* Welcome */}
        <section className="overflow-hidden rounded-2xl bg-[#27231f] p-6 text-white md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-orange-300">
                <Store size={20} />
                <span className="text-sm font-medium">
                  Vendor Dashboard
                </span>
              </div>

              <h1 className="text-2xl font-bold md:text-3xl">
                Welcome to your Vendor Dashboard!
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                Manage your pizza menu, track orders and grow your
                business with PizzaHub.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/menu"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#b83227] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#98291f]"
            >
              <Plus size={18} />
              Add Menu Item
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[#27231f]">
            Business Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-[#eaded1] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {stat.title}
                      </p>

                      <h3 className="mt-2 text-3xl font-bold text-[#27231f]">
                        {stat.value}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {stat.description}
                      </p>
                    </div>

                    <div className="rounded-lg bg-orange-50 p-3 text-[#b83227]">
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Statistics will appear once connected to the backend.
          </p>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[#27231f]">
            Quick Actions
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-xl border border-[#eaded1] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl p-3 ${action.color}`}>
                      <Icon size={22} />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#b83227]"
                    />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#27231f]">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Empty Orders */}
        <section className="rounded-xl border border-[#eaded1] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-[#b83227]">
              <ShoppingBag size={22} />
            </div>

            <div>
              <h2 className="font-bold text-[#27231f]">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500">
                Your latest customer orders will appear here.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 py-10 text-center">
            <ShoppingBag
              size={36}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm text-gray-500">
              Order management is coming in the next development step.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}