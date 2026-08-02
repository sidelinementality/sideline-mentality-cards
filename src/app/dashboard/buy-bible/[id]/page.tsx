import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

type BuyBibleProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

  preferred_products: string[] | null;
  preferred_card_types: string[] | null;

  max_buy_raw: number | string | null;
  max_buy_graded: number | string | null;
  max_buy_auto: number | string | null;
  max_buy_parallel: number | string | null;

  target_margin_percent: number | string;
  estimated_market_value: number | string | null;

  demand_score: number | null;
  liquidity_score: number | null;
  upside_score: number | null;
  stability_score: number | null;
  risk_score: number | null;
  overall_buy_score: number | null;

  rookie_year: number | null;
  team_or_brand: string | null;

  research_url: string | null;
  secondary_research_url: string | null;

  buying_notes: string | null;
  cards_to_avoid: string | null;
  internal_notes: string | null;

  created_at: string;
  updated_at: string;
};

export default async function BuyBibleProfilePage({
  params,
}: BuyBibleProfilePageProps) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("buy_bible_targets")
    .select(
      `
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
        demand_score,
        liquidity_score,
        upside_score,
        stability_score,
        risk_score,
        overall_buy_score,
        rookie_year,
        team_or_brand,
        research_url,
        secondary_research_url,
        buying_notes,
        cards_to_avoid,
        internal_notes,
        created_at,
        updated_at
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Buy Bible profile loading error:", error);
  }

  if (!data) {
    notFound();
  }

  const target = data as BuyBibleTarget;

  const currentQuantity = Number(target.current_quantity ?? 0);
  const targetQuantity = Number(target.target_quantity ?? 0);

  const remainingQuantity = Math.max(
    targetQuantity - currentQuantity,
    0,
  );

  const inventoryProgress =
    targetQuantity <= 0
      ? 100
      : Math.min(
          (currentQuantity / targetQuantity) * 100,
          100,
        );

  const preferredProducts =
    target.preferred_products ?? [];

  const preferredCardTypes =
    target.preferred_card_types ?? [];

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <Link
          href="/dashboard/buy-bible"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-green-400"
        >
          ← Back to Buy Bible
        </Link>
      </section>

      <section className="relative mb-8 overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-white/[0.05] to-white/[0.02] p-6 sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-green-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={target.target_status} />

              <HeatBadge heat={target.market_heat} />

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300">
                {target.player_category}
              </span>
            </div>

            <p className="mt-7 text-sm font-black uppercase tracking-[0.25em] text-green-400">
              {target.sport}
            </p>

            <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              {target.player_name}
            </h1>

            <p className="mt-4 text-lg text-zinc-400">
              {[target.team_or_brand, target.rookie_year]
                .filter(Boolean)
                .join(" • ")}
            </p>

            <div className="mt-6">
              <PriorityStars
                priority={target.priority_level}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[440px]">
            <HeroMetric
              label="Buy Score"
              value={
                target.overall_buy_score === null
                  ? "—"
                  : target.overall_buy_score
              }
              accent
            />

            <HeroMetric
              label="Currently Owned"
              value={currentQuantity}
            />

            <HeroMetric
              label="Still Needed"
              value={remainingQuantity}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
                Inventory Goal
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Target Progress
              </h2>
            </div>

            <p className="text-2xl font-black text-white">
              {currentQuantity} / {targetQuantity}
            </p>
          </div>

          <div className="mt-7 h-4 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{
                width: `${inventoryProgress}%`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-zinc-400">
              {remainingQuantity === 0
                ? "Inventory target reached"
                : `${remainingQuantity} more ${
                    remainingQuantity === 1
                      ? "card"
                      : "cards"
                  } needed`}
            </p>

            <p className="font-black text-green-400">
              {inventoryProgress.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
            Buying Strategy
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Target Margin
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <SmallMetric
              label="Market Estimate"
              value={formatOptionalMoney(
                target.estimated_market_value,
              )}
            />

            <SmallMetric
              label="Target Margin"
              value={`${Number(
                target.target_margin_percent ?? 0,
              ).toFixed(0)}%`}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <ProfilePanel
          eyebrow="Target Products"
          title="Preferred Products"
        >
          {preferredProducts.length === 0 ? (
            <EmptyMessage text="No preferred products have been added." />
          ) : (
            <TagList items={preferredProducts} />
          )}
        </ProfilePanel>

        <ProfilePanel
          eyebrow="Card Strategy"
          title="Preferred Card Types"
        >
          {preferredCardTypes.length === 0 ? (
            <EmptyMessage text="No preferred card types have been added." />
          ) : (
            <TagList items={preferredCardTypes} />
          )}
        </ProfilePanel>
      </section>

      <section className="mb-8">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
            Buying Limits
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Maximum Buy Prices
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PriceCard
            label="Raw"
            value={target.max_buy_raw}
          />

          <PriceCard
            label="Graded"
            value={target.max_buy_graded}
          />

          <PriceCard
            label="Autograph"
            value={target.max_buy_auto}
          />

          <PriceCard
            label="Parallel"
            value={target.max_buy_parallel}
          />
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
            Player Evaluation
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Buy Score Breakdown
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <ScoreCard
            label="Demand"
            value={target.demand_score}
          />

          <ScoreCard
            label="Liquidity"
            value={target.liquidity_score}
          />

          <ScoreCard
            label="Upside"
            value={target.upside_score}
          />

          <ScoreCard
            label="Stability"
            value={target.stability_score}
          />

          <ScoreCard
            label="Risk"
            value={target.risk_score}
            risk
          />
        </div>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <ProfilePanel
          eyebrow="Dealer Notes"
          title="Buying Notes"
        >
          <ParagraphContent
            text={target.buying_notes}
            emptyText="No buying notes have been added."
          />
        </ProfilePanel>

        <ProfilePanel
          eyebrow="Risk Control"
          title="Cards to Avoid"
        >
          <ParagraphContent
            text={target.cards_to_avoid}
            emptyText="No cards-to-avoid notes have been added."
          />
        </ProfilePanel>
      </section>

      <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
              Market Research
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Research This Target
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Review recent comparable sales before setting or
              changing maximum buy prices.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {target.research_url ? (
              <a
                href={target.research_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500"
              >
                Open Primary Research ↗
              </a>
            ) : null}

            {target.secondary_research_url ? (
              <a
                href={target.secondary_research_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:border-green-500 hover:text-green-400"
              >
                Open Secondary Research ↗
              </a>
            ) : null}

            <Link
              href={`/dashboard/buy-bible/${target.id}/edit`}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:border-green-500 hover:text-green-400"
            >
              Edit Target
            </Link>
          </div>
        </div>
      </section>

      {target.internal_notes ? (
        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
            Internal Notes
          </p>

          <p className="mt-3 whitespace-pre-wrap leading-7 text-amber-100/80">
            {target.internal_notes}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function HeroMetric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 text-center ${
        accent
          ? "border-green-500/30 bg-green-500/10"
          : "border-white/10 bg-black/20"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.16em] ${
          accent ? "text-green-400" : "text-zinc-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

function ProfilePanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black text-white">
        {title}
      </h2>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-green-500/25 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function PriceCard({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold text-zinc-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {formatOptionalMoney(value)}
      </p>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  risk = false,
}: {
  label: string;
  value: number | null;
  risk?: boolean;
}) {
  const normalizedValue =
    value === null ? 0 : Math.min(Math.max(value, 0), 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-zinc-300">
          {label}
        </p>

        <p
          className={`text-xl font-black ${
            risk ? "text-amber-400" : "text-green-400"
          }`}
        >
          {value ?? "—"}
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${
            risk ? "bg-amber-500" : "bg-green-500"
          }`}
          style={{
            width: `${normalizedValue}%`,
          }}
        />
      </div>
    </div>
  );
}

