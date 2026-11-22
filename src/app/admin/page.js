import { requireRole } from "@/lib/role-guard";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);

  return (
    <main className="container-custom py-8">
      <AdminDashboard />
    </main>
  );
}