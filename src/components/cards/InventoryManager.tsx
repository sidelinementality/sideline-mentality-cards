"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BulkActionBar, {
  type BulkAction,
} from "@/components/dealer/inventory/BulkActionBar";

type Card = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | null;
  brand: string | null;
  set_name: string | null;
  parallel: string | null;
  card_number: string | null;
  serial_number: string | null;

  price: number | string | null;
  purchase_price: number | string | null;
  shipping_cost: number | string | null;
  sales_tax: number | string | null;
  purchase_fees: number | string | null;
  market_value: number | string | null;

  image_url: string | null;
  featured: boolean | null;
  website_ready: boolean | null;
  listing_status: string | null;

  storage_area: string | null;
  cabinet: string | null;
  shelf: string | null;
  box: string | null;
  storage_row: string | null;
  slot: string | null;

  stock: number | null;
  created_at: string | null;
};

type InventoryManagerProps = {
  cards: Card[];
};

type BulkUpdatedCard = {
  id: string;
  website_ready: boolean | null;
  featured: boolean | null;
  listing_status: string | null;
};

type BulkDeleteSkip = {
  cardId: string;
  reason: string;
};

type BulkDeleteResult = {
  message?: string;
  requestedCount?: number;
  deletedCount?: number;
  skippedCount?: number;
  deletedCardIds?: string[];
  skippedCardIds?: string[];
  skipped?: BulkDeleteSkip[];
};

