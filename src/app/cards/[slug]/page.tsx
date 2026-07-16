import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type CardPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CardPage({ params }: CardPageProps) {
  const { slug } = await params;

  const { data: card, error } = await supabase
    .from("cards")
    .select("id, slug, player_name, sport, price, image_url, brand, year")
    .eq("slug", slug)
    .single();

  if (error || !card) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 rounded-3xl bg-white p-8 shadow-xl lg:grid-cols-2">
        <div className="flex min-h-[500px] items-center justify-center rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 p-8">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={`${card.player_name} sports card`}
              className="max-h-[600px] w-full rounded-xl object-contain"
            />
          ) : (
            <p className="text-center font-bold uppercase tracking-widest text-green-400">
              Card Image Coming Soon
            </p>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-700">
            {card.sport}
          </p>

          <h1 className="mt-4 text-5xl font-black text-gray-900">
            {card.player_name}
          </h1>

          <p className="mt-4 text-xl text-gray-500">
            {card.year} {card.brand}
          </p>

          <p className="mt-8 text-4xl font-black text-gray-900">
            ${Number(card.price).toFixed(2)}
          </p>

          <button className="mt-10 rounded-xl bg-green-700 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-800">
            Add to Cart
          </button>

          <a
            href="/"
            className="mt-6 text-center font-semibold text-green-700 hover:text-green-800"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </main>
  );
}