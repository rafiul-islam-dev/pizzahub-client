"use client";

import { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";

export default function DashboardShell({
  sidebar,
  children,
  sidebarClassName = "",
  backgroundClassName = "bg-[#fdfaf5]",
  sidebarWidth = "w-[220px]",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={backgroundClassName}>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-3 top-24 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[#e3d7c8] bg-white text-[#332c27] shadow-sm lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      <div className="flex">
        {/* Sticky desktop sidebar – stays in flow, never overlaps footer */}
        <aside
          className={`sticky top-20 hidden h-[calc(100vh-80px)] ${sidebarWidth} shrink-0 self-start border-r border-[#ece2d6] lg:block ${sidebarClassName}`}
        >
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            />
            <aside className="fixed bottom-0 left-0 top-20 z-40 w-[220px] border-r border-[#ece2d6] shadow-lg lg:hidden">
              {sidebar}
            </aside>
          </>
        )}

        <div className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1100px]">{children}</div>
        </div>
      </div>
    </div>
  );
}