export default function InventoryManager({
  cards,
}: InventoryManagerProps) {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "All";

  const [inventoryCards, setInventoryCards] = useState(cards);
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<BulkAction>("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkError, setBulkError] = useState("");

  const [updatingCardId, setUpdatingCardId] = useState<string | null>(null);
  const [stockError, setStockError] = useState("");

  const sports = useMemo(() => {
    const values = inventoryCards
      .map((card) => card.sport?.trim())
      .filter((sport): sport is string => Boolean(sport));

    return ["All", ...Array.from(new Set(values)).sort()];
  }, [inventoryCards]);

  const statuses = useMemo(() => {
    const values = inventoryCards
      .map((card) => card.listing_status?.trim())
      .filter((status): status is string => Boolean(status));

    return ["All", ...Array.from(new Set(values)).sort()];
  }, [inventoryCards]);

  const filteredCards = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return inventoryCards.filter((card) => {
      const searchableValues = [
        card.player_name,
        card.slug,
        card.sport,
        card.team,
        card.brand,
        card.set_name,
        card.parallel,
        card.card_number,
        card.serial_number,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        search.length === 0 || searchableValues.includes(search);

      const matchesSport =
        sportFilter === "All" || card.sport === sportFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (card.listing_status || "Available") === statusFilter;

      return matchesSearch && matchesSport && matchesStatus;
    });
  }, [inventoryCards, searchTerm, sportFilter, statusFilter]);

  const visibleCardIds = filteredCards.map((card) => card.id);

  const allVisibleSelected =
    visibleCardIds.length > 0 &&
    visibleCardIds.every((id) => selectedCardIds.includes(id));

  function toggleCardSelection(cardId: string) {
    setBulkMessage("");
    setBulkError("");

    setSelectedCardIds((currentIds) =>
      currentIds.includes(cardId)
        ? currentIds.filter((id) => id !== cardId)
        : [...currentIds, cardId],
    );
  }

  function toggleSelectAllVisible() {
    setBulkMessage("");
    setBulkError("");

    if (allVisibleSelected) {
      setSelectedCardIds((currentIds) =>
        currentIds.filter((id) => !visibleCardIds.includes(id)),
      );

      return;
    }

    setSelectedCardIds((currentIds) =>
      Array.from(new Set([...currentIds, ...visibleCardIds])),
    );
  }

  function clearSelection() {
    setSelectedCardIds([]);
    setBulkAction("");
    setSelectedStatus("");
    setBulkMessage("");
    setBulkError("");
  }

  async function applyBulkAction() {
    if (selectedCardIds.length === 0 || bulkAction === "") {
      return;
    }

    if (bulkAction === "delete") {
      const recordLabel =
        selectedCardIds.length === 1
          ? "inventory record"
          : "inventory records";
      const confirmed = window.confirm(
        `Permanently delete ${selectedCardIds.length} selected ${recordLabel}? This cannot be undone.`,
      );

      if (!confirmed) {
        return;
      }
    }

    setIsBulkUpdating(true);
    setBulkMessage("");
    setBulkError("");

    try {
      const response = await fetch("/api/cards/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardIds: selectedCardIds,
          action: bulkAction,
          status:
            bulkAction === "change-status"
              ? selectedStatus
              : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            (bulkAction === "delete"
              ? "The selected cards could not be deleted."
              : "The selected cards could not be updated."),
        );
      }

      if (bulkAction === "delete") {
        const deletion = result as BulkDeleteResult;
        const deletedCardIds = deletion.deletedCardIds ?? [];
        const skippedCardIds = deletion.skippedCardIds ?? [];
        const deletedIdSet = new Set(deletedCardIds);

        setInventoryCards((currentCards) =>
          currentCards.filter((card) => !deletedIdSet.has(card.id)),
        );
        setSelectedCardIds(skippedCardIds);
        setBulkAction(skippedCardIds.length > 0 ? "delete" : "");
        setSelectedStatus("");
        setBulkMessage(
          deletion.message ||
            `${deletedCardIds.length} inventory record${
              deletedCardIds.length === 1 ? "" : "s"
            } permanently deleted.`,
        );
        return;
      }

      const updatedCards = (result.cards ?? []) as BulkUpdatedCard[];

      setInventoryCards((currentCards) =>
        currentCards.map((card) => {
          const updatedCard = updatedCards.find(
            (item) => item.id === card.id,
          );

          if (!updatedCard) {
            return card;
          }

          return {
            ...card,
            website_ready: updatedCard.website_ready,
            featured: updatedCard.featured,
            listing_status: updatedCard.listing_status,
          };
        }),
      );

      setBulkMessage(
        result.message || "Selected cards updated successfully.",
      );

      setSelectedCardIds([]);
      setBulkAction("");
      setSelectedStatus("");
    } catch (error) {
      setBulkError(
        error instanceof Error
          ? error.message
          : "Something went wrong during the bulk update.",
      );
    } finally {
      setIsBulkUpdating(false);
    }
  }

  async function updateStock(cardId: string, nextStock: number) {
    if (nextStock < 0) {
      return;
    }

    setUpdatingCardId(cardId);
    setStockError("");

    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stockOnly: true,
          stock: nextStock,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "The stock amount could not be updated.",
        );
      }

      setInventoryCards((currentCards) =>
        currentCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                stock: nextStock,
              }
            : card,
        ),
      );
    } catch (error) {
      setStockError(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating stock.",
      );
    } finally {
      setUpdatingCardId(null);
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setSportFilter("All");
    setStatusFilter("All");
  }

  return (
    <>
      <BulkActionBar
        selectedCount={selectedCardIds.length}
        bulkAction={bulkAction}
        selectedStatus={selectedStatus}
        isUpdating={isBulkUpdating}
        message={bulkMessage}
        error={bulkError}
        onBulkActionChange={(action) => {
          setBulkAction(action);
          setSelectedStatus("");
          setBulkMessage("");
          setBulkError("");
        }}
        onStatusChange={setSelectedStatus}
        onApply={applyBulkAction}
        onClearSelection={clearSelection}
      />

      <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <div>
            <label
              htmlFor="inventorySearch"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Search inventory
            </label>

            <input
              id="inventorySearch"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Player, team, brand, set, parallel, card number..."
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="sportFilter"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Sport
            </label>

            <select
              id="sportFilter"
              value={sportFilter}
              onChange={(event) => setSportFilter(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-green-500"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="statusFilter"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Status
            </label>

            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-green-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-zinc-400">
            Showing{" "}
            <span className="font-bold text-white">
              {filteredCards.length}
            </span>{" "}
            of {inventoryCards.length} listings
          </p>

          {(searchTerm ||
            sportFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-bold text-green-400 transition hover:text-green-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {stockError && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {stockError}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {filteredCards.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-xl font-black text-white">
              No matching cards
            </h2>

            <p className="mt-2 text-zinc-400">
              Try another search or clear the filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl border border-white/15 px-5 py-3 font-bold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1510px] divide-y divide-white/10">
              <thead className="bg-black/30">
                <tr>
                  <th className="w-14 px-5 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Select all visible cards"
                      className="h-4 w-4 rounded border-white/20 bg-black accent-green-600"
                    />
                  </th>

                  <TableHeading>Card</TableHeading>
                  <TableHeading>Details</TableHeading>
                  <TableHeading>Cost</TableHeading>
                  <TableHeading>Price</TableHeading>
                  <TableHeading>Profit</TableHeading>
                  <TableHeading>Stock</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading>Location</TableHeading>
                  <TableHeading>Actions</TableHeading>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredCards.map((card) => {
                  const stock = Number(card.stock ?? 0);
                  const isUpdating = updatingCardId === card.id;
                  const isSelected = selectedCardIds.includes(card.id);

                  const totalCost =
                    Number(card.purchase_price ?? 0) +
                    Number(card.shipping_cost ?? 0) +
                    Number(card.sales_tax ?? 0) +
                    Number(card.purchase_fees ?? 0);

                  const websitePrice = Number(card.price ?? 0);
                  const potentialProfit = websitePrice - totalCost;

                  const roi =
                    totalCost > 0
                      ? (potentialProfit / totalCost) * 100
                      : 0;

                  return (
                    <tr
                      key={card.id}
                      className={`transition ${
                        isSelected
                          ? "bg-green-500/[0.08]"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="px-5 py-4 align-top">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCardSelection(card.id)}
                          aria-label={`Select ${card.player_name}`}
                          className="mt-2 h-4 w-4 rounded border-white/20 bg-black accent-green-600"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex min-w-[270px] items-center gap-4">
                          <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                            {card.image_url ? (
                              <img
                                src={card.image_url}
                                alt={`${card.player_name} card`}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-zinc-500">
                                No image
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-black text-white">
                              {card.player_name}
                            </p>

                            <p className="mt-1 text-sm text-zinc-400">
                              {[card.year, card.brand, card.set_name]
                                .filter(Boolean)
                                .join(" ")}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              {card.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[190px] text-sm">
                          <p className="font-semibold text-zinc-200">
                            {card.parallel || "Base / No parallel"}
                          </p>

                          <p className="mt-1 text-zinc-400">
                            Card #{card.card_number || "—"}
                          </p>

                          <p className="mt-1 text-zinc-500">
                            {card.team || card.sport || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-bold text-white">
                          {formatCurrency(totalCost)}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Purchase + expenses
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-bold text-white">
                          {formatCurrency(websitePrice)}
                        </p>

                        {card.market_value !== null && (
                          <p className="mt-1 text-xs text-zinc-500">
                            Market:{" "}
                            {formatCurrency(Number(card.market_value))}
                          </p>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p
                          className={`font-black ${
                            potentialProfit >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatCurrency(potentialProfit)}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            roi >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {roi.toFixed(1)}% ROI
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex min-w-[120px] flex-col items-start gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateStock(card.id, stock - 1)
                              }
                              disabled={isUpdating || stock <= 0}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/20 text-lg font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              −
                            </button>

                            <span className="min-w-8 text-center font-black text-white">
                              {isUpdating ? "…" : stock}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateStock(card.id, stock + 1)
                              }
                              disabled={isUpdating}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-500/40 bg-green-500/10 text-lg font-bold text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              +
                            </button>
                          </div>

                          <StockBadge stock={stock} />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[150px] space-y-2">
                          <StatusBadge
                            status={card.listing_status || "Available"}
                          />

                          {card.website_ready && (
                            <span className="block text-xs font-bold text-green-400">
                              Website ready
                            </span>
                          )}

                          {card.featured && (
                            <span className="block text-xs font-bold text-yellow-300">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="min-w-[170px] text-sm text-zinc-300">
                          {formatLocation(card)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex min-w-[125px] flex-col items-start gap-2">
                          <Link
                            href={`/cards/${card.slug}`}
                            className="text-sm font-bold text-green-400 hover:text-green-300"
                          >
                            View Card
                          </Link>

                          <Link
                            href={`/dashboard/inventory/${card.id}/edit`}
                            className="text-sm font-bold text-zinc-300 hover:text-white"
                          >
                            Edit Card
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-300">
        Out of Stock
      </span>
    );
  }

  if (stock <= 2) {
    return (
      <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-xs font-bold text-yellow-300">
        Low Stock
      </span>
    );
  }

  return (
    <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-300">
      In Stock
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  let classes =
    "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";

  if (
    normalized === "published" ||
    normalized === "available" ||
    normalized === "ready to publish"
  ) {
    classes =
      "border-green-500/30 bg-green-500/10 text-green-300";
  } else if (
    normalized === "draft" ||
    normalized === "needs photos" ||
    normalized === "needs pricing"
  ) {
    classes =
      "border-amber-500/30 bg-amber-500/10 text-amber-300";
  } else if (normalized === "sold") {
    classes =
      "border-blue-500/30 bg-blue-500/10 text-blue-300";
  } else if (normalized === "archived") {
    classes =
      "border-zinc-600/30 bg-zinc-600/10 text-zinc-400";
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${classes}`}
    >
      {status}
    </span>
  );
}

function formatLocation(card: Card) {
  const location = [
    card.storage_area,
    card.cabinet,
    card.shelf,
    card.box,
    card.storage_row,
    card.slot,
  ].filter(Boolean);

  return location.length > 0 ? location.join(" • ") : "Not assigned";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(value) ? value : 0);
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="whitespace-nowrap px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400"
    >
      {children}
    </th>
  );
}