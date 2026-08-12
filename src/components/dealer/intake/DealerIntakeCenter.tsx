"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Images,
  ListChecks,
  Loader2,
  RotateCcw,
  ScanLine,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

type IntakeStatus = "draft" | "uploading" | "publishing" | "published" | "duplicate" | "error";
type IdentificationStatus = "idle" | "identifying" | "identified" | "needs-review" | "error";
type PublishResult = "published" | "duplicate" | false;

type IdentificationResult = {
  confidence: number;
  playerName: string;
  sport: string;
  team: string;
  year: string;
  brand: string;
  setName: string;
  parallel: string;
  cardNumber: string;
  rookieCard: boolean;
  autograph: boolean;
  serialNumber: string;
  notes: string;
  warnings: string[];
};

type IntakeCard = {
  id: string;
  frontFile: File;
  backFile?: File;
  frontPreview: string;
  backPreview?: string;
  playerName: string;
  sport: string;
  team: string;
  year: string;
  brand: string;
  setName: string;
  parallel: string;
  cardNumber: string;
  rookieCard: boolean;
  autograph: boolean;
  serialNumber: string;
  purchasePrice: string;
  purchaseDate: string;
  purchaseSource: string;
  seller: string;
  purchaseSession: string;
  acquisitionNotes: string;
  websitePrice: string;
  quantity: string;
  storageArea: string;
  box: string;
  row: string;
  slot: string;
  websiteReady: boolean;
  reviewConfirmed: boolean;
  status: IntakeStatus;
  identificationStatus: IdentificationStatus;
  identificationConfidence?: number;
  identificationNotes?: string;
  identificationWarnings?: string[];
  error?: string;
};

type PairMode = "auto" | "sequential" | "front-only";
type QueueFilter = "all" | "needs-ai" | "exceptions" | "needs-review" | "ready";

const sports = [
  "Baseball",
  "Basketball",
  "Football",
  "Hockey",
  "Soccer",
  "Wrestling",
  "Racing",
  "Other",
];

const purchaseSources = [
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
];

