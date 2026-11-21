
import { requireSession } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export async function requireRole(allowedRoles) {
  const session = await requireSession();

  const role = session.user.role || "customer";

  if (!allowedRoles.includes(role)) {
    redirect("/dashboard");
  }

  return session;
}
