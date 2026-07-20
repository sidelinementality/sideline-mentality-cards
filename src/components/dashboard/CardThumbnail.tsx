import Image from "next/image";

type CardThumbnailProps = {
  player_name: string;
  image_url: string | null;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  stock: number | null;
  grade_company: string | null;
  grade: string | null;
  rookie_card: boolean | null;
  featured: boolean | null;
  autograph: boolean | null;
  serial_number: string | null;
  slug: string;
};

function formatCurrency(value: number | string | null) {
  const numberValue =
    typeof value === "string" ? Number.parseFloat(value) : value;

  if (numberValue === null || Number.isNaN(numberValue)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numberValue);
}

export default function CardThumbnail({
  player_name,
  image_url,
  sport,
  year,
  brand,
  price,
  stock,
  grade_company,
  grade,
  rookie_card,
  featured,
  autograph,
  serial_number,
  slug,
}: CardThumbnailProps) {
  const stockAmount = stock ?? 0;
  const isLowStock = stockAmount > 0 && stockAmount <= 2;
  const isOutOfStock = stockAmount <= 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-2xl">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
        {featured && (
          <div className="absolute left-0 top-4 z-10 rounded-r-full bg-emerald-500 px-4 py-1 text-xs font-black uppercase tracking-wider text-black shadow-lg">
            Featured
          </div>
        )}

        {image_url ? (
          <Image
            src={image_url}
            alt={player_name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No Image
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-white">
              {player_name}
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              {[year, brand, sport].filter(Boolean).join(" • ")}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              isOutOfStock
                ? "bg-red-500/15 text-red-300"
                : isLowStock
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-zinc-800 text-zinc-300"
            }`}
          >
            {isOutOfStock ? "Out" : `Stock: ${stockAmount}`}
          </span>
        </div>

        <div className="mt-4 flex min-h-7 flex-wrap gap-2">
          {grade_company && grade && (
            <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
              {grade_company} {grade}
            </span>
          )}

          {rookie_card && (
            <span className="inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
              RC
            </span>
          )}

          {autograph && (
            <span className="inline-flex rounded-full bg-sky-500/15 px-3 py-1 text-xs font-bold text-sky-300">
              AUTO
            </span>
          )}

          {serial_number && (
            <span className="inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-300">
              {serial_number}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Asking Price
            </p>

            <p className="mt-1 text-xl font-black text-emerald-400">
              {formatCurrency(price)}
            </p>
          </div>

          <span className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300 transition group-hover:bg-emerald-500 group-hover:text-black">
  View Card
</span>
        </div>
      </div>
    </article>
  );
}