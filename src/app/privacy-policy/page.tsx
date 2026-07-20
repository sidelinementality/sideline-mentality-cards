import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            Privacy Policy
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            How We Handle Your Information
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            Sideline Mentality Cards respects your privacy. This policy
            explains what information may be collected when you use our
            website, how it is used, and how it is protected.
          </p>
        </section>

        <div className="mt-8 space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Information We Collect
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              When you place an order or contact us, we may receive
              information such as your name, email address, phone number,
              billing address, shipping address, order details, and
              messages you send to us.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Payment Information
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Payments are processed securely through Stripe. Sideline
              Mentality Cards does not directly store your full credit
              card number or complete payment credentials.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              How We Use Information
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We may use your information to process and fulfill orders,
              provide customer support, communicate about your purchase,
              prevent fraud, maintain business records, and improve the
              website and customer experience.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Service Providers
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We may share necessary information with trusted service
              providers that help operate the business, including payment
              processors, website hosting providers, database providers,
              email providers, and shipping carriers.
            </p>

            <p className="mt-4 leading-8 text-neutral-300">
              These providers receive only the information reasonably
              needed to perform their services.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Cookies and Website Data
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              The website may use cookies or similar technologies that
              support essential functions such as shopping carts,
              checkout, security, performance, and analytics.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Data Security
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We use reasonable administrative and technical safeguards
              to protect customer information. However, no internet
              transmission or electronic storage method can be
              guaranteed to be completely secure.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Data Retention
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We may retain order and customer information for as long as
              reasonably necessary to fulfill orders, maintain business
              and tax records, resolve disputes, and meet legal
              obligations.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Your Choices
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              You may contact us to ask questions about the personal
              information associated with your orders or communications.
              Some records may need to be retained for legitimate
              business, tax, fraud-prevention, or legal purposes.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Children&apos;s Privacy
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              This website is intended for general audiences and is not
              directed toward children under 13. We do not knowingly
              collect personal information from children under 13.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Policy Updates
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              We may update this Privacy Policy when business practices,
              website features, or legal requirements change. Updates
              will be posted on this page.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">
              Contact Us
            </h2>

            <p className="mt-4 leading-8 text-neutral-300">
              Questions about this Privacy Policy may be sent to{" "}
              <a
                href="mailto:eric@sidelinementality.com"
                className="font-bold text-green-400 transition hover:text-green-300"
              >
                eric@sidelinementality.com
              </a>
              .
            </p>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-center">
          <h2 className="text-3xl font-black">
            Your Trust Matters
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-neutral-200">
            We are committed to handling customer information
            responsibly while providing a safe and dependable shopping
            experience.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-black text-neutral-950 transition hover:bg-neutral-200"
          >
            Return to Shop
          </Link>
        </section>
      </div>
    </main>
  );
}