import Link from "next/link";
import { formatCurrency } from "@/lib/purchases";

export type LinkedPurchaseCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | string | null;
  brand: string | null;
  set_name: string | null;
  parallel: string | null;
  card_number: string | null;
  image_url: string | null;
  purchase_price: number | string | null;
  price: number | string | null;
  stock: number | null;
  listing_status: string | null;
};

export default function LinkedPurchaseCards({
  cards,
  purchaseId,
}: {
  cards: LinkedPurchaseCard[];
  purchaseId: string;
}) {
  const intakeHref = `/dashboard/intake?purchaseId=${encodeURIComponent(purchaseId)}`;

  if (cards.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h3 className="text-lg font-black text-white">No linked cards yet</h3>
        <p className="mt-2 text-sm text-zinc-400">
          Cards published through Dealer Intake with this purchase selected will
          appear here. Existing inventory is not changed automatically.
        </p>
        <Link
          href={intakeHref}
          className="mt-5 inline-flex rounded-xl bg-green-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-500"
        >
          Open Dealer Intake
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-[980px] divide-y divide-white/10">
        <thead className="bg-black/30">
          <tr>
            <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
              Card
            </th>
            <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
              Details
            </th>
            <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
              Card cost
            </th>
            <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
              Website price
            </th>
            <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
              Stock
            </th>
            <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
              Status
            </th>
            <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 bg-white/[0.02]">
          {cards.map((card) => (
            <tr key={card.id} className="hover:bg-white/[0.03]">
              <td className="px-5 py-4">
                <div className="flex min-w-[240px] items-center gap-4">
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                    {card.image_url ? (
                      <img
                        src={card.image_url}
                        alt={`${card.player_name} card`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-zinc-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-black text-white">{card.player_name}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {[card.year, card.brand, card.set_name]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-sm">
                <p className="font-semibold text-zinc-200">
                  {card.parallel || "Base / No parallel"}
                </p>
                <p className="mt-1 text-zinc-400">
                  Card #{card.card_number || "—"}
                </p>
                <p className="mt-1 text-zinc-500">
                  {card.team || card.sport || "—"}
                </p>
              </td>
              <td className="whitespace-nowrap px-5 py-4">
                <p className="font-bold text-white">
                  {formatCurrency(card.purchase_price)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Individual card basis
                </p>
              </td>
              <td className="whitespace-nowrap px-5 py-4 font-bold text-white">
                {formatCurrency(card.price)}
              </td>
              <td className="whitespace-nowrap px-5 py-4 font-black text-white">
                {Number(card.stock ?? 0)}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                {card.listing_status || "—"}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-col items-start gap-2">
                  <Link
                    href={`/cards/${card.slug}`}
                    className="text-sm font-bold text-green-400 hover:text-green-300"
                  >
                    View Card
                  </Link>
                  <Link
                    href={`/dashboard/inventory/${card.id}/edit`}
                    className="text-sm font-bold text-zinc-300 hover:text-white"
                  >
                    Edit Card
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
