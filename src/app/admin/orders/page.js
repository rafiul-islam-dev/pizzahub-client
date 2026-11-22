import { requireRole } from "@/lib/role-guard";
import AdminOrders from "@/components/admin/AdminOrders";

export default async function AdminOrdersPage() {
  await requireRole(["admin"]);

  return (
    <main className="container-custom py-8">
      <AdminOrders />
    </main>
  );
}