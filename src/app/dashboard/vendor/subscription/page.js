import { requireRole } from "@/lib/role-guard";
import VendorSubscription from "@/components/vendor/VendorSubscription";

export default async function VendorSubscriptionPage() {
  await requireRole(["vendor"]);

  return <VendorSubscription />;
}