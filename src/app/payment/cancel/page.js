import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fff8ef] px-4 py-12">
      <div className="max-w-md rounded-3xl border border-[#eaded1] bg-white p-8 text-center shadow-sm">
        <XCircle size={64} className="mx-auto text-red-600" />

        <h1 className="mt-5 text-3xl font-bold text-[#27231f]">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-gray-500">
          Your payment was cancelled. You can try again whenever you are
          ready.
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