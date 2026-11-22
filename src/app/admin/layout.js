import { requireRole } from "@/lib/role-guard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }) {
  await requireRole(["admin"]);

  return (
    <div className="min-h-screen bg-[#fff8ef]">
      <AdminSidebar />

      <div className="min-h-screen lg:pl-64">
        {children}
      </div>
    </div>
  );
}