import Link from "next/link";
import BuyTargetCard from "@/components/dashboard/buy-bible/BuyTargetCard";
import {
  createInventoryQuantityMap,
  getOwnedQuantity,
} from "@/lib/buy-bible-inventory";
import { supabaseAdmin } from "@/lib/supabase-admin";

type BuyBibleTarget = {
  id: string;
  player_name: string;
  sport: string;
  player_category: string;
  priority_level: number;
  market_heat: string;
  target_status: string;
  target_quantity: number;
  current_quantity: number;
  preferred_products: string[];
  preferred_card_types: string[];
  max_buy_raw: number | string | null;
  max_buy_graded: number | string | null;
  max_buy_auto: number | string | null;
  max_buy_parallel: number | string | null;
  target_margin_percent: number | string;
  estimated_market_value: number | string | null;
  overall_buy_score: number | null;
  team_or_brand: string | null;
  rookie_year: number | null;
  buying_notes: string | null;
  is_active: boolean;
};

export default async function BuyBiblePage() {
  const { data, error } = await supabaseAdmin
    .from("buy_bible_targets")
    .select(`
      id,
      player_name,
      sport,
      player_category,
      priority_level,
      market_heat,
      target_status,
      target_quantity,
      current_quantity,
      preferred_products,
      preferred_card_types,
      max_buy_raw,
      max_buy_graded,
      max_buy_auto,
      max_buy_parallel,
      target_margin_percent,
      estimated_market_value,
      overall_buy_score,
      team_or_brand,
      rookie_year,
      buying_notes,
      is_active
    `)
    .eq("is_active", true)
    .order("priority_level", { ascending: false })
    .order("overall_buy_score", {
      ascending: false,
      nullsFirst: false,
    })
    .order("player_name", { ascending: true });

  if (error) {
    console.error("Buy Bible loading error:", error);
  }

  const targets = (data ?? []) as BuyBibleTarget[];

  const { data: inventoryCards, error: inventoryError } =
  await supabaseAdmin
    .from("cards")
    .select("player_name, stock")
    .gt("stock", 0);

if (inventoryError) {
  console.error(
    "Buy Bible inventory matching error:",
    inventoryError,
  );
}

const inventoryQuantityMap = createInventoryQuantityMap(
  inventoryCards ?? [],
);

  const totalTargets = targets.length;

  const buyTargets = targets.filter(
    (target) => target.target_status === "Buy",
  );

  const highPriorityTargets = targets.filter(
    (target) => target.priority_level >= 4,
  );

  const totalTargetQuantity = targets.reduce(
    (total, target) =>
      total + Number(target.target_quantity ?? 0),
    0,
  );

  const totalCurrentQuantity = targets.reduce(
    (total, target) =>
      total +
      getOwnedQuantity(
        target.player_name,
        inventoryQuantityMap,
      ),
    0,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
            Dealer OS
          </p>

          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Master Buy Bible
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Track the players, products, prices, and priorities that guide
            disciplined inventory buying.
          </p>
        </div>

        <Link
          href="/dashboard/buy-bible/new"
          className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-black text-white transition hover:bg-green-500"
        >
          + Add Buy Target
        </Link>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Targets"
          value={totalTargets}
          description="Players and characters being tracked"
        />

        <StatCard
          label="Buy Now"
          value={buyTargets.length}
          description="Targets currently marked Buy"
        />

        <StatCard
          label="High Priority"
          value={highPriorityTargets.length}
          description="Targets rated priority 4 or 5"
        />

        <StatCard
          label="Inventory Goal"
          value={`${totalCurrentQuantity}/${totalTargetQuantity}`}
          description="Current copies versus target quantity"
        />
      </section>

      {error ? (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-300">
            Buy Bible targets could not be loaded.
          </p>
        </section>
      ) : targets.length === 0 ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-green-400">
            Build Your Strategy
          </p>

          <h2 className="mt-4 text-2xl font-black text-white">
            No Buy Bible targets yet
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Add the first player or character you want to actively target,
            along with preferred products and maximum buy prices.
          </p>

          <Link
            href="/dashboard/buy-bible/new"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 font-black text-white transition hover:bg-green-500"
          >
            Add First Target
          </Link>
        </section>
      ) : (
        <section>
  <div className="mb-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
        Active Targets
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        Buy Opportunities
      </h2>
    </div>

    <p className="text-sm text-zinc-500">
      {targets.length} active players
    </p>
  </div>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {targets.map((target) => (
      <BuyTargetCard
        key={target.id}
        id={target.id}
        playerName={target.player_name}
        sport={target.sport}
        category={target.player_category}
        priority={target.priority_level}
        buyScore={target.overall_buy_score}
        currentQuantity={getOwnedQuantity(
            target.player_name,
            inventoryQuantityMap,
          )}
        targetQuantity={Number(target.target_quantity)}
        status={target.target_status}
      />
    ))}
  </div>
</section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold text-zinc-400">{label}</p>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>

      <p className="mt-2 text-xs leading-5 text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
      {children}
    </th>
  );
}

function PriorityStars({ priority }: { priority: number }) {
  return (
    <div
      aria-label={`Priority ${priority} out of 5`}
      className="whitespace-nowrap text-sm tracking-wider"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={
            index < priority
              ? "text-amber-400"
              : "text-zinc-700"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300">
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes = {
    Buy: "border-green-500/30 bg-green-500/10 text-green-300",
    Watch: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    Hold: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    Pass: "border-red-500/30 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${
        classes[status as keyof typeof classes] ??
        "border-zinc-500/30 bg-zinc-500/10 text-zinc-300"
      }`}
    >
      {status}
    </span>
  );
}

function HeatBadge({ heat }: { heat: string }) {
  const classes = {
    Hot: "text-red-400",
    Rising: "text-green-400",
    Watch: "text-amber-400",
    Stable: "text-blue-400",
    Cooling: "text-zinc-500",
  };

  return (
    <span
      className={`text-sm font-black ${
        classes[heat as keyof typeof classes] ?? "text-zinc-400"
      }`}
    >
      {heat}
    </span>
  );
}

function PriceLine({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-zinc-500">{label}</span>

      <span className="font-bold text-white">
        {value === null ? "—" : formatCurrency(Number(value))}
      </span>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(value) ? value : 0);
}