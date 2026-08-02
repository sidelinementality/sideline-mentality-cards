import Image from "next/image";
import Link from "next/link";
import ShopSearch from "@/components/shop/ShopSearch";

const collectorBenefits = [
  {
    title: "Secure Checkout",
    description: "Protected Stripe payments",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10V7a4 4 0 0 1 8 0v3"
        />
      </svg>
    ),
  },
  {
    title: "Accurate Listings",
    description: "Clear photos and honest details",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8 12 2.5 2.5L16 9"
        />
      </svg>
    ),
  },
  {
    title: "Collector Owned",
    description: "Built by someone who values the hobby",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
        />
      </svg>
    ),
  },
];

const collectionLinks = [
  {
    label: "New Arrivals",
    href: "/shop?sort=newest",
  },
  {
    label: "Rookie Cards",
    href: "/shop?rookie=true",
  },
  {
    label: "Autographs",
    href: "/shop?auto=true",
  },
  {
    label: "Graded Cards",
    href: "/shop?graded=true",
  },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-black text-white">
      <HeroBackground />

      <div className="relative mx-auto max-w-[1500px] px-5 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 xl:gap-20">
          <div className="relative z-20">
            <div className="inline-flex items-center gap-3 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>

              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-green-300 sm:text-xs">
                Premium Sports Card Marketplace
              </span>
            </div>

            <h1 className="mt-7 max-w-3xl text-[2.75rem] font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-[4.8rem] xl:text-[5.7rem]">
              Find the next

              <span className="mt-2 block text-green-400">
                centerpiece
              </span>

              <span className="mt-2 block text-white">
                of your collection.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg sm:leading-8">
              Shop hand-selected rookies, autographs, graded cards, stars,
              and legends from a collector-owned marketplace built around
              honest listings and dependable service.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/shop?sort=newest"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-green-500 px-6 py-4 text-sm font-black uppercase tracking-wide text-black shadow-[0_16px_45px_rgba(34,197,94,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-[0_20px_55px_rgba(34,197,94,0.3)]"
              >
                Shop New Arrivals

                <span
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>

              <Link
                href="/shop"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-6 py-4 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-green-500/60 hover:bg-green-500/10 hover:text-green-300"
              >
                Browse All Cards
              </Link>

              <Link
                href="/sell"
                className="inline-flex min-h-14 items-center justify-center rounded-xl px-5 py-4 text-sm font-black uppercase tracking-wide text-neutral-400 transition hover:text-green-300"
              >
                Sell Your Collection →
              </Link>
            </div>

            <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-3">
              {collectorBenefits.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-green-500/25 bg-green-500/10 text-green-400">
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-white">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-3xl lg:mx-0 lg:max-w-none">
            <div
              className="absolute -inset-10 rounded-[4rem] bg-green-500/10 blur-3xl"
              aria-hidden="true"
            />

            <div
              className="absolute -right-10 top-4 h-72 w-72 rounded-full bg-green-400/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-green-500/30 bg-neutral-950 shadow-[0_35px_100px_rgba(0,0,0,0.75)]">
              <div
                className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-white/10"
                aria-hidden="true"
              />

              <Image
                src="/sideline-mentality-cards-hero.png"
                alt="Premium sports trading cards available from Sideline Mentality Cards"
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="aspect-[3/2] w-full object-contain object-center transition duration-700 ease-out hover:scale-[1.015]"
              />

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/55 via-transparent to-green-500/10"
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 to-transparent"
                aria-hidden="true"
              />

              <div className="absolute left-5 top-5 z-30 sm:left-7 sm:top-7">
                <div className="rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl sm:text-xs">
                  Curated for Collectors
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black via-black/90 to-transparent px-5 pb-5 pt-28 sm:px-8 sm:pb-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-green-400">
                      Sideline Mentality Cards
                    </p>

                    <p className="mt-2 max-w-md text-base font-bold leading-6 text-white sm:text-lg">
                      Premium cards. Honest listings. A better collecting
                      experience.
                    </p>
                  </div>

                  <Link
                    href="/shop"
                    className="group inline-flex shrink-0 items-center gap-2 text-sm font-black uppercase tracking-wide text-green-400 transition hover:text-green-300"
                  >
                    Explore Inventory

                    <span
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative z-40 mx-3 -mt-3 rounded-3xl border border-white/10 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur-xl sm:mx-6 sm:-mt-5 sm:p-5">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
                    Search the Marketplace
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Find players, teams, brands, years, and grades.
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="hidden text-xs font-black uppercase tracking-wide text-neutral-500 transition hover:text-green-400 sm:block"
                >
                  View everything →
                </Link>
              </div>

              <ShopSearch />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 sm:mt-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-600">
                Explore Popular Collections
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {collectionLinks.map((collection) => (
                <Link
                  key={collection.label}
                  href={collection.href}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-wide text-neutral-300 transition hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-300"
                >
                  {collection.label}
                </Link>
              ))}
            </div>

            <p className="text-xs font-semibold text-neutral-600">
              New inventory added regularly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    >
      <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

      <div className="absolute -right-40 -top-24 h-[42rem] w-[42rem] rounded-full bg-green-500/15 blur-3xl" />

      <div className="absolute bottom-0 left-1/3 h-72 w-96 rounded-full bg-green-500/[0.06] blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:52px_52px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_82%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black" />
    </div>
  );
}