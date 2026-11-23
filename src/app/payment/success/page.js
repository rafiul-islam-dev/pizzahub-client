import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fff8ef] px-4 py-12">
      <div className="max-w-md rounded-3xl border border-[#eaded1] bg-white p-8 text-center shadow-sm">
        <CheckCircle2 size={64} className="mx-auto text-green-600" />

        <h1 className="mt-5 text-3xl font-bold text-[#27231f]">
          Payment Successful
        </h1>

        <p className="mt-3 text-gray-500">
          Your premium subscription is being activated. It may take a
          moment to reflect in your account.
        </p>

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