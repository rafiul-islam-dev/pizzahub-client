"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fff8ef] px-4 py-12">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#27231f]">
          Something went wrong
        </h1>

        <p className="mt-2 text-gray-500">
          An unexpected error occurred. Please try again.
        </p>

        <button
          onClick={reset}
          className="primary-button mt-6 inline-flex"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    </main>
  );
}