import { notFound } from "next/navigation";
import EditCardForm, {
  type EditableCard,
} from "@/components/cards/EditCardForm";
import { supabase } from "@/lib/supabase";

type EditCardPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCardPage({
  params,
}: EditCardPageProps) {
  const { id } = await params;

  const { data: card, error } = await supabase
    .from("cards")
    .select(`
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

      rookie_card,
      autograph,
      patch,
      relic,
      short_print,
      case_hit,
      serial_number,
      card_condition,
      condition_notes,

      graded,
      grade_company,
      grade,
      certification_number,

      purchase_date,
      purchase_source,
      seller,
      purchase_session,
      purchase_price,
      shipping_cost,
      sales_tax,
      purchase_fees,

      market_value,
      price,
      minimum_price,

      storage_area,
      cabinet,
      shelf,
      box,
      storage_row,
      slot,
      storage_notes,

      image_url,
      back_image_url,

      website_ready,
      featured,
      listing_status,
      internal_notes,

      stock
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Card loading error:", error);
  }

  if (!card) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer OS
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Edit Card
        </h1>

        <p className="mt-3 text-zinc-400">
          Update the complete inventory record for{" "}
          <span className="font-semibold text-white">
            {card.player_name}
          </span>
          .
        </p>
      </section>

      <EditCardForm card={card as EditableCard} />
    </div>
  );
}