"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import CardsWordmark from "@/components/shared/CardsWordmark";

const shopLinks = [
  {
    label: "All Cards",
    description: "Browse the entire marketplace",
    href: "/shop",
  },
  {
    label: "New Arrivals",
    description: "Recently added inventory",
    href: "/shop?sort=newest",
  },
  {
    label: "Featured Finds",
    description: "Dealer-selected cards",
    href: "/shop?featured=true",
  },
  {
    label: "Rookie Cards",
    description: "Rookies and rising stars",
    href: "/shop?rookie=true",
  },
  {
    label: "Autographs",
    description: "Signed cards and memorabilia",
    href: "/shop?auto=true",
  },
  {
    label: "Graded Cards",
    description: "Professionally graded inventory",
    href: "/shop?graded=true",
  },
];

const sportLinks = [
  {
    label: "Football",
    href: "/shop?sport=Football",
    symbol: "🏈",
  },
  {
    label: "Basketball",
    href: "/shop?sport=Basketball",
    symbol: "🏀",
  },
  {
    label: "Baseball",
    href: "/shop?sport=Baseball",
    symbol: "⚾",
  },
  {
    label: "Hockey",
    href: "/shop?sport=Hockey",
    symbol: "🏒",
  },
  {
    label: "Soccer",
    href: "/shop?sport=Soccer",
    symbol: "⚽",
  },
  {
    label: "WWE",
    href: "/shop?sport=WWE",
    symbol: "⭐",
  },
  {
    label: "UFC",
    href: "/shop?sport=UFC",
    symbol: "🥊",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileSportsOpen, setMobileSportsOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
    setMobileSportsOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="border-b border-white/[0.07] bg-green-500/[0.06]">
        <div className="mx-auto flex min-h-8 max-w-[1500px] items-center justify-center px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-green-300 sm:text-xs">
            ★ New cards added every week · Collector-owned marketplace
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="shrink-0"
          >
            <CardsWordmark />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            <DesktopNavLink
              href="/"
              label="Home"
              active={isActive("/")}
            />

            <DropdownMenu
              label="Shop"
              active={pathname.startsWith("/shop")}
              widthClass="w-[480px]"
            >
              <div className="grid grid-cols-2 gap-2 p-3">
                {shopLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group/item rounded-xl border border-transparent px-4 py-3 transition hover:border-green-500/20 hover:bg-green-500/[0.08]"
                  >
                    <p className="text-sm font-black text-white transition group-hover/item:text-green-400">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.025] px-5 py-4">
                <p className="text-xs font-semibold text-neutral-500">
                  Browse every available card
                </p>

                <Link
                  href="/shop"
                  className="text-xs font-black uppercase tracking-wide text-green-400 hover:text-green-300"
                >
                  Shop All →
                </Link>
              </div>
            </DropdownMenu>

            <DropdownMenu
              label="Sports"
              active={false}
              widthClass="w-[410px]"
            >
              <div className="grid grid-cols-2 gap-2 p-3">
                {sportLinks.map((sport) => (
                  <Link
                    key={sport.label}
                    href={sport.href}
                    className="group/item flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 transition hover:border-green-500/20 hover:bg-green-500/[0.08]"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-base"
                      aria-hidden="true"
                    >
                      {sport.symbol}
                    </span>

                    <span className="text-sm font-black text-white transition group-hover/item:text-green-400">
                      {sport.label}
                    </span>
                  </Link>
                ))}
              </div>
            </DropdownMenu>

            <DesktopNavLink
              href="/shop?sort=newest"
              label="New Arrivals"
              active={false}
            />

            <DesktopNavLink
              href="/sell"
              label="Sell"
              active={isActive("/sell")}
            />

            <DesktopNavLink
              href="/about"
              label="About"
              active={isActive("/about")}
            />
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              aria-label="Search cards"
              title="Search Cards"
              className="hidden h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3 text-neutral-300 transition hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 md:inline-flex xl:px-4"
            >
              <SearchIcon />

              <span className="hidden text-xs font-black uppercase tracking-wide xl:inline">
                Search
              </span>
            </Link>

            <Link
              href="/account/wishlist"
              aria-label="View wishlist"
              title="Wishlist"
              className={`hidden h-11 w-11 items-center justify-center rounded-xl border transition sm:inline-flex ${
                pathname.startsWith("/account/wishlist")
                  ? "border-green-500 bg-green-500/15 text-green-400"
                  : "border-white/10 bg-white/[0.045] text-neutral-300 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
              }`}
            >
              <HeartIcon />
            </Link>

            <Link
              href="/account"
              aria-label="View account"
              title="My Account"
              className={`hidden h-11 w-11 items-center justify-center rounded-xl border transition sm:inline-flex ${
                pathname.startsWith("/account") &&
                !pathname.startsWith("/account/wishlist")
                  ? "border-green-500 bg-green-500/15 text-green-400"
                  : "border-white/10 bg-white/[0.045] text-neutral-300 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
              }`}
            >
              <AccountIcon />
            </Link>

            <Link
              href="/cart"
              aria-label={`View cart with ${totalItems} ${
                totalItems === 1 ? "item" : "items"
              }`}
              title="Shopping Cart"
              className={`relative flex h-11 items-center justify-center gap-2 rounded-xl border px-3 transition sm:px-4 ${
                pathname.startsWith("/cart")
                  ? "border-green-500 bg-green-500 text-black"
                  : "border-green-500/40 bg-green-500/10 text-green-300 hover:border-green-400 hover:bg-green-500 hover:text-black"
              }`}
            >
              <CartIcon />

              <span className="hidden text-xs font-black uppercase tracking-wide sm:inline">
                Cart
              </span>

              {totalItems > 0 && (
                <span
                  className={`flex min-h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black ${
                    pathname.startsWith("/cart")
                      ? "bg-black text-green-400"
                      : "bg-green-500 text-black"
                  }`}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((currentValue) => !currentValue)
              }
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-white transition hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 lg:hidden"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 pb-6 pt-4 lg:hidden">
            <nav className="space-y-2">
              <MobileNavLink
                href="/"
                label="Home"
                active={pathname === "/"}
                onClick={closeMobileMenu}
              />

              <MobileAccordion
                label="Shop"
                open={mobileShopOpen}
                onToggle={() =>
                  setMobileShopOpen((currentValue) => !currentValue)
                }
              >
                <div className="grid gap-2 p-2 sm:grid-cols-2">
                  {shopLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-green-500/40 hover:bg-green-500/10"
                    >
                      <p className="text-sm font-black text-white">
                        {item.label}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              <MobileAccordion
                label="Shop by Sport"
                open={mobileSportsOpen}
                onToggle={() =>
                  setMobileSportsOpen((currentValue) => !currentValue)
                }
              >
                <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3">
                  {sportLinks.map((sport) => (
                    <Link
                      key={sport.label}
                      href={sport.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 text-sm font-black text-white transition hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
                    >
                      <span aria-hidden="true">{sport.symbol}</span>
                      {sport.label}
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              <MobileNavLink
                href="/shop?sort=newest"
                label="New Arrivals"
                active={false}
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                href="/sell"
                label="Sell Your Collection"
                active={pathname.startsWith("/sell")}
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                href="/about"
                label="About"
                active={pathname.startsWith("/about")}
                onClick={closeMobileMenu}
              />

              <div className="my-4 border-t border-white/10" />

              <div className="grid grid-cols-3 gap-2">
                <MobileUtilityLink
                  href="/shop"
                  label="Search"
                  onClick={closeMobileMenu}
                  icon={<SearchIcon />}
                />

                <MobileUtilityLink
                  href="/account/wishlist"
                  label="Wishlist"
                  onClick={closeMobileMenu}
                  icon={<HeartIcon />}
                />

                <MobileUtilityLink
                  href="/account"
                  label="Account"
                  onClick={closeMobileMenu}
                  icon={<AccountIcon />}
                />
              </div>

              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="mt-4 flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-600 transition hover:border-white/20 hover:text-neutral-400"
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

function DesktopNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative whitespace-nowrap rounded-xl px-2.5 py-3 text-xs font-black uppercase tracking-[0.1em] transition xl:px-3.5 ${
        active
          ? "bg-green-500/10 text-green-400"
          : "text-neutral-300 hover:bg-white/5 hover:text-green-400"
      }`}
    >
      {label}

      {active && (
        <span className="absolute inset-x-3 -bottom-[17px] h-0.5 bg-green-500" />
      )}
    </Link>
  );
}

function DropdownMenu({
  label,
  active,
  widthClass,
  children,
}: {
  label: string;
  active: boolean;
  widthClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-black uppercase tracking-[0.1em] transition xl:px-4 ${
          active
            ? "bg-green-500/10 text-green-400"
            : "text-neutral-300 group-hover:bg-white/5 group-hover:text-green-400"
        }`}
      >
        {label}

        <ChevronDownIcon />
      </button>

      <div
        className={`pointer-events-none absolute left-0 top-full z-50 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 ${widthClass}`}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/98 shadow-[0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-black uppercase tracking-wide transition ${
        active
          ? "bg-green-500/15 text-green-400"
          : "text-white hover:bg-white/5 hover:text-green-400"
      }`}
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function MobileAccordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-black uppercase tracking-wide transition ${
          open
            ? "bg-green-500/10 text-green-400"
            : "text-white hover:bg-white/5 hover:text-green-400"
        }`}
      >
        {label}

        <span
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className="mt-2 rounded-2xl border border-white/10 bg-black/30">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileUtilityLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-2 py-4 text-neutral-300 transition hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
    >
      {icon}

      <span className="text-[10px] font-black uppercase tracking-wide">
        {label}
      </span>
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
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
  );
}

function AccountIcon() {
  return (
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
  );
}

function CartIcon() {
  return (
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
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}