import Link from "next/link";

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            Returns & Refunds
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Our Return Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            We want every customer to have confidence when purchasing
            from Sideline Mentality Cards. Because every trading card is
            unique, please review our return policy before placing an
            order.
          </p>
        </section>

        <div className="mt-8 space-y-6">

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              All Sales Are Final
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Unless an item arrives damaged or we shipped the wrong
              item, all sales are considered final. Please review all
              photos and descriptions carefully before purchasing.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Damaged or Incorrect Orders
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              If your package arrives damaged or you receive the wrong
              card, please email
              <strong> eric@sidelinementality.com </strong>
              within 7 days of delivery.
            </p>

            <p className="mt-4 leading-8 text-neutral-300">
              Please include your order number along with clear photos of
              the packaging and the card so we can quickly review the
              situation.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Refunds
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Approved refunds will be issued to the original payment
              method. Processing time depends on your financial
              institution after the refund has been submitted.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Questions?
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We are committed to treating every customer fairly.
              If you have any questions before purchasing, please contact
              us and we will gladly help.
            </p>

            <a
              href="mailto:eric@sidelinementality.com"
              className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3 font-black transition hover:bg-green-500"
            >
              Contact Eric
            </a>
          </section>

        </div>

        <section className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-center">
          <h2 className="text-3xl font-black">
            Buy With Confidence
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-neutral-200">
            Every order is carefully packaged and shipped with the same
            care we would expect when purchasing cards for our own
            collection.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-black text-neutral-950 transition hover:bg-neutral-200"
          >
            Shop Cards
          </Link>
        </section>
      </div>
    </main>
  );
}