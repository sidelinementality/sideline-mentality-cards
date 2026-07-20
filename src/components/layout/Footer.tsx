import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-black text-green-400">
              Sideline Mentality Cards
            </h3>

            <p className="mt-4 leading-7 text-neutral-400">
              Premium sports cards backed by a faith-based mission of
              developing athletes, building leaders, and impacting lives
              beyond the scoreboard.
            </p>

            <p className="mt-6 text-sm font-semibold text-neutral-300">
              Eric Siever
            </p>

            <a
              href="mailto:eric@sidelinementality.com"
              className="mt-2 block text-sm text-green-400 transition hover:text-green-300"
            >
              eric@sidelinementality.com
            </a>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white">
              Shop
            </h4>

            <ul className="mt-4 space-y-3 text-neutral-400">
              <li>
                <Link href="/shop" className="hover:text-green-400">
                  All Cards
                </Link>
              </li>

              <li>
                <Link href="/shop?sport=Football" className="hover:text-green-400">
                  Football
                </Link>
              </li>

              <li>
                <Link href="/shop?sport=Basketball" className="hover:text-green-400">
                  Basketball
                </Link>
              </li>

              <li>
                <Link href="/shop?sport=Baseball" className="hover:text-green-400">
                  Baseball
                </Link>
              </li>

              <li>
                <Link href="/shop?sport=UFC" className="hover:text-green-400">
                  UFC
                </Link>
              </li>

              <li>
                <Link href="/shop?sport=WWE" className="hover:text-green-400">
                  WWE
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white">
              Company
            </h4>

            <ul className="mt-4 space-y-3 text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-green-400">
                  About
                </Link>
              </li>

              <li>
                <Link href="/sell" className="hover:text-green-400">
                  Sell Your Cards
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white">
              Support
            </h4>

            <ul className="mt-4 space-y-3 text-neutral-400">
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:text-green-400"
                >
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/returns"
                  className="hover:text-green-400"
                >
                  Returns & Refunds
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-green-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="hover:text-green-400"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Sideline Mentality Cards. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}