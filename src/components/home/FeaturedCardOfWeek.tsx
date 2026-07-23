import Link from "next/link";
import { supabase } from "@/lib/supabase";

type FeaturedCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | string | null;
  brand: string | null;
  set_name: string | null;
  card_number: string | null;
  price: number | string | null;
  image_url: string | null;
  stock: number | null;
  rookie_card: boolean | null;
  autograph: boolean | null;
  serial_number: string | null;
  grade_company: string | null;
  grade: string | null;
};

function formatCurrency(value: number | string | null) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default async function FeaturedCardOfWeek() {
  const { data, error } = await supabase
    .from("cards")
    .select(
      `
        id,
        slug,
        player_name,
        sport,
        team,
        year,
        brand,
        set_name,
        card_number,
        price,
        image_url,
        stock,
        rookie_card,
        autograph,
        serial_number,
        grade_company,
        grade
      `,
    )
    .eq("featured", true)
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Featured Card of the Week error:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const card = data as FeaturedCard;
  const stock = Number(card.stock ?? 0);

  const cardDescription = [
    card.year,
    card.brand,
    card.set_name,
  ]
    .filter(Boolean)
    .join(" • ");

  const gradeLabel =
    card.grade_company && card.grade
      ? `${card.grade_company} ${card.grade}`
      : card.grade_company;

  return (
    <section className="relative overflow-hidden bg-neutral-950 px-6 py-20 text-white sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-green-400">
            Collector Spotlight
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Featured Card of the Week
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">
            One standout card selected from the Sideline Mentality Cards
            inventory.
          </p>
        </div>

        <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-2xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <Link
              href={`/cards/${card.slug}`}
              className="group relative flex min-h-[440px] items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-black to-neutral-950 p-8 sm:min-h-[560px] sm:p-12"
            >
              <div className="absolute left-6 top-6 z-20 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-black shadow-lg">
                  Featured
                </span>

                {card.rookie_card && (
                  <span className="rounded-full bg-blue-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                    Rookie
                  </span>
                )}

                {card.autograph && (
                  <span className="rounded-full bg-purple-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                    Autograph
                  </span>
                )}

                {gradeLabel && (
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-black shadow-lg">
                    {gradeLabel}
                  </span>
                )}
              </div>

              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={`${card.player_name} featured sports card`}
                  className="relative z-10 max-h-[480px] w-full object-contain drop-shadow-2xl transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="relative z-10 flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                  <span className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                    Card Image Coming Soon
                  </span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
            </Link>

            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
                  {card.sport || "Sports Card"}
                </p>

                {stock <= 3 && (
                  <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-300">
                    Only {stock} Left
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
                {card.player_name}
              </h3>

              {card.team && (
                <p className="mt-3 text-xl font-bold text-neutral-300">
                  {card.team}
                </p>
              )}

              {cardDescription && (
                <p className="mt-5 text-lg leading-8 text-neutral-400">
                  {cardDescription}
                </p>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {card.card_number && (
                  <Detail label="Card Number" value={card.card_number} />
                )}

                {card.serial_number && (
                  <Detail label="Serial Number" value={card.serial_number} />
                )}

                {gradeLabel && (
                  <Detail label="Grade" value={gradeLabel} />
                )}

                <Detail
                  label="Availability"
                  value={stock === 1 ? "Last One Available" : `${stock} Available`}
                />
              </div>

              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-500">
                  Price
                </p>

                <p className="mt-2 text-4xl font-black text-white">
                  {formatCurrency(card.price)}
                </p>
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`/cards/${card.slug}`}
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-green-500 px-8 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-green-400"
                >
                  View Featured Card
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:border-green-400 hover:text-green-400"
                >
                  Shop All Cards
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function Detail({ label, value }: DetailProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </p>

      <p className="mt-2 font-bold text-white">{value}</p>
    </div>
  );
}