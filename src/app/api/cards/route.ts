import { NextResponse } from "next/server";
import { resolveCardSlug } from "@/lib/card-slug";
import { isPurchaseId } from "@/lib/purchases";
import { supabaseAdmin } from "@/lib/supabase-admin";

type CreateCardRequest = {
  playerName?: string;
  slug?: string;
  sport?: string;
  team?: string;
  year?: number | string;
  brand?: string;
  setName?: string;
  parallel?: string;
  cardNumber?: string;

  rookieCard?: boolean;
  autograph?: boolean;
  patch?: boolean;
  relic?: boolean;
  shortPrint?: boolean;
  caseHit?: boolean;
  serialNumber?: string;
  condition?: string;
  conditionNotes?: string;

  graded?: boolean;
  gradeCompany?: string;
  grade?: string;
  certificationNumber?: string;

  purchaseDate?: string;
  purchaseSource?: string;
  seller?: string;
  purchaseSession?: string;
  purchaseId?: string | null;
  purchasePrice?: number | null;
  shippingCost?: number;
  salesTax?: number;
  purchaseFees?: number;
  quantity?: number;

  marketValue?: number;
  websitePrice?: number | null;
  minimumPrice?: number;

  storageArea?: string;
  cabinet?: string;
  shelf?: string;
  box?: string;
  row?: string;
  slot?: string;
  storageNotes?: string;

  imageUrl?: string;
  backImageUrl?: string;

  websiteReady?: boolean;
  featured?: boolean;
  listingStatus?: string;
  internalNotes?: string;
};

function cleanOptionalText(value: string | undefined) {
  const cleanedValue = value?.trim();

  return cleanedValue ? cleanedValue : null;
}

function cleanOptionalNumber(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function cleanRequiredMoney(value: number | null | undefined) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateCardRequest;

    const playerName = body.playerName?.trim();
    const sport = body.sport?.trim();
    const team = cleanOptionalText(body.team);
    const brand = body.brand?.trim();
    const setName = cleanOptionalText(body.setName);
    const parallel = cleanOptionalText(body.parallel);
    const cardNumber = cleanOptionalText(body.cardNumber);
    const imageUrl = body.imageUrl?.trim();
    const backImageUrl = cleanOptionalText(body.backImageUrl);

    const year = Number(body.year);
    const quantity = Number(body.quantity ?? 1);

    const purchasePrice = cleanRequiredMoney(body.purchasePrice);
    const shippingCost = cleanRequiredMoney(body.shippingCost ?? 0);
    const salesTax = cleanRequiredMoney(body.salesTax ?? 0);
    const purchaseFees = cleanRequiredMoney(body.purchaseFees ?? 0);
    const websitePrice = cleanRequiredMoney(body.websitePrice);

    const slug = resolveCardSlug({
      playerName,
      year,
      brand,
      setName,
      parallel,
      cardNumber,
      slug: body.slug,
    });

    if (!playerName) {
      return NextResponse.json(
        { error: "A player or subject name is required." },
        { status: 400 },
      );
    }

    if (!sport) {
      return NextResponse.json(
        { error: "A sport is required." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(year) || year < 1800 || year > 2100) {
      return NextResponse.json(
        { error: "Please enter a valid card year." },
        { status: 400 },
      );
    }

    if (!brand) {
      return NextResponse.json(
        { error: "A brand is required." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "A URL slug could not be generated." },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "The URL slug may only contain lowercase letters, numbers, and hyphens.",
        },
        { status: 400 },
      );
    }

    if (purchasePrice === null) {
      return NextResponse.json(
        { error: "Please enter a valid purchase price." },
        { status: 400 },
      );
    }

    if (websitePrice === null || websitePrice <= 0) {
      return NextResponse.json(
        { error: "Website price is required and must be greater than $0." },
        { status: 400 },
      );
    }

    if (
      shippingCost === null ||
      salesTax === null ||
      purchaseFees === null
    ) {
      return NextResponse.json(
        { error: "Purchase costs cannot be negative." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1." },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "A front card image is required." },
        { status: 400 },
      );
    }

    const purchaseId = cleanOptionalText(body.purchaseId ?? undefined);

    if (purchaseId && !isPurchaseId(purchaseId)) {
      return NextResponse.json(
        { error: "A valid purchase is required when linking a lot." },
        { status: 400 },
      );
    }

    if (purchaseId) {
      const { data: purchase, error: purchaseError } = await supabaseAdmin
        .from("purchases")
        .select("id")
        .eq("id", purchaseId)
        .maybeSingle();

      if (purchaseError) {
        console.error("Purchase lookup error:", purchaseError);
        return NextResponse.json(
          { error: "The selected purchase could not be verified." },
          { status: 500 },
        );
      }

      if (!purchase) {
        return NextResponse.json(
          { error: "The selected purchase could not be found." },
          { status: 400 },
        );
      }
    }

    const graded = Boolean(body.graded);

    const { data, error } = await supabaseAdmin
      .from("cards")
      .insert({
        slug,
        player_name: playerName,
        sport,
        team,
        year,
        brand,
        set_name: setName,
        parallel,
        card_number: cardNumber,

        rookie_card: Boolean(body.rookieCard),
        autograph: Boolean(body.autograph),
        patch: Boolean(body.patch),
        relic: Boolean(body.relic),
        short_print: Boolean(body.shortPrint),
        case_hit: Boolean(body.caseHit),
        serial_number: cleanOptionalText(body.serialNumber),
        card_condition: cleanOptionalText(body.condition),
        condition_notes: cleanOptionalText(body.conditionNotes),

        graded,
        grade_company: graded
          ? cleanOptionalText(body.gradeCompany)
          : null,
        grade: graded ? cleanOptionalText(body.grade) : null,
        certification_number: graded
          ? cleanOptionalText(body.certificationNumber)
          : null,

        purchase_date: cleanOptionalText(body.purchaseDate),
        purchase_source: cleanOptionalText(body.purchaseSource),
        seller: cleanOptionalText(body.seller),
        purchase_session: cleanOptionalText(body.purchaseSession),
        ...(purchaseId ? { purchase_id: purchaseId } : {}),
        purchase_price: purchasePrice,
        shipping_cost: shippingCost,
        sales_tax: salesTax,
        purchase_fees: purchaseFees,

        market_value: cleanOptionalNumber(body.marketValue),
        price: websitePrice,
        minimum_price: cleanOptionalNumber(body.minimumPrice),

        storage_area: cleanOptionalText(body.storageArea),
        cabinet: cleanOptionalText(body.cabinet),
        shelf: cleanOptionalText(body.shelf),
        box: cleanOptionalText(body.box),
        storage_row: cleanOptionalText(body.row),
        slot: cleanOptionalText(body.slot),
        storage_notes: cleanOptionalText(body.storageNotes),

        image_url: imageUrl,
        back_image_url: backImageUrl,

        website_ready: Boolean(body.websiteReady),
        featured: Boolean(body.featured),
        listing_status:
          cleanOptionalText(body.listingStatus) ?? "Available",
        internal_notes: cleanOptionalText(body.internalNotes),

        stock: quantity,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Supabase card creation error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "A card already uses this URL slug. Change the slug or add more identifying details.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error: error.message || "The card could not be saved.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Card created successfully.",
        card: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected card creation error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while saving the card.",
      },
      { status: 500 },
    );
  }
}