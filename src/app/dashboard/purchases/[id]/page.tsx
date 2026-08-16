import Link from "next/link";
import { notFound } from "next/navigation";
import LinkedPurchaseCards, {
  type LinkedPurchaseCard,
} from "@/components/dealer/purchases/LinkedPurchaseCards";
import PurchaseForm from "@/components/dealer/purchases/PurchaseForm";
import {
  formatCurrency,
  formatPurchaseDate,
  formatPurchaseStatus,
  purchaseStatusClasses,
  type Purchase,
} from "@/lib/purchases";
import { supabaseAdmin } from "@/lib/supabase-admin";

type PurchaseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PurchaseDetailPage({
  params,
}: PurchaseDetailPageProps) {
  const { id } = await params;

  const { data: purchase, error } = await supabaseAdmin
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
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Purchase detail loading error:", error);
  }

  if (!purchase) {
    notFound();
  }

  const typedPurchase = purchase as Purchase;

  const { data: cards, error: cardsError } = await supabaseAdmin
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
      parallel,
      card_number,
      image_url,
      purchase_price,
      price,
      stock,
      listing_status
    `,
    )
    .eq("purchase_id", id)
    .order("created_at", { ascending: false });

  if (cardsError) {
    console.error("Purchase linked cards error:", cardsError);
  }

  const linkedCards = (cards ?? []) as LinkedPurchaseCard[];

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <Link
          href="/dashboard/purchases"
          className="text-sm font-bold text-green-400 hover:text-green-300"
        >
          ← All purchases
        </Link>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer OS
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          {typedPurchase.name}
        </h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          Lot total is what you paid for this acquisition. Each linked card keeps
          its own purchase price.
        </p>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total purchase cost"
          value={formatCurrency(typedPurchase.total_cost)}
        />
        <SummaryCard
          label="Source"
          value={typedPurchase.source || "—"}
        />
        <SummaryCard
          label="Seller"
          value={typedPurchase.seller || "—"}
        />
        <SummaryCard
          label="Purchase date"
          value={formatPurchaseDate(typedPurchase.purchase_date) ?? "—"}
        />
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${purchaseStatusClasses(typedPurchase.status)}`}
            >
              {formatPurchaseStatus(typedPurchase.status)}
            </span>
            <p className="text-sm text-zinc-400">
              {linkedCards.length} linked card
              {linkedCards.length === 1 ? "" : "s"}
              {typedPurchase.expected_item_count !== null
                ? ` · ${typedPurchase.expected_item_count} expected`
                : ""}
            </p>
          </div>
          <h2 className="mt-5 text-xl font-black text-white">Notes</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
            {typedPurchase.notes || "No notes recorded for this purchase."}
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-green-300">
            Cost rule
          </p>
          <p className="mt-3 text-sm leading-6 text-green-50">
            This lot&apos;s {formatCurrency(typedPurchase.total_cost)} total is
            not divided across cards. Linked cards keep whatever individual
            purchase price was entered at intake or on the card record.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">Linked inventory</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Cards published from Dealer Intake with this purchase selected.
            </p>
          </div>
          {linkedCards.length > 0 && (
            <Link
              href={`/dashboard/intake?purchaseId=${encodeURIComponent(typedPurchase.id)}`}
              className="inline-flex rounded-xl bg-green-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-500"
            >
              Open Dealer Intake
            </Link>
          )}
        </div>
        <LinkedPurchaseCards
          cards={linkedCards}
          purchaseId={typedPurchase.id}
        />
      </section>

      <PurchaseForm
        purchase={typedPurchase}
        submitLabel="Save purchase changes"
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}
