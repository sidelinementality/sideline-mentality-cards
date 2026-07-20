import Link from "next/link";

const contactEmail = "eric@sidelinementality.com";

const frequentlyAskedQuestions = [
  {
    question: "How quickly will my order ship?",
    answer:
      "Most orders are prepared and shipped within 1–3 business days. Delivery time depends on the USPS service used and the destination.",
  },
  {
    question: "How are trading cards packaged?",
    answer:
      "Cards are placed in protective sleeves and top loaders or other appropriate card protection before being securely packaged for shipping.",
  },
  {
    question: "Can I return a card?",
    answer:
      "Please review our Returns and Refund Policy for complete details. Contact us right away if your order arrives damaged or is incorrect.",
  },
  {
    question: "Do you buy sports card collections?",
    answer:
      "We may be interested in purchasing individual cards, lots, or collections. Email us with clear photos and a brief description of what you have.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10 lg:px-14">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            Get in Touch
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Contact Sideline Mentality Cards
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            Have a question about an order, a card, shipping, or
            selling a collection? Send us a message and we will
            be glad to help.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Email
            </p>

            <a
              href={`mailto:${contactEmail}`}
              className="mt-3 block break-all text-lg font-black text-green-400 transition hover:text-green-300"
            >
              {contactEmail}
            </a>

            <p className="mt-4 text-sm leading-6 text-neutral-400">
              Include your order number when contacting us about
              an existing purchase.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Response Time
            </p>

            <p className="mt-3 text-lg font-black">
              Within 1–2 business days
            </p>

            <p className="mt-4 text-sm leading-6 text-neutral-400">
              Messages received on weekends or holidays may be
              answered the following business day.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Order Support
            </p>

            <p className="mt-3 text-lg font-black">
              We are here to help
            </p>

            <p className="mt-4 text-sm leading-6 text-neutral-400">
              Contact us about damaged packages, incorrect items,
              tracking concerns, or questions before placing an
              order.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              Send a Message
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Email our team directly
            </h2>

            <p className="mt-4 leading-7 text-neutral-300">
              Click the button below to open your email app. Tell
              us how we can help, and include any useful order or
              card details.
            </p>

            <a
              href={`mailto:${contactEmail}?subject=Sideline%20Mentality%20Cards%20Question`}
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-black text-white transition hover:bg-green-500"
            >
              Email Sideline Mentality Cards
            </a>
          </div>
        </section>

        <section className="mt-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              Frequently Asked Questions
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Helpful information before you contact us
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {frequentlyAskedQuestions.map((item) => (
              <article
                key={item.question}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <h3 className="text-lg font-black">
                  {item.question}
                </h3>

                <p className="mt-4 leading-7 text-neutral-400">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-7 text-center sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-300">
            Our Mission
          </p>

          <h2 className="mt-4 text-3xl font-black">
            More than sports cards
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-7 text-neutral-200">
            Sideline Mentality is a faith-based sports brand
            committed to developing athletes, building leaders,
            and impacting lives beyond the scoreboard.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-black text-neutral-950 transition hover:bg-neutral-200"
          >
            Shop Sports Cards
          </Link>
        </section>
      </div>
    </main>
  );
}