import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type CreateBuyBibleTargetRequest = {
  playerName?: string;
  sport?: string;
  playerCategory?: string;
  priorityLevel?: number;
  marketHeat?: string;
  targetStatus?: string;
  targetQuantity?: number;
  currentQuantity?: number;
  preferredProducts?: string[];
  preferredCardTypes?: string[];
  maxBuyRaw?: number | null;
  maxBuyGraded?: number | null;
  maxBuyAuto?: number | null;
  maxBuyParallel?: number | null;
  targetMarginPercent?: number;
  estimatedMarketValue?: number | null;
  demandScore?: number | null;
  liquidityScore?: number | null;
  upsideScore?: number | null;
  stabilityScore?: number | null;
  riskScore?: number | null;
  rookieYear?: number | null;
  teamOrBrand?: string;
  researchUrl?: string;
  secondaryResearchUrl?: string;
  buyingNotes?: string;
  cardsToAvoid?: string;
  internalNotes?: string;
};

const allowedCategories = [
  "Blue Chip",
  "Rising Star",
  "Legend",
  "Hall of Famer",
  "Prospect",
  "Character",
];

const allowedMarketHeat = [
  "Hot",
  "Rising",
  "Watch",
  "Stable",
  "Cooling",
];

const allowedTargetStatuses = [
  "Buy",
  "Watch",
  "Hold",
  "Pass",
];

