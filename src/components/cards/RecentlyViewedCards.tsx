"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type RecentlyViewedCard = {
  id: string;
  slug: string;
  playerName: string;
  year: number | null;
  brand: string | null;
  price: number;
  imageUrl: string | null;
  viewedAt: number;
};

const STORAGE_KEY = "sm-recently-viewed";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function RecentlyViewedCards() {
  const [cards, setCards] = useState<RecentlyViewedCard[]>([]);

  useEffect(() => {
    try {
      const storedCards = localStorage.getItem(STORAGE_KEY);

      if (!storedCards) {
        return;
      }

      const parsedCards = JSON.parse(
        storedCards,
      ) as RecentlyViewedCard[];

      setCards(parsedCards.slice(0, 4));
    } catch (error) {
      console.error(
        "Recently viewed cards could not be loaded:",
        error,
      );
    }
  }, []);

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
            Continue Browsing
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Recently Viewed
          </h2>

          <p className="mt-2 text-neutral-400">
            Pick up where you left off.
          </p>
        </div>

        <Link
          href="/shop"
          className="text-sm font-bold text-green-400 transition hover:text-green-300"
        >
          Browse all cards →
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.slug}`}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-green-500/50 hover:bg-white/10"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              {card.imageUrl ? (
                <Image
                  src={card.imageUrl}
                  alt={card.playerName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-5 transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-5 text-center text-sm font-semibold text-neutral-500">
                  No image available
                </div>
              )}
            </div>

            <div className="p-5">
              <p className="text-lg font-black text-white">
                {card.playerName}
              </p>

              <p className="mt-2 text-sm text-neutral-400">
                {[card.year, card.brand]
                  .filter(Boolean)
                  .join(" ")}
              </p>

              <p className="mt-4 text-xl font-black text-green-400">
                {formatCurrency(card.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}