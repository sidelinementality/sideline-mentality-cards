"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ScanLine,
  ShoppingBag,
  Globe,
  BarChart3,
  Settings,
  ArrowLeft,
} from "lucide-react";

const navigation = [
  {
    title: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Add Card",
    href: "/dashboard/inventory/new",
    icon: PlusCircle,
  },
  {
    title: "Dealer Intake",
    href: "/dashboard/intake",
    icon: ScanLine,
  },
  {
    title: "Purchases",
    href: "/dashboard/purchases",
    icon: ShoppingBag,
  },
  {
    title: "Website Queue",
    href: "/dashboard/website",
    icon: Globe,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: Package,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-white/10 bg-black">
      <div className="border-b border-white/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-500">
          Sideline Mentality
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Dealer OS
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Inventory Management Platform
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                active
                  ? "bg-green-600 text-white"
                  : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <Icon size={20} />

              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/dashboard/settings"
          className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
        >
          <Settings size={20} />
          Settings
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900"
        >
          <ArrowLeft size={20} />
          Return to Website
        </Link>
      </div>
    </aside>
  );
}