export default function DealerIntakeCenter() {
  const [cards, setCards] = useState<IntakeCard[]>([]);
  const [pairMode, setPairMode] = useState<PairMode>("auto");
  const [batchName, setBatchName] = useState(() => createBatchName());
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [isIdentifyingAll, setIsIdentifyingAll] = useState(false);
  const [message, setMessage] = useState("");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
  const [batchPurchasePrice, setBatchPurchasePrice] = useState("");
  const [batchWebsitePrice, setBatchWebsitePrice] = useState("");
  const [batchStorageArea, setBatchStorageArea] = useState("");
  const [batchBox, setBatchBox] = useState("");
  const [batchPurchaseDate, setBatchPurchaseDate] = useState("");
  const [batchPurchaseSource, setBatchPurchaseSource] = useState("");
  const [batchSeller, setBatchSeller] = useState("");
  const [batchPurchaseSession, setBatchPurchaseSession] = useState("");
  const [batchAcquisitionNotes, setBatchAcquisitionNotes] = useState("");
  const [identifyProgress, setIdentifyProgress] = useState<{ current: number; total: number; label: string } | null>(null);
  const duplicateCheckTimersRef = useRef<Record<string, number>>({});
  const duplicateCheckInFlightRef = useRef<Record<string, string>>({});
  const duplicateCheckedIdentitiesRef = useRef<Record<string, boolean>>({});

  const publishedCount = useMemo(
    () => cards.filter((card) => card.status === "published").length,
    [cards],
  );

  const duplicateCount = useMemo(
    () => cards.filter((card) => card.status === "duplicate").length,
    [cards],
  );

  const errorCount = useMemo(
    () => cards.filter((card) => card.status === "error" || card.identificationStatus === "error").length,
    [cards],
  );

  const identifiedCount = useMemo(
    () => cards.filter((card) => card.identificationStatus === "identified").length,
    [cards],
  );

  const reviewCount = useMemo(
    () => cards.filter((card) => card.identificationStatus === "needs-review").length,
    [cards],
  );

  const readyCount = useMemo(
    () => cards.filter((card) => !isSettled(card) && validateCard(card) === null).length,
    [cards],
  );

  const needsAiCount = useMemo(
    () => cards.filter((card) => !isSettled(card) && card.identificationStatus === "idle").length,
    [cards],
  );

  const exceptionCount = useMemo(
    () => cards.filter((card) => !isSettled(card) && isExceptionCard(card)).length,
    [cards],
  );

  const reviewedCount = useMemo(
    () => cards.filter((card) => card.reviewConfirmed && !isSettled(card)).length,
    [cards],
  );

  const filteredCards = useMemo(() => {
    if (queueFilter === "needs-ai") {
      return cards.filter((card) => !isSettled(card) && card.identificationStatus === "idle");
    }
    if (queueFilter === "exceptions") {
      return cards.filter((card) => !isSettled(card) && isExceptionCard(card));
    }
    if (queueFilter === "needs-review") {
      return cards.filter((card) =>
        !isSettled(card) &&
        (card.identificationStatus === "needs-review" ||
          (card.identificationStatus === "identified" && !card.reviewConfirmed)),
      );
    }
    if (queueFilter === "ready") {
      return cards.filter((card) => !isSettled(card) && validateCard(card) === null);
    }
    return cards;
  }, [cards, queueFilter]);

  const activeCard = useMemo(() => {
    if (filteredCards.length === 0) return undefined;
    return filteredCards.find((card) => card.id === activeCardId) ?? filteredCards[0];
  }, [activeCardId, filteredCards]);

  const activeIndex = activeCard ? filteredCards.findIndex((card) => card.id === activeCard.id) : -1;

  // Run the inventory exists check from committed Ready state.
  // Scheduling from inside setState updaters is unreliable and skipped the check after review.
  useEffect(() => {
    for (const card of cards) {
      if (!isSettled(card) && validateCard(card) === null) {
        scheduleDuplicateCheck(card);
      }
    }
  }, [cards]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select" || target?.isContentEditable) return;
      if (!activeCard || isIdentifyingAll || isPublishingAll) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToRelativeCard(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToRelativeCard(1);
      } else if (event.key.toLowerCase() === "r" &&
        (activeCard.identificationStatus === "identified" || activeCard.identificationStatus === "needs-review")) {
        event.preventDefault();
        confirmReviewAndNext(activeCard);
      } else if (event.key.toLowerCase() === "i" && activeCard.identificationStatus !== "identifying") {
        event.preventDefault();
        void identifyCard(activeCard);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCard, activeIndex, filteredCards, isIdentifyingAll, isPublishingAll]);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );

    event.target.value = "";
    setMessage("");

    if (files.length === 0) {
      setMessage("Choose one or more image files from your scanner or computer.");
      return;
    }

    const pairs = pairImages(files, pairMode);
    const nextCards = pairs.map(({ front, back }) => createIntakeCard(front, back));

    setCards((current) => [...current, ...nextCards]);
    if (!activeCardId && nextCards[0]) setActiveCardId(nextCards[0].id);
  }

  function updateCard(id: string, patch: Partial<IntakeCard>) {
    setCards((current) =>
      current.map((card) =>
        card.id === id && !isSettled(card)
          ? {
              ...card,
              ...patch,
              status: patch.status ?? "draft",
              error: patch.error,
            }
          : card,
      ),
    );
  }

  function scheduleDuplicateCheck(card: IntakeCard) {
    if (isSettled(card) || validateCard(card) !== null) return;

    const identity = slugIdentityKey(card);
    const checkKey = `${card.id}:${identity}`;
    if (checkKey in duplicateCheckedIdentitiesRef.current) return;

    const timers = duplicateCheckTimersRef.current;
    window.clearTimeout(timers[card.id]);
    timers[card.id] = window.setTimeout(() => {
      void maybeMarkDuplicate(card, identity, checkKey);
    }, 250);
  }

  async function maybeMarkDuplicate(card: IntakeCard, identityAtSchedule: string, checkKey: string) {
    if (isSettled(card) || validateCard(card) !== null) return;
    if (slugIdentityKey(card) !== identityAtSchedule) return;
    if (checkKey in duplicateCheckedIdentitiesRef.current) return;
    if (duplicateCheckInFlightRef.current[card.id] === identityAtSchedule) return;

    duplicateCheckInFlightRef.current[card.id] = identityAtSchedule;

    try {
      const exists = await checkCardAlreadyInInventory(card);

      duplicateCheckedIdentitiesRef.current[checkKey] = exists;

      if (!exists) return;

      setCards((current) =>
        current.map((item) => {
          if (item.id !== card.id || isSettled(item)) return item;
          if (validateCard(item) !== null) return item;
          if (slugIdentityKey(item) !== identityAtSchedule) return item;
          return {
            ...item,
            status: "duplicate",
            error: "Already in Inventory",
          };
        }),
      );
    } finally {
      if (duplicateCheckInFlightRef.current[card.id] === identityAtSchedule) {
        delete duplicateCheckInFlightRef.current[card.id];
      }
    }
  }

  function removeCard(id: string) {
    setCards((current) => {
      const card = current.find((item) => item.id === id);
      if (card) {
        URL.revokeObjectURL(card.frontPreview);
        if (card.backPreview) URL.revokeObjectURL(card.backPreview);
      }
      const remaining = current.filter((card) => card.id !== id);
      if (activeCardId === id) setActiveCardId(remaining[0]?.id ?? null);
      return remaining;
    });
  }

  function swapCardImages(id: string) {
    setCards((current) =>
      current.map((card) => {
        if (card.id !== id || !card.backFile || !card.backPreview || isSettled(card)) {
          return card;
        }

        return {
          ...card,
          frontFile: card.backFile,
          backFile: card.frontFile,
          frontPreview: card.backPreview,
          backPreview: card.frontPreview,
          identificationStatus: "idle",
          identificationConfidence: undefined,
          identificationNotes: undefined,
          identificationWarnings: undefined,
          reviewConfirmed: false,
        };
      }),
    );
  }

  function resetBatch() {
    cards.forEach((card) => {
      URL.revokeObjectURL(card.frontPreview);
      if (card.backPreview) URL.revokeObjectURL(card.backPreview);
    });
    setCards([]);
    setBatchName(createBatchName());
    setMessage("");
    setActiveCardId(null);
    setQueueFilter("all");
    setBatchPurchasePrice("");
    setBatchWebsitePrice("");
    setBatchStorageArea("");
    setBatchBox("");
    setBatchPurchaseDate("");
    setBatchPurchaseSource("");
    setBatchSeller("");
    setBatchPurchaseSession("");
    setBatchAcquisitionNotes("");
    setIdentifyProgress(null);
    duplicateCheckedIdentitiesRef.current = {};
    duplicateCheckInFlightRef.current = {};
  }

  function applyBatchDefaults() {
    const patch: Partial<IntakeCard> = {};
    if (batchPurchasePrice.trim()) patch.purchasePrice = batchPurchasePrice.trim();
    if (batchWebsitePrice.trim()) patch.websitePrice = batchWebsitePrice.trim();
    if (batchStorageArea.trim()) patch.storageArea = batchStorageArea.trim();
    if (batchBox.trim()) patch.box = batchBox.trim();
    if (batchPurchaseDate.trim()) patch.purchaseDate = batchPurchaseDate.trim();
    if (batchPurchaseSource.trim()) patch.purchaseSource = batchPurchaseSource.trim();
    if (batchSeller.trim()) patch.seller = batchSeller.trim();
    if (batchPurchaseSession.trim()) patch.purchaseSession = batchPurchaseSession.trim();
    if (batchAcquisitionNotes.trim()) patch.acquisitionNotes = batchAcquisitionNotes.trim();

    if (Object.keys(patch).length === 0) {
      setMessage("Enter at least one batch default before applying it.");
      return;
    }

    setCards((current) => current.map((card) => {
      if (isSettled(card)) return card;
      return {
        ...card,
        purchasePrice: card.purchasePrice || patch.purchasePrice || "",
        websitePrice: card.websitePrice || patch.websitePrice || "",
        storageArea: card.storageArea || patch.storageArea || "",
        box: card.box || patch.box || "",
        purchaseDate: card.purchaseDate || patch.purchaseDate || "",
        purchaseSource: card.purchaseSource || patch.purchaseSource || "",
        seller: card.seller || patch.seller || "",
        purchaseSession: card.purchaseSession || patch.purchaseSession || "",
        acquisitionNotes: card.acquisitionNotes || patch.acquisitionNotes || "",
      };
    }));
    setMessage("Batch defaults applied to blank fields only.");
  }

  function goToRelativeCard(offset: number) {
    if (!activeCard || filteredCards.length === 0) return;
    const nextIndex = Math.max(0, Math.min(filteredCards.length - 1, activeIndex + offset));
    setActiveCardId(filteredCards[nextIndex]?.id ?? null);
  }

  function confirmReviewAndNext(card: IntakeCard) {
    updateCard(card.id, { reviewConfirmed: true });
    const currentIndex = filteredCards.findIndex((item) => item.id === card.id);
    const next = filteredCards[currentIndex + 1];
    if (next) setActiveCardId(next.id);
  }

  async function identifyCard(card: IntakeCard) {
    if (isSettled(card)) return false;

    updateCard(card.id, {
      identificationStatus: "identifying",
      identificationConfidence: undefined,
      identificationNotes: undefined,
      identificationWarnings: undefined,
      error: undefined,
    });

    try {
      const formData = new FormData();
      formData.append("front", card.frontFile);
      if (card.backFile) formData.append("back", card.backFile);
      formData.append("frontFileName", card.frontFile.name);
      formData.append("backFileName", card.backFile?.name ?? "");

      const response = await fetch("/api/dealer-intake/identify", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Card identification failed.");
      }

      const identification = result.identification as IdentificationResult;
      const confidence = clampConfidence(Number(identification.confidence));
      const status: IdentificationStatus = confidence >= 88 ? "identified" : "needs-review";

      updateCard(card.id, {
        playerName: identification.playerName || card.playerName,
        sport: normalizeSport(identification.sport) || card.sport,
        team: identification.team || card.team,
        year: identification.year || card.year,
        brand: identification.brand || card.brand,
        setName: identification.setName || card.setName,
        parallel: identification.parallel || card.parallel,
        cardNumber: identification.cardNumber || card.cardNumber,
        rookieCard: Boolean(identification.rookieCard),
        autograph: Boolean(identification.autograph),
        serialNumber: identification.serialNumber || card.serialNumber,
        identificationStatus: status,
        identificationConfidence: confidence,
        identificationNotes: identification.notes || "",
        identificationWarnings: identification.warnings ?? [],
        reviewConfirmed: false,
        error: undefined,
      });
      return true;
    } catch (error) {
      updateCard(card.id, {
        identificationStatus: "error",
        error: error instanceof Error ? error.message : "Card identification failed.",
      });
      return false;
    }
  }

  async function handleIdentifyAll() {
    const candidates = cards.filter(
      (card) =>
        !isSettled(card) &&
        (card.identificationStatus === "idle" || card.identificationStatus === "error"),
    );

    if (candidates.length === 0) {
      setMessage("Every unpublished card has already been analyzed. Use Identify Again on a single card if you want a fresh result.");
      return;
    }

    setIsIdentifyingAll(true);
    setMessage("");
    let successCount = 0;

    // Sequential calls avoid API bursts, make spend predictable, and let the operator see exact progress.
    for (let index = 0; index < candidates.length; index += 1) {
      const card = candidates[index];
      setActiveCardId(card.id);
      setIdentifyProgress({
        current: index + 1,
        total: candidates.length,
        label: card.playerName || stripSideFromDisplayName(card.frontFile.name),
      });
      const success = await identifyCard(card);
      if (success) successCount += 1;
    }

    setIdentifyProgress(null);
    setIsIdentifyingAll(false);
    setQueueFilter("exceptions");
    setActiveCardId(null);
    setMessage(
      `${successCount} of ${candidates.length} card${candidates.length === 1 ? "" : "s"} analyzed. Exceptions are filtered first so you can review warnings and low-confidence results before the clean cards.`,
    );
  }

  async function publishCard(card: IntakeCard): Promise<PublishResult> {
    const validationError = validateCard(card);

    if (validationError) {
      updateCard(card.id, { status: "error", error: validationError });
      return false;
    }

    try {
      const alreadyExists = await checkCardAlreadyInInventory(card);
      if (alreadyExists) {
        updateCard(card.id, {
          status: "duplicate",
          error: "Already in Inventory",
        });
        return "duplicate";
      }

      updateCard(card.id, { status: "uploading", error: undefined });

      const frontImageUrl = await uploadImage(card.frontFile);
      const backImageUrl = card.backFile ? await uploadImage(card.backFile) : "";

      updateCard(card.id, { status: "publishing" });

      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: card.playerName,
          sport: card.sport,
          team: card.team,
          year: Number(card.year),
          brand: card.brand,
          setName: card.setName,
          parallel: card.parallel,
          cardNumber: card.cardNumber,
          rookieCard: card.rookieCard,
          autograph: card.autograph,
          serialNumber: card.serialNumber,
          purchasePrice: card.purchasePrice.trim() === "" ? null : Number(card.purchasePrice),
          purchaseDate: card.purchaseDate.trim() || undefined,
          purchaseSource: card.purchaseSource.trim() || undefined,
          seller: card.seller.trim() || undefined,
          purchaseSession: card.purchaseSession.trim() || undefined,
          shippingCost: 0,
          salesTax: 0,
          purchaseFees: 0,
          quantity: Number(card.quantity || 1),
          websitePrice: card.websitePrice.trim() === "" ? null : Number(card.websitePrice),
          storageArea: card.storageArea,
          box: card.box,
          row: card.row,
          slot: card.slot,
          imageUrl: frontImageUrl,
          backImageUrl,
          websiteReady: card.websiteReady,
          featured: false,
          listingStatus: "Available",
          internalNotes: buildIntakeInternalNotes(batchName, card),
        }),
      });

      const result = await response.json();

      if (response.status === 409) {
        updateCard(card.id, {
          status: "duplicate",
          error: "Already in Inventory",
        });
        return "duplicate";
      }

      if (!response.ok) {
        throw new Error(result.error || "The card could not be published.");
      }

      updateCard(card.id, { status: "published", error: undefined });
      return "published";
    } catch (error) {
      updateCard(card.id, {
        status: "error",
        error: error instanceof Error ? error.message : "The card could not be published.",
      });
      return false;
    }
  }

  async function handlePublishAll() {
    const publishableCards = cards.filter(
      (card) => !isSettled(card) && validateCard(card) === null,
    );

    if (publishableCards.length === 0) {
      setMessage("No cards are ready to publish yet. Complete the required fields first.");
      return;
    }

    setIsPublishingAll(true);
    setMessage("");

    let publishedInBatch = 0;
    let duplicateInBatch = 0;
    let failedInBatch = 0;

    for (const card of publishableCards) {
      const result = await publishCard(card);
      if (result === "published") publishedInBatch += 1;
      else if (result === "duplicate") duplicateInBatch += 1;
      else failedInBatch += 1;
    }

    setIsPublishingAll(false);
    setMessage(
      `Published: ${publishedInBatch}. Already in Inventory: ${duplicateInBatch}. Failed: ${failedInBatch}.`,
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                <ScanLine size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
                  Scan Center V2.3
                </p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  Scan. Identify. Review. Publish.
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              V2.3 adds Identify All progress, exception-first review, keyboard shortcuts, and no-repeat batch AI so dealer-volume intake is faster without spending API credit twice on already-identified cards.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-bold text-zinc-300">
              Batch name
              <input
                value={batchName}
                onChange={(event) => setBatchName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-green-500/60"
              />
            </label>

            <label className="text-sm font-bold text-zinc-300">
              Pairing mode
              <select
                value={pairMode}
                onChange={(event) => setPairMode(event.target.value as PairMode)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-green-500/60"
              >
                <option value="auto">Auto-detect front/back</option>
                <option value="sequential">Sequential pairs</option>
                <option value="front-only">Front images only</option>
              </select>
            </label>
          </div>
        </div>

        <label className="mt-7 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-green-500/30 bg-green-500/[0.04] px-6 py-10 text-center transition hover:border-green-500/70 hover:bg-green-500/[0.07]">
          <Upload size={28} className="text-green-400" />
          <span className="mt-3 text-lg font-black text-white">Choose scanner images</span>
          <span className="mt-1 text-sm text-zinc-500">
            JPG, JPEG, PNG, WEBP and other browser-supported image files
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="sr-only"
          />
        </label>
      </section>

      {cards.length > 0 && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-8">
            <SummaryCard label="Cards in Batch" value={cards.length} />
            <SummaryCard label="Needs AI" value={needsAiCount} />
            <SummaryCard label="Exceptions" value={exceptionCount} />
            <SummaryCard label="AI Identified" value={identifiedCount} />
            <SummaryCard label="Reviewed" value={reviewedCount} />
            <SummaryCard label="Ready" value={readyCount} />
            <SummaryCard label="Published" value={publishedCount} />
            <SummaryCard label="Already in Inventory" value={duplicateCount} />
          </section>

          <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-black text-white">Batch controls</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Identify the batch first, verify yellow flags, then publish only completed cards.
              </p>
              {errorCount > 0 && (
                <p className="mt-2 text-xs font-bold text-red-300">{errorCount} card(s) need attention.</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetBatch}
                disabled={isPublishingAll || isIdentifyingAll}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-black text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                <RotateCcw size={17} /> Reset Batch
              </button>

              <button
                type="button"
                onClick={handleIdentifyAll}
                disabled={isIdentifyingAll || isPublishingAll}
                className="inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-black text-green-200 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isIdentifyingAll ? <Loader2 size={17} className="animate-spin" /> : <BrainCircuit size={17} />}
                {isIdentifyingAll ? "Identifying Batch..." : `Identify All Unidentified (${needsAiCount})`}
              </button>

              <button
                type="button"
                onClick={handlePublishAll}
                disabled={isPublishingAll || isIdentifyingAll || readyCount === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPublishingAll ? <Loader2 size={17} className="animate-spin" /> : <CheckCircle2 size={17} />}
                {isPublishingAll ? "Publishing Batch..." : `Publish Ready (${readyCount})`}
              </button>
            </div>
          </section>

          {identifyProgress && (
            <section className="rounded-2xl border border-green-500/25 bg-green-500/[0.07] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-green-300">Batch AI Progress</p>
                  <p className="mt-1 text-sm font-bold text-white">Identifying {identifyProgress.current} of {identifyProgress.total}: {identifyProgress.label}</p>
                </div>
                <p className="text-sm font-black text-green-200">{Math.round((identifyProgress.current / identifyProgress.total) * 100)}%</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40">
                <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${(identifyProgress.current / identifyProgress.total) * 100}%` }} />
              </div>
            </section>
          )}

          <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2">
                <ListChecks size={18} className="text-green-400" />
                <h2 className="font-black text-white">Batch defaults</h2>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                Apply common lot values to blank fields only. Existing card-specific values are preserved.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <CompactField label="Purchase Price" value={batchPurchasePrice} prefix="$" onChange={setBatchPurchasePrice} />
                <CompactField label="Website Price" value={batchWebsitePrice} prefix="$" onChange={setBatchWebsitePrice} />
                <CompactField label="Storage Area" value={batchStorageArea} onChange={setBatchStorageArea} />
                <CompactField label="Box" value={batchBox} onChange={setBatchBox} />
                <CompactField label="Purchase Date" value={batchPurchaseDate} type="date" onChange={setBatchPurchaseDate} />
                <CompactSelectField
                  label="Purchase Source"
                  value={batchPurchaseSource}
                  options={purchaseSources}
                  onChange={setBatchPurchaseSource}
                />
                <CompactField label="Seller / Vendor" value={batchSeller} onChange={setBatchSeller} />
                <CompactField label="Purchase Session" value={batchPurchaseSession} onChange={setBatchPurchaseSession} />
              </div>
              <div className="mt-3">
                <CompactField label="Acquisition Notes" value={batchAcquisitionNotes} onChange={setBatchAcquisitionNotes} />
              </div>
              <button
                type="button"
                onClick={applyBatchDefaults}
                disabled={isPublishingAll || isIdentifyingAll}
                className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-black text-green-200 transition hover:bg-green-500/20 disabled:opacity-40"
              >
                Apply to Blank Fields
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-black text-white">Review queue</h2>
              <p className="mt-1 text-sm text-zinc-400">Filter the batch and work one card at a time.</p>
              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
                {[
                  ["all", `All (${cards.length})`],
                  ["needs-ai", `Needs AI (${needsAiCount})`],
                  ["exceptions", `Exceptions (${exceptionCount})`],
                  ["needs-review", `Needs Review (${reviewCount + Math.max(0, identifiedCount - reviewedCount)})`],
                  ["ready", `Ready (${readyCount})`],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setQueueFilter(value as QueueFilter); setActiveCardId(null); }}
                    className={`rounded-xl border px-3 py-2 text-xs font-black transition ${queueFilter === value ? "border-green-500/40 bg-green-500/15 text-green-200" : "border-white/10 text-zinc-400 hover:bg-white/5"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {message && (
            <section className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-200">
              {message}
            </section>
          )}

          <section className="grid gap-5 xl:grid-cols-[280px_1fr]">
            <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-3 xl:sticky xl:top-24 xl:self-start">
              <div className="px-2 py-2">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-400">Batch Queue</p>
                <p className="mt-1 text-xs text-zinc-500">{filteredCards.length} card(s) in current filter</p>
              </div>
              <div className="mt-2 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
                {filteredCards.map((card) => (
                  <button
                    type="button"
                    key={card.id}
                    onClick={() => setActiveCardId(card.id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${activeCard?.id === card.id ? "border-green-500/40 bg-green-500/10" : "border-white/10 bg-black/20 hover:bg-white/5"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-white">{card.playerName || stripSideFromDisplayName(card.frontFile.name)}</p>
                        <p className="mt-1 truncate text-xs text-zinc-500">{card.cardNumber || card.frontFile.name}</p>
                      </div>
                      <QueueStatusDot card={card} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-zinc-500">
                      <span>{card.identificationConfidence ? `AI ${card.identificationConfidence}%` : "Not identified"}</span>
                      <span>
                        {card.status === "published"
                          ? "Published"
                          : card.status === "duplicate"
                            ? "Already in Inventory"
                            : validateCard(card) === null
                              ? "Ready"
                              : card.reviewConfirmed
                                ? "Reviewed"
                                : "Review"}
                      </span>
                    </div>
                  </button>
                ))}
                {filteredCards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 p-5 text-center text-xs font-bold text-zinc-600">
                    No cards match this queue filter.
                  </div>
                )}
              </div>
            </aside>

            <div className="space-y-4">
              {activeCard && (
                <>
                  <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-zinc-400">Reviewing {activeIndex + 1} of {filteredCards.length}</p>
                      <p className="mt-1 text-[11px] font-bold text-zinc-600">Keyboard: ←/→ navigate · R review + next · I identify</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => goToRelativeCard(-1)} disabled={activeIndex <= 0} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-black text-zinc-300 disabled:opacity-30">
                        <ChevronLeft size={15} /> Previous
                      </button>
                      <button type="button" onClick={() => goToRelativeCard(1)} disabled={activeIndex >= filteredCards.length - 1} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-black text-zinc-300 disabled:opacity-30">
                        Next <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                  <IntakeCardEditor
                    key={activeCard.id}
                    card={activeCard}
                    index={cards.findIndex((card) => card.id === activeCard.id)}
                    onChange={(patch) => updateCard(activeCard.id, patch)}
                    onRemove={() => removeCard(activeCard.id)}
                    onSwap={() => swapCardImages(activeCard.id)}
                    onIdentify={() => identifyCard(activeCard)}
                    onPublish={() => publishCard(activeCard)}
                    onReviewAndNext={() => confirmReviewAndNext(activeCard)}
                    hasNext={activeIndex < filteredCards.length - 1}
                  />
                </>
              )}
            </div>
          </section>
        </>
      )}

      {cards.length === 0 && (
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <Images size={32} className="mx-auto text-zinc-600" />
          <h2 className="mt-4 text-xl font-black text-white">No scan batch loaded</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">
            Load front and back card scans. V2.3 will pair them, identify the unprocessed cards, then surface exceptions first for fast human review.
          </p>
        </section>
      )}
    </div>
  );
}

function IntakeCardEditor({
  card,
  index,
  onChange,
  onRemove,
  onSwap,
  onIdentify,
  onPublish,
  onReviewAndNext,
  hasNext,
}: {
  card: IntakeCard;
  index: number;
  onChange: (patch: Partial<IntakeCard>) => void;
  onRemove: () => void;
  onSwap: () => void;
  onIdentify: () => void;
  onPublish: () => void;
  onReviewAndNext: () => void;
  hasNext: boolean;
}) {
  const validationError = validateCard(card);
  const busy = card.status === "uploading" || card.status === "publishing";
  const identifying = card.identificationStatus === "identifying";
  const published = card.status === "published";
  const duplicate = card.status === "duplicate";
  const settled = published || duplicate;

  return (
    <article className={`overflow-hidden rounded-3xl border bg-white/[0.035] ${published ? "border-green-500/30" : duplicate ? "border-sky-500/30" : "border-white/10"}`}>
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
            Card {index + 1}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {card.frontFile.name}{card.backFile ? ` + ${card.backFile.name}` : " · front only"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <IdentificationPill card={card} />
          <StatusPill status={card.status} />
          {!settled && (
            <button
              type="button"
              onClick={onRemove}
              disabled={busy || identifying}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40"
              aria-label="Remove card from batch"
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 p-5 xl:grid-cols-[280px_1fr]">
        <div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
            <ImagePreview label="Front" src={card.frontPreview} />
            {card.backPreview ? (
              <ImagePreview label="Back" src={card.backPreview} />
            ) : (
              <div className="flex min-h-36 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-center text-xs font-bold text-zinc-600">
                No back image paired
              </div>
            )}
          </div>

          {!settled && card.backFile && (
            <button
              type="button"
              onClick={onSwap}
              disabled={busy || identifying}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-black text-zinc-300 transition hover:bg-white/5 disabled:opacity-40"
            >
              <ArrowLeftRight size={15} /> Swap Front / Back
            </button>
          )}
        </div>

        <div className="space-y-5">
          {!settled && (
            <div className="flex flex-col gap-3 rounded-2xl border border-green-500/20 bg-green-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-green-400" />
                  <p className="font-black text-white">AI Card Identification</p>
                </div>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Analyzes the front and back scans, then proposes inventory fields. You remain the final reviewer.
                </p>
              </div>
              <button
                type="button"
                onClick={onIdentify}
                disabled={busy || identifying}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-500 disabled:opacity-50"
              >
                {identifying ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                {identifying ? "Identifying..." : card.identificationStatus === "idle" ? "Identify Card" : "Identify Again"}
              </button>
            </div>
          )}

          {card.identificationStatus !== "idle" && card.identificationStatus !== "identifying" && (
            <IdentificationPanel card={card} />
          )}

          <fieldset disabled={settled || busy || identifying} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 disabled:opacity-70">
            <Field label="Player / Subject *" value={card.playerName} onChange={(value) => onChange({ playerName: value })} />
            <SelectField label="Sport *" value={card.sport} options={sports} onChange={(value) => onChange({ sport: value })} />
            <Field label="Team" value={card.team} onChange={(value) => onChange({ team: value })} />
            <Field label="Year *" value={card.year} inputMode="numeric" onChange={(value) => onChange({ year: value })} />

            <Field label="Brand *" value={card.brand} onChange={(value) => onChange({ brand: value })} />
            <Field label="Set" value={card.setName} onChange={(value) => onChange({ setName: value })} />
            <Field label="Parallel / Variation" value={card.parallel} onChange={(value) => onChange({ parallel: value })} />
            <Field label="Card #" value={card.cardNumber} onChange={(value) => onChange({ cardNumber: value })} />

            <Field label="Purchase Price *" value={card.purchasePrice} inputMode="decimal" prefix="$" onChange={(value) => onChange({ purchasePrice: value })} />
            <Field label="Website Price *" value={card.websitePrice} inputMode="decimal" prefix="$" onChange={(value) => onChange({ websitePrice: value })} />
            <Field label="Quantity *" value={card.quantity} inputMode="numeric" onChange={(value) => onChange({ quantity: value })} />
            <Field label="Serial Number" value={card.serialNumber} onChange={(value) => onChange({ serialNumber: value })} />

            <Field label="Purchase Date" value={card.purchaseDate} type="date" onChange={(value) => onChange({ purchaseDate: value })} />
            <SelectField label="Purchase Source" value={card.purchaseSource} options={purchaseSources} onChange={(value) => onChange({ purchaseSource: value })} />
            <Field label="Seller / Vendor" value={card.seller} onChange={(value) => onChange({ seller: value })} />
            <Field label="Purchase Session" value={card.purchaseSession} onChange={(value) => onChange({ purchaseSession: value })} />

            <Field label="Storage Area" value={card.storageArea} onChange={(value) => onChange({ storageArea: value })} />
            <Field label="Box" value={card.box} onChange={(value) => onChange({ box: value })} />
            <Field label="Row" value={card.row} onChange={(value) => onChange({ row: value })} />
            <Field label="Slot" value={card.slot} onChange={(value) => onChange({ slot: value })} />

            <div className="sm:col-span-2 lg:col-span-4">
              <Field label="Acquisition Notes" value={card.acquisitionNotes} onChange={(value) => onChange({ acquisitionNotes: value })} />
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-4 text-sm font-bold text-zinc-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={card.rookieCard} disabled={settled || busy || identifying} onChange={(event) => onChange({ rookieCard: event.target.checked })} className="size-4 accent-green-500" />
              Rookie
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={card.autograph} disabled={settled || busy || identifying} onChange={(event) => onChange({ autograph: event.target.checked })} className="size-4 accent-green-500" />
              Autograph
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={card.websiteReady} disabled={settled || busy || identifying} onChange={(event) => onChange({ websiteReady: event.target.checked })} className="size-4 accent-green-500" />
              Ready for website
            </label>
            {(card.identificationStatus === "identified" || card.identificationStatus === "needs-review") && (
              <label className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-amber-200">
                <input type="checkbox" checked={card.reviewConfirmed} disabled={settled || busy || identifying} onChange={(event) => onChange({ reviewConfirmed: event.target.checked })} className="size-4 accent-green-500" />
                I reviewed the AI identification
              </label>
            )}
          </div>

          {(card.identificationStatus === "identified" || card.identificationStatus === "needs-review") && !settled && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onReviewAndNext}
                disabled={busy || identifying}
                className="inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-black text-green-200 transition hover:bg-green-500/20 disabled:opacity-40"
              >
                <CheckCircle2 size={16} /> Mark Reviewed{hasNext ? " + Next" : ""}
              </button>
              <span className="text-xs text-zinc-500">Fast review action for dealer-volume batches.</span>
            </div>
          )}

          {card.error && card.status === "error" && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-semibold text-red-200">
              {card.error}
            </div>
          )}

          {duplicate && (
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-sm font-semibold text-sky-200">
              Already in Inventory — publishing is blocked for this card.
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className={`text-sm font-semibold ${published ? "text-green-300" : duplicate ? "text-sky-300" : validationError ? "text-amber-300" : "text-green-300"}`}>
              {published
                ? "Published to inventory."
                : duplicate
                  ? "Already in Inventory."
                  : validationError ?? "Required fields complete. Ready to publish."}
            </p>

            {!settled && (
              <button
                type="button"
                onClick={onPublish}
                disabled={busy || identifying || Boolean(validationError)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy && <Loader2 size={16} className="animate-spin" />}
                {card.status === "uploading"
                  ? "Uploading Images..."
                  : card.status === "publishing"
                    ? "Adding to Inventory..."
                    : "Publish Card"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function IdentificationPanel({ card }: { card: IntakeCard }) {
  if (card.identificationStatus === "error") return null;

  const confidence = card.identificationConfidence ?? 0;
  const highConfidence = confidence >= 88;
  const warnings = card.identificationWarnings ?? [];

  return (
    <div className={`rounded-2xl border p-4 ${highConfidence ? "border-green-500/25 bg-green-500/[0.07]" : "border-amber-500/25 bg-amber-500/[0.07]"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={`text-xs font-black uppercase tracking-[0.18em] ${highConfidence ? "text-green-300" : "text-amber-300"}`}>
            {highConfidence ? "High-confidence identification" : "Verify before publishing"}
          </p>
          <p className="mt-1 text-2xl font-black text-white">{confidence}% confidence</p>
        </div>
        <p className="text-xs font-bold text-zinc-500">AI suggestion · human review required</p>
      </div>

      {card.identificationNotes && (
        <p className="mt-3 text-sm leading-6 text-zinc-300">{card.identificationNotes}</p>
      )}

      {warnings.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-500/20 bg-black/20 p-3">
          <p className="text-xs font-black uppercase tracking-wide text-amber-300">Check these details</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {warnings.map((warning, index) => (
              <li key={`${warning}-${index}`}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  inputMode,
  prefix,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "text" | "numeric" | "decimal";
  prefix?: string;
  type?: "text" | "date";
}) {
  return (
    <label className="text-sm font-bold text-zinc-400">
      {label}
      <div className="relative mt-2">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">{prefix}</span>}
        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-white/10 bg-black/50 py-3 text-white outline-none transition focus:border-green-500/60 ${prefix ? "pl-7 pr-3" : "px-3"}`}
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-bold text-zinc-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-3 text-white outline-none transition focus:border-green-500/60"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ImagePreview({ label, src }: { label: string; src: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
      <div className="border-b border-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      {/* Local object URLs are intentionally rendered with a standard img tag. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${label} card scan`} className="aspect-[2.5/3.5] w-full object-contain p-2" />
    </div>
  );
}

function CompactField({
  label,
  value,
  onChange,
  prefix,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  type?: "text" | "date";
}) {
  return (
    <label className="text-xs font-black uppercase tracking-wide text-zinc-500">
      {label}
      <div className="relative mt-2">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-white/10 bg-black/50 py-2.5 text-sm text-white outline-none focus:border-green-500/60 ${prefix ? "pl-7 pr-3" : "px-3"}`}
        />
      </div>
    </label>
  );
}

function CompactSelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs font-black uppercase tracking-wide text-zinc-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white outline-none focus:border-green-500/60"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function QueueStatusDot({ card }: { card: IntakeCard }) {
  let className = "bg-zinc-600";
  let title = "Needs AI";
  if (card.status === "published") { className = "bg-green-400"; title = "Published"; }
  else if (card.status === "duplicate") { className = "bg-sky-400"; title = "Already in Inventory"; }
  else if (validateCard(card) === null) { className = "bg-green-400"; title = "Ready"; }
  else if (card.identificationStatus === "error" || card.status === "error") { className = "bg-red-400"; title = "Needs attention"; }
  else if (card.identificationStatus === "identified" || card.identificationStatus === "needs-review") { className = card.reviewConfirmed ? "bg-sky-400" : "bg-amber-400"; title = card.reviewConfirmed ? "Reviewed" : "Needs review"; }
  return <span title={title} className={`mt-1 size-2.5 shrink-0 rounded-full ${className}`} />;
}

function stripSideFromDisplayName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/(?:front|back|fr|bk)$/i, "")
    .replace(/[-_.]+/g, " ")
    .trim() || "Unidentified card";
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: IntakeStatus }) {
  const text = {
    draft: "Review",
    uploading: "Uploading",
    publishing: "Publishing",
    published: "Published",
    duplicate: "Already in Inventory",
    error: "Needs Attention",
  }[status];

  const classes = {
    draft: "border-white/10 bg-white/5 text-zinc-300",
    uploading: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    publishing: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    published: "border-green-500/20 bg-green-500/10 text-green-300",
    duplicate: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    error: "border-red-500/20 bg-red-500/10 text-red-300",
  }[status];

  return <span className={`rounded-full border px-3 py-1 text-xs font-black ${classes}`}>{text}</span>;
}

function IdentificationPill({ card }: { card: IntakeCard }) {
  if (card.identificationStatus === "idle") {
    return <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-zinc-500">Not Identified</span>;
  }
  if (card.identificationStatus === "identifying") {
    return <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-black text-green-300"><Loader2 size={12} className="animate-spin" /> Identifying</span>;
  }
  if (card.identificationStatus === "error") {
    return <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-black text-red-300">AI Error</span>;
  }

  const confidence = card.identificationConfidence ?? 0;
  const high = card.identificationStatus === "identified";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black ${high ? "border-green-500/20 bg-green-500/10 text-green-300" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>
      AI {confidence}%
    </span>
  );
}

function createIntakeCard(frontFile: File, backFile?: File): IntakeCard {
  return {
    id: crypto.randomUUID(),
    frontFile,
    backFile,
    frontPreview: URL.createObjectURL(frontFile),
    backPreview: backFile ? URL.createObjectURL(backFile) : undefined,
    playerName: "",
    sport: "",
    team: "",
    year: "",
    brand: "",
    setName: "",
    parallel: "",
    cardNumber: "",
    rookieCard: false,
    autograph: false,
    serialNumber: "",
    purchasePrice: "",
    purchaseDate: "",
    purchaseSource: "",
    seller: "",
    purchaseSession: "",
    acquisitionNotes: "",
    websitePrice: "",
    quantity: "1",
    storageArea: "",
    box: "",
    row: "",
    slot: "",
    websiteReady: false,
    reviewConfirmed: false,
    status: "draft",
    identificationStatus: "idle",
  };
}

function pairImages(files: File[], mode: PairMode): Array<{ front: File; back?: File }> {
  const sorted = [...files].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
  );

  if (mode === "front-only") {
    return sorted.map((front) => ({ front }));
  }

  if (mode === "sequential") {
    const pairs: Array<{ front: File; back?: File }> = [];
    for (let index = 0; index < sorted.length; index += 2) {
      pairs.push({ front: sorted[index], back: sorted[index + 1] });
    }
    return pairs;
  }

  const groups = new Map<string, { front?: File; back?: File; loose: File[] }>();

  for (const file of sorted) {
    const parsed = parseSideFromName(file.name);
    const group = groups.get(parsed.base) ?? { loose: [] };

    if (parsed.side === "front" && !group.front) group.front = file;
    else if (parsed.side === "back" && !group.back) group.back = file;
    else group.loose.push(file);

    groups.set(parsed.base, group);
  }

  const detectedPairs: Array<{ front: File; back?: File }> = [];
  const leftovers: File[] = [];

  for (const group of groups.values()) {
    if (group.front || group.back) {
      if (group.front) {
        detectedPairs.push({ front: group.front, back: group.back });
      } else if (group.back) {
        // A back-only detection is safer as a front-only review item than silently labeling it as a front.
        detectedPairs.push({ front: group.back });
      }
      leftovers.push(...group.loose);
    } else {
      leftovers.push(...group.loose);
    }
  }

  if (detectedPairs.length === 0) {
    return pairImages(sorted, "sequential");
  }

  for (let index = 0; index < leftovers.length; index += 2) {
    detectedPairs.push({ front: leftovers[index], back: leftovers[index + 1] });
  }

  return detectedPairs;
}

function parseSideFromName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension.toLowerCase().trim();

  // V2 recognizes sides both as separated tokens ("card-front") and as a trailing suffix
  // attached directly to the card name ("XavierWorthyCB-8Front").
  const sideMatchers: Array<{ side: "front" | "back"; patterns: RegExp[] }> = [
    {
      side: "front",
      patterns: [
        /(?:^|[-_.\s])(front|fr)(?:$|[-_.\s])/i,
        /(front|fr)$/i,
        /(?:^|[-_.\s])f$/i,
      ],
    },
    {
      side: "back",
      patterns: [
        /(?:^|[-_.\s])(back|bk)(?:$|[-_.\s])/i,
        /(back|bk)$/i,
        /(?:^|[-_.\s])b$/i,
      ],
    },
  ];

  for (const matcher of sideMatchers) {
    for (const pattern of matcher.patterns) {
      if (pattern.test(normalized)) {
        const base = normalized
          .replace(pattern, "-")
          .replace(/[-_.\s]+/g, "-")
          .replace(/^-|-$/g, "");
        return { base, side: matcher.side } as const;
      }
    }
  }

  return { base: normalized.replace(/[-_.\s]+/g, "-"), side: "unknown" as const };
}

function isSettled(card: IntakeCard) {
  return card.status === "published" || card.status === "duplicate";
}

function slugIdentityKey(card: IntakeCard) {
  return [
    card.playerName.trim().toLowerCase(),
    String(Number(card.year)),
    card.brand.trim().toLowerCase(),
    card.setName.trim().toLowerCase(),
    card.parallel.trim().toLowerCase(),
    card.cardNumber.trim().toLowerCase(),
  ].join("|");
}

function isExceptionCard(card: IntakeCard) {
  if (card.status === "error" || card.identificationStatus === "error") return true;
  if (!card.backFile) return true;
  if (card.identificationStatus === "needs-review") return true;
  if ((card.identificationWarnings?.length ?? 0) > 0) return true;
  return false;
}

function validateCard(card: IntakeCard) {
  if (!card.playerName.trim()) return "Player / Subject is required.";
  if (!card.sport.trim()) return "Sport is required.";
  const year = Number(card.year);
  if (!Number.isInteger(year) || year < 1800 || year > 2100) return "Enter a valid year.";
  if (!card.brand.trim()) return "Brand is required.";
  if (!card.purchasePrice.trim()) return "Purchase Price is required.";
  const purchasePrice = Number(card.purchasePrice);
  if (!Number.isFinite(purchasePrice) || purchasePrice < 0) return "Enter a valid purchase price.";
  if (!card.websitePrice.trim()) return "Website Price is required.";
  const websitePrice = Number(card.websitePrice);
  if (!Number.isFinite(websitePrice) || websitePrice <= 0) return "Website Price must be greater than $0.";
  if (
    (card.identificationStatus === "identified" || card.identificationStatus === "needs-review") &&
    !card.reviewConfirmed
  ) {
    return "Review the AI identification and confirm it before publishing.";
  }
  const quantity = Number(card.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) return "Quantity must be at least 1.";
  return null;
}

async function checkCardAlreadyInInventory(card: IntakeCard) {
  try {
    const response = await fetch("/api/cards/exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: card.playerName,
        year: Number(card.year),
        brand: card.brand,
        setName: card.setName,
        parallel: card.parallel,
        cardNumber: card.cardNumber,
      }),
    });

    if (!response.ok) {
      // Fall through to normal publish; HTTP 409 remains the safety net.
      return false;
    }

    const result = await response.json();
    return Boolean(result.exists);
  } catch {
    return false;
  }
}

function buildIntakeInternalNotes(batchName: string, card: IntakeCard) {
  const parts = [`Dealer Intake batch: ${batchName}`];
  if (card.identificationConfidence) {
    parts.push(`AI confidence: ${card.identificationConfidence}%`);
  }
  if (card.acquisitionNotes.trim()) {
    parts.push(card.acquisitionNotes.trim());
  }
  return parts.join(" | ");
}

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-card-image", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.imageUrl) {
    throw new Error(result.error || `Could not upload ${file.name}.`);
  }

  return String(result.imageUrl);
}

function createBatchName() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return `Scan Batch ${date}`;
}

function clampConfidence(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeSport(value: string) {
  const match = sports.find((sport) => sport.toLowerCase() === value.trim().toLowerCase());
  return match ?? (value.trim() ? "Other" : "");
}
