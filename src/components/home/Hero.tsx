export default function Hero() {
    return (
      <section className="bg-gradient-to-b from-gray-100 to-white">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
  
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
            Premium Sports Card Marketplace
          </p>
  
          <h1 className="max-w-5xl text-6xl font-extrabold leading-tight text-gray-900">
            Buy.
            <span className="text-green-700"> Sell.</span>
            Collect.
            <br />
            Build Your Legacy.
          </h1>
  
          <p className="mt-8 max-w-2xl text-xl leading-8 text-gray-600">
            The home for collectors, investors, and sports fans looking
            for premium football, basketball, baseball, UFC, WWE,
            Pokémon, and more.
          </p>
  
          <div className="mt-12 flex gap-6">
            <button className="rounded-xl bg-green-700 px-8 py-4 text-lg font-semibold text-white hover:bg-green-800">
              Shop Cards
            </button>
  
            <button className="rounded-xl border border-green-700 px-8 py-4 text-lg font-semibold text-green-700 hover:bg-green-50">
              Sell Cards
            </button>
          </div>
  
        </div>
      </section>
    );
  }