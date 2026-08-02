import Link from "next/link";

type BuyTargetCardProps = {
  id: string;
  playerName: string;
  sport: string;
  category: string;
  priority: number;
  buyScore: number | null;
  currentQuantity: number;
  targetQuantity: number;
  status: string;
};

export default function BuyTargetCard({
  id,
  playerName,
  sport,
  category,
  priority,
  buyScore,
  currentQuantity,
  targetQuantity,
  status,
}: BuyTargetCardProps) {
  const remaining = Math.max(
    targetQuantity - currentQuantity,
    0,
  );

  const progress =
    targetQuantity === 0
      ? 100
      : Math.min(
          (currentQuantity / targetQuantity) * 100,
          100,
        );

  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
            {sport}
          </p>

          <h3 className="mt-2 text-2xl font-black text-white">
            {playerName}
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            {category}
          </p>
        </div>

        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-green-400">
            Buy Score
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {buyScore ?? "--"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-1 text-lg">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={
              index < priority
                ? "text-yellow-400"
                : "text-zinc-700"
            }
          >
            ★
          </span>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-zinc-400">
            Inventory Progress
          </span>

          <span className="font-bold text-white">
            {currentQuantity}/{targetQuantity}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-2 text-sm text-zinc-400">
          Need{" "}
          <span className="font-bold text-white">
            {remaining}
          </span>{" "}
          more card{remaining === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            status === "Buy"
              ? "bg-green-500/10 text-green-300"
              : status === "Watch"
              ? "bg-yellow-500/10 text-yellow-300"
              : "bg-zinc-700 text-zinc-300"
          }`}
        >
          {status}
        </span>

        <Link
          href={`/dashboard/buy-bible/${id}`}
          className="font-bold text-green-400 transition hover:text-green-300"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}