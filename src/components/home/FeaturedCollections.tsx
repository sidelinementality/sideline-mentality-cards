import Link from "next/link";

const collections = [
  {
    title: "Just Landed",
    description: "Fresh inventory",
    href: "/shop?sort=newest",
    badge: "New",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-9 w-9"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4 8 8-4 8 4-8 4-8-4Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4 8 8 4 8-4M4 8v8l8 4 8-4V8"
        />
      </svg>
    ),
    background:
      "radial-gradient(circle at top, rgba(34,197,94,0.28), transparent 55%), linear-gradient(145deg, #07130b, #020403)",
  },
  {
    title: "Rookie Watch",
    description: "Tomorrow's stars",
    href: "/shop?rookie=true",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-9 w-9"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m12 3 7 5-7 13L5 8l7-5Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m5 8 7 4 7-4M12 12v9"
        />
      </svg>
    ),
    background:
      "radial-gradient(circle at top, rgba(56,189,248,0.23), transparent 55%), linear-gradient(145deg, #07121a, #020405)",
  },
  {
    title: "Football Favorites",
    description: "Gridiron greatness",
    href: "/shop?sport=Football",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-9 w-9"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 4.5c-3.8-2.1-9.9.2-13.8 4.1S-.5 18.6 1.5 22.5c3.8 2.1 9.9-.2 13.8-4.1s6.2-10 4.2-13.9Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8 15 7-7M9.5 9.5l5 5"
        />
      </svg>
    ),
    background:
      "radial-gradient(circle at top, rgba(239,68,68,0.22), transparent 55%), linear-gradient(145deg, #180909, #040202)",
  },
  {
    title: "NBA Stars",
    description: "Hoops elite",
    href: "/shop?sport=Basketball",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-9 w-9"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.5 9.5c4.5.1 8.4 4 8.5 8.5M20.5 14.5c-4.5-.1-8.4-4-8.5-8.5M12 3v18M3 12h18"
        />
      </svg>
    ),
    background:
      "radial-gradient(circle at top, rgba(168,85,247,0.23), transparent 55%), linear-gradient(145deg, #13081a, #030204)",
  },
  {
    title: "Baseball Prospects",
    description: "Future legends",
    href: "/shop?sport=Baseball",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-9 w-9"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 5.5c2.2 1.6 3.2 3.8 3 6.5-.2 2.7-1.5 4.9-3.8 6.4M17 5.5c-2.2 1.6-3.2 3.8-3 6.5.2 2.7 1.5 4.9 3.8 6.4"
        />
      </svg>
    ),
    background:
      "radial-gradient(circle at top, rgba(14,165,233,0.22), transparent 55%), linear-gradient(145deg, #07141b, #020405)",
  },
  {
    title: "UFC",
    description: "Fight night heroes",
    href: "/shop?sport=UFC",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-9 w-9"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 11V6.5a1.5 1.5 0 0 1 3 0V10M11 10V5.5a1.5 1.5 0 0 1 3 0V10M14 10V7a1.5 1.5 0 0 1 3 0v5M8 10.5V9a1.5 1.5 0 0 0-3 0v4.5C5 18 8 21 12.5 21S20 18 20 13.5V10a1.5 1.5 0 0 0-3 0"
        />
      </svg>
    ),
    background:
      "radial-gradient(circle at top, rgba(239,68,68,0.24), transparent 55%), linear-gradient(145deg, #190707, #040202)",
  },
  {
    title: "WWE",
    description: "Superstar cards",
    href: "/shop?sport=WWE",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-9 w-9"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4 5 3 14 5-10 5 10 3-14M6 15h12"
        />
      </svg>
    ),
    background:
      "radial-gradient(circle at top, rgba(234,179,8,0.24), transparent 55%), linear-gradient(145deg, #191307, #040302)",
  },
  {
    title: "Under $50",
    description: "Great cards. Great prices.",
    href: "/shop?maxPrice=50",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-9 w-9"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.5 8.5c-.8-.8-1.9-1.2-3.2-1.2-1.8 0-3.3.9-3.3 2.4 0 3.8 7 1.5 7 5.2 0 1.6-1.5 2.7-3.7 2.7-1.5 0-2.9-.5-3.8-1.4M12 5v14"
        />
      </svg>
    ),
    background:
      "radial-gradient(circle at top, rgba(34,197,94,0.26), transparent 55%), linear-gradient(145deg, #07160c, #020403)",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black px-5 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-green-500/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-green-500 sm:w-20" />

            <p className="text-xs font-black uppercase tracking-[0.3em] text-green-400">
              Find Your Next Card
            </p>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-green-500 sm:w-20" />
          </div>

          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
            Explore Premium Collections
          </h2>

          <p className="mt-4 text-base leading-7 text-neutral-400 sm:text-lg">
            Hand-picked collections for every type of collector.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className="group relative min-h-64 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-6 transition duration-300 hover:-translate-y-1.5 hover:border-green-500/60 hover:shadow-2xl hover:shadow-green-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              style={{ backgroundImage: collection.background }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90"
                aria-hidden="true"
              />

              <div
                className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/5 bg-white/[0.02] transition duration-500 group-hover:scale-125 group-hover:border-green-500/20"
                aria-hidden="true"
              />

              {collection.badge ? (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-green-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                  {collection.badge}
                </span>
              ) : null}

              <div className="relative z-10 flex h-full min-h-52 flex-col">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/25 bg-black/40 text-green-400 backdrop-blur transition duration-300 group-hover:scale-110 group-hover:border-green-400 group-hover:bg-green-500 group-hover:text-black">
                  {collection.icon}
                </div>

                <div className="mt-auto pt-10">
                  <h3 className="max-w-[14rem] text-xl font-black uppercase leading-tight tracking-tight text-white transition group-hover:text-green-400">
                    {collection.title}
                  </h3>

                  <p className="mt-2 text-sm text-neutral-400">
                    {collection.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-green-400 opacity-80 transition duration-300 group-hover:gap-3 group-hover:opacity-100">
                    Shop Collection
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:border-green-500/60 hover:bg-green-500/10 hover:text-green-400"
          >
            View All Cards
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}