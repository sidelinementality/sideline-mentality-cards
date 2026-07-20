"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import CheckoutButton from "@/components/cart/CheckoutButton";

export default function CartPage() {
  const {
    items,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-black">Shopping Cart</h1>

        <p className="mt-6 text-lg text-slate-600">
          Your shopping cart is empty.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-xl bg-green-700 px-6 py-3 font-black text-white hover:bg-green-600"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-10 text-4xl font-black">
        Shopping Cart
      </h1>

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 rounded-2xl border bg-white p-5 shadow"
            >
              <div className="relative h-32 w-24 overflow-hidden rounded-lg bg-zinc-100">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.playerName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <h2 className="text-xl font-black">
                  {item.playerName}
                </h2>

                <p className="text-slate-500">
                  {item.year} {item.brand}
                </p>

                <p className="mt-3 text-2xl font-black">
                  ${item.price.toFixed(2)}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                    className="rounded-lg border px-3 py-1 font-black"
                  >
                    −
                  </button>

                  <span className="w-8 text-center font-black">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                    className="rounded-lg border px-3 py-1 font-black"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="ml-6 font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-2xl border bg-white p-6 shadow">
          <h2 className="text-2xl font-black">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between">
            <span>Subtotal</span>

            <span className="font-black">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span>Shipping</span>

            <span>Calculated at checkout</span>
          </div>

          <hr className="my-6" />

          <CheckoutButton />
        </aside>
      </div>
    </main>
  );
}