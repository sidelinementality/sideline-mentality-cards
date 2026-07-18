"use client";

import { useState } from "react";
import CardImageUpload from "@/components/cards/CardImageUpload";

export default function SellPage() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-500">
            Sideline Mentality Cards
          </p>

          <h1 className="text-4xl font-bold">Add New Card</h1>

          <p className="mt-3 text-gray-400">
            Upload a card image to test the new Supabase Storage connection.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <CardImageUpload onUploadComplete={setImageUrl} />

          {imageUrl && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <p className="mb-2 text-sm font-semibold text-green-300">
                Uploaded image URL
              </p>

              <p className="break-all text-sm text-gray-300">{imageUrl}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}