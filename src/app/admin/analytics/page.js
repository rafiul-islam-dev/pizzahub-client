import { requireRole } from "@/lib/role-guard";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

export default async function AdminAnalyticsPage() {
  await requireRole(["admin"]);

  return (
    <main className="container-custom py-8">
      <AdminAnalytics />
    </main>
  );
}