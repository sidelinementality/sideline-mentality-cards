import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Sideline Mentality Cards collects, uses, stores, and protects customer information.",
};

const privacyHighlights = [
  {
    title: "Information We Collect",
    description:
      "We collect information needed to process purchases, provide customer service, maintain accounts, and operate the website.",
  },
  {
    title: "How Information Is Used",
    description:
      "Customer information is used to complete orders, communicate updates, prevent fraud, improve the website, and support customers.",
  },
  {
    title: "Your Choices",
    description:
      "You may contact us to ask questions about your information, request corrections, or manage certain communications.",
  },
];

export default function PrivacyPolicyPage() {
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
            Your Information Matters
          </p>

          <h1 className="mt-5 text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-neutral-300">
            This policy explains what information Sideline Mentality Cards may
            collect, why we collect it, how it may be shared, and the choices
            available to you.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {privacyHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
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
                      d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 12 2 2 4-4"
                    />
                  </svg>
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
            <PolicySection title="Information We May Collect">
              <p>
                We may collect information that you provide directly when you
                browse the website, create an account, place an order, join a
                mailing list, save an item, or contact us.
              </p>

              <p>This information may include:</p>

              <ul className="list-disc space-y-3 pl-6">
                <li>Your name.</li>
                <li>Email address.</li>
                <li>Billing and shipping address.</li>
                <li>Telephone number, when provided.</li>
                <li>Account and login information.</li>
                <li>Order history and transaction details.</li>
                <li>Wishlist and recently viewed activity.</li>
                <li>Messages, support requests, and other communications.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Payment Information">
              <p>
                Payments are processed through third-party payment providers,
                including Stripe. Sideline Mentality Cards does not directly
                store complete credit card numbers or card security codes on
                its own servers.
              </p>

              <p>
                Payment providers may collect billing, transaction, identity,
                fraud-prevention, and device information according to their own
                privacy policies and service terms.
              </p>
            </PolicySection>

            <PolicySection title="Information Collected Automatically">
              <p>
                When you use the website, certain technical information may be
                collected automatically through cookies, server logs,
                analytics tools, and similar technologies.
              </p>

              <p>This information may include:</p>

              <ul className="list-disc space-y-3 pl-6">
                <li>Internet Protocol address.</li>
                <li>Browser and device type.</li>
                <li>Operating system.</li>
                <li>Pages viewed and links selected.</li>
                <li>Date, time, and length of visits.</li>
                <li>Referring website or traffic source.</li>
                <li>Approximate location derived from technical data.</li>
                <li>Website performance and error information.</li>
              </ul>
            </PolicySection>

            <PolicySection title="How We Use Information">
              <p>We may use collected information to:</p>

              <ul className="list-disc space-y-3 pl-6">
                <li>Process and fulfill purchases.</li>
                <li>Provide order confirmations and shipping updates.</li>
                <li>Create and maintain customer accounts.</li>
                <li>Provide customer service.</li>
                <li>Respond to questions and requests.</li>
                <li>Maintain wishlists and recently viewed items.</li>
                <li>Prevent fraud, abuse, and unauthorized activity.</li>
                <li>Monitor website security and performance.</li>
                <li>Improve products, services, and website features.</li>
                <li>Comply with legal, tax, accounting, and recordkeeping obligations.</li>
                <li>
                  Send promotional communications when permitted and when you
                  have chosen to receive them.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="Cookies and Similar Technologies">
              <p>
                Cookies and similar technologies may be used to remember
                preferences, maintain cart and account functions, understand
                website traffic, measure performance, and improve the customer
                experience.
              </p>

              <p>
                You may be able to restrict or remove cookies through your
                browser settings. Disabling cookies may prevent certain
                website features from working properly.
              </p>
            </PolicySection>

            <PolicySection title="How Information May Be Shared">
              <p>
                We do not sell customer personal information in exchange for
                money.
              </p>

              <p>
                Information may be shared with service providers that help us
                operate the business, including:
              </p>

              <ul className="list-disc space-y-3 pl-6">
                <li>Payment processors.</li>
                <li>Website hosting providers.</li>
                <li>Database and cloud service providers.</li>
                <li>Shipping carriers and fulfillment services.</li>
                <li>Email and communication providers.</li>
                <li>Analytics and website performance services.</li>
                <li>Fraud-prevention and security providers.</li>
                <li>Professional advisers such as accountants or attorneys.</li>
              </ul>

              <p>
                Information may also be disclosed when reasonably necessary to
                comply with law, enforce website policies, protect customers,
                investigate fraud, or defend legal rights.
              </p>
            </PolicySection>

            <PolicySection title="Third-Party Services">
              <p>
                The website relies on third-party services that may process
                information on our behalf. These may include Stripe, Supabase,
                Vercel, shipping carriers, analytics providers, and other
                services used to operate the website.
              </p>

              <p>
                Third-party services maintain their own privacy policies,
                security practices, and terms. Sideline Mentality Cards does
                not control the independent privacy practices of those
                providers.
              </p>
            </PolicySection>

            <PolicySection title="Data Retention">
              <p>
                Information may be retained for as long as reasonably
                necessary to fulfill the purposes described in this policy,
                maintain business and transaction records, resolve disputes,
                prevent fraud, and meet legal or financial obligations.
              </p>

              <p>
                Retention periods may vary depending on the type of information
                and the reason it was collected.
              </p>
            </PolicySection>

            <PolicySection title="Data Security">
              <p>
                We use reasonable administrative, technical, and physical
                safeguards intended to protect personal information from
                unauthorized access, misuse, alteration, or disclosure.
              </p>

              <p>
                No website, database, or electronic transmission method can be
                guaranteed to be completely secure. Customers should protect
                their account credentials and notify us of suspected
                unauthorized activity.
              </p>
            </PolicySection>

            <PolicySection title="Your Privacy Choices">
              <p>
                Depending on your location and applicable law, you may have the
                right to request access to, correction of, or deletion of
                certain personal information.
              </p>

              <p>
                You may also unsubscribe from promotional emails by using the
                unsubscribe option included in those messages or by contacting
                us directly.
              </p>

              <p>
                Some information may need to be retained for transactions,
                fraud prevention, legal compliance, tax records, or other
                legitimate business purposes.
              </p>
            </PolicySection>

            <PolicySection title="Children's Privacy">
              <p>
                This website is intended for a general audience and is not
                directed to children under 13. We do not knowingly collect
                personal information online from children under 13.
              </p>

              <p>
                A parent or guardian who believes a child has provided personal
                information should contact us so that the information can be
                reviewed and deleted when appropriate.
              </p>
            </PolicySection>

            <PolicySection title="External Links">
              <p>
                The website may contain links to third-party websites or
                services. We are not responsible for the privacy practices,
                content, or security of external websites.
              </p>

              <p>
                Review the privacy policy of any third-party website before
                providing personal information.
              </p>
            </PolicySection>

            <PolicySection title="Changes to This Policy">
              <p>
                This Privacy Policy may be updated as the website, services,
                technology, or business practices change.
              </p>

              <p>
                The updated version will be posted on this page with a revised
                effective date. Continued use of the website after an update
                constitutes acceptance of the revised policy to the extent
                permitted by law.
              </p>
            </PolicySection>

            <PolicySection title="Contact Us">
              <p>
                Questions or requests relating to this Privacy Policy may be
                sent to:
              </p>

              <p>
                <a
                  href="mailto:eric@sidelinementality.com"
                  className="font-bold text-green-700 underline decoration-green-300 underline-offset-4 transition hover:text-green-800"
                >
                  eric@sidelinementality.com
                </a>
              </p>
            </PolicySection>
          </div>

          <div className="mt-12 rounded-3xl bg-green-700 p-8 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-100">
              Privacy Questions
            </p>

            <h2 className="mt-4 text-3xl font-black">
              Have a question about your information?
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-green-50">
              Contact Sideline Mentality Cards and explain the information or
              privacy request you would like us to review.
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