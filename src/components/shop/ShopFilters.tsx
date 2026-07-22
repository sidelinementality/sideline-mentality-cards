"use client";

import { useRouter, useSearchParams } from "next/navigation";

const priceOptions = [
  {
    label: "Any Price",
    value: "",
  },
  {
    label: "Under $25",
    value: "under-25",
  },
  {
    label: "Under $50",
    value: "under-50",
  },
  {
    label: "Under $100",
    value: "under-100",
  },
  {
    label: "$100+",
    value: "100-plus",
  },
];

type QuickFilterButtonProps = {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
};

function QuickFilterButton({
  label,
  description,
  active,
  onClick,
}: QuickFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-green-500 bg-green-500/15 shadow-[0_0_25px_rgba(34,197,94,0.12)]"
          : "border-white/10 bg-white/[0.03] hover:border-green-500/50 hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-sm font-black uppercase tracking-wide ${
              active ? "text-green-400" : "text-white"
            }`}
          >
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {description}
          </p>
        </div>

        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
            active
              ? "border-green-500 bg-green-500 text-black"
              : "border-white/20 text-transparent"
          }`}
        >
          ✓
        </span>
      </div>
    </button>
  );
}

export default function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activePrice = searchParams.get("price") ?? "";
  const featuredActive = searchParams.get("featured") === "true";
  const gradedActive = searchParams.get("graded") === "true";

  const hasActiveFilters = Boolean(
    searchParams.get("grade") ||
      searchParams.get("rookie") ||
      searchParams.get("auto") ||
      searchParams.get("price") ||
      searchParams.get("featured") ||
      searchParams.get("graded") ||
      searchParams.get("sort"),
  );

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    // Return to page 1 whenever filters change.
    params.delete("page");

    const queryString = params.toString();

    router.push(queryString ? `/shop?${queryString}` : "/shop");
  }

  function toggleBooleanParam(name: string, active: boolean) {
    updateParam(name, active ? "" : "true");
  }

  function clearFilters() {
    const sport = searchParams.get("sport");

    if (sport) {
      router.push(`/shop?sport=${encodeURIComponent(sport)}`);
      return;
    }

    router.push("/shop");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900 to-black p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Filter Cards
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase">
            Refine Results
          </h2>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="rounded-xl border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide transition enabled:hover:border-green-500 enabled:hover:text-green-400 disabled:cursor-not-allowed disabled:text-neutral-600"
        >
          Clear Filters
        </button>
      </div>

      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">
          Quick Filters
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <QuickFilterButton
            label="Featured Finds"
            description="Show cards selected as featured inventory."
            active={featuredActive}
            onClick={() =>
              toggleBooleanParam("featured", featuredActive)
            }
          />

          <QuickFilterButton
            label="Graded Gems"
            description="Show professionally graded cards only."
            active={gradedActive}
            onClick={() =>
              toggleBooleanParam("graded", gradedActive)
            }
          />
        </div>
      </div>

      <div className="mt-7 border-t border-white/10 pt-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">
          Price
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {priceOptions.map((option) => {
            const isActive = activePrice === option.value;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => updateParam("price", option.value)}
                className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                  isActive
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-white/15 bg-white/5 text-neutral-300 hover:border-green-500 hover:text-green-400"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="shop-grade"
            className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-neutral-400"
          >
            Grade
          </label>

          <select
            id="shop-grade"
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white transition focus:border-green-500 focus:outline-none"
            value={searchParams.get("grade") ?? ""}
            onChange={(event) =>
              updateParam("grade", event.target.value)
            }
          >
            <option value="">All Grades</option>
            <option value="PSA">PSA</option>
            <option value="BGS">BGS</option>
            <option value="SGC">SGC</option>
            <option value="RAW">Raw Cards</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="shop-rookie"
            className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-neutral-400"
          >
            Card Type
          </label>

          <select
            id="shop-rookie"
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white transition focus:border-green-500 focus:outline-none"
            value={searchParams.get("rookie") ?? ""}
            onChange={(event) =>
              updateParam("rookie", event.target.value)
            }
          >
            <option value="">All Cards</option>
            <option value="true">Rookie Cards Only</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="shop-autograph"
            className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-neutral-400"
          >
            Autographs
          </label>

          <select
            id="shop-autograph"
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white transition focus:border-green-500 focus:outline-none"
            value={searchParams.get("auto") ?? ""}
            onChange={(event) =>
              updateParam("auto", event.target.value)
            }
          >
            <option value="">All Cards</option>
            <option value="true">Autographs Only</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="shop-sort"
            className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-neutral-400"
          >
            Sort
          </label>

          <select
            id="shop-sort"
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white transition focus:border-green-500 focus:outline-none"
            value={searchParams.get("sort") ?? ""}
            onChange={(event) =>
              updateParam("sort", event.target.value)
            }
          >
            <option value="">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}