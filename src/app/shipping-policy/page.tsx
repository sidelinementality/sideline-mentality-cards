import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Learn about processing times, shipping, tracking, and packaging for orders from Sideline Mentality Cards.",
};

const shippingDetails = [
  {
    title: "Processing Time",
    description:
      "Orders are normally processed and prepared for shipment within 1–2 business days after payment is successfully completed.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7v5l3 2"
        />
      </svg>
    ),
  },
  {
    title: "Secure Packaging",
    description:
      "Every card is packaged carefully using appropriate protection to help prevent movement, moisture exposure, and damage during transit.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4 8 8-4 8 4-8 4-8-4Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4 8 8 4 8-4M4 8v8l8 4 8-4V8"
        />
      </svg>
    ),
  },
  {
    title: "Order Tracking",
    description:
      "When tracking is available, the tracking number will be added to your order and provided after the shipment is prepared.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"
        />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
  },
];

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-20 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-green-400">
            Customer Care
          </p>

          <h1 className="mt-5 text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
            Shipping Policy
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-neutral-300">
            We understand that every card matters. Each order is reviewed,
            protected, and prepared with the care we would expect for our own
            collection.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {shippingDetails.map((detail) => (
              <div
                key={detail.title}
                className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  {detail.icon}
                </div>

                <h2 className="mt-6 text-xl font-black text-neutral-950">
                  {detail.title}
                </h2>

                <p className="mt-4 leading-7 text-neutral-600">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-8">
            <PolicySection title="Processing and Business Days">
              <p>
                Orders are typically processed within 1–2 business days.
                Business days do not include weekends or recognized holidays.
                Processing time is separate from the carrier&apos;s estimated
                delivery time.
              </p>

              <p>
                During periods of unusually high order volume, severe weather,
                holidays, or other circumstances outside our control,
                processing may take longer. We will make reasonable efforts to
                communicate material delays.
              </p>
            </PolicySection>

            <PolicySection title="Shipping Methods and Delivery">
              <p>
                Available shipping methods, estimated delivery times, and
                shipping charges are presented during checkout when
                applicable.
              </p>

              <p>
                Delivery dates are estimates provided by the shipping carrier
                and are not guaranteed by Sideline Mentality Cards. Carrier
                delays may occur after an order leaves our possession.
              </p>
            </PolicySection>

            <PolicySection title="Packaging Standards">
              <p>
                Cards are packaged according to the type, value, condition, and
                quantity of items purchased. Protective materials may include
                sleeves, top loaders, team bags, graded-card sleeves,
                cardboard reinforcement, bubble protection, or rigid mailers.
              </p>

              <p>
                Our goal is to minimize movement and provide sensible
                protection throughout the shipping process.
              </p>
            </PolicySection>

            <PolicySection title="Tracking Information">
              <p>
                When a tracked shipping method is used, tracking information
                will be provided after the shipping label is created. Tracking
                activity may take time to appear after the carrier receives
                the package.
              </p>

              <p>
                Customers are responsible for monitoring tracking information
                and providing a complete, accurate delivery address during
                checkout.
              </p>
            </PolicySection>

            <PolicySection title="Incorrect or Undeliverable Addresses">
              <p>
                Customers are responsible for reviewing their shipping address
                before submitting an order. Contact us immediately if an
                address needs to be corrected.
              </p>

              <p>
                We cannot guarantee that an address can be changed after an
                order has been processed. Additional shipping charges may
                apply when a package is returned because the address was
                incomplete, incorrect, or undeliverable.
              </p>
            </PolicySection>

            <PolicySection title="Lost, Delayed, or Damaged Packages">
              <p>
                Contact us as soon as possible if tracking shows unusual delay,
                delivery to the wrong location, or visible shipping damage.
                Please retain the item, packaging, shipping label, and all
                protective materials.
              </p>

              <p>
                Photographs may be required to document a damage claim. We will
                assist with reasonable next steps, but final carrier decisions
                and processing times remain outside our control.
              </p>
            </PolicySection>

            <PolicySection title="International Shipping">
              <p>
                International shipping may not be available for every order or
                destination. When it is available, customers are responsible
                for customs duties, taxes, import charges, and other fees
                assessed by the destination country.
              </p>
            </PolicySection>
          </div>

          <div className="mt-12 rounded-3xl bg-green-700 p-8 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-100">
              Shipping Questions
            </p>

            <h2 className="mt-4 text-3xl font-black">
              Need help with an order?
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-green-50">
              Contact Sideline Mentality Cards and include your name, order
              information, and a brief description of your question.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-green-700 transition hover:bg-green-100"
              >
                Contact Us
              </Link>

              <Link
                href="/faq"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                View FAQ
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

type PolicySectionProps = {
  title: string;
  children: React.ReactNode;
};

function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm sm:p-9">
      <h2 className="text-2xl font-black text-neutral-950">{title}</h2>

      <div className="mt-5 space-y-5 leading-8 text-neutral-600">
        {children}
      </div>
    </article>
  );
}