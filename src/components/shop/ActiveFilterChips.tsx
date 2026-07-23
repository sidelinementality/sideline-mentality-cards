import Link from "next/link";

type ActiveFilterChipsProps = {
  sport?: string;
  grade?: string;
  rookie?: string;
  auto?: string;
  price?: string;
  featured?: string;
  graded?: string;
  sort?: string;
};

type FilterKey =
  | "sport"
  | "grade"
  | "rookie"
  | "auto"
  | "price"
  | "featured"
  | "graded"
  | "sort";

type ActiveFilter = {
  key: FilterKey;
  label: string;
};

function getPriceLabel(price?: string) {
  if (price === "under-25") {
    return "Under $25";
  }

  if (price === "under-50") {
    return "Under $50";
  }

  if (price === "under-100") {
    return "Under $100";
  }

  if (price === "100-plus") {
    return "$100+";
  }

  return null;
}

function getSortLabel(sort?: string) {
  if (sort === "price-low") {
    return "Price: Low to High";
  }

  if (sort === "price-high") {
    return "Price: High to Low";
  }

  return null;
}

export default function ActiveFilterChips({
  sport,
  grade,
  rookie,
  auto,
  price,
  featured,
  graded,
  sort,
}: ActiveFilterChipsProps) {
  const filters: ActiveFilter[] = [];

  if (sport) {
    filters.push({
      key: "sport",
      label: sport,
    });
  }

  if (grade) {
    filters.push({
      key: "grade",
      label: grade === "RAW" ? "Raw Cards" : grade,
    });
  }

  if (rookie === "true") {
    filters.push({
      key: "rookie",
      label: "Rookie Cards",
    });
  }

  if (auto === "true") {
    filters.push({
      key: "auto",
      label: "Autographs",
    });
  }

  const priceLabel = getPriceLabel(price);

  if (priceLabel) {
    filters.push({
      key: "price",
      label: priceLabel,
    });
  }

  if (featured === "true") {
    filters.push({
      key: "featured",
      label: "Featured Finds",
    });
  }

  if (graded === "true") {
    filters.push({
      key: "graded",
      label: "Graded Cards",
    });
  }

  const sortLabel = getSortLabel(sort);

  if (sortLabel) {
    filters.push({
      key: "sort",
      label: sortLabel,
    });
  }

  if (filters.length === 0) {
    return null;
  }

  function createRemoveFilterUrl(filterKey: FilterKey) {
    const params = new URLSearchParams();

    if (sport && filterKey !== "sport") {
      params.set("sport", sport);
    }

    if (grade && filterKey !== "grade") {
      params.set("grade", grade);
    }

    if (rookie && filterKey !== "rookie") {
      params.set("rookie", rookie);
    }

    if (auto && filterKey !== "auto") {
      params.set("auto", auto);
    }

    if (price && filterKey !== "price") {
      params.set("price", price);
    }

    if (featured && filterKey !== "featured") {
      params.set("featured", featured);
    }

    if (graded && filterKey !== "graded") {
      params.set("graded", graded);
    }

    if (sort && filterKey !== "sort") {
      params.set("sort", sort);
    }

    const queryString = params.toString();

    return queryString ? `/shop?${queryString}` : "/shop";
  }

  return (
    <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/[0.06] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
            Active Filters
          </p>

          <p className="mt-1 text-sm font-semibold text-neutral-400">
            Select a filter below to remove it.
          </p>
        </div>

        <Link
          href="/shop"
          className="shrink-0 text-sm font-black uppercase tracking-wide text-neutral-400 transition hover:text-white"
        >
          Clear All
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.key}
            href={createRemoveFilterUrl(filter.key)}
            aria-label={`Remove ${filter.label} filter`}
            className="group inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-black text-green-300 transition hover:border-green-400 hover:bg-green-500 hover:text-black"
          >
            <span>{filter.label}</span>

            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-xs transition group-hover:bg-black/15"
            >
              ×
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}