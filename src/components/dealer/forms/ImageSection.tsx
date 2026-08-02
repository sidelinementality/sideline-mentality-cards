import CardImageUpload from "@/components/cards/CardImageUpload";

type ImageSectionProps = {
  frontImageUrl: string;
  backImageUrl: string;
  onFrontImageChange: (url: string) => void;
  onBackImageChange: (url: string) => void;
};

export default function ImageSection({
  frontImageUrl,
  backImageUrl,
  onFrontImageChange,
  onBackImageChange,
}: ImageSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
          Step 6
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Card Images
        </h2>

        <p className="mt-2 text-zinc-400">
          Upload clear front and back images for the website listing.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ImageUploadPanel
          label="Front Image"
          description="Required. This is the primary image customers will see."
          imageUrl={frontImageUrl}
          required
        >
          <CardImageUpload onUploadComplete={onFrontImageChange} />
        </ImageUploadPanel>

        <ImageUploadPanel
          label="Back Image"
          description="Recommended. This helps buyers inspect the complete card."
          imageUrl={backImageUrl}
        >
          <CardImageUpload onUploadComplete={onBackImageChange} />
        </ImageUploadPanel>
      </div>

      {!frontImageUrl && (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
          <p className="font-bold text-amber-300">
            A front image is required before the card can be saved.
          </p>
        </div>
      )}
    </section>
  );
}

type ImageUploadPanelProps = {
  label: string;
  description: string;
  imageUrl: string;
  required?: boolean;
  children: React.ReactNode;
};

function ImageUploadPanel({
  label,
  description,
  imageUrl,
  required = false,
  children,
}: ImageUploadPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-5">
        <p
          className={`text-xs font-bold uppercase tracking-[0.2em] ${
            required ? "text-green-500" : "text-zinc-500"
          }`}
        >
          {required ? "Required" : "Optional"}
        </p>

        <h3 className="mt-2 text-xl font-black text-white">
          {label}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {description}
        </p>
      </div>

      {children}

      {imageUrl && (
        <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm font-semibold text-green-300">
            Image uploaded and ready.
          </p>

          <p className="mt-2 break-all text-xs text-zinc-400">
            {imageUrl}
          </p>
        </div>
      )}
    </div>
  );
}