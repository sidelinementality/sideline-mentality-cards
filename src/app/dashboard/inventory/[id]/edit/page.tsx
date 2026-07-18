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
        grade_company,
        grade,
        price,
        image_url,
        featured,
        rookie_card,
        autograph,
        serial_number,
        stock,
        condition_notes
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Card loading error:", error);
  }

  if (!card) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Inventory
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Edit Card
        </h1>

        <p className="mt-3 text-zinc-400">
          Update the inventory information for{" "}
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