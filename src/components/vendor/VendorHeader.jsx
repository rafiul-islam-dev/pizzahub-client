"use client";

import Link from "next/link";

export default function VendorHeader({ title, subtitle }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b83227]">
          Your Pizzeria
        </p>

        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2b2622] sm:text-[34px]">
          {title}
        </h1>

        <p className="mt-1.5 text-sm text-[#8a8076]">
          {subtitle || "Here's what's happening at your shop today."}
        </p>
      </div>

      <Link
        href="/dashboard/profile-settings"
        className="hidden shrink-0 items-center gap-2 rounded-lg border border-[#e3d7c8] bg-white px-3.5 py-2 text-xs font-medium text-[#5c5349] shadow-sm transition hover:border-[#b83227] hover:text-[#b83227] sm:inline-flex"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        Edit profile
      </Link>
    </div>
  );
}