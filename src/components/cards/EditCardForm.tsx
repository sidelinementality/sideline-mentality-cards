"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type EditableCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  set_name: string | null;
  card_number: string | null;
  grade_company: string | null;
  grade: string | null;
  price: number | string | null;
  image_url: string | null;
  featured: boolean | null;
  rookie_card: boolean | null;
  autograph: boolean | null;
  serial_number: string | null;
  stock: number | null;
  condition_notes: string | null;
};

type EditCardFormProps = {
  card: EditableCard;
};

export default function EditCardForm({ card }: EditCardFormProps) {
  const [playerName, setPlayerName] = useState(card.player_name);
  const [slug, setSlug] = useState(card.slug);
  const [sport, setSport] = useState(card.sport ?? "");
  const [team, setTeam] = useState(card.team ?? "");
  const [year, setYear] = useState(String(card.year ?? ""));
  const [brand, setBrand] = useState(card.brand ?? "");
  const [setName, setSetName] = useState(card.set_name ?? "");
  const [cardNumber, setCardNumber] = useState(card.card_number ?? "");
  const [gradeCompany, setGradeCompany] = useState(
    card.grade_company ?? ""
  );
  const [grade, setGrade] = useState(card.grade ?? "");
  const [price, setPrice] = useState(String(card.price ?? ""));
  const [stock, setStock] = useState(String(card.stock ?? 0));
  const [serialNumber, setSerialNumber] = useState(
    card.serial_number ?? ""
  );
  const [conditionNotes, setConditionNotes] = useState(
    card.condition_notes ?? ""
  );

  const [featured, setFeatured] = useState(Boolean(card.featured));
  const [rookieCard, setRookieCard] = useState(
    Boolean(card.rookie_card)
  );
  const [autograph, setAutograph] = useState(Boolean(card.autograph));

  const router = useRouter();

const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
          year: Number(year),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <div>
            <p className="mb-3 text-sm font-bold text-white">
              Current Card Image
            </p>

            <div className="overflow-hidden rounded-xl bg-black p-3">
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={`${card.player_name} card`}
                  className="aspect-[3/4] h-full w-full object-contain"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center text-sm text-zinc-500">
                  No image
                </div>
              )}
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-500">
              Changing the card image will be added after the basic update
              form is working.
            </p>

            <Link
              href={`/cards/${card.slug}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              View Public Listing
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <TextInput
              id="playerName"
              label="Player or Subject"
              value={playerName}
              onChange={setPlayerName}
              required
            />

            <TextInput
              id="slug"
              label="URL Slug"
              value={slug}
              onChange={setSlug}
              required
            />

            <SelectInput
              id="sport"
              label="Sport"
              value={sport}
              onChange={setSport}
              required
              options={[
                "Football",
                "Basketball",
                "Baseball",
                "Hockey",
                "Soccer",
                "UFC",
                "WWE",
                "NASCAR",
                "Other",
              ]}
            />

            <TextInput
              id="team"
              label="Team"
              value={team}
              onChange={setTeam}
            />

            <TextInput
              id="year"
              label="Year"
              type="number"
              value={year}
              onChange={setYear}
              required
            />

            <TextInput
              id="brand"
              label="Brand"
              value={brand}
              onChange={setBrand}
              required
            />

            <TextInput
              id="setName"
              label="Set Name"
              value={setName}
              onChange={setSetName}
            />

            <TextInput
              id="cardNumber"
              label="Card Number"
              value={cardNumber}
              onChange={setCardNumber}
            />

            <SelectInput
              id="gradeCompany"
              label="Grade Company"
              value={gradeCompany}
              onChange={setGradeCompany}
              options={[
                "PSA",
                "BGS",
                "SGC",
                "CGC",
                "CSG",
                "HGA",
                "Other",
              ]}
            />

            <TextInput
              id="grade"
              label="Grade"
              value={grade}
              onChange={setGrade}
              placeholder="Example: 10"
            />

            <TextInput
              id="price"
              label="Price"
              type="number"
              value={price}
              onChange={setPrice}
              min="0"
              step="0.01"
              required
            />

            <TextInput
              id="stock"
              label="Stock Quantity"
              type="number"
              value={stock}
              onChange={setStock}
              min="0"
              step="1"
              required
            />

            <TextInput
              id="serialNumber"
              label="Serial Number"
              value={serialNumber}
              onChange={setSerialNumber}
              placeholder="Example: 12/99"
            />

            <div className="md:col-span-2">
              <label
                htmlFor="conditionNotes"
                className="mb-2 block text-sm font-bold text-white"
              >
                Condition Notes
              </label>

              <textarea
                id="conditionNotes"
                value={conditionNotes}
                onChange={(event) =>
                  setConditionNotes(event.target.value)
                }
                rows={5}
                placeholder="Enter any condition details or notes about the card."
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-black text-white">
          Card Attributes
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Choose the options that apply to this card.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <CheckboxInput
            id="featured"
            label="Featured Card"
            description="Display this card in featured inventory."
            checked={featured}
            onChange={setFeatured}
          />

          <CheckboxInput
            id="rookieCard"
            label="Rookie Card"
            description="Mark this listing as a rookie card."
            checked={rookieCard}
            onChange={setRookieCard}
          />

          <CheckboxInput
            id="autograph"
            label="Autograph"
            description="Mark this card as autographed."
            checked={autograph}
            onChange={setAutograph}
          />
        </div>
      </section>
      {error ? (
  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
    {error}
  </div>
) : null}

{success ? (
  <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-semibold text-green-300">
    {success}
  </div>
) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard/inventory"
          className="rounded-lg border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:border-white/30 hover:bg-white/5"
        >
          Cancel
        </Link>

        <button
  type="submit"
  disabled={saving}
  className="rounded-lg bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving ? "Saving..." : "Save Changes"}
</button>
      </div>
    </form>
  );
}

type TextInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  required?: boolean;
  min?: string;
  step?: string;
};

function TextInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  step,
}: TextInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-white"
      >
        {label}
        {required ? (
          <span className="ml-1 text-green-500">*</span>
        ) : null}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
      />
    </div>
  );
}

type SelectInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
};

function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
}: SelectInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-white"
      >
        {label}
        {required ? (
          <span className="ml-1 text-green-500">*</span>
        ) : null}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-lg border border-white/15 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-green-500"
      >
        <option value="">
          {required ? "Select an option" : "None"}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

type CheckboxInputProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function CheckboxInput({
  id,
  label,
  description,
  checked,
  onChange,
}: CheckboxInputProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-green-600"
      />

      <span>
        <span className="block font-bold text-white">{label}</span>

        <span className="mt-1 block text-sm leading-5 text-zinc-500">
          {description}
        </span>
      </span>
    </label>
  );
}