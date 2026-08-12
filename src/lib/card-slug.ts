/**
 * Shared card URL-slug helpers.
 * Must stay aligned with the database cards_slug_key unique constraint path.
 */

function cleanOptionalText(value: string | null | undefined) {
  const cleanedValue = value?.trim();
  return cleanedValue ? cleanedValue : null;
}

export function createSlug(parts: Array<string | number | null | undefined>) {
  return parts
    .filter((part) => part !== null && part !== undefined && part !== "")
    .join("-")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Same slug resolution used by POST /api/cards before insert. */
export function resolveCardSlug(input: {
  playerName?: string | null;
  year?: number | string | null;
  brand?: string | null;
  setName?: string | null;
  parallel?: string | null;
  cardNumber?: string | null;
  slug?: string | null;
}) {
  const playerName = input.playerName?.trim();
  const brand = input.brand?.trim();
  const setName = cleanOptionalText(input.setName);
  const parallel = cleanOptionalText(input.parallel);
  const cardNumber = cleanOptionalText(input.cardNumber);
  const year = Number(input.year);
  const suppliedSlug = input.slug?.trim().toLowerCase();

  const generatedSlug = createSlug([
    playerName,
    year,
    brand,
    setName,
    parallel,
    cardNumber,
  ]);

  return suppliedSlug || generatedSlug;
}
