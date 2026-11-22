
import { requireRole } from "@/lib/role-guard";
import VendorMenuManagement from "@/components/vendor/VendorMenuManagement";

export default async function VendorMenuPage() {
  await requireRole(["vendor"]);

  return <VendorMenuManagement />;
}
