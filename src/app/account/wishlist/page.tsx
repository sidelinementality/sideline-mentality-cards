import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type WishlistCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  year: number | null;
  brand: string | null;
  price: number | string | null;
  image_url: string | null;
  stock: number | null;
};

type WishlistItem = {
  id: string;
  created_at: string;
  cards: WishlistCard | null;
};

export default async function WishlistPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .select(
      `
        id,
        created_at,
        cards (
          id,
          slug,
          player_name,
          sport,
          year,
          brand,
          price,
          image_url,
          stock
        )
      `,
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Wishlist lookup error:", error);
  }

  const wishlistItems = (data ?? []) as WishlistItem[];

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
              My Account
            </p>

            <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
              My Wishlist
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Keep track of the cards you are interested in and add
              them to your cart when you are ready.
            </p>
          </div>

          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 font-black text-slate-800 transition hover:border-green-700 hover:text-green-700"
          >
            Back to Account
          </Link>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-black text-red-800">
              We could not load your wishlist.
            </h2>

            <p className="mt-2 text-sm text-red-700">
              Please refresh the page and try again.
            </p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">♡</div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-slate-600">
              Browse the marketplace and save cards that you want to
              revisit later.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800"
            >
              Browse Cards
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-10 font-bold text-slate-600">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1
                ? "saved card"
                : "saved cards"}
            </p>

            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => {
                const card = item.cards;

                if (!card) {
                  return null;
                }

                const price = Number(card.price);
                const stock = Number(card.stock ?? 0);
                const isInStock = stock > 0;

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link
                      href={`/cards/${card.slug}`}
                      className="relative block aspect-[4/5] bg-zinc-100"
                    >
                      {card.image_url ? (
                        <Image
                          src={card.image_url}
                          alt={`${card.player_name} trading card`}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-6 text-center font-bold text-slate-400">
                          Image unavailable
                        </div>
                      )}

                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                          isInStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isInStock ? "In Stock" : "Sold Out"}
                      </span>
                    </Link>

                    <div className="p-5">
                      {card.sport && (
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-green-700">
                          {card.sport}
                        </p>
                      )}

                      <Link href={`/cards/${card.slug}`}>
                        <h2 className="mt-2 text-xl font-black text-slate-950 transition hover:text-green-700">
                          {card.player_name}
                        </h2>
                      </Link>

                      <p className="mt-2 text-sm font-bold text-slate-500">
                        {[card.year, card.brand]
                          .filter(Boolean)
                          .join(" ")}
                      </p>

                      <p className="mt-4 text-2xl font-black text-slate-950">
                        {Number.isFinite(price)
                          ? `$${price.toFixed(2)}`
                          : "Price unavailable"}
                      </p>

                      <div className="mt-5 space-y-3">
                        <AddToCartButton
                          card={{
                            id: card.id,
                            slug: card.slug,
                            playerName: card.player_name,
                            year: card.year,
                            brand: card.brand,
                            price: Number.isFinite(price)
                              ? price
                              : 0,
                            imageUrl: card.image_url,
                            availableStock: stock,
                          }}
                        />

                        <WishlistButton cardId={card.id} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}