import Link from "next/link";

type IntelligenceCard = {
  id: string;
  playerName: string;
  totalCost: number;
  websitePrice: number;
  stock: number;
  createdAt: string | null;
  imageUrl: string | null;
  backImageUrl: string | null;
  purchasePrice: number | null;
  websiteReady: boolean;
  listingStatus: string;
};

type InventoryIntelligenceProps = {
  cards: IntelligenceCard[];
};

export default function InventoryIntelligence({
  cards,
}: InventoryIntelligenceProps) {
  const now = new Date();

  const belowCost = cards.filter(
    (card) =>
      card.stock > 0 &&
      card.websitePrice > 0 &&
      card.websitePrice < card.totalCost,
  );

  const missingPurchasePrice = cards.filter(
    (card) =>
      card.purchasePrice === null ||
      !Number.isFinite(card.purchasePrice) ||
      card.purchasePrice <= 0,
  );

  const highRoi = cards.filter((card) => {
    if (card.totalCost <= 0 || card.websitePrice <= 0) {
      return false;
    }

    const roi =
      ((card.websitePrice - card.totalCost) / card.totalCost) * 100;

    return roi >= 100;
  });

  const inventoryOver90Days = cards.filter((card) =>
    isOlderThanDays(card.createdAt, now, 90),
  );

  const inventoryOver180Days = cards.filter((card) =>
    isOlderThanDays(card.createdAt, now, 180),
  );

  const publishedMissingBackImage = cards.filter(
    (card) =>
      card.listingStatus.toLowerCase() === "published" &&
      !card.backImageUrl,
  );

  const readyWithIssues = cards.filter(
    (card) =>
      card.websiteReady &&
      (!card.imageUrl ||
        card.websitePrice <= 0 ||
        card.stock <= 0),
  );

  const totalIssues =
    belowCost.length +
    missingPurchasePrice.length +
    inventoryOver180Days.length +
    publishedMissingBackImage.length +
    readyWithIssues.length;

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03]">
      <div className="border-b border-white/10 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
              Inventory Intelligence
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              What Needs Attention
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Dealer OS automatically checks your inventory for pricing,
              aging, publishing, and data-quality issues.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">
              Open Issues
            </p>

            <p className="mt-1 text-3xl font-black text-white">
              {totalIssues}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
        <IntelligenceItem
          label="Priced Below Cost"
          value={belowCost.length}
          description="Listings where website price is below total card cost."
          tone="danger"
          href="/dashboard/inventory"
        />

        <IntelligenceItem
          label="Missing Purchase Price"
          value={missingPurchasePrice.length}
          description="Cards that cannot be included in accurate profit reporting."
          tone="warning"
          href="/dashboard/inventory"
        />

        <IntelligenceItem
          label="ROI Over 100%"
          value={highRoi.length}
          description="High-potential cards worth reviewing for promotion."
          tone="success"
          href="/dashboard/inventory"
        />

        <IntelligenceItem
          label="Inventory Over 90 Days"
          value={inventoryOver90Days.length}
          description="Older inventory that may need a pricing or promotion review."
          tone="neutral"
          href="/dashboard/inventory"
        />

        <IntelligenceItem
          label="Inventory Over 180 Days"
          value={inventoryOver180Days.length}
          description="Long-held inventory tying up business capital."
          tone="warning"
          href="/dashboard/inventory"
        />

        <IntelligenceItem
          label="Published Without Back Image"
          value={publishedMissingBackImage.length}
          description="Published listings missing a complete image set."
          tone="danger"
          href="/dashboard/inventory?status=Published"
        />

        <IntelligenceItem
          label="Website-Ready Issues"
          value={readyWithIssues.length}
          description="Website-ready cards missing stock, price, or front image."
          tone="danger"
          href="/dashboard/inventory"
        />
      </div>

      <div className="border-t border-white/10 px-6 py-5 sm:px-8">
        <Link
          href="/dashboard/inventory"
          className="inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500"
        >
          Review Inventory
        </Link>
      </div>
    </section>
  );
}

type IntelligenceItemProps = {
  label: string;
  value: number;
  description: string;
  tone: "neutral" | "success" | "warning" | "danger";
  href: string;
};

function IntelligenceItem({
  label,
  value,
  description,
  tone,
  href,
}: IntelligenceItemProps) {
  const styles = {
    neutral: {
      value: "text-white",
      badge: "border-zinc-500/20 bg-zinc-500/10",
    },
    success: {
      value: "text-green-400",
      badge: "border-green-500/20 bg-green-500/10",
    },
    warning: {
      value: "text-amber-400",
      badge: "border-amber-500/20 bg-amber-500/10",
    },
    danger: {
      value: "text-red-400",
      badge: "border-red-500/20 bg-red-500/10",
    },
  };

  return (
    <Link
      href={href}
      className="group bg-zinc-950 p-6 transition hover:bg-white/[0.04]"
    >
      <div
        className={`inline-flex min-w-12 items-center justify-center rounded-xl border px-3 py-2 ${styles[tone].badge}`}
      >
        <span className={`text-2xl font-black ${styles[tone].value}`}>
          {value}
        </span>
      </div>

      <h3 className="mt-5 font-black text-white transition group-hover:text-green-400">
        {label}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {description}
      </p>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-zinc-600 transition group-hover:text-green-400">
        Review →
      </p>
    </Link>
  );
}

function isOlderThanDays(
  createdAt: string | null,
  now: Date,
  days: number,
) {
  if (!createdAt) {
    return false;
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return false;
  }

  const ageInMilliseconds =
    now.getTime() - createdDate.getTime();

  const ageInDays =
    ageInMilliseconds / (1000 * 60 * 60 * 24);

  return ageInDays >= days;
}