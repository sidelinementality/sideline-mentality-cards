"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import CardImageUpload from "@/components/cards/CardImageUpload";

export default function AddCardPage() {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage("");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const cardData = {
        playerName: String(formData.get("playerName") || "").trim(),
        slug: String(formData.get("slug") || "")
          .trim()
          .toLowerCase(),
        sport: String(formData.get("sport") || "").trim(),
        year: Number(formData.get("year")),
        brand: String(formData.get("brand") || "").trim(),
        price: Number(formData.get("price")),
        imageUrl,
        featured: formData.get("featured") === "on",
      };

      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The card could not be saved.");
      }

      router.push(`/cards/${result.card.slug}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the card.";

      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Inventory
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Add New Card
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Enter the card information, upload an image, and save the listing to
          your Sideline Mentality Cards inventory.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-black text-white">
              Card Information
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Enter the main details customers will see.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="playerName"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Player or Subject Name
              </label>

              <input
                id="playerName"
                name="playerName"
                type="text"
                required
                placeholder="Example: Patrick Mahomes"
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-semibold text-white"
              >
                URL Slug
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                placeholder="patrick-mahomes-2023-prizm"
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Use lowercase letters, numbers, and hyphens. Do not use spaces.
              </p>
            </div>

            <div>
              <label
                htmlFor="sport"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Sport
              </label>

              <select
                id="sport"
                name="sport"
                required
                defaultValue=""
                className="w-full rounded-lg border border-white/15 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-green-500"
              >
                <option value="" disabled>
                  Select a sport
                </option>

                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Baseball">Baseball</option>
                <option value="Hockey">Hockey</option>
                <option value="Soccer">Soccer</option>
                <option value="WWE">WWE</option>
                <option value="UFC">UFC</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Year
              </label>

              <input
                id="year"
                name="year"
                type="number"
                required
                min="1800"
                max="2100"
                step="1"
                placeholder="2024"
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="brand"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Brand or Set
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                required
                placeholder="Example: Panini Prizm"
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="249.99"
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-black text-white">Card Image</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Select the card image and click Upload Card Image before saving
              the listing.
            </p>
          </div>

          <CardImageUpload onUploadComplete={setImageUrl} />

          {imageUrl && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-sm font-semibold text-green-300">
                Image uploaded and ready to save with this card.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="featured"
              className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-green-600"
            />

            <span>
              <span className="block font-semibold text-white">
                Feature this card on the homepage
              </span>

              <span className="mt-1 block text-sm text-zinc-400">
                Featured cards appear in the Featured Inventory section.
              </span>
            </span>
          </label>
        </section>

        {errorMessage && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-sm font-semibold text-red-300">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            disabled={isSaving}
            className="rounded-lg border border-white/15 px-6 py-3 font-bold text-white transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!imageUrl || isSaving}
            className="rounded-lg bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving Card..." : "Save Card"}
          </button>
        </div>
      </form>
    </div>
  );
}