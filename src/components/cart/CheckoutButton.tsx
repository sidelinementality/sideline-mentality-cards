"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function CheckoutButton() {
  const { items } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to start checkout."
        );
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Checkout failed."
      );
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full rounded-xl bg-green-700 py-4 font-black text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {loading ? "Redirecting..." : "Secure Checkout"}
      </button>

      {error && (
        <p className="mt-3 text-center text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </>
  );
}