import { requireSession } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export async function requireRole(allowedRoles) {
  const session = await requireSession();

  const role = session.user.role || "customer";

  if (!allowedRoles.includes(role)) {
    if (role === "admin") {
      redirect("/admin");
    }

    if (role === "vendor") {
      redirect("/dashboard/vendor");
    }

    redirect("/dashboard/orders");
  }

  return session;
}