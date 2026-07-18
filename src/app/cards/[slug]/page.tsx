import Link from "next/link";
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
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Card lookup error:", error);
  }

  if (!card) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-10 rounded-3xl bg-white p-7 shadow-xl md:grid-cols-2 md:p-10">
        <div className="flex min-h-[450px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-green-950 p-7">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={`${card.player_name} trading card`}
              className="max-h-[550px] w-full object-contain"
            />
          ) : (
            <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl bg-black px-6 text-center">
              <p className="font-bold text-zinc-400">
                Card image coming soon
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
            {card.sport}
          </p>

          <h1 className="mt-4 text-4xl font-black text-slate-950">
            {card.player_name}
          </h1>

          <p className="mt-4 text-lg text-slate-500">
            {card.year} {card.brand}
          </p>

          {card.set_name && (
            <p className="mt-1 text-sm text-slate-500">
              {card.set_name}
            </p>
          )}

          <p className="mt-8 text-3xl font-black text-slate-950">
            ${Number(card.price).toFixed(2)}
          </p>

          <button
            type="button"
            className="mt-10 rounded-xl bg-green-700 px-6 py-4 font-bold text-white transition hover:bg-green-600"
          >
            Add to Cart
          </button>

          <Link
            href="/"
            className="mt-6 text-center font-bold text-green-700 hover:text-green-600"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}