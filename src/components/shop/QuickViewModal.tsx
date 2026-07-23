"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";

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

type QuickViewModalProps = {
  card: Card | null;
  open: boolean;
  onClose: () => void;
};

export default function QuickViewModal({
  card,
  open,
  onClose,
}: QuickViewModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted || !open || !card) {
    return null;
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (event.target !== event.currentTarget) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onClose();
  }

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={handleBackdropClick}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-neutral-950 px-6 py-5">
          <h2
            id="quick-view-title"
            className="text-xl font-black text-white"
          >
            Quick View
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick view"
            className="rounded-lg p-2 text-2xl text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              {card.imageUrl ? (
                <img
                  src={card.imageUrl}
                  alt={card.playerName}
                  className="aspect-square w-full object-contain p-4"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-neutral-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              Sideline Mentality Cards
            </p>

            <h3 className="mt-2 text-3xl font-black text-white">
              {card.playerName}
            </h3>

            <p className="mt-3 text-lg text-neutral-400">
              {[card.year, card.brand].filter(Boolean).join(" • ")}
            </p>

            <p className="mt-8 text-4xl font-black text-green-400">
              ${card.price.toFixed(2)}
            </p>

            <div className="mt-6">
              {card.availableStock > 0 ? (
                <span className="rounded-full bg-green-500/15 px-4 py-2 text-sm font-bold text-green-400">
                  {card.availableStock} in stock
                </span>
              ) : (
                <span className="rounded-full bg-red-500/15 px-4 py-2 text-sm font-bold text-red-400">
                  Sold Out
                </span>
              )}
            </div>

            <AddToCartButton card={card} />

            <Link
              href={`/cards/${card.slug}`}
              className="mt-4 flex items-center justify-center rounded-xl border border-white/15 px-6 py-4 font-black text-white transition hover:border-green-500 hover:bg-green-500 hover:text-black"
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}