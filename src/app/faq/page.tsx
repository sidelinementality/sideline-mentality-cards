import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers about ordering, shipping, card condition, payments, returns, and shopping with Sideline Mentality Cards.",
};

const faqSections = [
  {
    title: "Ordering and Payment",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "Payments are processed securely through Stripe. Available payment methods may include major credit cards, debit cards, and other options displayed during checkout.",
      },
      {
        question: "Is checkout secure?",
        answer:
          "Yes. Payments are securely processed through Stripe. Sideline Mentality Cards does not directly store your complete payment card information.",
      },
      {
        question: "Can I change or cancel an order?",
        answer:
          "Contact us as soon as possible after placing your order. We will try to help, but orders that have already been packed or shipped may not be changed or canceled.",
      },
      {
        question: "Will I receive an order confirmation?",
        answer:
          "Yes. After a successful purchase, you should receive an order confirmation containing your order details.",
      },
    ],
  },
  {
    title: "Shipping",
    questions: [
      {
        question: "How quickly will my order ship?",
        answer:
          "Most orders are prepared for shipment within 1–2 business days. Processing times may be longer during holidays, major inventory drops, or unusually busy periods.",
      },
      {
        question: "How are cards packaged?",
        answer:
          "Cards are carefully protected using appropriate sleeves, top loaders or card holders, team bags, protective packaging, and secure mailers or boxes based on the order.",
      },
      {
        question: "Will I receive tracking information?",
        answer:
          "Tracking information will be provided for eligible shipments after the shipping label has been created.",
      },
      {
        question: "Do you combine shipping?",
        answer:
          "Cards purchased together in the same order will normally be packaged and shipped together whenever practical.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Free-shipping promotions may be available when an order reaches the amount displayed in the website announcement bar or during special promotions.",
      },
    ],
  },
  {
    title: "Card Condition and Listings",
    questions: [
      {
        question: "Are the card photos real?",
        answer:
          "Yes. Product listings are intended to show photos of the actual card being sold unless the listing clearly states otherwise.",
      },
      {
        question: "How is card condition described?",
        answer:
          "Important condition details are included in the product listing when available. Please review all photos and condition notes before purchasing.",
      },
      {
        question: "Are raw cards guaranteed to receive a certain grade?",
        answer:
          "No. Raw cards are not guaranteed to receive any particular grade from PSA, SGC, Beckett, CGC, or another grading company.",
      },
      {
        question: "What happens when a card sells out?",
        answer:
          "Most cards are one-of-a-kind or available in limited quantities. Once inventory reaches zero, the card will be marked as sold out and cannot be purchased unless it is restocked.",
      },
    ],
  },
  {
    title: "Returns and Problems",
    questions: [
      {
        question: "Do you accept returns?",
        answer:
          "Return eligibility depends on the circumstances and the condition of the item. Please review the Shipping and Returns policy for full details.",
      },
      {
        question: "What should I do if my order arrives damaged?",
        answer:
          "Contact us promptly and include your order information along with clear photos of the item, packaging, and shipping label. Keep all original packaging while the issue is reviewed.",
      },
      {
        question: "What if I receive the wrong card?",
        answer:
          "Contact us promptly with your order details and photos of the item received. We will review the issue and work toward an appropriate resolution.",
      },
    ],
  },
  {
    title: "About Sideline Mentality Cards",
    questions: [
      {
        question: "Who owns Sideline Mentality Cards?",
        answer:
          "Sideline Mentality Cards is a collector-owned sports card business focused on providing quality cards, secure checkout, careful packaging, and dependable service.",
      },
      {
        question: "What types of cards do you sell?",
        answer:
          "Inventory may include football, baseball, basketball, UFC, WWE, Pokémon, graded cards, rookie cards, autographs, inserts, parallels, and other collectibles.",
      },
      {
        question: "How often is new inventory added?",
        answer:
          "New cards are added regularly. Check the New Arrivals section and join the Sideline Mentality community to stay informed about future inventory.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
            Help Center
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Find answers about ordering, shipping, card condition,
            payments, returns, and shopping with Sideline Mentality
            Cards.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {faqSections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-2xl font-black text-slate-950">
                {section.title}
              </h2>

              <div className="mt-6 divide-y divide-zinc-200">
                {section.questions.map((item) => (
                  <details
                    key={item.question}
                    className="group py-5 first:pt-0 last:pb-0"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-black text-slate-950">
                      <span>{item.question}</span>

                      <span className="text-2xl font-light text-green-700 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>

                    <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-3xl bg-slate-950 p-8 text-center text-white sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
            Still Need Help?
          </p>

          <h2 className="mt-3 text-3xl font-black">
            We’re here to help.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            Contact Sideline Mentality Cards with questions about an
            order, listing, shipment, or product.
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-full bg-green-600 px-7 py-3 font-black text-white transition hover:bg-green-500"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  );
}