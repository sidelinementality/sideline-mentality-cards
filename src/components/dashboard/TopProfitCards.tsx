type ProfitCard = {
    id: string;
    player_name: string;
    total_cost: number;
    price: number;
    quantity: number;
  };
  
  type TopProfitCardsProps = {
    cards: ProfitCard[];
  };
  
  export default function TopProfitCards({
    cards,
  }: TopProfitCardsProps) {
    const rankedCards = [...cards]
      .map((card) => {
        const quantity = Math.max(card.quantity, 1);
        const costPerCard = card.total_cost / quantity;
        const profitPerCard = card.price - costPerCard;
        const totalPotentialProfit = profitPerCard * quantity;
  
        const roi =
          costPerCard > 0
            ? (profitPerCard / costPerCard) * 100
            : 0;
  
        return {
          ...card,
          quantity,
          costPerCard,
          profitPerCard,
          totalPotentialProfit,
          roi,
        };
      })
      .sort(
        (firstCard, secondCard) =>
          secondCard.totalPotentialProfit -
          firstCard.totalPotentialProfit,
      )
      .slice(0, 10);
  
    return (
      <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Profit Leaders
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white">
            Top Profit Cards
          </h2>
  
          <p className="mt-2 text-sm text-zinc-400">
            Ranked by total projected profit across the available quantity.
          </p>
        </div>
  
        {rankedCards.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">
            Add inventory purchase costs to begin tracking profit leaders.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] divide-y divide-white/10">
              <thead className="bg-black/20">
                <tr>
                  <TableHeading>Card</TableHeading>
                  <TableHeading>Quantity</TableHeading>
                  <TableHeading>Cost Per Card</TableHeading>
                  <TableHeading>Website Price</TableHeading>
                  <TableHeading>Profit Per Card</TableHeading>
                  <TableHeading>Total Profit</TableHeading>
                  <TableHeading>ROI</TableHeading>
                </tr>
              </thead>
  
              <tbody className="divide-y divide-white/10">
                {rankedCards.map((card, index) => {
                  const profitable = card.totalPotentialProfit >= 0;
  
                  return (
                    <tr
                      key={card.id}
                      className="transition hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-sm font-black text-green-400">
                            {index + 1}
                          </span>
  
                          <p className="font-bold text-white">
                            {card.player_name}
                          </p>
                        </div>
                      </td>
  
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-white">
                        {card.quantity}
                      </td>
  
                      <td className="whitespace-nowrap px-5 py-4 text-zinc-300">
                        {formatMoney(card.costPerCard)}
                      </td>
  
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-white">
                        {formatMoney(card.price)}
                      </td>
  
                      <td
                        className={`whitespace-nowrap px-5 py-4 font-bold ${
                          card.profitPerCard >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {formatMoney(card.profitPerCard)}
                      </td>
  
                      <td
                        className={`whitespace-nowrap px-5 py-4 font-black ${
                          profitable
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {formatMoney(card.totalPotentialProfit)}
                      </td>
  
                      <td
                        className={`whitespace-nowrap px-5 py-4 font-bold ${
                          card.roi >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {formatPercent(card.roi)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
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
  
  function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.isFinite(amount) ? amount : 0);
  }
  
  function formatPercent(value: number) {
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
    }).format(Number.isFinite(value) ? value : 0)}%`;
  }