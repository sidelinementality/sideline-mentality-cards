"use client";

import { useEffect, useState } from "react";

const messages = [
  "🚚 FREE Shipping on Orders $100+",
  "⭐ New Cards Added Every Week",
  "🔒 Secure Checkout Powered by Stripe",
  "💚 Collector-Owned • Faith-Driven • Fast Shipping",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
        <p
          key={index}
          className="text-center text-xs font-bold uppercase tracking-[0.18em] transition-opacity duration-500 sm:text-sm"
        >
          {messages[index]}
        </p>
      </div>
    </div>
  );
}