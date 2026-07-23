import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions governing the use of Sideline Mentality Cards.",
};

const highlights = [
  {
    title: "Website Use",
    description:
      "By using this website, you agree to these Terms and our posted policies.",
  },
  {
    title: "Orders",
    description:
      "Orders are subject to acceptance, inventory availability, and payment verification.",
  },
  {
    title: "Collectibles",
    description:
      "Sports cards are collectible items whose market values may change over time.",
  },
];

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 space-y-5 leading-8 text-neutral-600">
        {children}
      </div>
    </article>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-20 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-green-400">
            Legal Information
          </p>

          <h1 className="mt-5 text-5xl font-black uppercase">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-neutral-300">
            These Terms govern your access to and use of Sideline Mentality
            Cards, including purchases made through this website.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-xl font-black">
                  {item.title}
                </h2>

                <p className="mt-5 leading-7 text-neutral-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-8">

            <Section title="Acceptance of Terms">
              <p>
                By accessing or using this website, you agree to these Terms &
                Conditions together with our Privacy Policy, Shipping Policy,
                and Returns & Refund Policy.
              </p>
            </Section>

            <Section title="Product Information">
              <p>
                We make every reasonable effort to accurately describe and
                photograph each collectible item.
              </p>

              <p>
                Minor differences in color, lighting, print quality, centering,
                or manufacturing characteristics may exist.
              </p>
            </Section>

            <Section title="Pricing">
              <p>
                Prices are subject to change without notice.
              </p>

              <p>
                We reserve the right to correct pricing, inventory, or listing
                errors before an order ships.
              </p>
            </Section>

            <Section title="Orders">
              <p>
                Orders may be canceled when inventory is unavailable, payment
                cannot be verified, fraud is suspected, or an obvious listing
                error has occurred.
              </p>
            </Section>

            <Section title="Collectible Market">
              <p>
                Sports cards are collectibles.
              </p>

              <p>
                Player performance, grading results, scarcity, and market demand
                may increase or decrease a card's value after purchase.
              </p>

              <p>
                Future market value is never guaranteed.
              </p>
            </Section>

            <Section title="Intellectual Property">
              <p>
                Website design, graphics, logos, written content, and original
                branding created by Sideline Mentality remain our intellectual
                property unless otherwise noted.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the fullest extent permitted by law, Sideline Mentality
                Cards shall not be liable for indirect, incidental, special,
                or consequential damages arising from use of this website or
                products purchased through it.
              </p>
            </Section>

            <Section title="Changes">
              <p>
                These Terms may be updated periodically. Continued use of the
                website after updates constitutes acceptance of the revised
                Terms.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Questions regarding these Terms may be directed to:
              </p>

              <p className="font-bold text-green-700">
                eric@sidelinementality.com
              </p>
            </Section>

          </div>

          <div className="mt-12 rounded-3xl bg-green-700 p-10 text-center text-white">

            <h2 className="text-3xl font-black">
              Questions About These Terms?
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
              If you have questions about these Terms & Conditions or how they
              apply to your order, we're happy to help.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/contact"
                className="rounded-xl bg-white px-6 py-3 font-black uppercase tracking-wide text-green-700 transition hover:bg-green-100"
              >
                Contact Us
              </Link>

              <Link
                href="/faq"
                className="rounded-xl border border-white/30 px-6 py-3 font-black uppercase tracking-wide transition hover:bg-white/10"
              >
                FAQ
              </Link>

            </div>

          </div>

          <p className="mt-8 text-center text-sm text-neutral-500">
            Last updated: July 23, 2026
          </p>

        </div>
      </section>
    </main>
  );
}