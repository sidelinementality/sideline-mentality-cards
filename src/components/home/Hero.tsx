import Image from "next/image";
import Link from "next/link";

const trustItems = [
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
    title: "Fast Shipping",
    description: "Orders ship quickly",
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
          d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"
        />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
  },
  {
    title: "Collector Owned",
    description: "Built for the hobby",
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
  {
    title: "Accurate Listings",
    description: "Cards shown honestly",
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
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-[32rem] w-[32rem] rounded-full bg-green-500/15 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-14 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
              Premium Sports Card Marketplace
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-black uppercase leading-[0.98] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl">
              The Next
              <span className="mt-2 block -skew-x-3 text-green-400 drop-shadow-[0_0_24px_rgba(34,197,94,0.22)]">
                Centerpiece
              </span>
              <span className="mt-2 block">
                Of Your Collection
              </span>
              <span className="mt-2 block text-neutral-300">
                Starts Here.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg sm:leading-8">
              Discover hand-selected cards featuring today&apos;s stars,
              tomorrow&apos;s rookies, and legendary icons. Every order is
              carefully packed and backed by a collector who values the hobby
              as much as you do.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/shop?sort=newest"
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-4 text-sm font-black uppercase tracking-wide text-black shadow-lg shadow-green-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-green-500/30"
              >
                Shop New Arrivals
                <span
                  className="transition group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>

              <Link
                href="/shop"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-green-500/60 hover:bg-green-500/10 hover:text-green-400"
              >
                Browse All Cards
              </Link>

              <Link
                href="/sell"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-green-500/50 px-6 py-4 text-sm font-black uppercase tracking-wide text-green-400 transition duration-200 hover:-translate-y-0.5 hover:bg-green-500 hover:text-black"
              >
                Sell Your Collection
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">★★★★★</span>
                <span className="font-semibold text-neutral-300">
                  Collector-focused service
                </span>
              </div>

              <div className="hidden h-4 w-px bg-white/15 sm:block" />

              <p>New inventory added regularly</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-none">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-green-500/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="group relative overflow-hidden rounded-[1.75rem] border border-green-500/30 bg-neutral-950 shadow-2xl shadow-green-500/10">
              <div
                className="pointer-events-none absolute inset-0 z-10 rounded-[1.75rem] ring-1 ring-inset ring-white/10"
                aria-hidden="true"
              />

              <Image
                src="/sideline-mentality-cards-hero.png"
                alt="Sideline Mentality Cards premium sports card marketplace"
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="h-auto w-full transition duration-700 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pb-5 pt-20 sm:px-7 sm:pb-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
                      Built for Collectors
                    </p>

                    <p className="mt-1 max-w-md text-sm font-semibold text-white sm:text-base">
                      Premium cards. Honest listings. A better collecting
                      experience.
                    </p>
                  </div>

                  <Link
                    href="/shop"
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-black uppercase tracking-wide text-green-400 transition hover:text-green-300"
                  >
                    Explore the shop
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-neutral-950/95 px-5 py-4 shadow-xl backdrop-blur sm:block">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
                Fresh Inventory
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                New cards added regularly
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center gap-4 px-5 py-5 ${
                index > 0
                  ? "border-t border-white/10 sm:border-t-0 sm:[&:nth-child(odd)]:border-l lg:border-l"
                  : ""
              } ${
                index === 1
                  ? "sm:border-l"
                  : ""
              } ${
                index >= 2
                  ? "sm:border-t lg:border-t-0"
                  : ""
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-500/25 bg-green-500/10 text-green-400">
                {item.icon}
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-wide text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}