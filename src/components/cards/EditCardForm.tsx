"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import CardImageUpload from "@/components/cards/CardImageUpload";

export type EditableCard = {
  id: string;
  slug: string;
  player_name: string;
  sport: string | null;
  team: string | null;
  year: number | string | null;
  brand: string | null;
  set_name: string | null;
  parallel: string | null;
  card_number: string | null;

  rookie_card: boolean | null;
  autograph: boolean | null;
  patch: boolean | null;
  relic: boolean | null;
  short_print: boolean | null;
  case_hit: boolean | null;
  serial_number: string | null;
  card_condition: string | null;
  condition_notes: string | null;

  graded: boolean | null;
  grade_company: string | null;
  grade: string | null;
  certification_number: string | null;

  purchase_date: string | null;
  purchase_source: string | null;
  seller: string | null;
  purchase_session: string | null;
  purchase_price: number | string | null;
  shipping_cost: number | string | null;
  sales_tax: number | string | null;
  purchase_fees: number | string | null;

  market_value: number | string | null;
  price: number | string | null;
  minimum_price: number | string | null;

  storage_area: string | null;
  cabinet: string | null;
  shelf: string | null;
  box: string | null;
  storage_row: string | null;
  slot: string | null;
  storage_notes: string | null;

  image_url: string | null;
  back_image_url: string | null;

  website_ready: boolean | null;
  featured: boolean | null;
  listing_status: string | null;
  internal_notes: string | null;

  stock: number | null;
};

type EditCardFormProps = {
  card: EditableCard;
};

