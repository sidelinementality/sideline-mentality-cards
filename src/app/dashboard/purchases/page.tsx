import Link from "next/link";
import type { ReactNode } from "react";
import PurchaseForm from "@/components/dealer/purchases/PurchaseForm";
import {
  formatCurrency,
  formatPurchaseDate,
  formatPurchaseStatus,
  purchaseStatusClasses,
  type Purchase,
} from "@/lib/purchases";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function PurchasesPage() {
  const { data, error } = await supabaseAdmin
    .from("purchases")
    .select(
      `
      id,
      name,
      purchase_date,
      source,
      seller,
      total_cost,
      expected_item_count,
      notes,
      status,
      created_at,
      updated_at
    `,
    )
    .order("purchase_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Purchases loading error:", error);
  }

  const purchases = (data ?? []) as Purchase[];

  const { data: linkedCards, error: linkedError } = error
    ? { data: null, error: null }
    : await supabaseAdmin
        .from("cards")
        .select("purchase_id")
        .not("purchase_id", "is", null);

  if (linkedError) {
    console.error("Purchase card counts error:", linkedError);
  }

  const linkedCountByPurchase = (linkedCards ?? []).reduce<
    Record<string, number>
  >((counts, card) => {
    const purchaseId = card.purchase_id as string | null;
    if (!purchaseId) {
      return counts;
    }

    counts[purchaseId] = (counts[purchaseId] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
            Dealer OS
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Purchases
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Record lots and acquisitions, then connect cards from Dealer Intake
            without changing each card&apos;s individual cost basis.
          </p>
        </div>
      </section>

      {error ? (
        <section className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="font-semibold text-red-300">
            Purchases could not be loaded. If this is the first time using this
            module, apply the purchases migration in Supabase, then refresh.
          </p>
          {error.message && (
            <p className="mt-2 text-sm text-red-200">{error.message}</p>
          )}
        </section>
      ) : (
        <section className="mb-8 overflow-hidden rounded-2xl border border-white/10">
          {purchases.length === 0 ? (
            <div className="bg-white/5 p-10 text-center">
              <h2 className="text-xl font-black text-white">No purchases yet</h2>
              <p className="mt-2 text-zinc-400">
                Create a lot such as a Facebook Marketplace purchase, then
                select it in Dealer Intake.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[980px] divide-y divide-white/10">
                <thead className="bg-black/30">
                  <tr>
                    <HeaderCell>Purchase / lot</HeaderCell>
                    <HeaderCell>Date</HeaderCell>
                    <HeaderCell>Source</HeaderCell>
                    <HeaderCell>Seller</HeaderCell>
                    <HeaderCell>Total cost</HeaderCell>
                    <HeaderCell>Items</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {purchases.map((purchase) => {
                    const linkedCount =
                      linkedCountByPurchase[purchase.id] ?? 0;
                    const expectedCount = purchase.expected_item_count;

                    return (
                      <tr key={purchase.id} className="hover:bg-white/[0.03]">
                        <td className="px-5 py-4">
                          <Link
                            href={`/dashboard/purchases/${purchase.id}`}
                            className="font-black text-white hover:text-green-400"
                          >
                            {purchase.name}
                          </Link>
                          {purchase.notes && (
                            <p className="mt-1 max-w-xs truncate text-xs text-zinc-500">
                              {purchase.notes}
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                          {formatPurchaseDate(purchase.purchase_date) ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                          {purchase.source || "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                          {purchase.seller || "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-bold text-white">
                          {formatCurrency(purchase.total_cost)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                          <p>{linkedCount} linked</p>
                          {expectedCount !== null && (
                            <p className="mt-1 text-xs text-zinc-500">
                              {expectedCount} expected
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${purchaseStatusClasses(purchase.status)}`}
                          >
                            {formatPurchaseStatus(purchase.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <PurchaseForm submitLabel="Create purchase" />
    </div>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
      {children}
    </th>
  );
}
