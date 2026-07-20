"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DealerActionsProps = {
  orderId: string;
  currentStatus: string | null;
};

type FulfillmentStatus =
  | "pending"
  | "packed"
  | "shipped"
  | "delivered";

type NextAction = {
  status: FulfillmentStatus;
  label: string;
};

function getNextAction(
  currentStatus: string,
): NextAction | null {
  if (currentStatus === "pending") {
    return {
      status: "packed",
      label: "Mark Packed",
    };
  }

  if (currentStatus === "packed") {
    return {
      status: "shipped",
      label: "Mark Shipped",
    };
  }

  if (currentStatus === "shipped") {
    return {
      status: "delivered",
      label: "Mark Delivered",
    };
  }

  return null;
}

export default function DealerActions({
  orderId,
  currentStatus,
}: DealerActionsProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedCurrentStatus =
    currentStatus?.toLowerCase() ?? "pending";

  const nextAction = getNextAction(
    normalizedCurrentStatus,
  );

  async function updateStatus(
    status: FulfillmentStatus,
  ) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fulfillmentStatus: status,
          }),
        },
      );

      const result = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ||
            "The order status could not be updated.",
        );
      }

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The order status could not be updated.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
        Dealer Actions
      </p>

      <h2 className="mt-2 text-xl font-black">
        Fulfillment Workflow
      </h2>

      <p className="mt-2 text-sm text-neutral-400">
        Current status:{" "}
        <span className="font-bold capitalize text-white">
          {normalizedCurrentStatus}
        </span>
      </p>

      <div className="mt-6">
        {nextAction ? (
          <button
            type="button"
            disabled={isLoading}
            onClick={() =>
              updateStatus(nextAction.status)
            }
            className="inline-flex min-w-44 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-bold text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Updating..."
              : nextAction.label}
          </button>
        ) : (
          <div className="inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-bold text-green-300">
            Order Complete ✓
          </div>
        )}
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}
    </section>
  );
}