export const purchaseSources = [
  "Card Show",
  "eBay",
  "Facebook Marketplace",
  "Whatnot",
  "Local Collection",
  "Online Store",
  "Break",
  "Trade",
  "Personal Collection",
  "Other",
] as const;

export const purchaseStatuses = [
  "open",
  "processing",
  "complete",
  "archived",
] as const;

export type PurchaseSource = (typeof purchaseSources)[number];
export type PurchaseStatus = (typeof purchaseStatuses)[number];

export type Purchase = {
  id: string;
  name: string;
  purchase_date: string | null;
  source: string | null;
  seller: string | null;
  total_cost: number | string;
  expected_item_count: number | null;
  notes: string | null;
  status: PurchaseStatus | string;
  created_at: string;
  updated_at: string;
};

export type PurchaseWriteInput = {
  name?: string;
  purchaseDate?: string | null;
  source?: string | null;
  seller?: string | null;
  totalCost?: number | string | null;
  expectedItemCount?: number | string | null;
  notes?: string | null;
  status?: string | null;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPurchaseId(value: string | null | undefined) {
  return Boolean(value && uuidPattern.test(value));
}

export function isPurchaseStatus(
  value: string | null | undefined,
): value is PurchaseStatus {
  return Boolean(
    value && purchaseStatuses.includes(value as PurchaseStatus),
  );
}

export function cleanOptionalText(value: string | null | undefined) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
}

export function cleanOptionalInteger(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

export function cleanRequiredMoney(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatPurchaseDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const dateOnly = value.slice(0, 10);
  const parts = dateOnly.split("-");

  if (parts.length !== 3) {
    return value;
  }

  const [year, month, day] = parts.map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatPurchaseLabel(purchase: {
  name?: string | null;
  source?: string | null;
  purchase_date?: string | null;
  total_cost?: number | string | null;
}) {
  const title = purchase.name?.trim() || purchase.source?.trim() || "Purchase";
  const date = formatPurchaseDate(purchase.purchase_date);
  const cost = formatCurrency(purchase.total_cost);

  return [title, date, cost].filter(Boolean).join(" — ");
}

export function formatPurchaseStatus(status: string | null | undefined) {
  if (!status) {
    return "Open";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function purchaseStatusClasses(status: string | null | undefined) {
  const normalized = status?.toLowerCase();

  if (normalized === "complete") {
    return "border-green-500/30 bg-green-500/10 text-green-300";
  }

  if (normalized === "processing") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }

  if (normalized === "archived") {
    return "border-white/10 bg-white/5 text-zinc-400";
  }

  return "border-sky-500/30 bg-sky-500/10 text-sky-300";
}

export function buildPurchaseRecord(input: PurchaseWriteInput) {
  const name = cleanOptionalText(input.name);
  const source = cleanOptionalText(input.source);
  const seller = cleanOptionalText(input.seller);
  const notes = cleanOptionalText(input.notes);
  const purchaseDate = cleanOptionalText(input.purchaseDate);
  const totalCost = cleanRequiredMoney(input.totalCost);
  const expectedItemCount = cleanOptionalInteger(input.expectedItemCount);
  const status = cleanOptionalText(input.status)?.toLowerCase() ?? "open";

  if (!name) {
    return { error: "A purchase or lot name is required." };
  }

  if (source && !purchaseSources.includes(source as PurchaseSource)) {
    return { error: "Please choose a valid purchase source." };
  }

  if (totalCost === null) {
    return { error: "Total purchase cost cannot be negative." };
  }

  if (expectedItemCount === undefined) {
    return { error: "Item count must be a whole number of 0 or more." };
  }

  if (!isPurchaseStatus(status)) {
    return { error: "Please choose a valid purchase status." };
  }

  return {
    record: {
      name,
      purchase_date: purchaseDate,
      source,
      seller,
      total_cost: totalCost,
      expected_item_count: expectedItemCount,
      notes,
      status,
    },
  };
}
