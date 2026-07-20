type HighlightCard = {
    player_name: string;
    sport: string | null;
    year: number | null;
    brand: string | null;
    price: number | string | null;
  };
  
  type DealerHighlightsProps = {
    highestValueCard: HighlightCard | null;
    newestCard: HighlightCard | null;
    missingImageCount: number;
  };
  
  function formatCurrency(value: number | string | null) {
    const numericValue = Number(value ?? 0);
  
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numericValue);
  }
  
  function getCardDetails(card: HighlightCard) {
    return [
      card.year,
      card.brand,
      card.sport,
    ]
      .filter(Boolean)
      .join(" • ");
  }
  
  export default function DealerHighlights({
    highestValueCard,
    newestCard,
    missingImageCount,
  }: DealerHighlightsProps) {
    return (
        <section className="h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
            Inventory Spotlight
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white">
            Dealer Highlights
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Important inventory details worth reviewing.
          </p>
        </div>
  
        <div className="grid gap-5 p-6 lg:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-black/20 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Highest-Value Card
            </p>
  
            {highestValueCard ? (
              <>
                <h3 className="mt-4 text-xl font-black text-white">
                  {highestValueCard.player_name}
                </h3>
  
                <p className="mt-2 text-sm text-zinc-400">
                  {getCardDetails(highestValueCard) || "Card details unavailable"}
                </p>
  
                <p className="mt-4 text-lg font-bold text-green-400">
                  {formatCurrency(highestValueCard.price)}
                </p>
              </>
            ) : (
              <p className="mt-4 text-zinc-400">No inventory available.</p>
            )}
          </article>
  
          <article className="rounded-xl border border-white/10 bg-black/20 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Newest Listing
            </p>
  
            {newestCard ? (
              <>
                <h3 className="mt-4 text-xl font-black text-white">
                  {newestCard.player_name}
                </h3>
  
                <p className="mt-2 text-sm text-zinc-400">
                  {getCardDetails(newestCard) || "Card details unavailable"}
                </p>
  
                <p className="mt-4 text-lg font-bold text-green-400">
                  {formatCurrency(newestCard.price)}
                </p>
              </>
            ) : (
              <p className="mt-4 text-zinc-400">No inventory available.</p>
            )}
          </article>
  
          <article className="rounded-xl border border-white/10 bg-black/20 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Missing Images
            </p>
  
            <h3 className="mt-4 text-3xl font-black text-white">
              {missingImageCount}
            </h3>
  
            <p className="mt-2 text-sm text-zinc-400">
              Listings that still need a card image.
            </p>
  
            <p className="mt-4 text-sm font-bold text-green-400">
              Review inventory quality
            </p>
          </article>
        </div>
      </section>
    );
  }