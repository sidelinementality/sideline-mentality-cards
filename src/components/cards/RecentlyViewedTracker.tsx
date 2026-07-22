"use client";

import { useEffect } from "react";

type RecentlyViewedTrackerProps = {
  id: string;
  slug: string;
  playerName: string;
  year: number | null;
  brand: string | null;
  price: number;
  imageUrl: string | null;
};

const RECENTLY_VIEWED_KEY = "sm-recently-viewed";
const SESSION_ID_KEY = "sm-viewer-session-id";

function createSessionId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export default function RecentlyViewedTracker({
  id,
  slug,
  playerName,
  year,
  brand,
  price,
  imageUrl,
}: RecentlyViewedTrackerProps) {
  useEffect(() => {
    try {
      const card = {
        id,
        slug,
        playerName,
        year,
        brand,
        price,
        imageUrl,
        viewedAt: Date.now(),
      };

      const existingRecentlyViewed = localStorage.getItem(
        RECENTLY_VIEWED_KEY,
      );

      const recentlyViewedCards = existingRecentlyViewed
        ? JSON.parse(existingRecentlyViewed)
        : [];

      const filteredCards = recentlyViewedCards.filter(
        (item: { id: string }) => item.id !== id,
      );

      filteredCards.unshift(card);

      localStorage.setItem(
        RECENTLY_VIEWED_KEY,
        JSON.stringify(filteredCards.slice(0, 12)),
      );

      let sessionId = localStorage.getItem(SESSION_ID_KEY);

      if (!sessionId) {
        sessionId = createSessionId();
        localStorage.setItem(SESSION_ID_KEY, sessionId);
      }

      void fetch("/api/card-views", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: id,
          sessionId,
        }),
      }).catch((error) => {
        console.error("Card view request failed:", error);
      });
    } catch (error) {
      console.error(
        "Recently viewed card could not be recorded:",
        error,
      );
    }
  }, [id, slug, playerName, year, brand, price, imageUrl]);

  return null;
}