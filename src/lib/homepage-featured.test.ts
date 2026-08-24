import assert from "node:assert/strict";
import test from "node:test";
import { isHomepageFeaturedEligible } from "./homepage-featured.ts";

function card(
  overrides: Partial<{
    featured: boolean | null;
    website_ready: boolean | null;
    listing_status: string | null;
    stock: number | null;
  }> = {},
) {
  return {
    featured: true,
    website_ready: true,
    listing_status: "Published",
    stock: 1,
    ...overrides,
  };
}

test("live featured published in-stock cards are eligible for homepage featured sections", () => {
  assert.equal(isHomepageFeaturedEligible(card()), true);
});

test("deleted or missing featured cards are not eligible", () => {
  assert.equal(
    isHomepageFeaturedEligible(
      card({ featured: false, website_ready: true, listing_status: "Published" }),
    ),
    false,
  );
});

test("unpublished cards are not eligible for homepage featured sections", () => {
  assert.equal(
    isHomepageFeaturedEligible(card({ listing_status: "Ready to Publish" })),
    false,
  );
  assert.equal(
    isHomepageFeaturedEligible(card({ listing_status: "Available" })),
    false,
  );
});

test("cards removed from website readiness are not eligible", () => {
  assert.equal(
    isHomepageFeaturedEligible(card({ website_ready: false })),
    false,
  );
});

test("zero-stock cards are not eligible for homepage featured sections", () => {
  assert.equal(isHomepageFeaturedEligible(card({ stock: 0 })), false);
  assert.equal(isHomepageFeaturedEligible(card({ stock: null })), false);
});
