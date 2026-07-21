"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

type WishlistButtonProps = {
  cardId: string;
};

export default function WishlistButton({
  cardId,
}: WishlistButtonProps) {
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function checkWishlistStatus() {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabaseBrowser
        .from("wishlist_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("card_id", cardId)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Wishlist status error:", error.message);
        setIsLoading(false);
        return;
      }

      setIsSaved(Boolean(data));
      setIsLoading(false);
    }

    checkWishlistStatus();

    return () => {
      isMounted = false;
    };
  }, [cardId]);

  async function handleWishlistClick() {
    setMessage("");
    setIsUpdating(true);

    const {
      data: { user },
    } = await supabaseBrowser.auth.getUser();

    if (!user) {
      router.push("/account/login");
      router.refresh();
      return;
    }

    if (isSaved) {
      const { error } = await supabaseBrowser
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("card_id", cardId);

      if (error) {
        setMessage("This card could not be removed.");
        setIsUpdating(false);
        return;
      }

      setIsSaved(false);
      setMessage("Removed from wishlist.");
      setIsUpdating(false);
      return;
    }

    const { error } = await supabaseBrowser
      .from("wishlist_items")
      .insert({
        user_id: user.id,
        card_id: cardId,
      });

    if (error) {
      setMessage("This card could not be saved.");
      setIsUpdating(false);
      return;
    }

    setIsSaved(true);
    setMessage("Saved to wishlist.");
    setIsUpdating(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleWishlistClick}
        disabled={isLoading || isUpdating}
        className={`inline-flex w-full items-center justify-center rounded-xl border px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isSaved
            ? "border-red-500 bg-red-500/10 text-red-600 hover:bg-red-500/20"
            : "border-green-600 bg-green-50 text-green-800 hover:bg-green-100 hover:border-green-700"
        }`}
      >
        {isLoading
          ? "Loading..."
          : isUpdating
            ? "Updating..."
            : isSaved
              ? "♥ Saved to Wishlist"
              : "♡ Save to Wishlist"}
      </button>

      {message ? (
        <p className="mt-2 text-center text-sm text-neutral-400">
          {message}
        </p>
      ) : null}
    </div>
  );
}