import { requireRole } from "@/lib/role-guard";
import DashboardShell from "@/components/shared/DashboardShell";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }) {
  await requireRole(["admin"]);

  return (
    <DashboardShell
      sidebar={<AdminSidebar />}
      sidebarWidth="w-64"
      sidebarClassName="bg-[#27231f] border-[#27231f]"
      backgroundClassName="bg-[#fff8ef]"
    >
      {children}
    </DashboardShell>
  );
}