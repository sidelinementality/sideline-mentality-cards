"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  function navLinkClass(href: string) {
    return `text-sm font-bold uppercase tracking-wide transition ${
      isActive(href)
        ? "text-green-400"
        : "text-neutral-200 hover:text-green-400"
    }`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/95 text-white shadow-lg shadow-black/20 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500 font-black text-black shadow-lg shadow-green-500/10 transition group-hover:bg-green-400">
              SM
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-black uppercase tracking-wide sm:text-lg">
                Sideline Mentality
              </p>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-400">
                Cards
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className={navLinkClass("/")}
            >
              Home
            </Link>

            <Link
              href="/shop"
              className={navLinkClass("/shop")}
            >
              Shop
            </Link>

            <Link
              href="/shop?sport=Football"
              className="text-sm font-bold uppercase tracking-wide text-neutral-200 transition hover:text-green-400"
            >
              Football
            </Link>

            <Link
              href="/shop?sport=Basketball"
              className="text-sm font-bold uppercase tracking-wide text-neutral-200 transition hover:text-green-400"
            >
              Basketball
            </Link>

            <Link
              href="/shop?sport=Baseball"
              className="text-sm font-bold uppercase tracking-wide text-neutral-200 transition hover:text-green-400"
            >
              Baseball
            </Link>

            <Link
              href="/about"
              className={navLinkClass("/about")}
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/account/wishlist"
              aria-label="View wishlist"
              title="Wishlist"
              className={`hidden h-11 w-11 items-center justify-center rounded-xl border transition sm:inline-flex ${
                pathname.startsWith("/account/wishlist")
                  ? "border-green-500 bg-green-500/15 text-green-400"
                  : "border-white/10 bg-white/5 text-neutral-200 hover:border-green-500/60 hover:text-green-400"
              }`}
            >
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
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </Link>

            <Link
              href="/account"
              aria-label="View account"
              title="My Account"
              className={`hidden h-11 w-11 items-center justify-center rounded-xl border transition sm:inline-flex ${
                pathname.startsWith("/account") &&
                !pathname.startsWith("/account/wishlist")
                  ? "border-green-500 bg-green-500/15 text-green-400"
                  : "border-white/10 bg-white/5 text-neutral-200 hover:border-green-500/60 hover:text-green-400"
              }`}
            >
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
                  d="M20 21a8 8 0 0 0-16 0"
                />

                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link
              href="/cart"
              aria-label={`View cart with ${totalItems} ${
                totalItems === 1 ? "item" : "items"
              }`}
              title="Shopping Cart"
              className={`relative flex h-11 items-center justify-center gap-2 rounded-xl border px-3 transition sm:px-4 ${
                pathname.startsWith("/cart")
                  ? "border-green-500 bg-green-500/15 text-green-400"
                  : "border-white/10 bg-white/5 text-neutral-200 hover:border-green-500/60 hover:text-green-400"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"
                />
              </svg>

              <span className="hidden text-sm font-black sm:inline">
                Cart
              </span>

              {totalItems > 0 && (
                <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-green-500 px-1.5 text-xs font-black text-black">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (currentValue) => !currentValue,
                )
              }
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-green-500/60 hover:text-green-400 lg:hidden"
            >
              {mobileMenuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 py-5 lg:hidden">
            <nav className="grid gap-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wide transition ${
                  pathname === "/"
                    ? "bg-green-500/15 text-green-400"
                    : "text-white hover:bg-white/5 hover:text-green-400"
                }`}
              >
                Home
              </Link>

              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className={`rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wide transition ${
                  pathname.startsWith("/shop")
                    ? "bg-green-500/15 text-green-400"
                    : "text-white hover:bg-white/5 hover:text-green-400"
                }`}
              >
                Shop All Cards
              </Link>

              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/shop?sport=Football"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-black uppercase tracking-wide text-neutral-200 transition hover:border-green-500/50 hover:text-green-400"
                >
                  Football
                </Link>

                <Link
                  href="/shop?sport=Basketball"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-black uppercase tracking-wide text-neutral-200 transition hover:border-green-500/50 hover:text-green-400"
                >
                  Basketball
                </Link>

                <Link
                  href="/shop?sport=Baseball"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-black uppercase tracking-wide text-neutral-200 transition hover:border-green-500/50 hover:text-green-400"
                >
                  Baseball
                </Link>
              </div>

              <div className="my-2 border-t border-white/10" />

              <Link
                href="/account"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/5 hover:text-green-400"
              >
                My Account
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/account/orders"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/5 hover:text-green-400"
              >
                My Orders
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/account/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/5 hover:text-green-400"
              >
                Wishlist
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/5 hover:text-green-400"
              >
                About
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="mt-3 rounded-xl border border-white/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 transition hover:border-white/20 hover:text-neutral-300"
              >
                Dealer Portal
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}