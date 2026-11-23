"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import ThemeToggle from "@/components/shared/ThemeToggle";
import {
  Pizza,
  Menu,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const user = session?.user;

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const stored = JSON.parse(
          localStorage.getItem("pizzahub-cart") || "[]"
        );

        const count = Array.isArray(stored)
          ? stored.reduce(
              (total, item) =>
                total + (Number(item.quantity) || 0),
              0
            )
          : 0;

        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    queueMicrotask(updateCartCount);

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Menu", href: "/browse" },
  ];

  const isActive = (href) => pathname === href;

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Sign out failed");
        return;
      }

      toast.success("Signed out successfully!");

      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSignOutLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#eaded1] bg-[#fff8ef]/95 backdrop-blur-md dark:border-white/10 dark:bg-[#1c1815]/95">
      <nav className="container-custom flex h-20 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b83227] text-white">
            <Pizza size={24} />
          </div>

          <span className="text-xl font-bold text-[#27231f]">
            Pizza<span className="text-[#b83227]">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-[#b83227]"
                  : "text-[#51483f] hover:text-[#b83227]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#51483f] transition hover:bg-[#f2e8dc]"
          >
            <ShoppingBag size={18} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b83227] px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[#eaded1]" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#51483f] transition hover:bg-[#f2e8dc]"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl bg-[#f2e8dc] px-3 py-2"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <UserRound size={18} className="text-[#b83227]" />
                  )}

                  <span className="max-w-32 truncate text-sm font-medium text-[#27231f]">
                    {user.name || "User"}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#eaded1] bg-white py-2 shadow-lg">
                    <div className="border-b border-[#eaded1] px-4 py-2 text-xs text-gray-500">
                      {user.email}
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#51483f] hover:bg-[#fff8ef]"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile-settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#51483f] hover:bg-[#fff8ef]"
                    >
                      <UserRound size={16} />
                      Profile Settings
                    </Link>

                    <button
                      onClick={handleSignOut}
                      disabled={signOutLoading}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#b83227] hover:bg-[#fff8ef] disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {signOutLoading ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl px-4 py-2 text-sm font-medium text-[#51483f] transition hover:text-[#b83227]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-xl bg-[#b83227] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#98291f]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-[#27231f] md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#eaded1] bg-[#fff8ef] px-4 py-5 md:hidden dark:border-white/10 dark:bg-[#1c1815]">
          <div className="container-custom flex flex-col gap-4">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-medium ${
                  isActive(link.href)
                    ? "text-[#b83227]"
                    : "text-[#51483f]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between font-medium text-[#51483f]"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={18} />
                Cart
              </span>

              {cartCount > 0 && (
                <span className="rounded-full bg-[#b83227] px-2 py-0.5 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="border-t border-[#eaded1] pt-4">

              {isPending ? (
                <div className="h-8 animate-pulse rounded bg-[#eaded1]" />
              ) : user ? (
                <div className="flex flex-col gap-3">

                  <div className="flex items-center gap-2 text-sm font-medium text-[#27231f]">
                    <UserRound size={18} className="text-[#b83227]" />
                    {user.name || "User"}
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-[#51483f]"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile-settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-[#51483f]"
                  >
                    <UserRound size={18} />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleSignOut}
                    disabled={signOutLoading}
                    className="flex items-center gap-2 text-left text-sm font-medium text-[#b83227] disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {signOutLoading ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl border border-[#eaded1] py-2.5 text-center font-medium text-[#51483f]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-[#b83227] py-2.5 text-center font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}