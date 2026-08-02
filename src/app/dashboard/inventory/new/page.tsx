"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import CardIdentitySection from "@/components/dealer/forms/CardIdentitySection";
import CardFeaturesSection from "@/components/dealer/forms/CardFeaturesSection";
import PurchaseSection from "@/components/dealer/forms/PurchaseSection";
import PricingSection from "@/components/dealer/forms/PricingSection";
import StorageSection from "@/components/dealer/forms/StorageSection";
import ImageSection from "@/components/dealer/forms/ImageSection";
import WebsiteSection from "@/components/dealer/forms/WebsiteSection";
import SaveCardBar from "@/components/dealer/forms/SaveCardBar";

export default function NewCardPage() {
  const router = useRouter();

  const [isGraded, setIsGraded] = useState(false);

  const [purchasePrice, setPurchasePrice] = useState("");
  const [shippingCost, setShippingCost] = useState("0");
  const [salesTax, setSalesTax] = useState("0");
  const [purchaseFees, setPurchaseFees] = useState("0");
  const [quantity, setQuantity] = useState("1");

  const [marketValue, setMarketValue] = useState("");
  const [websitePrice, setWebsitePrice] = useState("");
  const [minimumPrice, setMinimumPrice] = useState("");

  const [frontImageUrl, setFrontImageUrl] = useState("");
  const [backImageUrl, setBackImageUrl] = useState("");

  const [featured, setFeatured] = useState(false);
  const [websiteReady, setWebsiteReady] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSave =
    purchasePrice.trim() !== "" &&
    websitePrice.trim() !== "" &&
    Number(quantity) >= 1 &&
    Boolean(frontImageUrl);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage("");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const cardData = {
        playerName: getText(formData, "playerName"),
        slug: getText(formData, "slug"),
        sport: getText(formData, "sport"),
        team: getText(formData, "team"),
        year: getNumber(formData, "year"),
        brand: getText(formData, "brand"),
        setName: getText(formData, "set"),
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
        quantity: Number(quantity),

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
      };

      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The card could not be saved.");
      }

      router.push("/dashboard/inventory");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the card.";

      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
          Dealer OS
        </p>

        <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
          Add a Card
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
          Enter the card once. Dealer OS will save the complete record directly
          to inventory and make it available throughout the dashboard.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <CardIdentitySection playerName="" slug="" />

        <CardFeaturesSection
          isGraded={isGraded}
          onGradedChange={setIsGraded}
        />

        <PurchaseSection
          purchasePrice={purchasePrice}
          shippingCost={shippingCost}
          salesTax={salesTax}
          purchaseFees={purchaseFees}
          quantity={quantity}
          onPurchasePriceChange={setPurchasePrice}
          onShippingCostChange={setShippingCost}
          onSalesTaxChange={setSalesTax}
          onPurchaseFeesChange={setPurchaseFees}
          onQuantityChange={setQuantity}
        />

        <PricingSection
          purchasePrice={purchasePrice}
          shippingCost={shippingCost}
          salesTax={salesTax}
          purchaseFees={purchaseFees}
          quantity={quantity}
          marketValue={marketValue}
          websitePrice={websitePrice}
          minimumPrice={minimumPrice}
          onMarketValueChange={setMarketValue}
          onWebsitePriceChange={setWebsitePrice}
          onMinimumPriceChange={setMinimumPrice}
        />

        <StorageSection />

        <ImageSection
          frontImageUrl={frontImageUrl}
          backImageUrl={backImageUrl}
          onFrontImageChange={setFrontImageUrl}
          onBackImageChange={setBackImageUrl}
        />

        <WebsiteSection
          featured={featured}
          websiteReady={websiteReady}
          onFeaturedChange={setFeatured}
          onWebsiteReadyChange={setWebsiteReady}
        />

        <SaveCardBar
          isSaving={isSaving}
          canSave={canSave}
          errorMessage={errorMessage}
          onCancel={() => router.push("/dashboard/inventory")}
        />
      </form>
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

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
}