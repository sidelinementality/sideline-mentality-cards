import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DealerLogoutButton from "@/components/dashboard/DealerLogoutButton";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "View Inventory",
    href: "/dashboard/inventory",
  },
  {
    label: "Add Card",
    href: "/dashboard/inventory/add",
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
  },
];

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dealerEmail = process.env.DEALER_EMAIL?.trim().toLowerCase();
  const signedInEmail = user?.email?.trim().toLowerCase();

  if (!user) {
    redirect("/dealer/login");
  }

  if (!dealerEmail || signedInEmail !== dealerEmail) {
    await supabase.auth.signOut();
    redirect("/dealer/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-6 py-8">
            <div className="border-b border-white/10 pb-7">
              <Link href="/" className="block">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-500">
                  Sideline Mentality
                </p>

                <p className="mt-2 text-2xl font-black">Dealer Dashboard</p>
              </Link>
            </div>

            <nav className="mt-8 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-green-700 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/10 pt-6">
              <Link
                href="/"
                className="block rounded-lg border border-white/10 px-4 py-3 text-center text-sm font-semibold text-zinc-300 transition hover:border-green-500 hover:text-white"
              >
                Return to Website
              </Link>

              <DealerLogoutButton />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-white/10 bg-black/70 px-5 py-4 backdrop-blur lg:px-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-500">
                  Inventory Management
                </p>

                <p className="mt-1 font-semibold text-white">
                  Sideline Mentality Cards
                </p>
              </div>

              <Link
                href="/dashboard/inventory/add"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-600"
              >
                Add New Card
              </Link>
            </div>
          </header>

          <main className="px-5 py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}