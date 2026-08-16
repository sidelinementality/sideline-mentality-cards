import DealerIntakeCenter from "@/components/dealer/intake/DealerIntakeCenter";

type DealerIntakePageProps = {
  searchParams: Promise<{
    purchaseId?: string;
  }>;
};

export default async function DealerIntakePage({
  searchParams,
}: DealerIntakePageProps) {
  const { purchaseId } = await searchParams;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer OS
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Dealer Intake
        </h1>

        <p className="mt-3 max-w-3xl text-zinc-400">
          Turn scanner images into inventory drafts, review the card details, and
          publish approved cards directly to Sideline Mentality Cards inventory.
        </p>
      </section>

      <DealerIntakeCenter initialPurchaseId={purchaseId} />
    </div>
  );
}
