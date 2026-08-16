export const ORDER_SKIP_REASON = "This card appears on an order.";
export const NOT_FOUND_SKIP_REASON = "Card was not found.";

export type BulkDeleteSkip = {
  cardId: string;
  reason: string;
};

export type BulkDeletePlan = {
  deletableIds: string[];
  skipped: BulkDeleteSkip[];
};

export function planBulkCardDeletion(input: {
  requestedIds: string[];
  existingIds: string[];
  orderReferencedIds: string[];
}): BulkDeletePlan {
  const existingIds = new Set(input.existingIds);
  const orderReferencedIds = new Set(input.orderReferencedIds);
  const deletableIds: string[] = [];
  const skipped: BulkDeleteSkip[] = [];

  for (const cardId of input.requestedIds) {
    if (!existingIds.has(cardId)) {
      skipped.push({
        cardId,
        reason: NOT_FOUND_SKIP_REASON,
      });
      continue;
    }

    if (orderReferencedIds.has(cardId)) {
      skipped.push({
        cardId,
        reason: ORDER_SKIP_REASON,
      });
      continue;
    }

    deletableIds.push(cardId);
  }

  return { deletableIds, skipped };
}

export function buildBulkDeleteMessage(
  deletedCount: number,
  skipped: BulkDeleteSkip[],
) {
  const deletedLabel =
    deletedCount === 1 ? "inventory record" : "inventory records";

  if (skipped.length === 0) {
    return `${deletedCount} ${deletedLabel} permanently deleted.`;
  }

  const orderCount = skipped.filter(
    (item) => item.reason === ORDER_SKIP_REASON,
  ).length;
  const notFoundCount = skipped.filter(
    (item) => item.reason === NOT_FOUND_SKIP_REASON,
  ).length;

  const skipParts: string[] = [];

  if (orderCount > 0) {
    skipParts.push(
      orderCount === 1
        ? "1 was not deleted because it appears on an order."
        : `${orderCount} were not deleted because they appear on orders.`,
    );
  }

  if (notFoundCount > 0) {
    skipParts.push(
      notFoundCount === 1
        ? "1 was not deleted because it was not found."
        : `${notFoundCount} were not deleted because they were not found.`,
    );
  }

  if (deletedCount === 0) {
    return `0 inventory records deleted. ${skipParts.join(" ")}`;
  }

  return `${deletedCount} ${deletedLabel} deleted. ${skipParts.join(" ")}`;
}

export function cardImageStoragePath(imageUrl: string) {
  const path = imageUrl.split("/card-images/")[1];
  return path ? path : null;
}

export function cardImageStoragePaths(
  urls: Array<string | null | undefined>,
) {
  const paths = new Set<string>();

  for (const url of urls) {
    if (typeof url !== "string" || url.length === 0) {
      continue;
    }

    const path = cardImageStoragePath(url);
    if (path) {
      paths.add(path);
    }
  }

  return Array.from(paths);
}
