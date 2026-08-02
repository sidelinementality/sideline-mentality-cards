type SaveCardBarProps = {
    isSaving: boolean;
    canSave: boolean;
    errorMessage: string;
    onCancel: () => void;
  };
  
  export default function SaveCardBar({
    isSaving,
    canSave,
    errorMessage,
    onCancel,
  }: SaveCardBarProps) {
    return (
      <div className="sticky bottom-0 z-30 border-t border-white/10 bg-zinc-950/95 py-4 backdrop-blur">
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-sm font-semibold text-red-300">
              {errorMessage}
            </p>
          </div>
        )}
  
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">
              {canSave ? "Card is ready to save" : "Complete the required fields"}
            </p>
  
            <p className="mt-1 text-sm text-zinc-400">
              Player, sport, year, brand, purchase price, website price, quantity,
              and front image are required.
            </p>
          </div>
  
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-xl border border-white/15 px-6 py-3 font-bold text-white transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
  
            <button
              type="submit"
              disabled={!canSave || isSaving}
              className="rounded-xl bg-green-600 px-8 py-3 font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving Card..." : "Save Card"}
            </button>
          </div>
        </div>
      </div>
    );
  }