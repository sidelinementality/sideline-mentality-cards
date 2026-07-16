const reasons = [
    {
      title: "Collector Owned",
      description:
        "Built by collectors, for collectors. Every card is selected with quality and long-term value in mind.",
      icon: "🃏",
    },
    {
      title: "Fast & Secure Shipping",
      description:
        "Every order is carefully packaged with protection so your cards arrive safely.",
      icon: "📦",
    },
    {
      title: "Premium Inventory",
      description:
        "From modern rookies to legendary Hall of Famers, we focus on cards collectors actually want.",
      icon: "💎",
    },
    {
      title: "Integrity First",
      description:
        "Sideline Mentality is built on honesty, service, and doing business the right way.",
      icon: "🤝",
    },
  ];
  
  export default function WhyChooseUs() {
    return (
      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-400">
              Why Sideline Mentality Cards?
            </p>
  
            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              More Than Just Another Card Store
            </h2>
  
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
              We're building a trusted marketplace where collectors, investors,
              athletes, and fans can confidently buy and sell premium sports cards.
            </p>
          </div>
  
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-green-500 hover:bg-green-500/10"
              >
                <div className="text-5xl">{reason.icon}</div>
  
                <h3 className="mt-6 text-2xl font-bold">
                  {reason.title}
                </h3>
  
                <p className="mt-4 leading-7 text-gray-400">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }