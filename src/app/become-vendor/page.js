import { requireSession } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import BecomeVendorForm from "@/components/vendor/BecomeVendorForm";

export default async function BecomeVendorPage() {
  const session = await requireSession();

  if (session.user.role !== "customer") {
    redirect("/dashboard");
  }

  return <BecomeVendorForm />;
}