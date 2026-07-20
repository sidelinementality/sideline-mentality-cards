"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartButtonProps = {
  card: {
    id: string;
    slug: string;
    playerName: string;
    year: number | null;
    brand: string | null;
    price: number;
    imageUrl: string | null;
    availableStock: number;
  };
};

export default function AddToCartButton({
  card,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [wasAdded, setWasAdded] = useState(false);

  const cartItem = items.find((item) => item.id === card.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const isSoldOut = card.availableStock <= 0;
  const isAtStockLimit =
    quantityInCart >= card.availableStock;

  function handleAddToCart() {
    if (isSoldOut || isAtStockLimit) {
      return;
    }

    addItem(card);
    setWasAdded(true);

    window.setTimeout(() => {
      setWasAdded(false);
    }, 1500);
  }

  let buttonText = "Add to Cart";

  if (isSoldOut) {
    buttonText = "Sold Out";
  } else if (isAtStockLimit) {
    buttonText = "Maximum Quantity in Cart";
  } else if (wasAdded) {
    buttonText = "Added to Cart!";
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isSoldOut || isAtStockLimit}
        className="w-full rounded-xl bg-green-700 px-6 py-4 font-black text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
      >
        {buttonText}
      </button>

      {quantityInCart > 0 && (
        <p className="mt-3 text-center text-sm font-bold text-slate-500">
          {quantityInCart}{" "}
          {quantityInCart === 1 ? "card" : "cards"} currently
          in your cart
        </p>
      )}
    </div>
  );
}