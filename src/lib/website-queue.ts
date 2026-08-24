export const WEBSITE_QUEUE_ROUTE = "/dashboard/website";

export const READY_TO_PUBLISH_STATUS = "Ready to Publish";
export const PUBLISHED_STATUS = "Published";
export const AVAILABLE_STATUS = "Available";

export type WebsiteQueueCard = {
  id: string;
  slug: string | null;
  player_name: string | null;
  year: number | null;
  brand: string | null;
  set_name: string | null;
  parallel: string | null;
  card_number: string | null;
  price: number | string | null;
  stock: number | null;
  image_url: string | null;
  featured: boolean | null;
  website_ready: boolean | null;
  listing_status: string | null;
};

export function listingStatus(card: Pick<WebsiteQueueCard, "listing_status">) {
  return (card.listing_status ?? "").trim();
}

export function isWebsiteReady(card: Pick<WebsiteQueueCard, "website_ready">) {
  return card.website_ready === true;
}

export function intakePublishWebsiteFields(websiteReady: boolean) {
  if (websiteReady) {
    return {
      websiteReady: true,
      listingStatus: READY_TO_PUBLISH_STATUS,
    };
  }

  return {
    websiteReady: false,
    listingStatus: AVAILABLE_STATUS,
  };
}

export function applyPublishToWebsite<T extends WebsiteQueueCard>(card: T): T {
  return {
    ...card,
    website_ready: true,
    listing_status: PUBLISHED_STATUS,
  };
}

export function isReadyToPublish(card: WebsiteQueueCard) {
  return (
    isWebsiteReady(card) &&
    listingStatus(card).toLowerCase() === READY_TO_PUBLISH_STATUS.toLowerCase()
  );
}

export function isLiveOnWebsite(card: WebsiteQueueCard) {
  return (
    isWebsiteReady(card) &&
    listingStatus(card).toLowerCase() === PUBLISHED_STATUS.toLowerCase()
  );
}

export function isPublicStorefrontVisible(card: WebsiteQueueCard) {
  return isLiveOnWebsite(card) && Number(card.stock ?? 0) > 0;
}

export function hasValidSlug(card: Pick<WebsiteQueueCard, "slug">) {
  return Boolean(card.slug?.trim());
}

export function canViewLiveCard(card: WebsiteQueueCard) {
  return isLiveOnWebsite(card) && hasValidSlug(card);
}

export function splitWebsiteQueue<T extends WebsiteQueueCard>(cards: T[]) {
  const readyToPublish = cards.filter(isReadyToPublish);
  const liveOnWebsite = cards.filter(isLiveOnWebsite);

  return {
    readyToPublish,
    liveOnWebsite,
    readyToPublishCount: readyToPublish.length,
    liveOnWebsiteCount: liveOnWebsite.length,
  };
}
