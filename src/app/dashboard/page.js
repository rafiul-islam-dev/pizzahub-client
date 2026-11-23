import { requireSession } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import CustomerDashboardOverview from "@/components/dashboard/CustomerDashboardOverview";

export default async function DashboardPage() {
  const session = await requireSession();

  const role = session.user.role || "customer";

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "vendor") {
    redirect("/dashboard/vendor");
  }

  // Customer overview
  return (
    <div className="container-custom py-8">
      <CustomerDashboardOverview />
    </div>
  );
}