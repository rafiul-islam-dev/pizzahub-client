"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const user = session?.user;
  const name = user?.name || "Customer";
  const initial = name.charAt(0).toUpperCase();

  function isActive(href) {
    return pathname === href;
  }

  async function handleSignOut() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Sign out failed");
      return;
    }

    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col bg-[#fcf8f2]">
      {/* Account */}
      <div className="flex items-center gap-2.5 border-b border-[#ece2d6] px-5 py-[18px]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3d9c2] text-sm font-bold text-[#a85435]">
          {initial}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#332c27]">
            {name}
          </p>

          <p className="truncate text-[10px] text-[#9a8f84]">
            customer account
          </p>
        </div>
      </div>

      {/* Workspace nav */}
      <nav className="flex-1 px-3 py-5">
        <p className="mb-3 px-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b4a89c]">
          Workspace
        </p>

        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition ${
                  active
                    ? "bg-[#f7e7db] font-semibold text-[#b83227]"
                    : "text-[#5c5349] hover:bg-[#f5ede3] hover:text-[#b83227]"
                }`}
              >
                <Icon size={16} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Promo */}
      <div className="px-3">
        <div className="rounded-lg bg-[#f7e7db] px-3.5 py-3.5">
          <Sparkles size={16} className="text-[#b83227]" />

          <p className="mt-2 text-[12px] font-semibold text-[#332c27]">
            Made for the neighborhood.
          </p>

          <p className="mt-1 text-[10px] leading-4 text-[#9a8f84]">
            Thanks for being part of PizzaHub.
          </p>
        </div>
      </div>

      {/* Footer links */}
      <div className="space-y-0.5 px-3 py-4">
        <Link
          href="/dashboard/profile-settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-[12px] text-[#6c6359] transition hover:bg-[#f5ede3] hover:text-[#b83227]"
        >
          <Settings size={15} strokeWidth={1.8} />
          Profile settings
        </Link>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[12px] text-[#6c6359] transition hover:bg-[#f5ede3] hover:text-[#b83227]"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </div>
  );
}