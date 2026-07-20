import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            Shipping Policy
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Fast, Secure Card Shipping
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            We take pride in packaging every order carefully so your
            cards arrive safely and ready for your collection.
          </p>
        </section>

        <div className="mt-8 space-y-6">

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Processing Time
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Orders are typically processed within <strong>1–3 business days</strong>.
              Orders placed on weekends or holidays will begin processing on the
              next business day.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Shipping Method
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We currently ship throughout the United States using
              USPS. Shipping is a flat rate of
              <strong> $3.99 per order</strong>.
            </p>

            <p className="mt-4 leading-8 text-neutral-300">
              As Sideline Mentality Cards grows, additional shipping
              options may become available.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Packaging
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Every card is carefully protected before shipping.
            </p>

            <ul className="mt-5 list-disc space-y-3 pl-6 text-neutral-300">
              <li>Penny sleeve</li>
              <li>Top Loader or appropriate card protection</li>
              <li>Protective tape</li>
              <li>Bubble mailer</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Tracking
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Tracking information will be provided once your order has
              been shipped.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Lost or Damaged Packages
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              If your order arrives damaged or appears to be lost in
              transit, please contact us as soon as possible at
              <strong> eric@sidelinementality.com</strong>.
              We will work with you to resolve the issue.
            </p>
          </section>

        </div>

        <section className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-center">
          <h2 className="text-3xl font-black">
            Thank You
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-neutral-200">
            Thank you for supporting Sideline Mentality Cards.
            Every order helps us continue building a faith-based sports
            brand dedicated to developing athletes, building leaders,
            and impacting lives beyond the scoreboard.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-black text-neutral-950 transition hover:bg-neutral-200"
          >
            Continue Shopping
          </Link>
        </section>
      </div>
    </main>
  );
}