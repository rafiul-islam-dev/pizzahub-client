import { requireRole } from "@/lib/role-guard";
import AdminMenuApproval from "@/components/admin/AdminMenuApproval";

export default async function AdminMenuApprovalPage() {
  await requireRole(["admin"]);

  return (
    <main className="container-custom py-8">
      <AdminMenuApproval />
    </main>
  );
}