export async function POST(request: Request) {
  try {
    const authResult = await authorizeDealer();

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body =
      (await request.json()) as CreateBuyBibleTargetRequest;

    const playerName = body.playerName?.trim();
    const sport = body.sport?.trim();

    if (!playerName) {
      return NextResponse.json(
        { error: "A player or character name is required." },
        { status: 400 },
      );
    }

    if (!sport) {
      return NextResponse.json(
        { error: "A sport or category is required." },
        { status: 400 },
      );
    }

    const playerCategory =
      body.playerCategory?.trim() || "Rising Star";

    if (!allowedCategories.includes(playerCategory)) {
      return NextResponse.json(
        { error: "Choose a valid player category." },
        { status: 400 },
      );
    }

    const marketHeat = body.marketHeat?.trim() || "Watch";

    if (!allowedMarketHeat.includes(marketHeat)) {
      return NextResponse.json(
        { error: "Choose a valid market heat value." },
        { status: 400 },
      );
    }

    const targetStatus = body.targetStatus?.trim() || "Buy";

    if (!allowedTargetStatuses.includes(targetStatus)) {
      return NextResponse.json(
        { error: "Choose a valid target status." },
        { status: 400 },
      );
    }

    const priorityLevel = Number(body.priorityLevel ?? 3);
    const targetQuantity = Number(body.targetQuantity ?? 1);
    const currentQuantity = Number(body.currentQuantity ?? 0);
    const targetMarginPercent = Number(
      body.targetMarginPercent ?? 35,
    );

    if (
      !Number.isInteger(priorityLevel) ||
      priorityLevel < 1 ||
      priorityLevel > 5
    ) {
      return NextResponse.json(
        { error: "Priority level must be between 1 and 5." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(targetQuantity) ||
      targetQuantity < 0
    ) {
      return NextResponse.json(
        { error: "Target quantity cannot be negative." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(currentQuantity) ||
      currentQuantity < 0
    ) {
      return NextResponse.json(
        { error: "Current quantity cannot be negative." },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(targetMarginPercent) ||
      targetMarginPercent < 0
    ) {
      return NextResponse.json(
        { error: "Target margin cannot be negative." },
        { status: 400 },
      );
    }

    const scoreResult = validateScores({
      demandScore: body.demandScore,
      liquidityScore: body.liquidityScore,
      upsideScore: body.upsideScore,
      stabilityScore: body.stabilityScore,
      riskScore: body.riskScore,
    });

    if (scoreResult.error) {
      return NextResponse.json(
        { error: scoreResult.error },
        { status: 400 },
      );
    }

    const overallBuyScore = calculateOverallBuyScore({
      demandScore: scoreResult.values.demandScore,
      liquidityScore: scoreResult.values.liquidityScore,
      upsideScore: scoreResult.values.upsideScore,
      stabilityScore: scoreResult.values.stabilityScore,
      riskScore: scoreResult.values.riskScore,
    });

    const { data, error } = await supabaseAdmin
      .from("buy_bible_targets")
      .insert({
        player_name: playerName,
        sport,
        player_category: playerCategory,
        priority_level: priorityLevel,
        market_heat: marketHeat,
        target_status: targetStatus,

        target_quantity: targetQuantity,
        current_quantity: currentQuantity,

        preferred_products: cleanTextArray(
          body.preferredProducts,
        ),
        preferred_card_types: cleanTextArray(
          body.preferredCardTypes,
        ),

        max_buy_raw: cleanOptionalMoney(body.maxBuyRaw),
        max_buy_graded: cleanOptionalMoney(
          body.maxBuyGraded,
        ),
        max_buy_auto: cleanOptionalMoney(body.maxBuyAuto),
        max_buy_parallel: cleanOptionalMoney(
          body.maxBuyParallel,
        ),

        target_margin_percent: targetMarginPercent,
        estimated_market_value: cleanOptionalMoney(
          body.estimatedMarketValue,
        ),

        demand_score: scoreResult.values.demandScore,
        liquidity_score: scoreResult.values.liquidityScore,
        upside_score: scoreResult.values.upsideScore,
        stability_score: scoreResult.values.stabilityScore,
        risk_score: scoreResult.values.riskScore,
        overall_buy_score: overallBuyScore,

        rookie_year: cleanOptionalInteger(body.rookieYear),
        team_or_brand: cleanOptionalText(body.teamOrBrand),

        research_url: cleanOptionalText(body.researchUrl),
        secondary_research_url: cleanOptionalText(
          body.secondaryResearchUrl,
        ),

        buying_notes: cleanOptionalText(body.buyingNotes),
        cards_to_avoid: cleanOptionalText(body.cardsToAvoid),
        internal_notes: cleanOptionalText(
          body.internalNotes,
        ),

        is_active: true,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Buy Bible target creation error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "That player or character already exists for this sport.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error:
            error.message ||
            "The Buy Bible target could not be saved.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Buy Bible target created successfully.",
        target: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Unexpected Buy Bible creation error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while saving the Buy Bible target.",
      },
      { status: 500 },
    );
  }
}

async function authorizeDealer() {
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
          "You are not authorized to manage the Buy Bible.",
      },
      { status: 401 },
    );
  }

  return user;
}

function cleanOptionalText(
  value: string | null | undefined,
) {
  const cleaned = value?.trim();

  return cleaned ? cleaned : null;
}

function cleanTextArray(values: string[] | undefined) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function cleanOptionalMoney(
  value: number | null | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function cleanOptionalInteger(
  value: number | null | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function validateScores(scores: {
  demandScore?: number | null;
  liquidityScore?: number | null;
  upsideScore?: number | null;
  stabilityScore?: number | null;
  riskScore?: number | null;
}) {
  const values = {
    demandScore: cleanScore(scores.demandScore),
    liquidityScore: cleanScore(scores.liquidityScore),
    upsideScore: cleanScore(scores.upsideScore),
    stabilityScore: cleanScore(scores.stabilityScore),
    riskScore: cleanScore(scores.riskScore),
  };

  const invalidEntry = Object.entries(values).find(
    ([, value]) =>
      value !== null &&
      (!Number.isInteger(value) || value < 0 || value > 100),
  );

  if (invalidEntry) {
    return {
      error: "All Buy Bible scores must be between 0 and 100.",
      values,
    };
  }

  return {
    error: null,
    values,
  };
}

function cleanScore(
  value: number | null | undefined,
) {
  if (value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

function calculateOverallBuyScore(scores: {
  demandScore: number | null;
  liquidityScore: number | null;
  upsideScore: number | null;
  stabilityScore: number | null;
  riskScore: number | null;
}) {
  const availableScores = [
    scores.demandScore,
    scores.liquidityScore,
    scores.upsideScore,
    scores.stabilityScore,
    scores.riskScore === null
      ? null
      : 100 - scores.riskScore,
  ].filter((score): score is number => score !== null);

  if (availableScores.length === 0) {
    return null;
  }

  const average =
    availableScores.reduce(
      (total, score) => total + score,
      0,
    ) / availableScores.length;

  return Math.round(average);
}