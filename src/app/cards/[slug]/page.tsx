import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import CardImageGallery from "@/components/cards/CardImageGallery";
import RecentlyViewedTracker from "@/components/cards/RecentlyViewedTracker";
import RelatedCards from "@/components/cards/RelatedCards";
import WishlistButton from "@/components/wishlist/WishlistButton";
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

type FactTileProps = {
  label: string;
  value: string | number | null;
};

type CardRecord = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  set_name: string | null;
  card_number: string | null;
  grade_company: string | null;
  grade: string | null;
  price: number | string | null;
  image_url: string | null;
  back_image_url: string | null;
  rookie_card: boolean | null;
  autograph: boolean | null;
  serial_number: string | null;
  stock: number | null;
  condition_notes: string | null;
};

const SITE_URL = "https://www.sidelinementalitycards.com";

async function getCardBySlug(
  slug: string,
): Promise<CardRecord | null> {
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
    console.error("Card lookup error:", error.message);
    return null;
  }

  return card as CardRecord | null;
}

function formatCurrency(value: number | string | null) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function buildCardTitle(card: CardRecord) {
  return [
    card.year,
    card.brand,
    card.player_name,
    card.rookie_card ? "Rookie Card" : null,
    card.autograph ? "Autograph" : null,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildCardDescription(card: CardRecord) {
  const price = formatCurrency(card.price);

  const details = [
    card.year,
    card.brand,
    card.set_name,
    card.player_name,
    card.sport ? `${card.sport} card` : "sports card",
    card.grade_company && card.grade
      ? `graded ${card.grade_company} ${card.grade}`
      : null,
    card.rookie_card ? "rookie card" : null,
    card.autograph ? "autograph card" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return `Shop this ${details}${
    price ? ` for ${price}` : ""
  } from Sideline Mentality Cards. Real card photos, secure checkout, and careful shipping.`;
}

export async function generateMetadata({
  params,
}: CardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  if (!card) {
    return {
      title: "Card Not Found",
      description: "This sports card listing could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = buildCardTitle(card);
  const description = buildCardDescription(card);
  const cardUrl = `${SITE_URL}/cards/${card.slug}`;

  const socialImages = card.image_url
    ? [
        {
          url: card.image_url,
          alt: `${title} available from Sideline Mentality Cards`,
        },
      ]
    : undefined;

  return {
    title,
    description,

    alternates: {
      canonical: cardUrl,
    },

    openGraph: {
      type: "website",
      url: cardUrl,
      siteName: "Sideline Mentality Cards",
      title,
      description,
      images: socialImages,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: card.image_url ? [card.image_url] : undefined,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

function DetailRow({ label, value }: DetailRowProps) {
  if (value === null || value === "") {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-6 border-b border-zinc-200 py-3 last:border-b-0">
      <dt className="font-bold text-slate-500">{label}</dt>

      <dd className="text-right font-black text-slate-950">
        {value}
      </dd>
    </div>
  );
}

function FactTile({ label, value }: FactTileProps) {
  if (value === null || value === "") {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>

      <p className="mt-2 font-black text-white">{value}</p>
    </div>
  );
}

export default async function CardPage({
  params,
}: CardPageProps) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  if (!card) {
    notFound();
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

  const stockMessage = !isInStock
    ? "Sold Out"
    : stock === 1
      ? "Last One Available"
      : stock <= 3
        ? `Only ${stock} Left`
        : "In Stock";

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: buildCardTitle(card),
    description: buildCardDescription(card),
    image: card.image_url ? [card.image_url] : undefined,
    sku: card.card_number || card.id,
    brand: {
      "@type": "Brand",
      name: card.brand || "Sideline Mentality Cards",
    },
    category: card.sport
      ? `${card.sport} Trading Card`
      : "Sports Trading Card",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/cards/${card.slug}`,
      priceCurrency: "USD",
      price: Number.isFinite(price) ? price.toFixed(2) : "0.00",
      availability: isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: "Sideline Mentality Cards",
      },
    },
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 sm:px-6 sm:py-16">
      <RecentlyViewedTracker
        id={card.id}
        slug={card.slug}
        playerName={card.player_name}
        year={card.year}
        brand={card.brand}
        price={Number.isFinite(price) ? price : 0}
        imageUrl={card.image_url}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <div className="mx-auto max-w-7xl">
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
              <span aria-hidden="true" className="text-zinc-400">
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

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
          <section className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">
            <CardImageGallery
              frontImage={card.image_url}
              backImage={card.back_image_url}
              playerName={card.player_name}
            />
          </section>

          <aside className="lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
              <div className="border-b border-white/10 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-green-400">
                    {card.sport || "Sports Card"}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                      !isInStock
                        ? "bg-red-500/15 text-red-300"
                        : stock <= 3
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-green-500/15 text-green-300"
                    }`}
                  >
                    {stockMessage}
                  </span>
                </div>

                <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl">
                  {card.player_name}
                </h1>

                <p className="mt-4 text-lg font-bold text-zinc-300">
                  {[card.year, card.brand, card.set_name]
                    .filter(Boolean)
                    .join(" • ")}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {card.rookie_card && (
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-300">
                      Rookie Card
                    </span>
                  )}

                  {card.autograph && (
                    <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-purple-300">
                      Autograph
                    </span>
                  )}

                  {gradeDisplay && (
                    <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-300">
                      {gradeDisplay}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Your Price
                    </p>

                    <p className="mt-2 text-4xl font-black text-white sm:text-5xl">
                      {Number.isFinite(price)
                        ? formatCurrency(price)
                        : "Price unavailable"}
                    </p>
                  </div>

                  {isInStock && (
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">
                        Availability
                      </p>

                      <p
                        className={`mt-2 font-black ${
                          stock <= 3
                            ? "text-amber-300"
                            : "text-green-400"
                        }`}
                      >
                        {stockMessage}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-7 space-y-3">
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

                  <WishlistButton cardId={card.id} />
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <FactTile label="Year" value={card.year} />
                  <FactTile label="Brand" value={card.brand} />
                  <FactTile label="Grade" value={gradeDisplay || "Raw"} />
                  <FactTile
                    label="Card Number"
                    value={card.card_number || "Not Listed"}
                  />
                </div>

                <div className="mt-7 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
                  <ul className="space-y-3 text-sm font-semibold text-zinc-200">
                    <li className="flex items-center gap-3">
                      <span aria-hidden="true">🔒</span>
                      Secure checkout powered by Stripe
                    </li>

                    <li className="flex items-center gap-3">
                      <span aria-hidden="true">🚚</span>
                      Ships in 1–2 business days
                    </li>

                    <li className="flex items-center gap-3">
                      <span aria-hidden="true">📦</span>
                      Carefully packaged for collectors
                    </li>

                    <li className="flex items-center gap-3">
                      <span aria-hidden="true">💚</span>
                      Collector-owned and faith-driven
                    </li>
                  </ul>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-6 text-center">
                  <div>
                    <p className="text-lg">✓</p>
                    <p className="mt-1 text-xs font-bold text-zinc-400">
                      Real Photos
                    </p>
                  </div>

                  <div className="border-x border-white/10">
                    <p className="text-lg">✓</p>
                    <p className="mt-1 text-xs font-bold text-zinc-400">
                      Secure Payment
                    </p>
                  </div>

                  <div>
                    <p className="text-lg">✓</p>
                    <p className="mt-1 text-xs font-bold text-zinc-400">
                      Fast Shipping
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              Card Details
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the complete listing information before adding this
              card to your collection.
            </p>

            <dl className="mt-5">
              <DetailRow
                label="Player"
                value={card.player_name}
              />

              <DetailRow label="Sport" value={card.sport} />

              <DetailRow label="Team" value={card.team} />

              <DetailRow label="Year" value={card.year} />

              <DetailRow label="Brand" value={card.brand} />

              <DetailRow label="Set" value={card.set_name} />

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

          <div className="space-y-8">
            <div className="rounded-3xl bg-zinc-950 p-6 text-white shadow-lg sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
                Collector Confidence
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Buy with confidence
              </h2>

              <p className="mt-4 leading-7 text-zinc-400">
                Every listing uses photos of the actual card being sold.
                Orders are securely processed and carefully prepared for
                shipment.
              </p>

              <div className="mt-6 space-y-3 text-sm font-bold text-zinc-200">
                <p>✓ Actual card photos</p>
                <p>✓ Secure Stripe checkout</p>
                <p>✓ Careful collector packaging</p>
                <p>✓ Responsive customer support</p>
              </div>
            </div>

            {card.condition_notes && (
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg sm:p-8">
                <h2 className="text-2xl font-black text-slate-950">
                  Condition Notes
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                  {card.condition_notes}
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-black text-slate-950 transition hover:border-green-600 hover:text-green-700"
          >
            ← Continue Shopping
          </Link>
        </div>

        <RelatedCards
          currentCard={{
            id: card.id,
            playerName: card.player_name,
            sport: card.sport,
            team: card.team,
            year: card.year,
            brand: card.brand,
            setName: card.set_name,
            price: card.price,
          }}
        />
      </div>
    </main>
  );
}