import { requireRole } from "@/lib/role-guard";
import VendorOrders from "@/components/vendor/VendorOrders";

export default async function VendorOrdersPage() {
  await requireRole(["vendor"]);

  return (
    <div className="container-custom py-8">
      <VendorOrders />
    </div>
  );
}