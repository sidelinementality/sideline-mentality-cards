import Image from "next/image";
import Link from "next/link";
import ShopSearch from "@/components/shop/ShopSearch";
import { supabase } from "@/lib/supabase";

type HeroCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string;
  featured: boolean | null;
  created_at: string | null;
};

const quickLinks = [
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Baseball", href: "/shop?sport=Baseball" },
  { label: "Football", href: "/shop?sport=Football" },
  { label: "Basketball", href: "/shop?sport=Basketball" },
  { label: "More Sports", href: "/shop" },
];

const cardPositions = [
  "left-[2%] top-[18%] z-10 w-[36%] -rotate-6 hover:-translate-y-2 hover:-rotate-3",
  "left-[31%] top-[3%] z-30 w-[42%] rotate-1 hover:-translate-y-3 hover:rotate-0",
  "right-[0%] top-[20%] z-20 w-[34%] rotate-7 hover:-translate-y-2 hover:rotate-4",
];


async function getHeroData() {
  const selectFields = `
    id,
    slug,
    player_name,
    sport,
    team,
    year,
    brand,
    price,
    image_url,
    featured,
    created_at
  `;

  const [{ data: candidateData, error: candidateError }, { count, error: countError }] =
    await Promise.all([
      supabase
        .from("cards")
        .select(selectFields)
        .eq("website_ready", true)
        .eq("listing_status", "Published")
        .gt("stock", 0)
        .not("image_url", "is", null)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("cards")
        .select("id", { count: "exact", head: true })
        .eq("website_ready", true)
        .eq("listing_status", "Published")
        .gt("stock", 0),
    ]);

  if (candidateError) {
    console.error("Hero card candidates error:", candidateError);
  }

  if (countError) {
    console.error("Hero inventory count error:", countError);
  }

  const candidates = (candidateData ?? []) as HeroCard[];
  const leadCard = candidates.find((card) => card.featured) ?? candidates[0] ?? null;

  if (!leadCard) {
    return { heroCards: [], inventoryCount: count ?? 0 };
  }

  const selected: HeroCard[] = [leadCard];

  const addBestRemainingCard = () => {
    const selectedIds = new Set(selected.map((card) => card.id));
    const selectedSports = new Set(selected.map((card) => card.sport).filter(Boolean));
    const selectedTeams = new Set(selected.map((card) => card.team).filter(Boolean));

    const remaining = candidates.filter((card) => !selectedIds.has(card.id));

    const nextCard =
      remaining.find((card) => card.sport && !selectedSports.has(card.sport)) ??
      remaining.find((card) => card.team && !selectedTeams.has(card.team)) ??
      remaining[0];

    if (nextCard) selected.push(nextCard);
  };

  addBestRemainingCard();
  addBestRemainingCard();

  // Keep the strongest featured card in the center position of the visual stack.
  const heroCards =
    selected.length >= 3
      ? [selected[1], selected[0], selected[2]]
      : selected.length === 2
        ? [selected[1], selected[0]]
        : selected;

  return {
    heroCards,
    inventoryCount: count ?? 0,
  };
}
export default async function Hero() {
  const { heroCards, inventoryCount } = await getHeroData();
  const leadCard = heroCards[1] ?? heroCards[0] ?? null;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(34,197,94,0.16),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(34,197,94,0.08),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-7 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-0 lg:pt-16">
        <div className="grid items-center gap-10 lg:min-h-[570px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:min-h-[610px] xl:gap-16">
          <div className="relative z-30 pb-2 lg:pb-16">
            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.24em] text-green-400 sm:text-xs">
              <span className="h-px w-10 bg-green-500" />
              The Hunt Starts Here
            </div>

            <h1 className="mt-5 max-w-3xl text-[3.35rem] font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[5.75rem]">
              Find Your
              <span className="mt-1 block text-green-400 drop-shadow-[0_0_28px_rgba(34,197,94,0.2)]">
                Next Card.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg sm:leading-8">
              Rookies, refractors, parallels, stars and legends. Fresh inventory
              for collectors who still love the hunt.
            </p>

            <div className="mt-7 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-green-400 sm:text-xs">
                  Search The Shop
                </p>
                <p className="hidden text-xs font-semibold text-neutral-500 sm:block">
                  Player · Team · Brand · Grade
                </p>
              </div>

              <ShopSearch />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/shop"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-black uppercase tracking-wide text-black shadow-lg shadow-green-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-green-500/30"
              >
                Shop All Cards
                <span className="transition group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                href="/shop?sort=newest"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-green-500/60 hover:bg-green-500/10 hover:text-green-400"
              >
                New Arrivals
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 sm:text-sm">
              <span className="text-neutral-300">
                <span className="text-green-400">{inventoryCount}</span> cards live
              </span>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <span>Secure checkout</span>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <span>Collector owned</span>
            </div>
          </div>

          <div className="relative mx-auto h-[420px] w-full max-w-[680px] sm:h-[500px] lg:h-[545px] lg:max-w-none">
            <div
              className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl"
              aria-hidden="true"
            />

            {heroCards.length > 0 ? (
              <>
                <div className="absolute left-1/2 top-[8%] z-0 h-[78%] w-[74%] -translate-x-1/2 rounded-[2.25rem] border border-white/[0.06] bg-gradient-to-b from-white/[0.045] to-white/[0.015] shadow-[0_40px_110px_rgba(0,0,0,0.5)] backdrop-blur-sm" />

                {heroCards.map((card, index) => (
                  <Link
                    key={card.id}
                    href={`/cards/${card.slug}`}
                    className={`group absolute block transition duration-300 ease-out ${cardPositions[index]}`}
                    aria-label={`View ${card.player_name}`}
                  >
                    <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-xl border border-white/15 bg-neutral-950 p-2 shadow-[0_24px_55px_rgba(0,0,0,0.6)] sm:rounded-2xl sm:p-2.5">
                      <div className="relative h-full w-full overflow-hidden rounded-lg bg-black sm:rounded-xl">
                        <Image
                          src={card.image_url}
                          alt={`${card.player_name} sports card`}
                          fill
                          priority={index === 1}
                          sizes="(max-width: 640px) 38vw, (max-width: 1024px) 30vw, 18vw"
                          className="object-contain transition duration-500 group-hover:scale-[1.035]"
                        />
                      </div>

                      <div
                        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/[0.055] to-green-400/[0.08] opacity-70 sm:rounded-2xl"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}

                {leadCard ? (
                  <Link
                    href={`/cards/${leadCard.slug}`}
                    className="absolute bottom-[5%] right-[3%] z-40 max-w-[78%] rounded-2xl border border-white/10 bg-black/90 px-4 py-3 shadow-2xl backdrop-blur-md transition hover:border-green-500/40 sm:max-w-[66%] sm:px-5 sm:py-4"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400 sm:text-xs">
                      Featured Pick
                    </p>
                    <div className="mt-1 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black uppercase text-white sm:text-base">
                          {leadCard.player_name}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-neutral-400 sm:text-sm">
                          {[leadCard.year, leadCard.brand].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <p className="shrink-0 text-[10px] font-black uppercase tracking-[0.16em] text-green-400 sm:text-xs">
                        View Card →
                      </p>
                    </div>
                  </Link>
                ) : null}
              </>
            ) : (
              <div className="group absolute inset-x-0 top-[8%] mx-auto w-[92%] overflow-hidden rounded-[2rem] border border-green-500/25 bg-neutral-950 shadow-[0_35px_100px_rgba(0,0,0,0.65)]">
                <Image
                  src="/sideline-mentality-cards-hero.png"
                  alt="Sideline Mentality Cards sports card marketplace"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-40 border-t border-white/10 bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-5 sm:px-6 lg:px-8">
          <div className="mr-5 hidden shrink-0 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-neutral-500 md:block">
            Shop The Hobby
          </div>

          <nav className="flex min-w-max items-center" aria-label="Card categories">
            {quickLinks.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-2 px-4 py-4 text-xs font-black uppercase tracking-[0.14em] text-neutral-300 transition hover:bg-white/[0.035] hover:text-green-400 sm:px-5 sm:text-sm ${
                  index > 0 ? "border-l border-white/10" : ""
                }`}
              >
                {item.label}
                <span
                  className="text-green-500 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}