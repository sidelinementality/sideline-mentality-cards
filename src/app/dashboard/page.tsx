import Link from "next/link";

const dashboardStats = [
  {
    label: "Total Inventory",
    value: "—",
    description: "Cards currently in your catalog",
  },
  {
    label: "Featured Cards",
    value: "—",
    description: "Cards displayed on the homepage",
  },
  {
    label: "Orders",
    value: "—",
    description: "Customer orders will appear here",
  },
  {
    label: "Inventory Value",
    value: "—",
    description: "Total listed value of your cards",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer Center
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Dashboard Overview
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Manage your card inventory, upload card images, and prepare listings
          for the Sideline Mentality Cards marketplace.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm font-semibold text-zinc-400">{stat.label}</p>

            <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {stat.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
            Quick Action
          </p>

          <h2 className="mt-3 text-2xl font-black">Add a New Card</h2>

          <p className="mt-3 text-zinc-400">
            Upload a real card image and add the card information to your
            inventory.
          </p>

          <Link
            href="/dashboard/inventory/add"
            className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-600"
          >
            Add Card
          </Link>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
            Inventory
          </p>

          <h2 className="mt-3 text-2xl font-black">View Your Cards</h2>

          <p className="mt-3 text-zinc-400">
            Your searchable inventory table will be added during the next
            dashboard milestone.
          </p>

          <Link
            href="/dashboard/inventory"
            className="mt-6 inline-flex rounded-lg border border-white/15 px-5 py-3 font-bold text-white transition hover:border-green-500 hover:bg-green-500/10"
          >
            View Inventory
          </Link>
        </article>
      </section>
    </div>
  );
}