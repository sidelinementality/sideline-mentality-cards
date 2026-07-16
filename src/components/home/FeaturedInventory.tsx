const featuredCards = [
    {
      player: "Marcus Reed",
      sport: "Football",
      year: "2024",
      brand: "Prizm",
      price: "$249",
    },
    {
      player: "Jaylen Brooks",
      sport: "Basketball",
      year: "2023",
      brand: "Select",
      price: "$189",
    },
    {
      player: "Tyler Nash",
      sport: "Baseball",
      year: "2022",
      brand: "Topps Chrome",
      price: "$320",
    },
    {
      player: "Dante Silva",
      sport: "UFC",
      year: "2024",
      brand: "Panini Immaculate",
      price: "$175",
    },
  ];
  
  export default function FeaturedInventory() {
    return (
      <section id="featured" className="bg-white px-6 py-20 text-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-700">
                Featured Inventory
              </p>
  
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Premium cards worth a closer look
              </h2>
            </div>
  
            <a
              href="#"
              className="hidden text-sm font-bold text-green-700 transition hover:text-green-800 sm:block"
            >
              View All Cards
            </a>
          </div>
  
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCards.map((card) => (
              <article
                key={`${card.player}-${card.year}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 p-6">
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-center">
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
                      Card Image Coming Soon
                    </span>
                  </div>
                </div>
  
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                    {card.sport}
                  </p>
  
                  <h3 className="mt-2 text-xl font-black">{card.player}</h3>
  
                  <p className="mt-1 text-sm text-gray-500">
                    {card.year} {card.brand}
                  </p>
  
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-lg font-black">{card.price}</span>
  
                    <button className="rounded-lg bg-black px-4 py-2 text-sm font-bold text-white transition group-hover:bg-green-700">
                      View Card
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }