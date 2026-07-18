"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export type EditableCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string;
  team: string | null;
  year: string;
  brand: string;
  set_name: string | null;
  card_number: string | null;
  grade_company: string | null;
  grade: string | null;
  price: number;
  image_url: string | null;
  featured: boolean;
  rookie_card: boolean;
  autograph: boolean;
  serial_number: string | null;
  stock: number;
  condition_notes: string | null;
};

type EditCardFormProps = {
  card: EditableCard;
};

export default function EditCardForm({ card }: EditCardFormProps) {
  const router = useRouter();

  const [playerName, setPlayerName] = useState(card.player_name);
  const [slug, setSlug] = useState(card.slug);
  const [sport, setSport] = useState(card.sport);
  const [team, setTeam] = useState(card.team ?? "");
  const [year, setYear] = useState(card.year);
  const [brand, setBrand] = useState(card.brand);
  const [setName, setSetName] = useState(card.set_name ?? "");
  const [cardNumber, setCardNumber] = useState(card.card_number ?? "");
  const [gradeCompany, setGradeCompany] = useState(
    card.grade_company ?? ""
  );
  const [grade, setGrade] = useState(card.grade ?? "");
  const [price, setPrice] = useState(String(card.price));
  const [featured, setFeatured] = useState(card.featured);
  const [rookieCard, setRookieCard] = useState(card.rookie_card);
  const [autograph, setAutograph] = useState(card.autograph);
  const [serialNumber, setSerialNumber] = useState(
    card.serial_number ?? ""
  );
  const [stock, setStock] = useState(String(card.stock));
  const [conditionNotes, setConditionNotes] = useState(
    card.condition_notes ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName,
          slug,
          sport,
          team,
          year,
          brand,
          setName,
          cardNumber,
          gradeCompany,
          grade,
          price: Number(price),
          imageUrl: card.image_url,
          featured,
          rookieCard,
          autograph,
          serialNumber,
          stock: Number(stock),
          conditionNotes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The card could not be updated.");
      }

      setSuccess("Card updated successfully.");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the card."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${card.player_name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The card could not be deleted.");
      }

      router.push("/dashboard/inventory");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the card."
      );

      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={card.player_name}
                className="aspect-[3/4] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center text-sm text-white/50">
                No card image
              </div>
            )}
          </div>

          <p className="text-center text-sm text-white/50">
            The existing card image will remain unchanged.
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-xl font-bold text-white">
              Card Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="playerName"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Player Name
                </label>

                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Slug
                </label>

                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="sport"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Sport
                </label>

                <select
                  id="sport"
                  value={sport}
                  onChange={(event) => setSport(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                >
                  <option value="">Select a sport</option>
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
                  htmlFor="team"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Team
                </label>

                <input
                  id="team"
                  type="text"
                  value={team}
                  onChange={(event) => setTeam(event.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Year
                </label>

                <input
                  id="year"
                  type="text"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Brand
                </label>

                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="setName"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Set Name
                </label>

                <input
                  id="setName"
                  type="text"
                  value={setName}
                  onChange={(event) => setSetName(event.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Card Number
                </label>

                <input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-xl font-bold text-white">
              Grading and Special Features
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="gradeCompany"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Grading Company
                </label>

                <select
                  id="gradeCompany"
                  value={gradeCompany}
                  onChange={(event) => setGradeCompany(event.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                >
                  <option value="">Ungraded</option>
                  <option value="PSA">PSA</option>
                  <option value="BGS">BGS</option>
                  <option value="SGC">SGC</option>
                  <option value="CGC">CGC</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="grade"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Grade
                </label>

                <input
                  id="grade"
                  type="text"
                  value={grade}
                  onChange={(event) => setGrade(event.target.value)}
                  placeholder="Example: 10"
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="serialNumber"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Serial Number
                </label>

                <input
                  id="serialNumber"
                  type="text"
                  value={serialNumber}
                  onChange={(event) => setSerialNumber(event.target.value)}
                  placeholder="Example: 12/99"
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4 text-white">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />
                Featured
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4 text-white">
                <input
                  type="checkbox"
                  checked={rookieCard}
                  onChange={(event) => setRookieCard(event.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />
                Rookie Card
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4 text-white">
                <input
                  type="checkbox"
                  checked={autograph}
                  onChange={(event) => setAutograph(event.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />
                Autograph
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-xl font-bold text-white">
              Pricing and Inventory
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Price
                </label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="conditionNotes"
                className="mb-2 block text-sm font-semibold text-white/80"
              >
                Condition Notes
              </label>

              <textarea
                id="conditionNotes"
                value={conditionNotes}
                onChange={(event) => setConditionNotes(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-green-500"
              />
            </div>
          </section>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-6 py-3 font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Card"}
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/inventory"
                className="rounded-lg border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving || deleting}
                className="rounded-lg bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}