function PriorityStars({
  priority,
}: {
  priority: number;
}) {
  return (
    <div
      aria-label={`Priority ${priority} out of 5`}
      className="flex items-center gap-1 text-2xl"
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

function StatusBadge({ status }: { status: string }) {
  const classes = {
    Buy: "border-green-500/30 bg-green-500/10 text-green-300",
    Watch:
      "border-amber-500/30 bg-amber-500/10 text-amber-300",
    Hold: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    Pass: "border-red-500/30 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
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
    Hot: "border-red-500/30 bg-red-500/10 text-red-300",
    Rising:
      "border-green-500/30 bg-green-500/10 text-green-300",
    Watch:
      "border-amber-500/30 bg-amber-500/10 text-amber-300",
    Stable:
      "border-blue-500/30 bg-blue-500/10 text-blue-300",
    Cooling:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
        classes[heat as keyof typeof classes] ??
        "border-zinc-500/30 bg-zinc-500/10 text-zinc-300"
      }`}
    >
      {heat}
    </span>
  );
}

function ParagraphContent({
  text,
  emptyText,
}: {
  text: string | null;
  emptyText: string;
}) {
  if (!text) {
    return <EmptyMessage text={emptyText} />;
  }

  return (
    <p className="whitespace-pre-wrap leading-7 text-zinc-300">
      {text}
    </p>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <p className="text-sm italic text-zinc-500">
      {text}
    </p>
  );
}

function formatOptionalMoney(
  value: number | string | null,
) {
  if (value === null) {
    return "Not set";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}