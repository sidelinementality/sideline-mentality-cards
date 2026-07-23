"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type TrackingFormProps = {
  orderId: string;
  currentCarrier: string | null;
  currentTrackingNumber: string | null;
};

const carriers = ["USPS", "UPS", "FedEx"] as const;

type ShippingCarrier = (typeof carriers)[number];

export default function TrackingForm({
  orderId,
  currentCarrier,
  currentTrackingNumber,
}: TrackingFormProps) {
  const router = useRouter();

  const startingCarrier = carriers.includes(
    currentCarrier as ShippingCarrier,
  )
    ? (currentCarrier as ShippingCarrier)
    : "USPS";

  const [shippingCarrier, setShippingCarrier] =
    useState<ShippingCarrier>(startingCarrier);

  const [trackingNumber, setTrackingNumber] = useState(
    currentTrackingNumber ?? "",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedTrackingNumber = trackingNumber.trim();

    if (!cleanedTrackingNumber) {
      setError("Please enter a tracking number.");
      setMessage(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fulfillmentStatus: "shipped",
            shippingCarrier,
            trackingNumber: cleanedTrackingNumber,
          }),
        },
      );

      const result = (await response.json()) as {
        error?: string;
        message?: string;
        emailWarning?: string | null;
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "The order could not be updated.",
        );
      }

      if (result.emailWarning) {
        setMessage(
          `Order marked as shipped. ${result.emailWarning}`,
        );
      } else {
        setMessage(
          result.message ??
            "Order marked as shipped and the customer was emailed.",
        );
      }

      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while shipping the order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
          Shipping
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Ship This Order
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Select the carrier and enter the tracking number. The
          customer will automatically receive a shipping email.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5 lg:grid-cols-[220px_1fr_auto] lg:items-end"
      >
        <div>
          <label
            htmlFor="shippingCarrier"
            className="mb-2 block text-sm font-bold text-neutral-200"
          >
            Shipping Carrier
          </label>

          <select
            id="shippingCarrier"
            value={shippingCarrier}
            onChange={(event) =>
              setShippingCarrier(
                event.target.value as ShippingCarrier,
              )
            }
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          >
            {carriers.map((carrier) => (
              <option key={carrier} value={carrier}>
                {carrier}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="trackingNumber"
            className="mb-2 block text-sm font-bold text-neutral-200"
          >
            Tracking Number
          </label>

          <input
            id="trackingNumber"
            type="text"
            value={trackingNumber}
            onChange={(event) =>
              setTrackingNumber(event.target.value)
            }
            placeholder="Enter the package tracking number"
            autoComplete="off"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 outline-none transition focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-green-500 px-6 py-3 font-black text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Shipping..." : "Mark as Shipped"}
        </button>
      </form>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200">
          {message}
        </div>
      ) : null}

      {currentTrackingNumber ? (
        <p className="mt-5 text-sm text-neutral-400">
          Current tracking number:{" "}
          <span className="font-bold text-white">
            {currentTrackingNumber}
          </span>
        </p>
      ) : null}
    </section>
  );
}