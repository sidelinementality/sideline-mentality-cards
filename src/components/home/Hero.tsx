import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-green-400">
            Premium Sports Card Marketplace
          </p>

          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Buy. Sell. Collect.
            <span className="block text-green-400">Build Your Legacy.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Curated sports cards for collectors, investors, and fans who value
            quality, trust, and the thrill of the hobby.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#featured"
              className="rounded-xl bg-green-500 px-7 py-4 text-center text-base font-bold text-black transition hover:bg-green-400"
            >
              Shop Cards
            </a>

            <a
              href="#sell"
              className="rounded-xl border border-green-500 px-7 py-4 text-center text-base font-bold text-green-400 transition hover:bg-green-500 hover:text-black"
            >
              Sell Your Cards
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-5 sm:grid-cols-4">
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
    <p className="text-2xl font-black text-green-400">500+</p>
    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
      Cards
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
    <p className="text-2xl font-black text-green-400">24hr</p>
    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
      Shipping
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
    <p className="text-2xl font-black text-green-400">100%</p>
    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
      Secure Checkout
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
    <p className="text-2xl font-black text-green-400">★★★★★</p>
    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
      Collector Owned
    </p>
  </div>
</div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-xl rounded-3xl border border-green-500/30 bg-white/5 p-8 shadow-2xl shadow-green-500/10 backdrop-blur">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/10 to-transparent" />

            <Image
              src="/sideline-mentality-logo.png"
              alt="Sideline Mentality"
              width={700}
              height={700}
              className="relative h-auto w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}