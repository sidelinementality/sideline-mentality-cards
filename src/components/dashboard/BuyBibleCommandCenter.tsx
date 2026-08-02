import Link from "next/link";

type BuyBibleCommandTarget = {
  id: string;
  playerName: string;
  sport: string;
  priority: number;
  buyScore: number | null;
  currentQuantity: number;
  targetQuantity: number;
  status: string;
};

type BuyBibleCommandCenterProps = {
  targets: BuyBibleCommandTarget[];
};

export default function BuyBibleCommandCenter({
  targets,
}: BuyBibleCommandCenterProps) {
  const activeTargets = targets
    .filter((target) => target.status === "Buy")
    .map((target) => ({
      ...target,
      remaining: Math.max(
        target.targetQuantity - target.currentQuantity,
        0,
      ),
    }))
    .filter((target) => target.remaining > 0)
    .sort((firstTarget, secondTarget) => {
      if (secondTarget.priority !== firstTarget.priority) {
        return secondTarget.priority - firstTarget.priority;
      }

      return (
        Number(secondTarget.buyScore ?? 0) -
        Number(firstTarget.buyScore ?? 0)
      );
    })
    .slice(0, 5);

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/[0.08] via-white/[0.04] to-white/[0.02]">
      <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-green-400">
            Dealer Intelligence
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Buy Bible Command Center
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Your highest-priority active buying targets, ranked by
            priority and Buy Score.
          </p>
        </div>

        <Link
          href="/dashboard/buy-bible"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500"
        >
          Open Full Buy Bible →
        </Link>
      </div>

      {activeTargets.length === 0 ? (
        <div className="px-6 py-10 text-center sm:px-8">
          <h3 className="text-xl font-black text-white">
            No active buying needs
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Your current Buy targets have reached their inventory goals,
            or no targets are marked Buy.
          </p>
        </div>
      ) : (
        <div className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-5">
          {activeTargets.map((target) => (
            <Link
              key={target.id}
              href={`/dashboard/buy-bible/${target.id}`}
              className="group bg-zinc-950 px-5 py-6 transition hover:bg-green-500/[0.08]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">
                    {target.sport}
                  </p>

                  <h3 className="mt-2 text-lg font-black leading-tight text-white transition group-hover:text-green-300">
                    {target.playerName}
                  </h3>
                </div>

                <div className="rounded-xl border border-green-500/25 bg-green-500/10 px-3 py-2 text-center">
                  <p className="text-[9px] font-black uppercase tracking-wide text-green-400">
                    Score
                  </p>

                  <p className="mt-1 text-xl font-black text-white">
                    {target.buyScore ?? "—"}
                  </p>
                </div>
              </div>

              <div
                aria-label={`Priority ${target.priority} out of 5`}
                className="mt-5 flex gap-0.5 text-sm"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={
                      index < target.priority
                        ? "text-amber-400"
                        : "text-zinc-700"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Still Needed
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {target.remaining}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {target.currentQuantity} owned of{" "}
                  {target.targetQuantity} target
                </p>
              </div>

              <p className="mt-5 text-sm font-black text-green-400 transition group-hover:text-green-300">
                View Target →
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}