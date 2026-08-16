import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DealerLogoutButton from "@/components/dashboard/DealerLogoutButton";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

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
    redirect("/login");
  }

  if (!dealerEmail || signedInEmail !== dealerEmail) {
    await supabase.auth.signOut();
    redirect("/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        {/* Desktop Dealer OS Sidebar */}
        <div className="hidden shrink-0 lg:block">
          <div className="sticky top-0">
            <DashboardSidebar />
          </div>
        </div>

        {/* Main Dealer OS Area */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 px-5 py-4 backdrop-blur lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-500">
                  Dealer OS
                </p>

                <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                  Sideline Mentality Cards
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/inventory/new"
                  className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-500"
                >
                  + Add Card
                </Link>

                <div className="hidden sm:block">
                  <DealerLogoutButton />
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Dealer Navigation */}
          <div className="border-b border-white/10 bg-black px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Link
                href="/dashboard"
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
              >
                Home
              </Link>

              <Link
                href="/dashboard/inventory"
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
              >
                Inventory
              </Link>

              <Link
                href="/dashboard/inventory/new"
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
              >
                Add Card
              </Link>

              <Link
                href="/dashboard/intake"
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
              >
                Intake
              </Link>

              <Link
                href="/dashboard/purchases"
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
              >
                Purchases
              </Link>

              <Link
                href="/dashboard/orders"
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
              >
                Orders
              </Link>

              <Link
                href="/dashboard/analytics"
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
              >
                Analytics
              </Link>
            </div>
          </div>

          <main className="px-5 py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}