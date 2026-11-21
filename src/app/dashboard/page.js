
import { requireSession } from "@/lib/auth-guard";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireSession();

  const role = session.user.role || "customer";

  const roleLabels = {
    customer: "Customer",
    vendor: "Vendor",
    admin: "Administrator",
  };

  return (
    <main className="min-h-screen bg-[#fff8ef] px-4 py-12">
      <div className="container-custom">
        <div className="rounded-3xl border border-[#eaded1] bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-medium text-[#b83227]">
            PizzaHub Dashboard
          </p>

          <h1 className="text-3xl font-bold text-[#27231f]">
            Welcome, {session.user.name}!
          </h1>

          <div className="mt-4 inline-flex rounded-full bg-[#f2e8dc] px-4 py-2 text-sm font-semibold text-[#b83227]">
            {roleLabels[role] || "Customer"}
          </div>

          <p className="mt-3 text-gray-500">
            You are signed in as a {roleLabels[role] || "Customer"}.
          </p>

          <Link
            href="/browse"
            className="mt-6 inline-flex rounded-xl bg-[#b83227] px-5 py-3 font-semibold text-white transition hover:bg-[#98291f]"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
