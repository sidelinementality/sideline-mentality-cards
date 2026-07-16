const sports = [
    {
      name: "Football",
      emoji: "🏈",
      description: "NFL • College • Rookie Cards",
    },
    {
      name: "Basketball",
      emoji: "🏀",
      description: "NBA • WNBA • Prospect Cards",
    },
    {
      name: "Baseball",
      emoji: "⚾",
      description: "MLB • Prospects • Hall of Fame",
    },
    {
      name: "UFC",
      emoji: "🥊",
      description: "Champions • Rookies • Autos",
    },
    {
      name: "WWE",
      emoji: "🤼",
      description: "Legends • Current Stars",
    },
    {
      name: "Soccer",
      emoji: "⚽",
      description: "Premier League • MLS • World Cup",
    },
    {
      name: "Hockey",
      emoji: "🏒",
      description: "NHL • Young Guns • Legends",
    },
    {
      name: "Pokémon",
      emoji: "⚡",
      description: "Vintage • Modern • Graded",
    },
  ];
  
  export default function ShopBySport() {
    return (
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-700">
              Shop by Sport
            </p>
  
            <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">
              Find your next favorite card
            </h2>
  
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Browse our growing inventory across every major sport and collectible category.
            </p>
          </div>
  
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sports.map((sport) => (
              <div
                key={sport.name}
                className="group cursor-pointer rounded-2xl bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:bg-green-700 hover:text-white hover:shadow-xl"
              >
                <div className="text-5xl">{sport.emoji}</div>
  
                <h3 className="mt-5 text-2xl font-black">
                  {sport.name}
                </h3>
  
                <p className="mt-3 text-sm opacity-80">
                  {sport.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }