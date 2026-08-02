import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type CsvImportRow = {
  playerName?: string;
  slug?: string;
  sport?: string;
  team?: string;
  year?: string;
  brand?: string;
  setName?: string;
  parallel?: string;
  cardNumber?: string;

  rookieCard?: string;
  autograph?: string;
  patch?: string;
  serialNumber?: string;

  graded?: string;
  gradeCompany?: string;
  grade?: string;
  certificationNumber?: string;

  purchaseDate?: string;
  purchaseSource?: string;
  seller?: string;
  purchasePrice?: string;
  shippingCost?: string;
  salesTax?: string;
  purchaseFees?: string;

  marketValue?: string;
  websitePrice?: string;
  minimumPrice?: string;
  quantity?: string;

  storageArea?: string;
  cabinet?: string;
  shelf?: string;
  box?: string;
  row?: string;
  slot?: string;

  imageUrl?: string;
  backImageUrl?: string;

  websiteReady?: string;
  featured?: string;
  listingStatus?: string;
  internalNotes?: string;
};

type ImportRequest = {
  rows?: CsvImportRow[];
};

type ImportFailure = {
  rowNumber: number;
  playerName: string;
  error: string;
};

const allowedStatuses = [
  "Available",
  "Draft",
  "Needs Photos",
  "Needs Pricing",
  "Ready to Publish",
  "Published",
  "Reserved",
  "Sold",
  "Archived",
];

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const dealerEmail =
      process.env.DEALER_EMAIL?.trim().toLowerCase();

    const signedInEmail =
      user?.email?.trim().toLowerCase();

    if (
      !user ||
      !dealerEmail ||
      signedInEmail !== dealerEmail
    ) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to import inventory.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as ImportRequest;
    const rows = Array.isArray(body.rows) ? body.rows : [];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "The import contains no inventory rows." },
        { status: 400 },
      );
    }

    if (rows.length > 500) {
      return NextResponse.json(
        {
          error:
            "Imports are limited to 500 cards at a time.",
        },
        { status: 400 },
      );
    }

    const preparedRows: Record<string, unknown>[] = [];
    const failures: ImportFailure[] = [];
    const generatedSlugs = new Set<string>();

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const playerName = cleanText(row.playerName);
      const sport = cleanText(row.sport);
      const brand = cleanText(row.brand);
      const team = cleanOptionalText(row.team);
      const setName = cleanOptionalText(row.setName);
      const parallel = cleanOptionalText(row.parallel);
      const cardNumber = cleanOptionalText(row.cardNumber);
      const imageUrl = cleanText(row.imageUrl);

      const year = parseNumber(row.year);
      const purchasePrice = parseMoney(row.purchasePrice);
      const shippingCost = parseMoney(row.shippingCost, 0);
      const salesTax = parseMoney(row.salesTax, 0);
      const purchaseFees = parseMoney(row.purchaseFees, 0);
      const websitePrice = parseMoney(row.websitePrice);
      const marketValue = parseOptionalMoney(row.marketValue);
      const minimumPrice = parseOptionalMoney(row.minimumPrice);
      const quantity = parseNumber(row.quantity);

      const suppliedSlug = cleanOptionalText(row.slug)?.toLowerCase();

      const generatedSlug = createSlug([
        playerName,
        year,
        brand,
        setName,
        parallel,
        cardNumber,
      ]);

      const slug = suppliedSlug || generatedSlug;

      const rowErrors: string[] = [];

      if (!playerName) {
        rowErrors.push("playerName is required");
      }

      if (!sport) {
        rowErrors.push("sport is required");
      }

      if (
        !Number.isInteger(year) ||
        year < 1800 ||
        year > 2100
      ) {
        rowErrors.push("year is invalid");
      }

      if (!brand) {
        rowErrors.push("brand is required");
      }

      if (purchasePrice === null) {
        rowErrors.push("purchasePrice is invalid");
      }

      if (websitePrice === null) {
        rowErrors.push("websitePrice is invalid");
      }

      if (
        shippingCost === null ||
        salesTax === null ||
        purchaseFees === null
      ) {
        rowErrors.push(
          "shippingCost, salesTax, and purchaseFees cannot be negative",
        );
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        rowErrors.push("quantity must be at least 1");
      }

      if (!imageUrl) {
        rowErrors.push("imageUrl is required");
      }

      if (
        !slug ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
      ) {
        rowErrors.push("slug is invalid");
      }

      if (slug && generatedSlugs.has(slug)) {
        rowErrors.push(
          "another row in this import uses the same slug",
        );
      }

      const listingStatus =
        cleanOptionalText(row.listingStatus) ?? "Draft";

      if (!allowedStatuses.includes(listingStatus)) {
        rowErrors.push("listingStatus is invalid");
      }

      const websiteReady = parseBoolean(row.websiteReady);
      const featured = parseBoolean(row.featured);
      const graded = parseBoolean(row.graded);

      if (
        listingStatus === "Published" &&
        (
          !websiteReady ||
          websitePrice === null ||
          websitePrice <= 0 ||
          !imageUrl ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        )
      ) {
        rowErrors.push(
          "published cards must be website ready, priced, pictured, and in stock",
        );
      }

      if (rowErrors.length > 0) {
        failures.push({
          rowNumber,
          playerName: playerName || "Unnamed card",
          error: rowErrors.join("; "),
        });

        return;
      }

      generatedSlugs.add(slug);

      preparedRows.push({
        slug,
        player_name: playerName,
        sport,
        team,
        year,
        brand,
        set_name: setName,
        parallel,
        card_number: cardNumber,

        rookie_card: parseBoolean(row.rookieCard),
        autograph: parseBoolean(row.autograph),
        patch: parseBoolean(row.patch),
        relic: false,
        short_print: false,
        case_hit: false,
        serial_number: cleanOptionalText(row.serialNumber),
        card_condition: null,
        condition_notes: null,

        graded,
        grade_company: graded
          ? cleanOptionalText(row.gradeCompany)
          : null,
        grade: graded
          ? cleanOptionalText(row.grade)
          : null,
        certification_number: graded
          ? cleanOptionalText(row.certificationNumber)
          : null,

        purchase_date: cleanOptionalText(row.purchaseDate),
        purchase_source: cleanOptionalText(
          row.purchaseSource,
        ),
        seller: cleanOptionalText(row.seller),
        purchase_session: null,
        purchase_price: purchasePrice,
        shipping_cost: shippingCost,
        sales_tax: salesTax,
        purchase_fees: purchaseFees,

        market_value: marketValue,
        price: websitePrice,
        minimum_price: minimumPrice,

        storage_area: cleanOptionalText(row.storageArea),
        cabinet: cleanOptionalText(row.cabinet),
        shelf: cleanOptionalText(row.shelf),
        box: cleanOptionalText(row.box),
        storage_row: cleanOptionalText(row.row),
        slot: cleanOptionalText(row.slot),
        storage_notes: null,

        image_url: imageUrl,
        back_image_url: cleanOptionalText(
          row.backImageUrl,
        ),

        website_ready: websiteReady,
        featured,
        listing_status: listingStatus,
        internal_notes: cleanOptionalText(
          row.internalNotes,
        ),

        stock: quantity,
      });
    });

    if (failures.length > 0) {
      return NextResponse.json(
        {
          error:
            "Some rows contain invalid or incomplete information.",
          importedCount: 0,
          failedCount: failures.length,
          failures,
        },
        { status: 400 },
      );
    }

    const slugs = preparedRows.map(
      (row) => row.slug as string,
    );

    const { data: existingCards, error: duplicateCheckError } =
      await supabaseAdmin
        .from("cards")
        .select("slug")
        .in("slug", slugs);

    if (duplicateCheckError) {
      console.error(
        "Import duplicate check error:",
        duplicateCheckError,
      );

      return NextResponse.json(
        {
          error:
            "Dealer OS could not check the import for duplicate cards.",
        },
        { status: 500 },
      );
    }

    const existingSlugs = new Set(
      (existingCards ?? []).map((card) => card.slug),
    );

    const rowsWithoutDuplicates: Record<string, unknown>[] = [];

    preparedRows.forEach((row, index) => {
      const slug = row.slug as string;

      if (existingSlugs.has(slug)) {
        failures.push({
          rowNumber: index + 2,
          playerName:
            String(row.player_name || "Unnamed card"),
          error:
            "A card with this slug already exists in inventory",
        });

        return;
      }

      rowsWithoutDuplicates.push(row);
    });

    if (failures.length > 0) {
      return NextResponse.json(
        {
          error:
            "Duplicate cards were found. Nothing was imported.",
          importedCount: 0,
          failedCount: failures.length,
          failures,
        },
        { status: 409 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("cards")
      .insert(rowsWithoutDuplicates)
      .select(`
        id,
        slug,
        player_name
      `);

    if (error) {
      console.error("CSV inventory import error:", error);

      return NextResponse.json(
        {
          error:
            error.message ||
            "The inventory could not be imported.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: `${data?.length ?? 0} card${
          data?.length === 1 ? "" : "s"
        } imported successfully.`,
        importedCount: data?.length ?? 0,
        failedCount: 0,
        cards: data ?? [],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Unexpected inventory import error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while importing inventory.",
      },
      { status: 500 },
    );
  }
}

function cleanText(value: string | undefined) {
  return value?.trim() ?? "";
}

function cleanOptionalText(value: string | undefined) {
  const cleaned = value?.trim();

  return cleaned ? cleaned : null;
}

function parseNumber(value: string | undefined) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseMoney(
  value: string | undefined,
  defaultValue?: number,
) {
  if (
    (value === undefined || value.trim() === "") &&
    defaultValue !== undefined
  ) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function parseOptionalMoney(value: string | undefined) {
  if (value === undefined || value.trim() === "") {
    return null;
  }

  return parseMoney(value);
}

function parseBoolean(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();

  return (
    normalized === "yes" ||
    normalized === "true" ||
    normalized === "1" ||
    normalized === "y"
  );
}

function createSlug(
  parts: Array<string | number | null | undefined>,
) {
  return parts
    .filter(
      (part) =>
        part !== null &&
        part !== undefined &&
        String(part).trim() !== "",
    )
    .join("-")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}