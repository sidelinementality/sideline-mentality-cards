import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const SITE_URL = "https://www.sidelinementalitycards.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/returns`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const { data: cards, error } = await supabase
    .from("cards")
    .select("slug, created_at")
    .gt("stock", 0)
    .not("slug", "is", null);

  if (error) {
    console.error("Sitemap cards error:", error.message);
    return staticPages;
  }

  const cardPages: MetadataRoute.Sitemap = (cards ?? [])
    .filter((card) => Boolean(card.slug))
    .map((card) => ({
      url: `${SITE_URL}/cards/${card.slug}`,
      lastModified: card.created_at
        ? new Date(card.created_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticPages, ...cardPages];
}