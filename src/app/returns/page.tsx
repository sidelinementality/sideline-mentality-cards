import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "Review the return, refund, damaged shipment, and order issue policies for Sideline Mentality Cards.",
};

const policyHighlights = [
  {
    title: "Contact Us Promptly",
    description:
      "Report damaged, incorrect, or materially misrepresented items within 3 calendar days of confirmed delivery.",
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
    title: "Keep All Packaging",
    description:
      "Retain the card, shipping container, label, protective materials, and any other contents while the issue is reviewed.",
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
    title: "Approval Is Required",
    description:
      "Items should not be returned without authorization and return instructions from Sideline Mentality Cards.",
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
          d="m5 12 4 4L19 6"
        />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
];

export default function ReturnsPage() {
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
            Returns & Refunds
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-neutral-300">
            Every order is handled carefully and described as accurately as
            possible. This policy explains what to do if there is a problem
            with your purchase.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {policyHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  {item.icon}
                </div>

                <h2 className="mt-6 text-xl font-black text-neutral-950">
                  {item.title}
                </h2>

                <p className="mt-4 leading-7 text-neutral-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-8">
            <PolicySection title="General Return Policy">
              <p>
                Due to the collectible nature of sports cards, all sales are
                generally considered final unless an item arrives damaged, the
                wrong item is received, or the item is materially different
                from the description provided at the time of purchase.
              </p>

              <p>
                Buyer&apos;s remorse, changes in market value, player
                performance, grading results, or a change in personal
                preference are not normally eligible reasons for a return.
              </p>
            </PolicySection>

            <PolicySection title="Eligible Return Situations">
              <p>A return or refund review may be available when:</p>

              <ul className="list-disc space-y-3 pl-6">
                <li>The wrong card or item was shipped.</li>
                <li>
                  The item arrived with shipping damage that was not disclosed
                  before purchase.
                </li>
                <li>
                  The item is materially different from the website
                  description or photographs.
                </li>
                <li>
                  Part of the order is missing from the delivered package.
                </li>
              </ul>

              <p>
                Eligibility is determined after the order information,
                photographs, packaging, and other relevant details are
                reviewed.
              </p>
            </PolicySection>

            <PolicySection title="Non-Returnable Situations">
              <p>Returns are generally not accepted for:</p>

              <ul className="list-disc space-y-3 pl-6">
                <li>Changes in card value after purchase.</li>
                <li>
                  Disagreement with a professional grading company&apos;s
                  opinion.
                </li>
                <li>
                  Cards removed from sealed packaging, protective holders, or
                  tamper-evident materials.
                </li>
                <li>
                  Damage caused after delivery through handling, storage, or
                  attempted cleaning.
                </li>
                <li>
                  Minor printing, centering, surface, edge, or corner
                  characteristics visible in the listing photographs.
                </li>
                <li>
                  Orders returned without prior authorization or proper
                  tracking.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="Reporting an Order Problem">
              <p>
                Contact Sideline Mentality Cards within 3 calendar days of
                confirmed delivery when reporting a damaged, incorrect,
                missing, or materially misrepresented item.
              </p>

              <p>Please include:</p>

              <ul className="list-disc space-y-3 pl-6">
                <li>Your name and order number.</li>
                <li>A description of the issue.</li>
                <li>Clear photographs of the card or item.</li>
                <li>
                  Photographs of the shipping container, label, and protective
                  packaging when damage is involved.
                </li>
              </ul>

              <p>
                Keep all packaging and contents until the claim has been
                resolved.
              </p>
            </PolicySection>

            <PolicySection title="Return Authorization">
              <p>
                Do not mail an item back without first receiving return
                authorization and instructions from Sideline Mentality Cards.
              </p>

              <p>
                Approved returns must be shipped using the method and address
                provided in the return instructions. The item must be returned
                in the same condition and protective materials in which it was
                received.
              </p>

              <p>
                Unauthorized returns, improperly packaged returns, or returns
                without tracking may be refused.
              </p>
            </PolicySection>

            <PolicySection title="Return Shipping Costs">
              <p>
                When a return is approved because of an incorrect item,
                confirmed shipping damage, or a material listing error,
                Sideline Mentality Cards may provide a return label or
                reimburse reasonable return shipping costs.
              </p>

              <p>
                Original and return shipping charges are not refundable when a
                return is requested for a reason that is not the responsibility
                of Sideline Mentality Cards.
              </p>
            </PolicySection>

            <PolicySection title="Refund Processing">
              <p>
                Approved refunds are issued after the returned item is received
                and inspected, unless another resolution is agreed upon.
              </p>

              <p>
                Refunds are normally returned to the original payment method.
                Processing times vary by bank, credit card company, and payment
                provider.
              </p>

              <p>
                Shipping fees may be excluded from a refund unless the return
                resulted from our error or confirmed shipping damage.
              </p>
            </PolicySection>

            <PolicySection title="Order Cancellations">
              <p>
                Contact us immediately if you need to request an order
                cancellation. We will make a reasonable effort to help, but an
                order cannot be canceled after it has been processed or
                shipped.
              </p>

              <p>
                Payment processing fees or other nonrecoverable charges may be
                deducted from an approved cancellation when permitted.
              </p>
            </PolicySection>

            <PolicySection title="Chargebacks and Payment Disputes">
              <p>
                Customers should contact Sideline Mentality Cards before
                initiating a payment dispute so that we have an opportunity to
                investigate and resolve the concern.
              </p>

              <p>
                Order records, tracking details, communications, listing
                photographs, and other relevant documentation may be provided
                to the payment processor when a dispute is filed.
              </p>
            </PolicySection>
          </div>

          <div className="mt-12 rounded-3xl bg-green-700 p-8 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-100">
              Order Support
            </p>

            <h2 className="mt-4 text-3xl font-black">
              Is there a problem with your order?
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-green-50">
              Contact us as soon as possible and include your order details,
              photographs, and a clear explanation of the issue.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-green-700 transition hover:bg-green-100"
              >
                Contact Us
              </Link>

              <Link
                href="/shipping-policy"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Shipping Policy
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
  children: ReactNode;
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