export default function EditCardForm({ card }: EditCardFormProps) {
  const router = useRouter();

  const [frontImageUrl, setFrontImageUrl] = useState(card.image_url ?? "");
  const [backImageUrl, setBackImageUrl] = useState(
    card.back_image_url ?? "",
  );

  const [isGraded, setIsGraded] = useState(Boolean(card.graded));
  const [featured, setFeatured] = useState(Boolean(card.featured));
  const [websiteReady, setWebsiteReady] = useState(
    Boolean(card.website_ready),
  );

  const [purchasePrice, setPurchasePrice] = useState(
    String(card.purchase_price ?? 0),
  );
  const [shippingCost, setShippingCost] = useState(
    String(card.shipping_cost ?? 0),
  );
  const [salesTax, setSalesTax] = useState(
    String(card.sales_tax ?? 0),
  );
  const [purchaseFees, setPurchaseFees] = useState(
    String(card.purchase_fees ?? 0),
  );

  const [marketValue, setMarketValue] = useState(
    card.market_value === null ? "" : String(card.market_value),
  );
  const [websitePrice, setWebsitePrice] = useState(
    String(card.price ?? 0),
  );
  const [minimumPrice, setMinimumPrice] = useState(
    card.minimum_price === null ? "" : String(card.minimum_price),
  );
  const [stock, setStock] = useState(String(card.stock ?? 0));

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const totalCost =
    Number(purchasePrice || 0) +
    Number(shippingCost || 0) +
    Number(salesTax || 0) +
    Number(purchaseFees || 0);

  const projectedProfit = Number(websitePrice || 0) - totalCost;

  const projectedRoi =
    totalCost > 0 ? (projectedProfit / totalCost) * 100 : 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData(event.currentTarget);

      const payload = {
        playerName: getText(formData, "playerName"),
        slug: getText(formData, "slug"),
        sport: getText(formData, "sport"),
        team: getText(formData, "team"),
        year: getNumber(formData, "year"),
        brand: getText(formData, "brand"),
        setName: getText(formData, "setName"),
        parallel: getText(formData, "parallel"),
        cardNumber: getText(formData, "cardNumber"),

        rookieCard: hasCheckbox(formData, "rookieCard"),
        autograph: hasCheckbox(formData, "autograph"),
        patch: hasCheckbox(formData, "patch"),
        relic: hasCheckbox(formData, "relic"),
        shortPrint: hasCheckbox(formData, "shortPrint"),
        caseHit: hasCheckbox(formData, "caseHit"),
        serialNumber: getText(formData, "serialNumber"),
        condition: getText(formData, "condition"),
        conditionNotes: getText(formData, "conditionNotes"),

        graded: isGraded,
        gradeCompany: isGraded
          ? getText(formData, "gradeCompany")
          : "",
        grade: isGraded ? getText(formData, "grade") : "",
        certificationNumber: isGraded
          ? getText(formData, "certificationNumber")
          : "",

        purchaseDate: getText(formData, "purchaseDate"),
        purchaseSource: getText(formData, "purchaseSource"),
        seller: getText(formData, "seller"),
        purchaseSession: getText(formData, "purchaseSession"),
        purchasePrice: Number(purchasePrice),
        shippingCost: Number(shippingCost || 0),
        salesTax: Number(salesTax || 0),
        purchaseFees: Number(purchaseFees || 0),

        marketValue: optionalNumber(marketValue),
        websitePrice: Number(websitePrice),
        minimumPrice: optionalNumber(minimumPrice),

        storageArea: getText(formData, "storageArea"),
        cabinet: getText(formData, "cabinet"),
        shelf: getText(formData, "shelf"),
        box: getText(formData, "box"),
        row: getText(formData, "row"),
        slot: getText(formData, "slot"),
        storageNotes: getText(formData, "storageNotes"),

        imageUrl: frontImageUrl,
        backImageUrl,

        websiteReady,
        featured,
        listingStatus: getText(formData, "listingStatus"),
        internalNotes: getText(formData, "internalNotes"),

        stock: Number(stock),
      };

      const response = await fetch(`/api/cards/${card.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The card could not be updated.");
      }

      setSuccessMessage("Card updated successfully.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the card.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Permanently delete ${card.player_name}? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The card could not be deleted.");
      }

      router.push("/dashboard/inventory");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the card.",
      );

      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection
        step="1"
        title="Card Identity"
        description="Update the primary identifying information."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            id="playerName"
            label="Player or Subject"
            defaultValue={card.player_name}
            required
          />

          <TextField
            id="team"
            label="Team"
            defaultValue={card.team ?? ""}
          />

          <SelectField
            id="sport"
            label="Sport"
            defaultValue={card.sport ?? ""}
            required
            options={[
              "Football",
              "Basketball",
              "Baseball",
              "Hockey",
              "Soccer",
              "WWE",
              "UFC",
              "Other",
            ]}
          />

          <TextField
            id="year"
            label="Year"
            type="number"
            defaultValue={String(card.year ?? "")}
            required
          />

          <TextField
            id="brand"
            label="Brand"
            defaultValue={card.brand ?? ""}
            required
          />

          <TextField
            id="setName"
            label="Set"
            defaultValue={card.set_name ?? ""}
          />

          <TextField
            id="parallel"
            label="Parallel"
            defaultValue={card.parallel ?? ""}
          />

          <TextField
            id="cardNumber"
            label="Card Number"
            defaultValue={card.card_number ?? ""}
          />

          <div className="md:col-span-2">
            <TextField
              id="slug"
              label="URL Slug"
              defaultValue={card.slug}
              required
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        step="2"
        title="Features and Grading"
        description="Update special card attributes, condition, and grading."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CheckboxCard
            name="rookieCard"
            label="Rookie Card"
            defaultChecked={Boolean(card.rookie_card)}
          />

          <CheckboxCard
            name="autograph"
            label="Autograph"
            defaultChecked={Boolean(card.autograph)}
          />

          <CheckboxCard
            name="patch"
            label="Patch"
            defaultChecked={Boolean(card.patch)}
          />

          <CheckboxCard
            name="relic"
            label="Relic"
            defaultChecked={Boolean(card.relic)}
          />

          <CheckboxCard
            name="shortPrint"
            label="Short Print"
            defaultChecked={Boolean(card.short_print)}
          />

          <CheckboxCard
            name="caseHit"
            label="Case Hit"
            defaultChecked={Boolean(card.case_hit)}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <TextField
            id="serialNumber"
            label="Serial Number"
            defaultValue={card.serial_number ?? ""}
          />

          <SelectField
            id="condition"
            label="Raw Card Condition"
            defaultValue={card.card_condition ?? ""}
            options={[
              "Mint",
              "Near Mint or Better",
              "Excellent",
              "Very Good",
              "Good",
              "Poor",
            ]}
          />
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
          <input
            type="checkbox"
            checked={isGraded}
            onChange={(event) => setIsGraded(event.target.checked)}
            className="mt-1 h-5 w-5 accent-green-600"
          />

          <span>
            <span className="block font-bold text-white">
              This card is graded
            </span>

            <span className="mt-1 block text-sm text-zinc-400">
              Show grading company, grade, and certification fields.
            </span>
          </span>
        </label>

        {isGraded && (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <SelectField
              id="gradeCompany"
              label="Grading Company"
              defaultValue={card.grade_company ?? ""}
              options={["PSA", "BGS", "SGC", "CGC", "TAG", "Other"]}
            />

            <TextField
              id="grade"
              label="Grade"
              defaultValue={card.grade ?? ""}
            />

            <TextField
              id="certificationNumber"
              label="Certification Number"
              defaultValue={card.certification_number ?? ""}
            />
          </div>
        )}

        <div className="mt-6">
          <TextAreaField
            id="conditionNotes"
            label="Condition Notes"
            defaultValue={card.condition_notes ?? ""}
          />
        </div>
      </FormSection>

      <FormSection
        step="3"
        title="Purchase Details"
        description="Maintain the true cost basis and acquisition source for this card. Dealer Intake can fill these when a card is published from a scan batch."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            id="purchaseDate"
            label="Purchase Date"
            type="date"
            defaultValue={card.purchase_date ?? ""}
          />

          <SelectField
            id="purchaseSource"
            label="Purchase Source"
            defaultValue={card.purchase_source ?? ""}
            options={[
              "Card Show",
              "eBay",
              "Facebook Marketplace",
              "Whatnot",
              "Local Collection",
              "Online Store",
              "Break",
              "Trade",
              "Personal Collection",
              "Other",
            ]}
          />

          <TextField
            id="seller"
            label="Seller or Vendor"
            defaultValue={card.seller ?? ""}
          />

          <TextField
            id="purchaseSession"
            label="Purchase Session"
            defaultValue={card.purchase_session ?? ""}
          />

          <ControlledMoneyField
            id="purchasePrice"
            label="Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            required
          />

          <ControlledMoneyField
            id="shippingCost"
            label="Shipping Cost"
            value={shippingCost}
            onChange={setShippingCost}
          />

          <ControlledMoneyField
            id="salesTax"
            label="Sales Tax"
            value={salesTax}
            onChange={setSalesTax}
          />

          <ControlledMoneyField
            id="purchaseFees"
            label="Purchase Fees"
            value={purchaseFees}
            onChange={setPurchaseFees}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
          <p className="text-sm font-semibold text-green-300">
            Total cost basis
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            {formatCurrency(totalCost)}
          </p>
        </div>
      </FormSection>

      <FormSection
        step="4"
        title="Pricing and Inventory"
        description="Update pricing, profitability, and available stock."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ControlledMoneyField
            id="marketValue"
            label="Market Value"
            value={marketValue}
            onChange={setMarketValue}
          />

          <ControlledMoneyField
            id="websitePrice"
            label="Website Price"
            value={websitePrice}
            onChange={setWebsitePrice}
            required
          />

          <ControlledMoneyField
            id="minimumPrice"
            label="Minimum Price"
            value={minimumPrice}
            onChange={setMinimumPrice}
          />

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Stock
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              required
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SummaryCard
            label="Projected Profit"
            value={formatCurrency(projectedProfit)}
            positive={projectedProfit >= 0}
          />

          <SummaryCard
            label="Projected ROI"
            value={`${projectedRoi.toFixed(1)}%`}
            positive={projectedRoi >= 0}
          />
        </div>
      </FormSection>

      <FormSection
        step="5"
        title="Storage Location"
        description="Record where the card is physically stored."
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <TextField
            id="storageArea"
            label="Storage Area"
            defaultValue={card.storage_area ?? ""}
          />

          <TextField
            id="cabinet"
            label="Cabinet"
            defaultValue={card.cabinet ?? ""}
          />

          <TextField
            id="shelf"
            label="Shelf"
            defaultValue={card.shelf ?? ""}
          />

          <TextField
            id="box"
            label="Box"
            defaultValue={card.box ?? ""}
          />

          <TextField
            id="row"
            label="Row"
            defaultValue={card.storage_row ?? ""}
          />

          <TextField
            id="slot"
            label="Slot"
            defaultValue={card.slot ?? ""}
          />
        </div>

        <div className="mt-6">
          <TextAreaField
            id="storageNotes"
            label="Storage Notes"
            defaultValue={card.storage_notes ?? ""}
          />
        </div>
      </FormSection>

      <FormSection
        step="6"
        title="Card Images"
        description="Keep the existing images or upload replacements."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <ImagePanel
            label="Front Image"
            imageUrl={frontImageUrl}
            required
          >
            <CardImageUpload onUploadComplete={setFrontImageUrl} />
          </ImagePanel>

          <ImagePanel label="Back Image" imageUrl={backImageUrl}>
            <CardImageUpload onUploadComplete={setBackImageUrl} />
          </ImagePanel>
        </div>
      </FormSection>

      <FormSection
        step="7"
        title="Website Settings"
        description="Control publishing, featured status, and internal notes."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <ToggleCard
            label="Ready for Website"
            checked={websiteReady}
            onChange={setWebsiteReady}
          />

          <ToggleCard
            label="Featured Card"
            checked={featured}
            onChange={setFeatured}
          />
        </div>

        <div className="mt-6">
          <SelectField
            id="listingStatus"
            label="Inventory Status"
            defaultValue={card.listing_status ?? "Available"}
            options={[
              "Available",
              "Draft",
              "Needs Photos",
              "Needs Pricing",
              "Ready to Publish",
              "Published",
              "Reserved",
              "Sold",
              "Archived",
            ]}
          />
        </div>

        <div className="mt-6">
          <TextAreaField
            id="internalNotes"
            label="Internal Notes"
            defaultValue={card.internal_notes ?? ""}
          />
        </div>
      </FormSection>

      {errorMessage && (
        <MessageBox type="error" message={errorMessage} />
      )}

      {successMessage && (
        <MessageBox type="success" message={successMessage} />
      )}

      <div className="sticky bottom-0 z-30 border-t border-white/10 bg-zinc-950/95 py-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-3 font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Card"}
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/inventory"
              className="rounded-xl border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:bg-white/5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || deleting || !frontImageUrl}
              className="rounded-xl bg-green-600 px-8 py-3 font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500";

type FormSectionProps = {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function FormSection({
  step,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
          Step {step}
        </p>

        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 text-zinc-400">{description}</p>
      </div>

      {children}
    </section>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
};

function TextField({
  id,
  label,
  defaultValue,
  type = "text",
  required = false,
}: TextFieldProps) {
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
        type={type}
        defaultValue={defaultValue}
        required={required}
        className={inputClasses}
      />
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  defaultValue: string;
  options: string[];
  required?: boolean;
};

function SelectField({
  id,
  label,
  defaultValue,
  options,
  required = false,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-white"
      >
        {label}
      </label>

      <select
        id={id}
        name={id}
        defaultValue={defaultValue}
        required={required}
        className={inputClasses}
      >
        <option value="">
          {required ? "Select an option" : "Not selected"}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

type ControlledMoneyFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function ControlledMoneyField({
  id,
  label,
  value,
  onChange,
  required = false,
}: ControlledMoneyFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-white"
      >
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-500">
          $
        </span>

        <input
          id={id}
          name={id}
          type="number"
          min="0"
          step="0.01"
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClasses} pl-8`}
        />
      </div>
    </div>
  );
}

