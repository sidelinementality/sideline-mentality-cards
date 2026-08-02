type CardFeaturesSectionProps = {
    isGraded: boolean;
    onGradedChange: (checked: boolean) => void;
  };
  
  export default function CardFeaturesSection({
    isGraded,
    onGradedChange,
  }: CardFeaturesSectionProps) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
            Step 2
          </p>
  
          <h2 className="mt-2 text-3xl font-black text-white">
            Card Features
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Add the features that make this card unique.
          </p>
        </div>
  
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <FeatureCheckbox
            name="rookieCard"
            label="Rookie Card"
            description="Mark this card as an official rookie card."
          />
  
          <FeatureCheckbox
            name="autograph"
            label="Autograph"
            description="The card includes a player or subject autograph."
          />
  
          <FeatureCheckbox
            name="patch"
            label="Patch"
            description="The card includes a patch or memorabilia piece."
          />
  
          <FeatureCheckbox
            name="relic"
            label="Relic"
            description="The card includes game-used or player-worn material."
          />
  
          <FeatureCheckbox
            name="shortPrint"
            label="Short Print"
            description="The card is a short print or super short print."
          />
  
          <FeatureCheckbox
            name="caseHit"
            label="Case Hit"
            description="The card is considered a case-hit insert."
          />
        </div>
  
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="serialNumber"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Serial Number
            </label>
  
            <input
              id="serialNumber"
              name="serialNumber"
              type="text"
              placeholder="Example: 12/99"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
            />
          </div>
  
          <div>
            <label
              htmlFor="condition"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Raw Card Condition
            </label>
  
            <select
              id="condition"
              name="condition"
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
            >
              <option value="">Select condition</option>
              <option value="Mint">Mint</option>
              <option value="Near Mint or Better">Near Mint or Better</option>
              <option value="Excellent">Excellent</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
  
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
          <label className="flex cursor-pointer items-start gap-4">
            <input
              type="checkbox"
              name="graded"
              checked={isGraded}
              onChange={(event) => onGradedChange(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-black text-green-600"
            />
  
            <span>
              <span className="block text-lg font-bold text-white">
                This card is graded
              </span>
  
              <span className="mt-1 block text-sm text-zinc-400">
                Turn this on to enter grading company, grade, and certification
                number.
              </span>
            </span>
          </label>
  
          {isGraded && (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="gradeCompany"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Grading Company
                </label>
  
                <select
                  id="gradeCompany"
                  name="gradeCompany"
                  defaultValue=""
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
                >
                  <option value="">Select company</option>
                  <option value="PSA">PSA</option>
                  <option value="BGS">BGS</option>
                  <option value="SGC">SGC</option>
                  <option value="CGC">CGC</option>
                  <option value="TAG">TAG</option>
                  <option value="Other">Other</option>
                </select>
              </div>
  
              <div>
                <label
                  htmlFor="grade"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Grade
                </label>
  
                <input
                  id="grade"
                  name="grade"
                  type="text"
                  placeholder="Example: 10"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
                />
              </div>
  
              <div>
                <label
                  htmlFor="certificationNumber"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Certification Number
                </label>
  
                <input
                  id="certificationNumber"
                  name="certificationNumber"
                  type="text"
                  placeholder="Example: 12345678"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
                />
              </div>
            </div>
          )}
        </div>
  
        <div className="mt-8">
          <label
            htmlFor="conditionNotes"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Condition Notes
          </label>
  
          <textarea
            id="conditionNotes"
            name="conditionNotes"
            rows={4}
            placeholder="Note any surface, edge, corner, centering, or case issues."
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
          />
        </div>
      </section>
    );
  }
  
  type FeatureCheckboxProps = {
    name: string;
    label: string;
    description: string;
  };
  
  function FeatureCheckbox({
    name,
    label,
    description,
  }: FeatureCheckboxProps) {
    return (
      <label className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-green-500/50">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name={name}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-green-600"
          />
  
          <span>
            <span className="block font-bold text-white">{label}</span>
            <span className="mt-1 block text-sm leading-6 text-zinc-400">
              {description}
            </span>
          </span>
        </div>
      </label>
    );
  }