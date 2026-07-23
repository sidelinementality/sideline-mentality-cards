import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type CurrentCard = {
  id: string;
  playerName: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  setName: string | null;
  price: number | string | null;
};

type RelatedCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  set_name: string | null;
  price: number | string | null;
  image_url: string | null;
  stock: number | null;
};

type RelatedCardsProps = {
  currentCard: CurrentCard;
};

type ScoredCard = RelatedCard & {
  recommendationScore: number;
  recommendationReason: string;
};

function normalize(value: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function getCardScore(
  candidate: RelatedCard,
  currentCard: CurrentCard,
) {
  let score = 0;
  let reason = "Similar card";

  const samePlayer =
    normalize(candidate.player_name) ===
    normalize(currentCard.playerName);

  const sameSet =
    Boolean(candidate.set_name) &&
    normalize(candidate.set_name) ===
      normalize(currentCard.setName);

  const sameBrand =
    Boolean(candidate.brand) &&
    normalize(candidate.brand) ===
      normalize(currentCard.brand);

  const sameSport =
    Boolean(candidate.sport) &&
    normalize(candidate.sport) ===
      normalize(currentCard.sport);

  const sameTeam =
    Boolean(candidate.team) &&
    normalize(candidate.team) ===
      normalize(currentCard.team);

  if (samePlayer) {
    score += 100;
    reason = "Same player";
  }

  if (sameSet) {
    score += 50;

    if (!samePlayer) {
      reason = "Same set";
    }
  }

  if (sameBrand) {
    score += 35;

    if (!samePlayer && !sameSet) {
      reason = "Same brand";
    }
  }

  if (sameSport) {
    score += 25;

    if (!samePlayer && !sameSet && !sameBrand) {
      reason = "Same sport";
    }
  }

  if (sameTeam) {
    score += 20;

    if (
      !samePlayer &&
      !sameSet &&
      !sameBrand &&
      !sameSport
    ) {
      reason = "Same team";
    }
  }

  if (
    candidate.year !== null &&
    currentCard.year !== null
  ) {
    const yearDifference = Math.abs(
      candidate.year - currentCard.year,
    );

    if (yearDifference === 0) {
      score += 15;

      if (
        !samePlayer &&
        !sameSet &&
        !sameBrand &&
        !sameSport &&
        !sameTeam
      ) {
        reason = "Same year";
      }
    } else if (yearDifference === 1) {
      score += 8;
    } else if (yearDifference <= 3) {
      score += 3;
    }
  }

  const candidatePrice = Number(candidate.price);
  const currentPrice = Number(currentCard.price);

  if (
    Number.isFinite(candidatePrice) &&
    Number.isFinite(currentPrice) &&
    currentPrice > 0
  ) {
    const priceDifferencePercentage =
      Math.abs(candidatePrice - currentPrice) /
      currentPrice;

    if (priceDifferencePercentage <= 0.15) {
      score += 20;

      if (
        !samePlayer &&
        !sameSet &&
        !sameBrand &&
        !sameSport &&
        !sameTeam
      ) {
        reason = "Similar price";
      }
    } else if (priceDifferencePercentage <= 0.3) {
      score += 12;
    } else if (priceDifferencePercentage <= 0.5) {
      score += 5;
    }
  }

  return {
    score,
    reason,
  };
}

function formatCurrency(value: number | string | null) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function RelatedCards({
  currentCard,
}: RelatedCardsProps) {
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
        price,
        image_url,
        stock
      `,
    )
    .neq("id", currentCard.id)
    .gt("stock", 0)
    .order("created_at", {
      ascending: false,
    })
    .limit(100);

  if (error) {
    console.error(
      "Related cards lookup error:",
      error.message,
    );

    return null;
  }

  const scoredCards: ScoredCard[] = (
    (data ?? []) as RelatedCard[]
  )
    .map((candidate) => {
      const result = getCardScore(
        candidate,
        currentCard,
      );

      return {
        ...candidate,
        recommendationScore: result.score,
        recommendationReason: result.reason,
      };
    })
    .sort((firstCard, secondCard) => {
      if (
        secondCard.recommendationScore !==
        firstCard.recommendationScore
      ) {
        return (
          secondCard.recommendationScore -
          firstCard.recommendationScore
        );
      }

      return (
        Number(secondCard.price ?? 0) -
        Number(firstCard.price ?? 0)
      );
    })
    .slice(0, 4);

  if (scoredCards.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-700">
            Recommended For You
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-950">
            You May Also Like
          </h2>

          <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-500">
            Similar players, sets, brands, sports, years,
            and price ranges from our available inventory.
          </p>
        </div>

        <Link
          href="/shop"
          className="hidden shrink-0 font-black text-green-700 transition hover:text-green-600 sm:inline"
        >
          View All Cards →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {scoredCards.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.slug}`}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
              {card.image_url ? (
                <Image
                  src={card.image_url}
                  alt={`${card.player_name} card`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-3 transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-zinc-400">
                  No card image available
                </div>
              )}

              <div className="absolute left-3 top-3 rounded-full bg-slate-950/90 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg backdrop-blur">
                {card.recommendationReason}
              </div>
            </div>

            <div className="p-5">
              {card.sport && (
                <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
                  {card.sport}
                </p>
              )}

              <h3 className="mt-2 line-clamp-2 text-lg font-black text-slate-950">
                {card.player_name}
              </h3>

              <p className="mt-1 min-h-5 truncate text-sm font-bold text-slate-500">
                {[card.year, card.brand]
                  .filter(Boolean)
                  .join(" ")}
              </p>

              {card.set_name && (
                <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                  {card.set_name}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xl font-black text-slate-950">
                  {formatCurrency(card.price)}
                </p>

                <span className="text-sm font-black text-green-700 transition group-hover:translate-x-1">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/shop"
        className="mt-6 block text-center font-black text-green-700 transition hover:text-green-600 sm:hidden"
      >
        View All Cards →
      </Link>
    </section>
  );
}