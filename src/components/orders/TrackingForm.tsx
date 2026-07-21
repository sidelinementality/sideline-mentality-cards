"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type TrackingFormProps = {
  orderId: string;
  currentCarrier: string | null;
  currentTrackingNumber: string | null;
};

export default function TrackingForm({
  orderId,
  currentCarrier,
  currentTrackingNumber,
}: TrackingFormProps) {
  const router = useRouter();

  const [carrier, setCarrier] = useState(currentCarrier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(
    currentTrackingNumber ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/orders/${orderId}/tracking`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingCarrier: carrier,
          trackingNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save tracking.");
      }

      setMessage("Tracking saved successfully.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save tracking.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-black">Shipping & Tracking</h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="shipping-carrier"
            className="mb-2 block text-sm font-bold text-neutral-300"
          >
            Shipping Carrier
          </label>

          <select
            id="shipping-carrier"
            value={carrier}
            onChange={(event) => setCarrier(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-green-500"
          >
            <option value="">Select carrier</option>
            <option value="USPS">USPS</option>
            <option value="UPS">UPS</option>
            <option value="FedEx">FedEx</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tracking-number"
            className="mb-2 block text-sm font-bold text-neutral-300"
          >
            Tracking Number
          </label>

          <input
            id="tracking-number"
            type="text"
            value={trackingNumber}
            onChange={(event) =>
              setTrackingNumber(event.target.value)
            }
            placeholder="Enter tracking number"
            className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-green-500 px-5 py-3 font-black text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Tracking"}
        </button>

        {message ? (
          <p className="text-sm text-neutral-300">{message}</p>
        ) : null}
      </form>
    </section>
  );
}