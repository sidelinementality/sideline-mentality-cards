import Link from "next/link";

const collectorFeatures = [
  {
    eyebrow: "Future Stars",
    title: "Rookie Watch",
    description:
      "Explore rookie cards from players building the next chapter of the hobby.",
    href: "/shop?rookie=true",
    action: "Browse Rookies",
    number: "01",
  },
  {
    eyebrow: "Collector Value",
    title: "Cards Under $50",
    description:
      "Find affordable additions that bring personality and potential to your collection.",
    href: "/shop?maxPrice=50",
    action: "Shop Under $50",
    number: "02",
  },
  {
    eyebrow: "Certified Quality",
    title: "Graded Gems",
    description:
      "Shop professionally graded cards ready for display, protection, and long-term collecting.",
    href: "/shop?graded=true",
    action: "View Graded Cards",
    number: "03",
  },
];

export default function CollectorsCorner() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black px-5 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div
        className="pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-green-500/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.7fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-green-400">
              More Than a Marketplace
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl">
              Collector&apos;s
              <span className="block text-green-400">Corner</span>
            </h2>
          </div>

          <div className="lg:max-w-2xl">
            <p className="text-base leading-7 text-neutral-400 sm:text-lg">
              Discover new ways to build your collection—from tomorrow&apos;s
              stars to affordable finds and display-worthy graded cards.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition duration-200 hover:-translate-y-0.5 hover:bg-green-400"
              >
                Explore the Marketplace
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {collectorFeatures.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative min-h-[25rem] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 p-7 transition duration-300 hover:-translate-y-2 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 sm:p-8"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_42%)] opacity-60 transition duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/5 transition duration-500 group-hover:scale-125 group-hover:border-green-500/20"
                aria-hidden="true"
              />

              <div className="relative flex h-full min-h-[21rem] flex-col">
                <div className="flex items-start justify-between gap-6">
                  <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-green-400">
                    {feature.eyebrow}
                  </span>

                  <span className="text-5xl font-black leading-none text-white/5 transition duration-300 group-hover:text-green-500/15">
                    {feature.number}
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="mb-7 h-px w-full bg-gradient-to-r from-green-500/70 via-white/10 to-transparent" />

                  <h3 className="text-3xl font-black uppercase leading-none tracking-tight text-white transition duration-300 group-hover:text-green-400">
                    {feature.title}
                  </h3>

                  <p className="mt-5 max-w-sm leading-7 text-neutral-400">
                    {feature.description}
                  </p>

                  <div className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-green-400">
                    {feature.action}

                    <span
                      className="transition duration-300 group-hover:translate-x-1.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-green-500/10 via-neutral-950 to-neutral-950">
          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
                Built for Collectors
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Every great collection starts with one meaningful card.
              </h3>

              <p className="mt-3 max-w-3xl leading-7 text-neutral-400">
                Whether you collect favorite players, chase rookies, or build
                around a sport, Sideline Mentality Cards helps you find the
                next piece of your story.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-green-500/40 bg-black/40 px-6 py-3 text-sm font-black uppercase tracking-wide text-green-400 transition duration-200 hover:-translate-y-0.5 hover:bg-green-500 hover:text-black"
            >
              Start Collecting
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}