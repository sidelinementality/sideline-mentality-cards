import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IDENTIFICATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    confidence: { type: "integer", minimum: 0, maximum: 100 },
    playerName: { type: "string" },
    sport: { type: "string", enum: ["Baseball", "Basketball", "Football", "Hockey", "Soccer", "Wrestling", "Racing", "Other", ""] },
    team: { type: "string" },
    year: { type: "string" },
    brand: { type: "string" },
    setName: { type: "string" },
    parallel: { type: "string" },
    cardNumber: { type: "string" },
    rookieCard: { type: "boolean" },
    autograph: { type: "boolean" },
    serialNumber: { type: "string" },
    notes: { type: "string" },
    warnings: {
      type: "array",
      items: { type: "string" },
      maxItems: 6,
    },
  },
  required: [
    "confidence",
    "playerName",
    "sport",
    "team",
    "year",
    "brand",
    "setName",
    "parallel",
    "cardNumber",
    "rookieCard",
    "autograph",
    "serialNumber",
    "notes",
    "warnings",
  ],
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "AI identification is built, but OPENAI_API_KEY is not configured yet. Add it to .env.local, restart npm run dev, then try Identify Card again.",
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const front = formData.get("front");
    const back = formData.get("back");
    const frontFileName = String(formData.get("frontFileName") ?? "");
    const backFileName = String(formData.get("backFileName") ?? "");

    if (!(front instanceof File) || !front.type.startsWith("image/")) {
      return NextResponse.json({ error: "A front card image is required." }, { status: 400 });
    }

    if (front.size > 12 * 1024 * 1024 || (back instanceof File && back.size > 12 * 1024 * 1024)) {
      return NextResponse.json(
        { error: "Each scan must be 12 MB or smaller for Dealer Intake V2." },
        { status: 413 },
      );
    }

    const content: Array<Record<string, unknown>> = [
      {
        type: "input_text",
        text: buildPrompt(frontFileName, backFileName),
      },
      {
        type: "input_image",
        image_url: await fileToDataUrl(front),
        detail: "high",
      },
    ];

    if (back instanceof File && back.type.startsWith("image/")) {
      content.push({
        type: "input_image",
        image_url: await fileToDataUrl(back),
        detail: "high",
      });
    }

    const model = process.env.OPENAI_INTAKE_MODEL || "gpt-4o-mini";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "You are the Sideline Mentality Cards intake identifier. Analyze trading-card scans conservatively. Extract only details supported by visible evidence. Never invent a set, parallel, card number, year, autograph, serial number, or rookie designation. If uncertain, leave the field blank or false, reduce confidence, and add a warning. Distinguish the card brand/manufacturer from the product/set. Use the back of the card when it contains stronger identification evidence.",
          },
          {
            role: "user",
            content,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "sports_card_identification",
            strict: true,
            schema: IDENTIFICATION_SCHEMA,
          },
        },
        max_output_tokens: 1200,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = data?.error?.message || "OpenAI could not analyze the card.";
      return NextResponse.json({ error: detail }, { status: response.status });
    }

    const outputText = extractOutputText(data);
    if (!outputText) {
      return NextResponse.json({ error: "The AI response did not contain an identification result." }, { status: 502 });
    }

    let identification: unknown;
    try {
      identification = JSON.parse(outputText);
    } catch {
      return NextResponse.json({ error: "The AI returned an unreadable identification result." }, { status: 502 });
    }

    return NextResponse.json({ identification, model });
  } catch (error) {
    console.error("Dealer Intake identify error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Card identification failed." },
      { status: 500 },
    );
  }
}

function buildPrompt(frontFileName: string, backFileName: string) {
  return [
    "Identify this sports or trading card from the attached scans.",
    `Front filename: ${frontFileName || "unknown"}`,
    `Back filename: ${backFileName || "not provided"}`,
    "Return the best-supported values for player/subject, sport, team, year, brand/manufacturer, set/product, parallel/variation, card number, rookie status, autograph status, and visible serial numbering.",
    "Confidence should represent confidence in the exact card identity, not merely the player name.",
    "If the exact parallel or set cannot be proven from the scans, leave it blank and explain that in warnings.",
    "For serialNumber, use the printed numbering exactly as visible (example: 17/99).",
  ].join("\n");
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
}

function extractOutputText(data: unknown) {
  if (!data || typeof data !== "object") {
    return "";
  }

  const record = data as {
    output_text?: unknown;
    output?: Array<{
      type?: string;
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text.trim();
  }

  if (!Array.isArray(record.output)) {
    return "";
  }

  for (const item of record.output) {
    if (item?.type !== "message" || !Array.isArray(item?.content)) continue;
    for (const content of item.content) {
      if (content?.type === "output_text" && typeof content?.text === "string") {
        return content.text.trim();
      }
    }
  }

  return "";
}
