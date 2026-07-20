import Link from "next/link";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 text-4xl">
          ✓
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-green-400">
          Payment successful
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          Thank you for your order.
        </h1>

        <p className="mt-6 text-lg leading-8 text-neutral-300">
          Your payment was received and your order has been added
          to the Sideline Mentality Cards order system.
        </p>

        <p className="mt-4 text-neutral-400">
          A confirmation email will be sent once email
          notifications are connected.
        </p>

        {sessionId ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Stripe checkout reference
            </p>

            <p className="mt-2 break-all font-mono text-sm text-neutral-300">
              {sessionId}
            </p>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="rounded-full bg-green-500 px-7 py-3 font-bold text-black transition hover:bg-green-400"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-7 py-3 font-bold text-white transition hover:bg-white/10"
          >
            Return Home
          </Link>
        </div>

        <p className="mt-10 text-sm text-neutral-500">
          Sideline Mentality Cards
        </p>
      </div>
    </main>
  );
}