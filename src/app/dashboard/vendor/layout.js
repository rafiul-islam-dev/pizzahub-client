import { requireRole } from "@/lib/role-guard";
import DashboardShell from "@/components/shared/DashboardShell";
import VendorSidebar from "@/components/vendor/VendorSidebar";

export default async function VendorLayout({ children }) {
  await requireRole(["vendor"]);

  return (
    <DashboardShell sidebar={<VendorSidebar />}>{children}</DashboardShell>
  );
}