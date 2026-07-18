"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  featured: boolean | null;
  stock: number | null;
  created_at: string | null;
};

type InventoryManagerProps = {
  cards: Card[];
};

type StockStatus = {
  label: string;
  className: string;
};

export default function InventoryManager({
  cards,
}: InventoryManagerProps) {
  const [inventoryCards, setInventoryCards] = useState(cards);
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [updatingCardId, setUpdatingCardId] = useState<string | null>(
    null
  );
  const [stockError, setStockError] = useState("");

  const sports = useMemo(() => {
    const uniqueSports = new Set(
      inventoryCards
        .map((card) => card.sport)
        .filter((sport): sport is string => Boolean(sport))
    );

    return ["All", ...Array.from(uniqueSports).sort()];
  }, [inventoryCards]);

  const filteredCards = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return inventoryCards.filter((card) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        card.player_name.toLowerCase().includes(normalizedSearch) ||
        card.slug.toLowerCase().includes(normalizedSearch) ||
        card.brand?.toLowerCase().includes(normalizedSearch);

      const matchesSport =
        sportFilter === "All" || card.sport === sportFilter;

      return matchesSearch && matchesSport;
    });
  }, [inventoryCards, searchTerm, sportFilter]);

  function getStockStatus(stock: number): StockStatus {
    if (stock <= 0) {
      return {
        label: "Out of Stock",
        className:
          "border-red-500/30 bg-red-500/10 text-red-300",
      };
    }

    if (stock <= 2) {
      return {
        label: "Low Stock",
        className:
          "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      };
    }

    return {
      label: "In Stock",
      className:
        "border-green-500/30 bg-green-500/10 text-green-300",
      };
  }

  async function updateStock(cardId: string, nextStock: number) {
    if (nextStock < 0) {
      return;
    }

    setUpdatingCardId(cardId);
    setStockError("");

    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stockOnly: true,
          stock: nextStock,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "The stock amount could not be updated."
        );
      }

      setInventoryCards((currentCards) =>
        currentCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                stock: nextStock,
              }
            : card
        )
      );
    } catch (error) {
      setStockError(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating stock."
      );
    } finally {
      setUpdatingCardId(null);
    }
  }

  return (
    <>
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <div>
            <label
              htmlFor="inventorySearch"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Search inventory
            </label>

            <input
              id="inventorySearch"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by player, slug, or brand"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="sportFilter"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Filter by sport
            </label>

            <select
              id="sportFilter"
              value={sportFilter}
              onChange={(event) => setSportFilter(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-green-500"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-zinc-400">
          Showing {filteredCards.length} of {inventoryCards.length} cards
        </p>
      </section>

      {stockError && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {stockError}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {filteredCards.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-xl font-black text-white">
              No matching cards
            </h2>

            <p className="mt-2 text-zinc-400">
              Try a different search term or sport filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSportFilter("All");
              }}
              className="mt-6 rounded-lg border border-white/15 px-5 py-3 font-bold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/20">
                <tr>
                  <TableHeading>Card</TableHeading>
                  <TableHeading>Sport</TableHeading>
                  <TableHeading>Year / Brand</TableHeading>
                  <TableHeading>Price</TableHeading>
                  <TableHeading>Stock</TableHeading>
                  <TableHeading>Featured</TableHeading>
                  <TableHeading>Actions</TableHeading>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredCards.map((card) => {
                  const stock = Number(card.stock ?? 0);
                  const stockStatus = getStockStatus(stock);
                  const isUpdating = updatingCardId === card.id;

                  return (
                    <tr
                      key={card.id}
                      className="transition hover:bg-white/[0.03]"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-12 overflow-hidden rounded-md bg-black">
                            {card.image_url ? (
                              <img
                                src={card.image_url}
                                alt={`${card.player_name} card`}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-zinc-500">
                                No image
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-white">
                              {card.player_name}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {card.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                        {card.sport || "—"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                        {card.year || "—"} {card.brand || ""}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-bold text-white">
                        ${Number(card.price ?? 0).toFixed(2)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex flex-col items-start gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateStock(card.id, stock - 1)
                              }
                              disabled={isUpdating || stock <= 0}
                              aria-label={`Decrease stock for ${card.player_name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/20 text-lg font-bold text-white transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              −
                            </button>

                            <span className="min-w-8 text-center font-bold text-white">
                              {isUpdating ? "..." : stock}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateStock(card.id, stock + 1)
                              }
                              disabled={isUpdating}
                              aria-label={`Increase stock for ${card.player_name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-green-500/40 bg-green-500/10 text-lg font-bold text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              +
                            </button>
                          </div>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-bold ${stockStatus.className}`}
                          >
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {card.featured ? (
                          <span className="font-bold text-yellow-300">
                            Yes
                          </span>
                        ) : (
                          <span className="text-zinc-500">No</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/cards/${card.slug}`}
                            className="text-sm font-bold text-green-400 hover:text-green-300"
                          >
                            View
                          </Link>

                          <span className="text-zinc-700">|</span>

                          <Link
                            href={`/dashboard/inventory/${card.id}/edit`}
                            className="text-sm font-bold text-zinc-300 hover:text-white"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400"
    >
      {children}
    </th>
  );
}