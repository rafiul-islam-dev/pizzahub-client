"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10;

    if (!sessionId) {
      queueMicrotask(() => {
        setStatus("success");
        setMessage(
          "Your payment was processed. Your premium status will update shortly."
        );
      });
      return;
    }

    async function checkStatus() {
      try {
        await authClient.getSession();

        const response = await fetch("/api/checkout_sessions/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const result = await response.json();

        if (cancelled) return;

        if (result?.premium === true) {
          setStatus("success");
          setMessage(
            "Your premium subscription is now active! You can publish unlimited menu items."
          );
          return;
        }

        attempts += 1;

        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000);
        } else {
          setStatus("pending");
          setMessage(
            "Your payment was received. Premium activation may take a moment — refresh this page shortly."
          );
        }
      } catch (error) {
        if (cancelled) return;

        attempts += 1;

        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000);
        } else {
          setStatus("pending");
          setMessage(
            "Your payment was received. Premium activation may take a moment."
          );
        }
      }
    }

    queueMicrotask(() => checkStatus());

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fff8ef] px-4 py-12">
      <div className="max-w-md rounded-3xl border border-[#eaded1] bg-white p-8 text-center shadow-sm">
        {status === "checking" && (
          <>
            <Loader2
              size={64}
              className="mx-auto animate-spin text-[#b83227]"
            />

            <h1 className="mt-5 text-2xl font-bold text-[#27231f]">
              Verifying Payment...
            </h1>

            <p className="mt-3 text-gray-500">
              Please wait while we confirm your subscription.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={64} className="mx-auto text-green-600" />

            <h1 className="mt-5 text-2xl font-bold text-[#27231f]">
              Payment Successful
            </h1>

            <p className="mt-3 text-gray-500">{message}</p>
          </>
        )}

        {status === "pending" && (
          <>
            <AlertCircle size={64} className="mx-auto text-amber-500" />

            <h1 className="mt-5 text-2xl font-bold text-[#27231f]">
              Payment Received
            </h1>

            <p className="mt-3 text-gray-500">{message}</p>
          </>
        )}

        <Link
          href="/dashboard/vendor/subscription"
          className="primary-button mt-7 inline-flex"
        >
          Back to Subscription
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-[#fff8ef]">
          <Loader2 size={32} className="animate-spin text-[#b83227]" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}