"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  purchaseSources,
  purchaseStatuses,
  formatPurchaseStatus,
  type Purchase,
} from "@/lib/purchases";

type PurchaseFormProps = {
  purchase?: Purchase;
  submitLabel: string;
};

export default function PurchaseForm({
  purchase,
  submitLabel,
}: PurchaseFormProps) {
  const router = useRouter();
  const isEdit = Boolean(purchase);

  const [name, setName] = useState(purchase?.name ?? "");
  const [purchaseDate, setPurchaseDate] = useState(
    purchase?.purchase_date?.slice(0, 10) ?? "",
  );
  const [source, setSource] = useState(purchase?.source ?? "");
  const [seller, setSeller] = useState(purchase?.seller ?? "");
  const [totalCost, setTotalCost] = useState(
    purchase ? String(purchase.total_cost ?? 0) : "",
  );
  const [expectedItemCount, setExpectedItemCount] = useState(
    purchase?.expected_item_count === null ||
      purchase?.expected_item_count === undefined
      ? ""
      : String(purchase.expected_item_count),
  );
  const [status, setStatus] = useState(purchase?.status ?? "open");
  const [notes, setNotes] = useState(purchase?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        name,
        purchaseDate,
        source,
        seller,
        totalCost: totalCost.trim() === "" ? 0 : Number(totalCost),
        expectedItemCount:
          expectedItemCount.trim() === ""
            ? null
            : Number(expectedItemCount),
        notes,
        status,
      };

      const response = await fetch(
        isEdit ? `/api/purchases/${purchase?.id}` : "/api/purchases",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The purchase could not be saved.");
      }

      if (isEdit) {
        setSuccessMessage("Purchase updated.");
        router.refresh();
        return;
      }

      router.push(`/dashboard/purchases/${result.purchase.id}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the purchase.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
    >
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
          {isEdit ? "Update purchase" : "New purchase / lot"}
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">
          {isEdit ? "Purchase details" : "Record an acquisition"}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Lot total cost stays on this purchase. Individual card cost stays on
          each inventory card.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-white md:col-span-2">
          Purchase / lot name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Facebook Marketplace Lot"
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </label>

        <label className="text-sm font-semibold text-white">
          Purchase date
          <input
            type="date"
            value={purchaseDate}
            onChange={(event) => setPurchaseDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </label>

        <label className="text-sm font-semibold text-white">
          Source / platform
          <select
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          >
            <option value="">Select source</option>
            {purchaseSources.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-white">
          Seller
          <input
            value={seller}
            onChange={(event) => setSeller(event.target.value)}
            placeholder="Seller or vendor"
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </label>

        <label className="text-sm font-semibold text-white">
          Total purchase cost
          <div className="relative mt-2">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-500">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={totalCost}
              onChange={(event) => setTotalCost(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-8 pr-4 text-white outline-none transition focus:border-green-500"
            />
          </div>
        </label>

        <label className="text-sm font-semibold text-white">
          Cards / items if known
          <input
            type="number"
            min="0"
            step="1"
            value={expectedItemCount}
            onChange={(event) => setExpectedItemCount(event.target.value)}
            placeholder="16"
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </label>

        <label className="text-sm font-semibold text-white">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          >
            {purchaseStatuses.map((option) => (
              <option key={option} value={option}>
                {formatPurchaseStatus(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-white md:col-span-2">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Anything useful about this lot or acquisition."
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </label>
      </div>

      {errorMessage && (
        <p className="mt-5 text-sm font-semibold text-red-300">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mt-5 text-sm font-semibold text-green-300">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-6 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500 disabled:opacity-40"
      >
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
