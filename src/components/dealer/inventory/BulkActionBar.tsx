type BulkAction =
  | ""
  | "publish"
  | "website-ready"
  | "feature"
  | "unfeature"
  | "archive"
  | "change-status";

type BulkActionBarProps = {
  selectedCount: number;
  bulkAction: BulkAction;
  selectedStatus: string;
  isUpdating: boolean;
  message: string;
  error: string;
  onBulkActionChange: (action: BulkAction) => void;
  onStatusChange: (status: string) => void;
  onApply: () => void;
  onClearSelection: () => void;
};

const inventoryStatuses = [
  "Available",
  "Draft",
  "Needs Photos",
  "Needs Pricing",
  "Ready to Publish",
  "Published",
  "Reserved",
  "Sold",
  "Archived",
];

export default function BulkActionBar({
  selectedCount,
  bulkAction,
  selectedStatus,
  isUpdating,
  message,
  error,
  onBulkActionChange,
  onStatusChange,
  onApply,
  onClearSelection,
}: BulkActionBarProps) {
  const needsStatus = bulkAction === "change-status";

  const canApply =
    selectedCount > 0 &&
    bulkAction !== "" &&
    (!needsStatus || selectedStatus !== "") &&
    !isUpdating;

  return (
    <section className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/[0.07] p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
            Bulk Actions
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            {selectedCount === 0
              ? "Select inventory records"
              : `${selectedCount} ${
                  selectedCount === 1 ? "card" : "cards"
                } selected`}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Update several cards at once without opening each record.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:items-end">
          <div className="min-w-[220px]">
            <label
              htmlFor="bulkAction"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Choose action
            </label>

            <select
              id="bulkAction"
              value={bulkAction}
              onChange={(event) =>
                onBulkActionChange(
                  event.target.value as BulkAction,
                )
              }
              disabled={selectedCount === 0 || isUpdating}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select an action</option>
              <option value="publish">Publish selected</option>
              <option value="website-ready">
                Mark ready for website
              </option>
              <option value="feature">Feature selected</option>
              <option value="unfeature">Unfeature selected</option>
              <option value="archive">Archive selected</option>
              <option value="change-status">Change status</option>
            </select>
          </div>

          {needsStatus && (
            <div className="min-w-[210px]">
              <label
                htmlFor="bulkStatus"
                className="mb-2 block text-sm font-semibold text-white"
              >
                New status
              </label>

              <select
                id="bulkStatus"
                value={selectedStatus}
                onChange={(event) =>
                  onStatusChange(event.target.value)
                }
                disabled={isUpdating}
                className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Choose status</option>

                {inventoryStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={onApply}
            disabled={!canApply}
            className="rounded-xl bg-green-600 px-6 py-3 font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isUpdating ? "Updating..." : "Apply Action"}
          </button>

          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onClearSelection}
              disabled={isUpdating}
              className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
          {error}
        </div>
      )}
    </section>
  );
}

export type { BulkAction };