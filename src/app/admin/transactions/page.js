import { requireRole } from "@/lib/role-guard";
import AdminTransactions from "@/components/admin/AdminTransactions";

export default async function AdminTransactionsPage() {
  await requireRole(["admin"]);

  return (
    <main className="container-custom py-8">
      <AdminTransactions />
    </main>
  );
}