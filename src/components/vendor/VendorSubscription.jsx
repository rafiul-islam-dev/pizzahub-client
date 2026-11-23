"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthToken() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  return data.token;
}

async function getSubscription() {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/payments/subscription`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load subscription");
  }

  return result.data;
}

async function createCheckoutSession() {
  const response = await fetch("/api/checkout_sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create checkout session");
  }

  return result;
}

const freeFeatures = [
  "Up to 3 active menu items",
  "Vendor dashboard",
  "Order management",
];

const premiumFeatures = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement",
  "Everything in Free",
];

export default function VendorSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getSubscription();

        if (!cancelled) {
          setIsPremium(Boolean(data?.isPremium));
        }
      } catch (error) {
        console.error("Subscription error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpgrade() {
    try {
      setProcessing(true);

      const result = await createCheckoutSession();

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      toast.error("Stripe did not return a checkout URL");
    } catch (error) {
      toast.error(error.message || "Failed to start checkout");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b83227]">
        Your Pizzeria
      </div>

      <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#332c27] sm:text-[34px]">
        Subscription
      </h1>

      <p className="mt-1.5 text-sm text-[#8a8076]">
        Here&apos;s what&apos;s happening at your shop today.
      </p>

      {/* Center heading */}
      <div className="mx-auto mt-10 max-w-xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b83227]">
          Plans that rise with you
        </p>

        <h2 className="mt-2 font-serif text-3xl font-semibold text-[#332c27] sm:text-[38px]">
          Make room for{" "}
          <em className="font-normal not-italic text-[#b83227]">
            more.
          </em>
        </h2>

        <p className="mt-2 text-[11px] text-[#9a8f84]">
          Choose a plan that fits your shop. Demo checkout — no
          payment is collected.
        </p>
      </div>

      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="animate-spin text-[#b83227]" />
        </div>
      ) : (
        <div className="mx-auto mt-8 grid max-w-3xl gap-5 md:grid-cols-2">
          {/* Free plan */}
          <div className="flex flex-col rounded-lg border border-[#ece2d6] bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b83227]">
              The Starter
            </p>

            <h3 className="mt-2 font-serif text-2xl font-semibold text-[#332c27]">
              Free
            </h3>

            <p className="mt-1 text-xs text-[#9a8f84]">
              <span className="font-serif text-base text-[#332c27]">
                $0
              </span>{" "}
              /month
            </p>

            <p className="mt-2 text-[11px] text-[#9a8f84]">
              For the neighborhood shop getting started
            </p>

            <div className="mt-5 flex-1 space-y-2.5">
              {freeFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-[11px] text-[#5c5349]"
                >
                  <Check size={13} className="text-[#6f9b72]" />
                  {feature}
                </div>
              ))}
            </div>

            <button
              disabled
              className="mt-5 w-full rounded-md border border-[#e3d7c8] bg-white py-2.5 text-[11px] font-medium text-[#9a8f84]"
            >
              Current plan
            </button>
          </div>

          {/* Premium plan */}
          <div className="relative flex flex-col rounded-lg bg-[#b8452f] p-5 text-white">
            <span className="absolute right-4 top-4 rounded-full bg-[#f3d9c2] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#8f3826]">
              Most popular
            </span>

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
              The Full Oven
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Sparkles size={17} className="text-white/90" />

              <h3 className="font-serif text-2xl font-semibold">
                Premium
              </h3>
            </div>

            <p className="mt-1 text-xs text-white/80">
              <span className="font-serif text-base text-white">
                $19
              </span>{" "}
              /month
            </p>

            <p className="mt-2 text-[11px] text-white/80">
              For the shop ready to serve a bigger room
            </p>

            <div className="mt-5 flex-1 space-y-2.5">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-[11px] text-white/95"
                >
                  <Check size={13} />
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={processing || isPremium}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-md bg-[#f7e7db] py-2.5 text-[11px] font-semibold text-[#8f3826] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {processing ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Opening checkout...
                </>
              ) : isPremium ? (
                "You're on Premium"
              ) : (
                <>
                  Upgrade to Premium
                  <ArrowRight size={13} />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[9px] text-white/60">
              Demo only — no real payment is processed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}