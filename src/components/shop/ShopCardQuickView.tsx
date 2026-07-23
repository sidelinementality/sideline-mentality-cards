"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QuickViewModal from "@/components/shop/QuickViewModal";

type Card = {
  id: string;
  slug: string;
  playerName: string;
  year: number | null;
  brand: string | null;
  price: number;
  imageUrl: string | null;
  availableStock: number;
};

type ShopCardQuickViewProps = {
  card: Card;
};

export default function ShopCardQuickView({
  card,
}: ShopCardQuickViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center rounded-xl bg-green-700 px-4 py-3 text-sm font-black text-white transition hover:bg-green-600"
        >
          Quick View
        </button>

        <Link
          href={`/cards/${card.slug}`}
          className="flex w-full items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm font-black text-white transition hover:border-green-500 hover:bg-green-500 hover:text-black"
        >
          View Full Details →
        </Link>
      </div>

      <QuickViewModal
        card={card}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}