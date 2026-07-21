const trustReasons = [
    {
      title: "Real Card Photos",
      description:
        "Every listing uses photos of the actual card being sold, so you know exactly what will arrive.",
      icon: "📸",
    },
    {
      title: "Collector-Safe Packaging",
      description:
        "Cards are protected with appropriate sleeves, holders, team bags, and secure shipping materials.",
      icon: "📦",
    },
    {
      title: "Fast, Trackable Shipping",
      description:
        "Orders are prepared promptly, and tracking information is added to your account after shipment.",
      icon: "🚚",
    },
    {
      title: "Secure Stripe Checkout",
      description:
        "Payments are processed securely through Stripe, so your financial information is never stored by us.",
      icon: "🔒",
    },
    {
      title: "Collector Owned",
      description:
        "Sideline Mentality Cards is built by people who understand the hobby and care about every order.",
      icon: "🃏",
    },
    {
      title: "Inventory Added Regularly",
      description:
        "New rookies, stars, legends, autographs, and graded cards are added to the marketplace regularly.",
      icon: "✨",
    },
  ];
  
  const buyerPromises = [
    "The exact card pictured",
    "Secure payment processing",
    "Careful protective packaging",
    "Order and shipping updates",
  ];
  
  export default function WhyChooseUs() {
    return (
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-24 text-white">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
  
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
              Buy With Confidence
            </p>
  
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              A Better Way to Buy Cards
            </h2>
  
            <p className="mt-6 text-lg leading-8 text-neutral-400">
              Sideline Mentality Cards is built around honesty,
              protection, and service. From the listing photo to the
              package arriving at your door, every part of the buying
              experience matters.
            </p>
          </div>
  
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trustReasons.map((reason) => (
              <article
                key={reason.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1 hover:border-green-500/50 hover:bg-green-500/[0.08]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl transition group-hover:border-green-500/40 group-hover:bg-green-500/10">
                  <span aria-hidden="true">{reason.icon}</span>
                </div>
  
                <h3 className="mt-6 text-xl font-black">
                  {reason.title}
                </h3>
  
                <p className="mt-3 leading-7 text-neutral-400">
                  {reason.description}
                </p>
              </article>
            ))}
          </div>
  
          <div className="mt-16 overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-r from-green-500/15 via-white/[0.04] to-green-500/10">
            <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:p-10">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                  The Sideline Standard
                </p>
  
                <h3 className="mt-3 text-3xl font-black">
                  Your collection deserves to be handled the right way.
                </h3>
  
                <p className="mt-4 max-w-2xl leading-7 text-neutral-300">
                  We want every customer to feel confident before,
                  during, and after a purchase. That means accurate
                  listings, secure checkout, careful packaging, and
                  clear order updates.
                </p>
              </div>
  
              <div className="grid gap-3 sm:grid-cols-2">
                {buyerPromises.map((promise) => (
                  <div
                    key={promise}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-black text-black"
                    >
                      ✓
                    </span>
  
                    <span className="text-sm font-bold text-neutral-100">
                      {promise}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }