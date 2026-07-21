import Link from "next/link";

const collections = [
  {
    name: "Football",
    emoji: "🏈",
    description: "NFL, college stars, rookies, and legends",
    href: "/shop?sport=Football",
  },
  {
    name: "Basketball",
    emoji: "🏀",
    description: "NBA, WNBA, prospects, and superstars",
    href: "/shop?sport=Basketball",
  },
  {
    name: "Baseball",
    emoji: "⚾",
    description: "MLB stars, prospects, and Hall of Famers",
    href: "/shop?sport=Baseball",
  },
  {
    name: "UFC",
    emoji: "🥊",
    description: "Champions, contenders, rookies, and autos",
    href: "/shop?sport=UFC",
  },
  {
    name: "WWE",
    emoji: "🤼",
    description: "Legends, current stars, and rising talent",
    href: "/shop?sport=WWE",
  },
  {
    name: "Soccer",
    emoji: "⚽",
    description: "Premier League, MLS, and international stars",
    href: "/shop?sport=Soccer",
  },
  {
    name: "Hockey",
    emoji: "🏒",
    description: "NHL stars, Young Guns, and legends",
    href: "/shop?sport=Hockey",
  },
  {
    name: "Pokémon",
    emoji: "⚡",
    description: "Vintage, modern, rare, and graded cards",
    href: "/shop?sport=Pokémon",
  },
];

const featuredCollections = [
  {
    name: "Rookie Cards",
    label: "Build for the Future",
    description:
      "Shop rookie cards from rising stars and established superstars.",
    href: "/shop?rookie=true",
  },
  {
    name: "Autographs",
    label: "Signed Collectibles",
    description:
      "Browse authenticated and collectible autograph cards.",
    href: "/shop?auto=true",
  },
  {
    name: "Graded Cards",
    label: "Collector Favorites",
    description:
      "Explore professionally graded cards from leading grading companies.",
    href: "/shop?grade=PSA",
  },
  {
    name: "New Arrivals",
    label: "Fresh Inventory",
    description:
      "See the newest cards added to the Sideline Mentality marketplace.",
    href: "/shop?sort=newest",
  },
];

export default function ShopBySport() {
  return (
    <section className="bg-neutral-100 px-6 py-24 text-neutral-950">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
            Explore the Marketplace
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Shop by Collection
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-600">
            Find your next card by sport, collectible type, or the
            newest inventory added to Sideline Mentality Cards.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCollections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.href}
              className="group relative overflow-hidden rounded-3xl bg-neutral-950 p-7 text-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-transparent opacity-60 transition group-hover:opacity-100" />

              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
                  {collection.label}
                </p>

                <h3 className="mt-4 text-2xl font-black">
                  {collection.name}
                </h3>

                <p className="mt-3 min-h-16 text-sm leading-6 text-neutral-400">
                  {collection.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-black text-green-400">
                    Shop Collection
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-xl text-green-400 transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-green-700">
                Choose Your Sport
              </p>

              <h3 className="mt-2 text-3xl font-black">
                Browse every category
              </h3>
            </div>

            <Link
              href="/shop"
              className="inline-flex w-fit items-center text-sm font-black text-green-700 transition hover:text-green-600"
            >
              View All Cards →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => (
              <Link
                key={collection.name}
                href={collection.href}
                className="group flex min-h-64 flex-col rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-green-700/30 hover:bg-green-700 hover:text-white hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-4xl transition group-hover:bg-white/15">
                    {collection.emoji}
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-2xl text-neutral-300 transition group-hover:translate-x-1 group-hover:text-white"
                  >
                    →
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  {collection.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-600 transition group-hover:text-green-50">
                  {collection.description}
                </p>

                <p className="mt-auto pt-6 text-xs font-black uppercase tracking-[0.2em] text-green-700 transition group-hover:text-white">
                  Shop {collection.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}