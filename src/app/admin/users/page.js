import { requireRole } from "@/lib/role-guard";
import AdminUsers from "@/components/admin/AdminUsers";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);

  return (
    <main className="container-custom py-8">
      <AdminUsers />
    </main>
  );
}