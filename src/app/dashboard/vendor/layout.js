import { requireRole } from "@/lib/role-guard";
import VendorSidebar from "@/components/vendor/VendorSidebar";

export default async function VendorLayout({ children }) {
  await requireRole(["vendor"]);

  return (
    <div className="min-h-screen bg-[#fff8ef]">
      <VendorSidebar />

      <div className="min-h-screen pt-16 lg:pl-64 lg:pt-0">
        <div className="container-custom py-8">{children}</div>
      </div>
    </div>
  );
}