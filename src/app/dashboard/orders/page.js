import { requireRole } from "@/lib/role-guard";
import MyOrders from "@/components/dashboard/MyOrders";

export default async function MyOrdersPage() {
  await requireRole(["customer"]);

  return (
    <div className="container-custom py-8">
      <MyOrders />
    </div>
  );
}