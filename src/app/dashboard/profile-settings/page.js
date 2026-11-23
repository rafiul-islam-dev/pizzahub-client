import { requireSession } from "@/lib/auth-guard";
import ProfileSettings from "@/components/profile/ProfileSettings";

export default async function ProfileSettingsPage() {
  await requireSession();

  return (
    <div className="container-custom py-8">
      <ProfileSettings />
    </div>
  );
}