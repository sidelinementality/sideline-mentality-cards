import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            Terms & Conditions
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Terms of Use
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            By using the Sideline Mentality Cards website, you agree to
            these Terms & Conditions. Please read them carefully before
            purchasing products from our store.
          </p>
        </section>

        <div className="mt-8 space-y-6">

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Products
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We strive to accurately describe every trading card,
              including condition, grading, and photographs. Please
              review each listing carefully before purchasing.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Pricing
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Prices are subject to change without notice until an order
              has been successfully completed.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Order Acceptance
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We reserve the right to refuse or cancel orders when
              necessary, including pricing errors, inventory issues,
              suspected fraud, or other unforeseen circumstances. If
              payment has already been received, any approved refund will
              be issued promptly.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Intellectual Property
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              The Sideline Mentality name, logos, website design,
              graphics, and original content are the property of
              Sideline Mentality unless otherwise noted and may not be
              copied or used without permission.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Limitation of Liability
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              To the extent permitted by law, Sideline Mentality Cards is
              not liable for indirect, incidental, or consequential
              damages arising from the use of this website or purchased
              products.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Governing Law
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              These Terms & Conditions are governed by the laws of the
              State of Missouri, United States, without regard to
              conflict-of-law principles.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Contact
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Questions regarding these Terms & Conditions may be sent to
              <a
                href="mailto:eric@sidelinementality.com"
                className="font-bold text-green-400 hover:text-green-300"
              >
                {" "}eric@sidelinementality.com
              </a>.
            </p>
          </section>

        </div>

        <section className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-center">
          <h2 className="text-3xl font-black">
            Thank You
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-neutral-200">
            Thank you for supporting Sideline Mentality Cards. We are
            committed to operating with honesty, integrity, and excellent
            customer service.
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