"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PublishToWebsiteButtonProps = {
  cardId: string;
  playerName: string | null;
};

export default function PublishToWebsiteButton({
  cardId,
  playerName,
}: PublishToWebsiteButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function publishToWebsite() {
    const label = playerName?.trim() || "this card";
    const confirmed = window.confirm(
      `Publish ${label} to the public website? This will set the listing to Published.`,
    );

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/cards/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardIds: [cardId],
          action: "publish",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "The card could not be published to the website.",
        );
      }

      router.refresh();
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "The card could not be published to the website.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={publishToWebsite}
        disabled={busy}
        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "Publishing..." : "Publish to Website"}
      </button>

      {error ? (
        <p className="mt-2 max-w-[220px] text-xs font-semibold text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
