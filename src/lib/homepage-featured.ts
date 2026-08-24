export const HOMEPAGE_FEATURED_STATUS = "Published";

export type HomepageFeaturedEligibility = {
  featured: boolean | null;
  website_ready: boolean | null;
  listing_status: string | null;
  stock: number | null;
};

export function isHomepageFeaturedEligible(card: HomepageFeaturedEligibility) {
  return (
    card.featured === true &&
    card.website_ready === true &&
    (card.listing_status ?? "").trim().toLowerCase() ===
      HOMEPAGE_FEATURED_STATUS.toLowerCase() &&
    Number(card.stock ?? 0) > 0
  );
}
