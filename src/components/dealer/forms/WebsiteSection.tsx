type WebsiteSectionProps = {
    featured: boolean;
    websiteReady: boolean;
    onFeaturedChange: (checked: boolean) => void;
    onWebsiteReadyChange: (checked: boolean) => void;
  };
  
  export default function WebsiteSection({
    featured,
    websiteReady,
    onFeaturedChange,
    onWebsiteReadyChange,
  }: WebsiteSectionProps) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
            Step 7
          </p>
  
          <h2 className="mt-2 text-3xl font-black text-white">
            Website Settings
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Choose how this card should appear in Sideline Mentality Cards.
          </p>
        </div>
  
        <div className="grid gap-5 md:grid-cols-2">
          <ToggleCard
            label="Ready for Website"
            description="Mark the card ready to appear in the website publishing queue."
            checked={websiteReady}
            onChange={onWebsiteReadyChange}
          />
  
          <ToggleCard
            label="Featured Card"
            description="Display this card in featured inventory areas."
            checked={featured}
            onChange={onFeaturedChange}
          />
        </div>
  
        <div className="mt-8">
          <label
            htmlFor="listingStatus"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Inventory Status
          </label>
  
          <select
            id="listingStatus"
            name="listingStatus"
            defaultValue="Available"
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500 md:max-w-md"
          >
            <option value="Available">Available</option>
            <option value="Draft">Draft</option>
            <option value="Needs Photos">Needs Photos</option>
            <option value="Needs Pricing">Needs Pricing</option>
            <option value="Ready to Publish">Ready to Publish</option>
            <option value="Published">Published</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
  
        <div className="mt-8">
          <label
            htmlFor="internalNotes"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Internal Notes
          </label>
  
          <textarea
            id="internalNotes"
            name="internalNotes"
            rows={4}
            placeholder="Add dealer-only notes. These will not appear on the public website."
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
          />
        </div>
      </section>
    );
  }
  
  type ToggleCardProps = {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  };
  
  function ToggleCard({
    label,
    description,
    checked,
    onChange,
  }: ToggleCardProps) {
    return (
      <label
        className={`cursor-pointer rounded-2xl border p-5 transition ${
          checked
            ? "border-green-500/40 bg-green-500/10"
            : "border-white/10 bg-black/20 hover:border-white/20"
        }`}
      >
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-white/20 bg-black text-green-600"
          />
  
          <span>
            <span className="block text-lg font-bold text-white">
              {label}
            </span>
  
            <span className="mt-1 block text-sm leading-6 text-zinc-400">
              {description}
            </span>
          </span>
        </div>
      </label>
    );
  }