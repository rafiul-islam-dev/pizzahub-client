import { requireSession } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await requireSession();

  const role = session.user.role || "customer";

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "vendor") {
    redirect("/dashboard/vendor");
  }

  // Customer-এর বর্তমানে থাকা route
  redirect("/dashboard/orders");
}