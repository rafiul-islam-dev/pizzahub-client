
import { requireRole } from "@/lib/role-guard";
import VendorDashboard from "@/components/vendor/VendorDashboard";

export default async function VendorDashboardPage() {
  await requireRole(["vendor"]);

  return <VendorDashboard />;
}