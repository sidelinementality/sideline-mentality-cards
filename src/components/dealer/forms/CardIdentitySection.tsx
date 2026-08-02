type CardIdentitySectionProps = {
    playerName: string;
    slug: string;
  };
  
  export default function CardIdentitySection({
    playerName,
    slug,
  }: CardIdentitySectionProps) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
            Step 1
          </p>
  
          <h2 className="mt-2 text-3xl font-black text-white">
            Card Identity
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Enter the primary information for this trading card.
          </p>
        </div>
  
        <div className="grid gap-6 md:grid-cols-2">
  
          <div>
            <label className="mb-2 block font-semibold">
              Player / Subject
            </label>
  
            <input
              name="playerName"
              defaultValue={playerName}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
              placeholder="Patrick Mahomes"
            />
          </div>
  
          <div>
            <label className="mb-2 block font-semibold">
              Team
            </label>
  
            <input
              name="team"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
              placeholder="Kansas City Chiefs"
            />
          </div>
  
          <div>
            <label className="mb-2 block font-semibold">
              Sport
            </label>
  
            <select
              name="sport"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
            >
              <option>Football</option>
              <option>Basketball</option>
              <option>Baseball</option>
              <option>Hockey</option>
              <option>Soccer</option>
              <option>WWE</option>
              <option>UFC</option>
              <option>Other</option>
            </select>
          </div>
  
          <div>
            <label className="mb-2 block font-semibold">
              Year
            </label>
  
            <input
              type="number"
              name="year"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
            />
          </div>
  
          <div>
            <label className="mb-2 block font-semibold">
              Brand
            </label>
  
            <input
              name="brand"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
              placeholder="Panini"
            />
          </div>
  
          <div>
            <label className="mb-2 block font-semibold">
              Set
            </label>
  
            <input
              name="set"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
              placeholder="Prizm"
            />
          </div>
  
          <div>
            <label className="mb-2 block font-semibold">
              Parallel
            </label>
  
            <input
              name="parallel"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
              placeholder="Silver"
            />
          </div>
  
          <div>
            <label className="mb-2 block font-semibold">
              Card Number
            </label>
  
            <input
              name="cardNumber"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
              placeholder="#245"
            />
          </div>
  
          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold">
              URL Slug
            </label>
  
            <input
              name="slug"
              defaultValue={slug}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
              placeholder="patrick-mahomes-2024-prizm-silver"
            />
  
            <p className="mt-2 text-sm text-zinc-500">
              Dealer OS will automatically generate this later.
            </p>
          </div>
  
        </div>
      </section>
    );
  }