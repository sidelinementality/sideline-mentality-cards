"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/sideline-mentality-logo.png"
            alt="Sideline Mentality"
            width={180}
            height={80}
            priority
            className="h-auto w-[145px] sm:w-[180px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wide text-white lg:flex">
          <Link
            href="/shop"
            className="transition hover:text-green-400"
          >
            Shop
          </Link>

          <Link
            href="/shop?sport=Football"
            className="transition hover:text-green-400"
          >
            Football
          </Link>

          <Link
            href="/shop?sport=Basketball"
            className="transition hover:text-green-400"
          >
            Basketball
          </Link>

          <Link
            href="/shop?sport=Baseball"
            className="transition hover:text-green-400"
          >
            Baseball
          </Link>

          <Link
            href="/dashboard"
            className="transition hover:text-green-400"
          >
            Dealer Center
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            aria-label={`Shopping cart with ${totalItems} ${
              totalItems === 1 ? "item" : "items"
            }`}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-gray-700 text-white transition hover:border-green-500 hover:text-green-400"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="19" cy="20" r="1" />
              <path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex min-h-6 min-w-6 items-center justify-center rounded-full bg-green-500 px-1.5 text-xs font-black text-black">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard"
            className="hidden rounded-lg border border-green-500 px-4 py-2 text-sm font-semibold text-green-400 transition hover:bg-green-500 hover:text-white sm:inline-flex"
          >
            Dealer Login
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex items-center gap-6 overflow-x-auto border-t border-gray-800 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white lg:hidden">
        <Link
          href="/shop"
          className="shrink-0 transition hover:text-green-400"
        >
          Shop
        </Link>

        <Link
          href="/shop?sport=Football"
          className="shrink-0 transition hover:text-green-400"
        >
          Football
        </Link>

        <Link
          href="/shop?sport=Basketball"
          className="shrink-0 transition hover:text-green-400"
        >
          Basketball
        </Link>

        <Link
          href="/shop?sport=Baseball"
          className="shrink-0 transition hover:text-green-400"
        >
          Baseball
        </Link>

        <Link
          href="/dashboard"
          className="shrink-0 transition hover:text-green-400"
        >
          Dealer Center
        </Link>
      </nav>
    </header>
  );
}