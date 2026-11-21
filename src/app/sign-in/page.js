
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Pizza } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error("Please enter your email and password");
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await authClient.signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password");
                return;
            }

            toast.success("Welcome back!");

            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-80px)] bg-[#fff8ef] px-4 py-12 sm:py-16">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

                {/* Left Side */}
                <div className="hidden flex-col justify-between bg-[#b83227] p-10 text-white md:flex">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-2xl font-bold"
                    >
                        <Pizza size={30} />
                        PizzaHub
                    </Link>

                    <div>
                        <div className="mb-6 text-8xl">🍕</div>

                        <h1 className="mb-4 text-4xl font-bold leading-tight">
                            Welcome back
                            <br />
                            to PizzaHub!
                        </h1>

                        <p className="max-w-sm text-white/80">
                            Your favorite pizzas are just a few clicks away.
                            Sign in and enjoy your delicious journey.
                        </p>
                    </div>

                    <p className="text-sm text-white/60">
                        © 2026 PizzaHub. All rights reserved.
                    </p>
                </div>

                {/* Right Side */}
                <div className="px-6 py-10 sm:px-10 md:px-12">

                    {/* Mobile Logo */}
                    <Link
                        href="/"
                        className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-[#b83227] md:hidden"
                    >
                        <Pizza size={26} />
                        PizzaHub
                    </Link>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[#27231f]">
                            Sign In
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Enter your credentials to access your account.
                        </p>
                    </div>

                    {/* Registered success message */}
                    {searchParams.get("registered") === "true" && (
                        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            Account created successfully! Please sign in.
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-5">

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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-[#eaded1] px-4 py-3 pr-12 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    {showPassword ? (
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
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Google button */}

                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await authClient.signIn.social({
                                    provider: "google",
                                    callbackURL: "/",
                                });
                            } catch (error) {
                                toast.error("Google sign in failed. Please try again.");
                            }
                        }}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        <span className="font-bold text-lg">G</span>
                        Continue with Google
                    </button>


                    {/* Sign Up */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-semibold text-[#b83227] hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