function CheckboxCard({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="h-4 w-4 accent-green-600"
        />

        <span className="font-bold text-white">{label}</span>
      </div>
    </label>
  );
}

function TextAreaField({
  id,
  label,
  defaultValue,
}: {
  id: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-white"
      >
        {label}
      </label>

      <textarea
        id={id}
        name={id}
        rows={4}
        defaultValue={defaultValue}
        className={inputClasses}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        positive
          ? "border-green-500/20 bg-green-500/10"
          : "border-red-500/20 bg-red-500/10"
      }`}
    >
      <p className="text-sm font-semibold text-zinc-300">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function ImagePanel({
  label,
  imageUrl,
  required = false,
  children,
}: {
  label: string;
  imageUrl: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
        {required ? "Required" : "Optional"}
      </p>

      <h3 className="mt-2 text-xl font-black text-white">{label}</h3>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={label}
          className="mt-5 max-h-72 w-full rounded-xl object-contain"
        />
      )}

      <div className="mt-5">{children}</div>
    </div>
  );
}

function ToggleCard({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`cursor-pointer rounded-2xl border p-5 ${
        checked
          ? "border-green-500/40 bg-green-500/10"
          : "border-white/10 bg-black/20"
      }`}
    >
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="h-5 w-5 accent-green-600"
        />

        <span className="font-bold text-white">{label}</span>
      </div>
    </label>
  );
}

function MessageBox({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        type === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-green-500/30 bg-green-500/10 text-green-300"
      }`}
    >
      {message}
    </div>
  );
}

function getText(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) || "").trim();
}

function getNumber(formData: FormData, fieldName: string) {
  return Number(formData.get(fieldName));
}

function hasCheckbox(formData: FormData, fieldName: string) {
  return formData.get(fieldName) === "on";
}

function optionalNumber(value: string) {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(value) ? value : 0);
}