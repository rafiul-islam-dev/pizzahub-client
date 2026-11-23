"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Crown, CheckCircle2, XCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getSubscription } from "@/services/vendor.service";

// Add getSubscription to vendor.service via inline fetch instead.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthToken() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  return data.token;
}

async function subscriptionRequest() {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/payments/subscription`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch subscription");
  }

  return result;
}

async function createCheckoutSession() {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/payments/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create checkout session");
  }

  return result;
}

export default function VendorSubscription() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await subscriptionRequest();

        if (!cancelled) {
          setData(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load subscription");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const isPremium = data?.isPremium === true;

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

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-[#b83227]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#27231f] sm:text-3xl">
          Subscription
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Upgrade to Premium for unlimited menu items and featured
          placement.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div
        className={`rounded-2xl border p-6 ${
          isPremium
            ? "border-green-200 bg-green-50"
            : "border-[#eaded1] bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <Crown
            size={28}
            className={
              isPremium ? "text-green-600" : "text-[#b83227]"
            }
          />

          <div>
            <h2 className="text-xl font-bold text-[#27231f]">
              {isPremium ? "Premium Plan" : "Free Plan"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isPremium
                ? `Active until ${
                    data?.subscriptionExpiresAt
                      ? new Date(
                          data.subscriptionExpiresAt
                        ).toLocaleDateString()
                      : "—"
                  }`
                : "Up to 3 active menu items"}
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            {isPremium
              ? "Unlimited active menu items"
              : "Up to 3 active menu items"}
          </li>

          <li className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            Premium vendor badge
          </li>

          <li className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            Featured placement on the home page
          </li>

          <li className="flex items-center gap-2">
            {isPremium ? (
              <CheckCircle2 size={16} className="text-green-600" />
            ) : (
              <XCircle size={16} className="text-gray-400" />
            )}
            All free features
          </li>
        </ul>

        {!isPremium && (
          <button
            onClick={handleUpgrade}
            disabled={processing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b83227] py-3.5 font-semibold text-white transition hover:bg-[#98291f] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {processing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Crown size={20} />
                Upgrade to Premium
              </>
            )}
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-[#eaded1] bg-white p-5 text-sm text-gray-600">
        <p>
          Payments are processed securely by Stripe. Premium access is
          activated only after a verified payment confirmation.
        </p>
      </div>
    </div>
  );
}