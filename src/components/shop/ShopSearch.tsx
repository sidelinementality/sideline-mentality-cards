"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  cards?: Card[];
};

function formatCurrency(value: number | string | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function ShopSearch({
  cards: _cards,
}: ShopSearchProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Card[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRequestRef = useRef<AbortController | null>(
    null,
  );

  const trimmedSearch = search.trim();

  useEffect(() => {
    if (trimmedSearch.length < 2) {
      searchRequestRef.current?.abort();
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      searchRequestRef.current?.abort();

      const controller = new AbortController();
      searchRequestRef.current = controller;

      setIsLoading(true);
      setHasSearched(false);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedSearch)}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Unable to search cards.");
        }

        const data = (await response.json()) as Card[];

        setResults(data);
        setHasSearched(true);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Search error:", error);

        setResults([]);
        setHasSearched(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [trimmedSearch]);

  useEffect(() => {
    return () => {
      searchRequestRef.current?.abort();
    };
  }, []);

  const showResults =
    isFocused && trimmedSearch.length > 0;

  function closeResults() {
    setIsFocused(false);
  }

  return (
    <div className="relative">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-500">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />

            <path
              strokeLinecap="round"
              d="m20 20-4-4"
            />
          </svg>
        </span>

        <input
          type="search"
          placeholder="Search players, teams, brands, grades..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
            }, 150);
          }}
          aria-label="Search the card marketplace"
          autoComplete="off"
          className="w-full rounded-2xl border border-white/10 bg-neutral-900 py-4 pl-12 pr-12 text-white shadow-lg outline-none transition placeholder:text-neutral-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
        />

        {isLoading ? (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-green-400" />
          </span>
        ) : search ? (
          <button
            type="button"
            onMouseDown={(event) =>
              event.preventDefault()
            }
            onClick={() => {
              setSearch("");
              setResults([]);
              setHasSearched(false);
            }}
            aria-label="Clear search"
            className="absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-white/5 hover:text-white"
          >
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
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {showResults ? (
        <div className="absolute left-0 right-0 z-50 mt-3 max-h-[32rem] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-950 p-2 shadow-2xl shadow-black/50">
          {trimmedSearch.length < 2 ? (
            <div className="p-6 text-center">
              <p className="font-black text-white">
                Keep typing
              </p>

              <p className="mt-2 text-sm text-neutral-400">
                Enter at least two characters to search
                the full marketplace.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-3 p-8">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-green-400" />

              <p className="text-sm font-bold text-neutral-400">
                Searching the marketplace...
              </p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Search Results
                </p>

                <p className="text-xs font-bold text-green-400">
                  {results.length}{" "}
                  {results.length === 1
                    ? "result"
                    : "results"}
                </p>
              </div>

              {results.map((card) => (
                <Link
                  key={card.id}
                  href={`/cards/${card.slug}`}
                  onClick={closeResults}
                  className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-white/5 focus:bg-white/5 focus:outline-none"
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
                      {[
                        card.year,
                        card.brand,
                        card.team,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>

                    {(card.grade_company ||
                      card.grade) && (
                      <p className="mt-1 text-xs font-bold text-green-400">
                        {[
                          card.grade_company,
                          card.grade,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                    )}

                    {card.sport ? (
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-neutral-600">
                        {card.sport}
                      </p>
                    ) : null}
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
          ) : hasSearched ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-neutral-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />

                  <path
                    strokeLinecap="round"
                    d="m20 20-4-4"
                  />
                </svg>
              </div>

              <p className="mt-4 font-black text-white">
                No cards found
              </p>

              <p className="mt-2 text-sm text-neutral-400">
                Try another player, team, sport, brand,
                or grade.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}