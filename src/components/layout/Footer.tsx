import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-2xl font-black text-green-400">
              Sideline Mentality Cards
            </h3>

            <p className="mt-4 max-w-sm leading-7 text-neutral-400">
              Premium sports cards backed by a faith-based mission of
              developing athletes, building leaders, and impacting lives
              beyond the scoreboard.
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <p className="font-bold text-white">
                Collector-Owned. Faith-Driven.
              </p>

              <p className="text-neutral-400">
                Secure checkout and careful shipping on every order.
              </p>
            </div>

            <a
              href="mailto:eric@sidelinementality.com"
              className="mt-5 inline-block text-sm font-bold text-green-400 transition hover:text-green-300"
            >
              eric@sidelinementality.com
            </a>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-[0.18em] text-white">
              Shop
            </h4>

            <ul className="mt-5 space-y-3 text-neutral-400">
              <li>
                <Link
                  href="/shop"
                  className="transition hover:text-green-400"
                >
                  All Cards
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?sport=Football"
                  className="transition hover:text-green-400"
                >
                  Football
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?sport=Basketball"
                  className="transition hover:text-green-400"
                >
                  Basketball
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?sport=Baseball"
                  className="transition hover:text-green-400"
                >
                  Baseball
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?sport=UFC"
                  className="transition hover:text-green-400"
                >
                  UFC
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?sport=WWE"
                  className="transition hover:text-green-400"
                >
                  WWE
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?sport=Pok%C3%A9mon"
                  className="transition hover:text-green-400"
                >
                  Pokémon
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-[0.18em] text-white">
              Company
            </h4>

            <ul className="mt-5 space-y-3 text-neutral-400">
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-green-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/sell"
                  className="transition hover:text-green-400"
                >
                  Sell Your Cards
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-green-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-[0.18em] text-white">
              Customer Care
            </h4>

            <ul className="mt-5 space-y-3 text-neutral-400">
              <li>
                <Link
                  href="/faq"
                  className="transition hover:text-green-400"
                >
                  Frequently Asked Questions
                </Link>
              </li>

              <li>
                <Link
                  href="/shipping-policy"
                  className="transition hover:text-green-400"
                >
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/returns"
                  className="transition hover:text-green-400"
                >
                  Returns & Refunds
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="transition hover:text-green-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-green-400"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 text-center text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © {new Date().getFullYear()} Sideline Mentality Cards. All
              rights reserved.
            </p>

            <p>
              Secure checkout powered by Stripe.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}