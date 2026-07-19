"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SearchCard = {
  id: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  stock: number | null;
  price: number | string | null;
};

type DashboardInventorySearchProps = {
  cards: SearchCard[];
};

export default function DashboardInventorySearch({
  cards,
}: DashboardInventorySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return [];
    }

    return cards
      .filter((card) => {
        const searchableText = [
          card.player_name,
          card.sport,
          card.year,
          card.brand,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .slice(0, 6);
  }, [cards, searchTerm]);

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
          Quick Search
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Find an Inventory Card
        </h2>

        <p className="mt-2 text-zinc-400">
          Search by player, sport, year, or brand and open the listing directly.
        </p>
      </div>

      <div className="p-6">
        <label
          htmlFor="dashboard-card-search"
          className="text-sm font-bold text-white"
        >
          Search inventory
        </label>

        <input
          id="dashboard-card-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Example: Patrick Mahomes, Football, Prizm..."
          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
        />

        {searchTerm.trim() && searchResults.length === 0 && (
          <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <p className="font-semibold text-yellow-200">
              No matching cards were found.
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Try searching with a different player, sport, year, or brand.
            </p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
            <div className="divide-y divide-white/10">
              {searchResults.map((card) => (
                <div
                  key={card.id}
                  className="flex flex-col gap-4 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-black text-white">
                      {card.player_name}
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                      {card.year || "Year unknown"} {card.brand || ""}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      {card.sport || "Uncategorized"} · Stock:{" "}
                      {Number(card.stock ?? 0)} ·{" "}
                      {formatCurrency(Number(card.price ?? 0))}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/inventory/${card.id}/edit`}
                    className="inline-flex shrink-0 justify-center rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-300 transition hover:bg-green-500/20"
                  >
                    Open Card
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searchTerm.trim() && (
          <p className="mt-4 text-sm text-zinc-500">
            Start typing to search your current inventory.
          </p>
        )}
      </div>
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}