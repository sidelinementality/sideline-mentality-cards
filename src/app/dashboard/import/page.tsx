import ImportCenter from "@/components/dealer/inventory/ImportCenter";

export default function ImportPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
          Dealer OS
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Inventory Import Center
        </h1>

        <p className="mt-3 max-w-3xl text-zinc-400">
          Download the Dealer OS template, prepare inventory in Excel or
          Google Sheets, and review the records before importing them into
          Sideline Mentality Cards.
        </p>
      </section>

      <ImportCenter />
    </div>
  );
}