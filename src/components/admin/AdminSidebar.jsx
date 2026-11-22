"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Pizza,
    ShieldCheck,
    Menu,
    X,
    ArrowLeft,
    ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { Receipt } from "lucide-react";
import { ChartNoAxesCombined } from "lucide-react";

const navItems = [
    {
        label: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Vendor Applications",
        href: "/admin/vendor-applications",
        icon: Users,
    },
    {
        label: "Menu Approval",
        href: "/admin/menu-approval",
        icon: Pizza,
    },
    {
        name: "Manage Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        name: "Manage Orders",
        href: "/admin/orders",
        icon: ClipboardList,
    },
    {
        name: "Transactions",
        href: "/admin/transactions",
        icon: Receipt,
    },
    {
        name: "Sales Analytics",
        href: "/admin/analytics",
        icon: ChartNoAxesCombined,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    function isActive(href) {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname.startsWith(href);
    }

    const sidebarContent = (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <Link
                href="/admin"
                className="flex items-center gap-3 border-b border-white/10 px-6 py-6"
            >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e77a3c]">
                    <ShieldCheck size={24} className="text-white" />
                </div>

                <div>
                    <h2 className="font-bold text-white">PizzaHub</h2>
                    <p className="text-xs text-white/50">Admin Panel</p>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
                <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                    Management
                </p>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active
                                ? "bg-[#b83227] text-white"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <Icon size={20} />

                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/10 p-4">
                <Link
                    href="/"
                    className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                    ← Back to Website
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-[#27231f] text-white lg:hidden"
                aria-label="Toggle admin menu"
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 bg-[#27231f] lg:block">
                {sidebarContent}
            </aside>

            {/* Mobile sidebar */}
            {mobileOpen && (
                <>
                    <div
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    />

                    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-[#27231f] lg:hidden">
                        {sidebarContent}
                    </aside>
                </>
            )}
        </>
    );
}