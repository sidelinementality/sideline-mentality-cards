import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Sideline Mentality Cards for questions about orders, inventory, collections, and customer support.",
};

const contactCards = [
  {
    title: "Customer Support",
    description:
      "Questions about an order, shipping, returns, or your account? We're happy to help.",
  },
  {
    title: "Looking for a Card?",
    description:
      "Searching for a specific player, rookie, parallel, autograph, or graded card? Let us know and we'll keep an eye out.",
  },
  {
    title: "Selling a Collection",
    description:
      "Have a sports card collection to sell? Contact us with the details and we'll discuss purchasing opportunities.",
  },
];

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 space-y-5 leading-8 text-neutral-600">
        {children}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-20 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-green-400">
            We'd Love To Hear From You
          </p>

          <h1 className="mt-5 text-5xl font-black uppercase">
            Contact Us
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-neutral-300">
            Whether you have a question about an order, are searching for a
            specific card, or are interested in selling a collection, we're
            here to help.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">

          <div className="grid gap-6 md:grid-cols-3">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-xl font-black">
                  {card.title}
                </h2>

                <p className="mt-5 leading-7 text-neutral-600">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">

            <Section title="Contact Information">
              <p>
                <strong>Email:</strong>
              </p>

              <p>
              eric@sidelinementality.com
              </p>

              <p>
                We typically respond within one business day.
              </p>

              <p>
                Please include your order number if your question is related
                to an existing purchase.
              </p>
            </Section>

            <Section title="Before You Contact Us">
              <ul className="list-disc space-y-3 pl-6">
                <li>Include your name.</li>
                <li>Include your order number (if applicable).</li>
                <li>Describe the issue or question clearly.</li>
                <li>
                  Attach photos if you're reporting shipping damage.
                </li>
              </ul>
            </Section>

          </div>

          <div className="mt-12 rounded-3xl bg-green-700 p-10 text-center text-white">

            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-100">
              Need Something Specific?
            </p>

            <h2 className="mt-4 text-4xl font-black">
              Looking for a particular card?
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
              We're constantly adding inventory. If you don't see the card
              you're looking for, send us a message. We may already have one
              coming into inventory or can help locate it.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/shop"
                className="rounded-xl bg-white px-6 py-3 font-black uppercase tracking-wide text-green-700 transition hover:bg-green-100"
              >
                Browse Inventory
              </Link>

              <Link
                href="/faq"
                className="rounded-xl border border-white/30 px-6 py-3 font-black uppercase tracking-wide transition hover:bg-white/10"
              >
                Frequently Asked Questions
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