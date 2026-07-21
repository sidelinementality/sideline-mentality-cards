import { supabase } from "@/lib/supabase";

export default async function MarketplaceStats() {
  const { data: cards, error } = await supabase
    .from("cards")
    .select("price, stock, sport");

  if (error || !cards) {
    return null;
  }

  const totalCards = cards.reduce(
    (sum, card) => sum + Number(card.stock ?? 0),
    0,
  );

  const inventoryValue = cards.reduce(
    (sum, card) =>
      sum + Number(card.price ?? 0) * Number(card.stock ?? 0),
    0,
  );

  const sports = new Set(
    cards
      .map((card) => card.sport)
      .filter(Boolean),
  );

  const stats = [
    {
      value: totalCards.toLocaleString(),
      label: "Cards Available",
    },
    {
      value: inventoryValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      label: "Inventory Value",
    },
    {
      value: sports.size,
      label: "Sports",
    },
    {
      value: "24hr",
      label: "Shipping",
    },
  ];

  return (
    <section className="bg-black px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur transition hover:border-green-500/40 hover:bg-white/10"
          >
            <p className="text-4xl font-black text-green-400">
              {stat.value}
            </p>

            <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}