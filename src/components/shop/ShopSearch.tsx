"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  grade_company: string | null;
  grade: string | null;
};

export default function ShopSearch({
  cards,
}: {
  cards: Card[];
}) {
  const [search, setSearch] = useState("");

  const filteredCards = useMemo(() => {
    if (!search.trim()) {
      return [];
    }

    const term = search.toLowerCase();

    return cards
      .filter((card) => {
        return [
          card.player_name,
          card.team,
          card.sport,
          card.brand,
          card.grade_company,
          card.grade,
          card.year?.toString(),
        ]
          .filter(Boolean)
          .some((value) =>
            value!.toLowerCase().includes(term),
          );
      })
      .slice(0, 10);
  }, [cards, search]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search players, teams, brands..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-green-500"
      />

      {filteredCards.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 shadow-2xl">
          {filteredCards.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.slug}`}
              className="block border-b border-white/5 px-4 py-3 hover:bg-white/5"
            >
              <div className="font-semibold text-white">
                {card.player_name}
              </div>

              <div className="text-sm text-neutral-400">
                {card.year} • {card.brand} • {card.grade_company}{" "}
                {card.grade}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}