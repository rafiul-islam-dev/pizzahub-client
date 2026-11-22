import Link from "next/link";
import {
  Users,
  Pizza,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const adminSections = [
  {
    title: "Vendor Applications",
    description:
      "Review vendor applications and approve or reject new vendors.",
    href: "/admin/vendor-applications",
    icon: Users,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Menu Approval",
    description:
      "Review pizza submissions and manage menu publishing.",
    href: "/admin/menu-approval",
    icon: Pizza,
    color: "bg-orange-100 text-orange-700",
  },
];

export default function AdminOverviewPage() {
  return (
    <main className="container-custom px-5 py-10 sm:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#b83227] text-white">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#27231f]">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-[#766b60]">
              Welcome to PizzaHub management panel.
            </p>
          </div>
        </div>
      </div>

      {/* Management cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border border-[#eaded1] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${section.color}`}
                >
                  <Icon size={28} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-[#766b60] transition group-hover:translate-x-1 group-hover:text-[#b83227]"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#27231f]">
                {section.title}
              </h2>

              <p className="mt-2 leading-7 text-[#766b60]">
                {section.description}
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#b83227]">
                Manage section →
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}