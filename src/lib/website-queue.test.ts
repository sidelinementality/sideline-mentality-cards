import assert from "node:assert/strict";
import test from "node:test";
import {
  AVAILABLE_STATUS,
  PUBLISHED_STATUS,
  READY_TO_PUBLISH_STATUS,
  WEBSITE_QUEUE_ROUTE,
  applyPublishToWebsite,
  canViewLiveCard,
  intakePublishWebsiteFields,
  isLiveOnWebsite,
  isPublicStorefrontVisible,
  isReadyToPublish,
  splitWebsiteQueue,
} from "./website-queue.ts";

function card(
  overrides: Partial<{
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
  }> = {},
) {
  return {
    id: "card-1",
    slug: "isaiah-denis",
    player_name: "Isaiah Denis",
    year: 2026,
    brand: "Topps",
    set_name: "Chrome",
    parallel: null,
    card_number: "12",
    price: 25,
    stock: 1,
    image_url: "/front.jpg",
    featured: false,
    website_ready: true,
    listing_status: "Ready to Publish",
    ...overrides,
  };
}

test("Website Queue route matches the existing sidebar href", () => {
  assert.equal(WEBSITE_QUEUE_ROUTE, "/dashboard/website");
});

test("Dealer Intake Ready for website writes Ready to Publish and is not public", () => {
  const fields = intakePublishWebsiteFields(true);
  const created = card({
    website_ready: fields.websiteReady,
    listing_status: fields.listingStatus,
  });

  assert.deepEqual(fields, {
    websiteReady: true,
    listingStatus: READY_TO_PUBLISH_STATUS,
  });
  assert.equal(isReadyToPublish(created), true);
  assert.equal(isLiveOnWebsite(created), false);
  assert.equal(isPublicStorefrontVisible(created), false);
});

test("Dealer Intake without Ready for website stays Available and off the queue", () => {
  const fields = intakePublishWebsiteFields(false);
  const created = card({
    website_ready: fields.websiteReady,
    listing_status: fields.listingStatus,
  });

  assert.deepEqual(fields, {
    websiteReady: false,
    listingStatus: AVAILABLE_STATUS,
  });
  assert.equal(isReadyToPublish(created), false);
  assert.equal(isLiveOnWebsite(created), false);
  assert.equal(isPublicStorefrontVisible(created), false);
});

test("Website Queue recognizes Ready to Publish", () => {
  assert.equal(isReadyToPublish(card()), true);
  assert.equal(
    isReadyToPublish(card({ website_ready: false })),
    false,
  );
  assert.equal(
    isReadyToPublish(card({ listing_status: "Published" })),
    false,
  );
  assert.equal(
    isReadyToPublish(card({ listing_status: "Available" })),
    false,
  );
});

test("Publish to Website sets Published and keeps website_ready and stock", () => {
  const ready = card({ stock: 2, website_ready: true });
  const published = applyPublishToWebsite(ready);

  assert.equal(published.listing_status, PUBLISHED_STATUS);
  assert.equal(published.website_ready, true);
  assert.equal(published.stock, 2);
  assert.equal(isReadyToPublish(published), false);
  assert.equal(isLiveOnWebsite(published), true);
});

test("Published card appears in Live on Website", () => {
  const result = splitWebsiteQueue([
    card({ id: "ready", listing_status: "Ready to Publish" }),
    applyPublishToWebsite(card({ id: "live" })),
    card({ id: "available", listing_status: "Available" }),
  ]);

  assert.deepEqual(
    result.readyToPublish.map((item) => item.id),
    ["ready"],
  );
  assert.deepEqual(
    result.liveOnWebsite.map((item) => item.id),
    ["live"],
  );
});

test("Published card satisfies public storefront visibility rules", () => {
  const published = applyPublishToWebsite(card({ stock: 1 }));

  assert.equal(isPublicStorefrontVisible(published), true);
  assert.equal(
    isPublicStorefrontVisible(applyPublishToWebsite(card({ stock: 0 }))),
    false,
  );
  assert.equal(isPublicStorefrontVisible(card()), false);
});

test("inventory that is not website_ready does not enter Website Queue", () => {
  const result = splitWebsiteQueue([
    card({
      id: "plain",
      website_ready: false,
      listing_status: "Available",
    }),
    card({
      id: "ready-without-flag",
      website_ready: false,
      listing_status: "Ready to Publish",
    }),
  ]);

  assert.equal(result.readyToPublishCount, 0);
  assert.equal(result.liveOnWebsiteCount, 0);
});

test("View is allowed only for live published cards with a valid slug", () => {
  assert.equal(
    canViewLiveCard(card({ listing_status: "Published", slug: "isaiah-denis" })),
    true,
  );
  assert.equal(
    canViewLiveCard(card({ listing_status: "Ready to Publish", slug: "isaiah-denis" })),
    false,
  );
  assert.equal(
    canViewLiveCard(card({ listing_status: "Published", slug: "  " })),
    false,
  );
  assert.equal(
    canViewLiveCard(card({ listing_status: "Published", slug: null })),
    false,
  );
});
