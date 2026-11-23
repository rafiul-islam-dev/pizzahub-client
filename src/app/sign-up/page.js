"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Pizza,
  Store,
  ShoppingBag,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error(
        "Password must include at least one uppercase and one lowercase letter"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        // Sent here purely as a hint for the form; the server ignores any
        // attempt to set role/subscription through the API.
        role,
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");

      if (role === "vendor") {
        // Send the new vendor straight to the application form so an
        // application is actually created for the admin to review.
        router.push("/become-vendor");
        router.refresh();
        return;
      }

      router.push("/sign-in?registered=true");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#fff8ef] px-4 py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Left side */}
        <div className="hidden flex-col justify-between bg-[#b83227] p-10 text-white md:flex">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <Pizza size={30} />
            PizzaHub
          </Link>

          <div>
            <div className="mb-6 text-8xl">🍕</div>

            <h1 className="mb-4 text-4xl font-bold leading-tight">
              Delicious pizza,
              <br />
              made for you.
            </h1>

            <p className="max-w-sm text-white/80">
              Discover your favorite flavors and enjoy a delicious
              pizza experience with PizzaHub.
            </p>
          </div>

          <p className="text-sm text-white/60">
            © 2026 PizzaHub. All rights reserved.
          </p>
        </div>

        {/* Right side */}
        <div className="px-6 py-10 sm:px-10 md:px-12">

          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-[#b83227] md:hidden"
          >
            <Pizza size={26} />
            PizzaHub
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#27231f]">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Join PizzaHub and discover delicious pizzas.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />
            </div>

            {/* Role */}
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Account Type
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  aria-pressed={role === "customer"}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-4 py-3.5 text-sm font-semibold transition ${
                    role === "customer"
                      ? "border-[#b83227] bg-[#b83227]/5 text-[#b83227]"
                      : "border-[#eaded1] text-[#51483f] hover:border-[#b83227]"
                  }`}
                >
                  <ShoppingBag size={22} />
                  Customer
                  <span className="text-xs font-normal text-gray-500">
                    Order pizza
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  aria-pressed={role === "vendor"}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-4 py-3.5 text-sm font-semibold transition ${
                    role === "vendor"
                      ? "border-[#b83227] bg-[#b83227]/5 text-[#b83227]"
                      : "border-[#eaded1] text-[#51483f] hover:border-[#b83227]"
                  }`}
                >
                  <Store size={22} />
                  Vendor
                  <span className="text-xs font-normal text-gray-500">
                    Restaurant owner
                  </span>
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Vendor accounts must be approved by an admin before they can
                publish menu items.
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 chars, upper & lower case"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#eaded1] px-4 py-3 pr-12 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#eaded1] px-4 py-3 pr-12 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b83227] py-3.5 font-semibold text-white transition hover:bg-[#98291f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#b83227] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}