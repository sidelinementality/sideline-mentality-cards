export default function StorageSection() {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
            Step 5
          </p>
  
          <h2 className="mt-2 text-3xl font-black text-white">
            Storage Location
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Record the card’s physical location so it can be found quickly when
            it sells.
          </p>
        </div>
  
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <StorageField
            id="storageArea"
            label="Storage Area"
            placeholder="Example: Card Room"
          />
  
          <StorageField
            id="cabinet"
            label="Cabinet"
            placeholder="Example: Cabinet A"
          />
  
          <StorageField
            id="shelf"
            label="Shelf"
            placeholder="Example: Shelf 2"
          />
  
          <StorageField
            id="box"
            label="Box"
            placeholder="Example: Football Box 4"
          />
  
          <StorageField
            id="row"
            label="Row"
            placeholder="Example: Row B"
          />
  
          <StorageField
            id="slot"
            label="Slot"
            placeholder="Example: Slot 18"
          />
        </div>
  
        <div className="mt-8">
          <label
            htmlFor="storageNotes"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Storage Notes
          </label>
  
          <textarea
            id="storageNotes"
            name="storageNotes"
            rows={3}
            placeholder="Add any additional details needed to locate or protect this card."
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
          />
        </div>
      </section>
    );
  }
  
  type StorageFieldProps = {
    id: string;
    label: string;
    placeholder: string;
  };
  
  function StorageField({
    id,
    label,
    placeholder,
  }: StorageFieldProps) {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-white"
        >
          {label}
        </label>
  
        <input
          id={id}
          name={id}
          type="text"
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
        />
      </div>
    );
  }