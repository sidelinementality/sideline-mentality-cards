import assert from "node:assert/strict";
import test from "node:test";
import {
  NOT_FOUND_SKIP_REASON,
  ORDER_SKIP_REASON,
  buildBulkDeleteMessage,
  cardImageStoragePaths,
  planBulkCardDeletion,
} from "./bulk-card-deletion.ts";

test("safe cards are planned for deletion", () => {
  const plan = planBulkCardDeletion({
    requestedIds: ["a", "b", "c"],
    existingIds: ["a", "b", "c"],
    orderReferencedIds: [],
  });

  assert.deepEqual(plan.deletableIds, ["a", "b", "c"]);
  assert.deepEqual(plan.skipped, []);
});

test("cards that appear in order_items are refused and never deletable", () => {
  const plan = planBulkCardDeletion({
    requestedIds: ["safe", "sold"],
    existingIds: ["safe", "sold"],
    orderReferencedIds: ["sold"],
  });

  assert.deepEqual(plan.deletableIds, ["safe"]);
  assert.deepEqual(plan.skipped, [
    { cardId: "sold", reason: ORDER_SKIP_REASON },
  ]);
  assert.equal(plan.deletableIds.includes("sold"), false);
});

test("missing card IDs are skipped and not deleted", () => {
  const plan = planBulkCardDeletion({
    requestedIds: ["exists", "gone"],
    existingIds: ["exists"],
    orderReferencedIds: [],
  });

  assert.deepEqual(plan.deletableIds, ["exists"]);
  assert.deepEqual(plan.skipped, [
    { cardId: "gone", reason: NOT_FOUND_SKIP_REASON },
  ]);
});

test("order protection takes precedence over deletion even when mixed with missing IDs", () => {
  const plan = planBulkCardDeletion({
    requestedIds: ["safe", "sold", "gone"],
    existingIds: ["safe", "sold"],
    orderReferencedIds: ["sold", "gone"],
  });

  assert.deepEqual(plan.deletableIds, ["safe"]);
  assert.deepEqual(plan.skipped, [
    { cardId: "sold", reason: ORDER_SKIP_REASON },
    { cardId: "gone", reason: NOT_FOUND_SKIP_REASON },
  ]);
});

test("an already-deleted card referenced by an order is skipped as not found and not deleted", () => {
  const plan = planBulkCardDeletion({
    requestedIds: ["historical"],
    existingIds: [],
    orderReferencedIds: ["historical"],
  });

  assert.deepEqual(plan.deletableIds, []);
  assert.deepEqual(plan.skipped, [
    { cardId: "historical", reason: NOT_FOUND_SKIP_REASON },
  ]);
});

test("all-deleted message matches the inventory copy", () => {
  assert.equal(
    buildBulkDeleteMessage(4, []),
    "4 inventory records permanently deleted.",
  );
  assert.equal(
    buildBulkDeleteMessage(1, []),
    "1 inventory record permanently deleted.",
  );
});

test("protected-order message matches the inventory copy", () => {
  assert.equal(
    buildBulkDeleteMessage(3, [
      { cardId: "sold", reason: ORDER_SKIP_REASON },
    ]),
    "3 inventory records deleted. 1 was not deleted because it appears on an order.",
  );
  assert.equal(
    buildBulkDeleteMessage(2, [
      { cardId: "sold-1", reason: ORDER_SKIP_REASON },
      { cardId: "sold-2", reason: ORDER_SKIP_REASON },
    ]),
    "2 inventory records deleted. 2 were not deleted because they appear on orders.",
  );
});

test("all-protected cards produce a skipped-only message", () => {
  assert.equal(
    buildBulkDeleteMessage(0, [
      { cardId: "sold", reason: ORDER_SKIP_REASON },
    ]),
    "0 inventory records deleted. 1 was not deleted because it appears on an order.",
  );
});

test("card image storage paths are extracted from public card-images URLs", () => {
  assert.deepEqual(
    cardImageStoragePaths([
      "https://example.supabase.co/storage/v1/object/public/card-images/cards/front.jpg",
      "https://example.supabase.co/storage/v1/object/public/card-images/cards/back.jpg",
      null,
      "",
      "https://example.com/unrelated.jpg",
    ]),
    ["cards/front.jpg", "cards/back.jpg"],
  );
});
