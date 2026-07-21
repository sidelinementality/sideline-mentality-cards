"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-sm font-bold uppercase tracking-wide transition ${
      pathname === href
        ? "text-green-400"
        : "text-white hover:text-green-400"
    }`;

  return (
    <header className="border-b border-white/10 bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-black uppercase tracking-wide"
        >
          Sideline Mentality Cards
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/shop" className={linkClass("/shop")}>
            Shop
          </Link>

          <Link
            href="/shop?sport=Football"
            className="text-sm font-bold uppercase tracking-wide text-white transition hover:text-green-400"
          >
            Football
          </Link>

          <Link
            href="/shop?sport=Basketball"
            className="text-sm font-bold uppercase tracking-wide text-white transition hover:text-green-400"
          >
            Basketball
          </Link>

          <Link
            href="/shop?sport=Baseball"
            className="text-sm font-bold uppercase tracking-wide text-white transition hover:text-green-400"
          >
            Baseball
          </Link>
        </nav>

        <Link
          href="/dashboard"
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-black uppercase tracking-wide text-black transition hover:bg-green-400"
        >
          Dealer Login
        </Link>
      </div>
    </header>
  );
}