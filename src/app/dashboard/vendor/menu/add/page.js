import { requireRole } from "@/lib/role-guard";
import VendorAddMenuItem from "@/components/vendor/VendorAddMenuItem";

export default async function VendorAddMenuItemPage() {
  await requireRole(["vendor"]);

  return <VendorAddMenuItem />;
}