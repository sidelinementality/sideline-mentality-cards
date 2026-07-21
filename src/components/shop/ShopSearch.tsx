"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  grade_company: string | null;
  grade: string | null;
};

type ShopSearchProps = {
  cards: Card[];
};

function formatCurrency(value: number | string | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function ShopSearch({
  cards,
}: ShopSearchProps) {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredCards = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return [];
    }

    return cards
      .filter((card) => {
        const searchableValues = [
          card.player_name,
          card.team,
          card.sport,
          card.brand,
          card.grade_company,
          card.grade,
          card.year?.toString(),
        ];

        return searchableValues
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(term),
          );
      })
      .slice(0, 8);
  }, [cards, search]);

  const showResults =
    isFocused && search.trim().length > 0;

  return (
    <div className="relative">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-500">
          🔍
        </span>

        <input
          type="search"
          placeholder="Search players, teams, brands, grades..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
            }, 150);
          }}
          className="w-full rounded-2xl border border-white/10 bg-neutral-900 py-4 pl-12 pr-4 text-white shadow-lg outline-none transition placeholder:text-neutral-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
        />
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 z-50 mt-3 max-h-[32rem] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-950 p-2 shadow-2xl shadow-black/50">
          {filteredCards.length > 0 ? (
            <>
              <div className="px-3 py-2">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Search Results
                </p>
              </div>

              {filteredCards.map((card) => (
                <Link
                  key={card.id}
                  href={`/cards/${card.slug}`}
                  className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-white/5"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                    {card.image_url ? (
                      <Image
                        src={card.image_url}
                        alt={card.player_name}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-neutral-600">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-white">
                      {card.player_name}
                    </p>

                    <p className="mt-1 truncate text-sm text-neutral-400">
                      {[card.year, card.brand, card.team]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>

                    {(card.grade_company || card.grade) && (
                      <p className="mt-1 text-xs font-bold text-green-400">
                        {[card.grade_company, card.grade]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-black text-white">
                      {formatCurrency(card.price)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-green-400">
                      View →
                    </p>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="font-black text-white">
                No cards found
              </p>

              <p className="mt-2 text-sm text-neutral-400">
                Try searching for another player, team, brand, or grade.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}