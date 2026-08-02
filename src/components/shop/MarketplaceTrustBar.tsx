const trustItems = [
    {
      title: "$4.99 Flat Shipping",
      description: "One shipping charge per order",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
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
    {
      title: "Free Shipping $100+",
      description: "Applied automatically at checkout",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 12v8H4v-8M2 7h20v5H2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7v13M12 7H8.5A2.5 2.5 0 1 1 11 4.5V7Zm0 0h3.5A2.5 2.5 0 1 0 13 4.5V7Z"
          />
        </svg>
      ),
    },
    {
      title: "Secure Checkout",
      description: "Protected Stripe payments",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect x="4" y="10" width="16" height="10" rx="2" />
  
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10V7a4 4 0 0 1 8 0v3"
          />
        </svg>
      ),
    },
    {
      title: "Collector Owned",
      description: "Built by someone who values the hobby",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
          />
        </svg>
      ),
    },
    {
      title: "Carefully Packaged",
      description: "Tracked and protected shipping",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3 7 9-4 9 4-9 4-9-4Z"
          />
  
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3 7 9 4 9-4v10l-9 4-9-4V7Z"
          />
  
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11v10"
          />
        </svg>
      ),
    },
  ];
  
  export default function MarketplaceTrustBar() {
    return (
      <section
        aria-label="Marketplace purchase benefits"
        className="border-b border-white/10 bg-black px-4 py-5 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-500/[0.09] via-white/[0.035] to-green-500/[0.09]">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5">
              {trustItems.map((item, index) => (
                <div
                  key={item.title}
                  className={`flex items-center gap-3 px-5 py-4 ${
                    index > 0
                      ? "border-t border-white/10 sm:[&:nth-child(2)]:border-l lg:border-l lg:border-t-0"
                      : ""
                  } ${
                    index >= 2
                      ? "sm:border-t lg:border-t-0"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 text-green-400">
                    {item.icon}
                  </div>
  
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wide text-white">
                      {item.title}
                    </p>
  
                    <p className="mt-1 text-[11px] leading-4 text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }