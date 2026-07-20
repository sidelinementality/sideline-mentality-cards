import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import CardImageGallery from "@/components/cards/CardImageGallery";
import RelatedCards from "@/components/cards/RelatedCards";
import { supabase } from "@/lib/supabase";

type CardPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type DetailRowProps = {
  label: string;
  value: string | number | null;
};

function DetailRow({ label, value }: DetailRowProps) {
  if (value === null || value === "") {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-6 border-b border-zinc-200 py-3 last:border-b-0">
      <dt className="font-bold text-slate-500">
        {label}
      </dt>

      <dd className="text-right font-black text-slate-950">
        {value}
      </dd>
    </div>
  );
}

export default async function CardPage({
  params,
}: CardPageProps) {
  const { slug } = await params;

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
        back_image_url,
        rookie_card,
        autograph,
        serial_number,
        stock,
        condition_notes
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Card lookup error:", error);
  }

  if (!card) {
    notFound();
  }

  const { data: relatedCards, error: relatedCardsError } =
    await supabase
      .from("cards")
      .select(
        `
          id,
          slug,
          player_name,
          sport,
          year,
          brand,
          price,
          image_url
        `,
      )
      .eq("sport", card.sport)
      .neq("id", card.id)
      .gt("stock", 0)
      .order("created_at", {
        ascending: false,
      })
      .limit(4);

  if (relatedCardsError) {
    console.error(
      "Related cards lookup error:",
      relatedCardsError,
    );
  }

  const price = Number(card.price);
  const stock = Number(card.stock ?? 0);
  const isInStock = stock > 0;

  const gradeDisplay =
    card.grade_company && card.grade
      ? `${card.grade_company} ${card.grade}`
      : card.grade_company || card.grade || null;

  const sportLink = card.sport
    ? `/shop?sport=${encodeURIComponent(card.sport)}`
    : "/shop";

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500"
        >
          <Link
            href="/"
            className="transition hover:text-green-700"
          >
            Home
          </Link>

          <span aria-hidden="true" className="text-zinc-400">
            /
          </span>

          <Link
            href="/shop"
            className="transition hover:text-green-700"
          >
            Shop
          </Link>

          {card.sport && (
            <>
              <span
                aria-hidden="true"
                className="text-zinc-400"
              >
                /
              </span>

              <Link
                href={sportLink}
                className="transition hover:text-green-700"
              >
                {card.sport}
              </Link>
            </>
          )}

          <span aria-hidden="true" className="text-zinc-400">
            /
          </span>

          <span
            aria-current="page"
            className="font-black text-slate-950"
          >
            {card.player_name}
          </span>
        </nav>

        <div className="grid gap-10 rounded-3xl bg-white p-7 shadow-xl lg:grid-cols-2 lg:p-10">
          <CardImageGallery
            frontImage={card.image_url}
            backImage={card.back_image_url}
            playerName={card.player_name}
          />

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
                {card.sport}
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                  isInStock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isInStock ? "In Stock" : "Sold Out"}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              {card.player_name}
            </h1>

            <p className="mt-4 text-lg font-bold text-slate-500">
              {card.year} {card.brand}
            </p>

            {card.set_name && (
              <p className="mt-1 text-sm text-slate-500">
                {card.set_name}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {card.rookie_card && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-800">
                  Rookie Card
                </span>
              )}

              {card.autograph && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-purple-800">
                  Autograph
                </span>
              )}

              {gradeDisplay && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-800">
                  {gradeDisplay}
                </span>
              )}
            </div>

            <p className="mt-8 text-4xl font-black text-slate-950">
              {Number.isFinite(price)
                ? `$${price.toFixed(2)}`
                : "Price unavailable"}
            </p>

            <p className="mt-2 text-sm font-bold text-slate-500">
              {isInStock
                ? `${stock} available`
                : "This card is currently unavailable"}
            </p>

            <AddToCartButton
  card={{
    id: card.id,
    slug: card.slug,
    playerName: card.player_name,
    year: card.year,
    brand: card.brand,
    price: Number.isFinite(price) ? price : 0,
    imageUrl: card.image_url,
    availableStock: stock,
  }}
/>

            <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <h2 className="text-lg font-black text-slate-950">
                Card Details
              </h2>

              <dl className="mt-3">
                <DetailRow
                  label="Player"
                  value={card.player_name}
                />

                <DetailRow
                  label="Sport"
                  value={card.sport}
                />

                <DetailRow
                  label="Team"
                  value={card.team}
                />

                <DetailRow
                  label="Year"
                  value={card.year}
                />

                <DetailRow
                  label="Brand"
                  value={card.brand}
                />

                <DetailRow
                  label="Set"
                  value={card.set_name}
                />

                <DetailRow
                  label="Card Number"
                  value={card.card_number}
                />

                <DetailRow
                  label="Grade"
                  value={gradeDisplay}
                />

                <DetailRow
                  label="Serial Number"
                  value={card.serial_number}
                />

                <DetailRow
                  label="Rookie Card"
                  value={card.rookie_card ? "Yes" : "No"}
                />

                <DetailRow
                  label="Autograph"
                  value={card.autograph ? "Yes" : "No"}
                />
              </dl>
            </div>

            {card.condition_notes && (
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
                <h2 className="text-lg font-black text-slate-950">
                  Condition Notes
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                  {card.condition_notes}
                </p>
              </div>
            )}

            <Link
              href="/shop"
              className="mt-8 text-center font-black text-green-700 transition hover:text-green-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <RelatedCards cards={relatedCards ?? []} />
      </div>
    </main>
  );
}