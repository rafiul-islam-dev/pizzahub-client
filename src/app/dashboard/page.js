import { requireSession } from "@/lib/auth-guard";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireSession();
  const user = session.user;
  const role = user.role || "customer";

  return (
    <div className="min-h-screen bg-[#fff8ef] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#27231f]">
            Welcome, {user.name} 👋
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome to your PizzaHub dashboard.
          </p>
        </div>

        {/* Customer Dashboard */}
        {role === "customer" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Orders */}
            <div className="rounded-2xl border border-[#eaded1] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#27231f]">
                My Orders
              </h2>

              <p className="mt-2 text-gray-600">
                Track your orders and check your order history.
              </p>

              <Link
                href="/dashboard/orders"
                className="mt-5 inline-block rounded-lg bg-[#b83227] px-5 py-2.5 font-medium text-white transition hover:bg-[#98291f]"
              >
                View My Orders
              </Link>
            </div>

            {/* Become a Vendor */}
            <div className="rounded-2xl border border-[#eaded1] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#27231f]">
                Become a Vendor 🍕
              </h2>

              <p className="mt-2 text-gray-600">
                Start your own pizza business on PizzaHub and sell your
                delicious pizzas to customers.
              </p>

              <Link
                href="/become-vendor"
                className="mt-5 inline-block rounded-lg bg-[#e77a3c] px-5 py-2.5 font-medium text-white transition hover:bg-[#d9682c]"
              >
                Apply as Vendor
              </Link>
            </div>
          </div>
        )}

        {/* Vendor Dashboard */}
        {role === "vendor" && (
          <div className="rounded-2xl border border-[#eaded1] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Vendor Dashboard</h2>

            <p className="mt-2 text-gray-600">
              Manage your menu items and customer orders.
            </p>
          </div>
        )}

        {/* Admin Dashboard */}
        {role === "admin" && (
          <div className="rounded-2xl border border-[#eaded1] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>

            <p className="mt-2 text-gray-600">
              Manage users, vendors, menu items, and platform activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}