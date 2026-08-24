import assert from "node:assert/strict";
import test from "node:test";
import {
  buildIntakePairsFromSelection,
  pairGenericImages,
  pairImages,
  pairIntakeFilesFromSelection,
  parseFastFotoFilename,
} from "./intake-pairing.ts";

function named(names: string[]) {
  return names.map((name) => ({ name }));
}

function summarize(pairs: Array<{ front: { name: string }; back?: { name: string } }>) {
  return pairs.map((pair) => ({
    front: pair.front.name,
    back: pair.back?.name ?? null,
  }));
}

const EPSON_SIX_FILE_SELECTION = [
  "2026_August_Cards_0002.jpg",
  "2026_August_Cards_0002_b.jpg",
  "2026_August_Cards_0003.jpg",
  "2026_August_Cards_0003_b.jpg",
  "2026_August_Cards_0004.jpg",
  "2026_August_Cards_0004_b.jpg",
];

const EPSON_SIX_FILE_CARDS = [
  { front: "2026_August_Cards_0002.jpg", back: "2026_August_Cards_0002_b.jpg" },
  { front: "2026_August_Cards_0003.jpg", back: "2026_August_Cards_0003_b.jpg" },
  { front: "2026_August_Cards_0004.jpg", back: "2026_August_Cards_0004_b.jpg" },
];

test("parseFastFotoFilename uses the exact live FastFoto literals", () => {
  assert.deepEqual(parseFastFotoFilename("2026_August_Cards_0002.jpg"), {
    baseKey: "2026_august_cards_0002",
    role: "front",
  });
  assert.deepEqual(parseFastFotoFilename("2026_August_Cards_0002_b.jpg"), {
    baseKey: "2026_august_cards_0002",
    role: "back",
  });
  assert.deepEqual(parseFastFotoFilename("2026_August_Cards_0003.jpg"), {
    baseKey: "2026_august_cards_0003",
    role: "front",
  });
  assert.deepEqual(parseFastFotoFilename("2026_August_Cards_0003_b.jpg"), {
    baseKey: "2026_august_cards_0003",
    role: "back",
  });
  assert.deepEqual(parseFastFotoFilename("2026_August_Cards_0004.jpg"), {
    baseKey: "2026_august_cards_0004",
    role: "front",
  });
  assert.deepEqual(parseFastFotoFilename("2026_August_Cards_0004_b.jpg"), {
    baseKey: "2026_august_cards_0004",
    role: "back",
  });
});

test("exact live six FastFoto files become three cards and never reach generic pairing", () => {
  const result = buildIntakePairsFromSelection(
    [
      "2026_August_Cards_0002.jpg",
      "2026_August_Cards_0002_b.jpg",
      "2026_August_Cards_0003.jpg",
      "2026_August_Cards_0003_b.jpg",
      "2026_August_Cards_0004.jpg",
      "2026_August_Cards_0004_b.jpg",
    ].map((name) => ({ name, type: "image/jpeg" })),
    "auto",
  );

  assert.equal(result.remaining.length, 0);
  assert.equal(result.genericPairs.length, 0);
  assert.equal(result.unmatchedFrontPairs.length, 0);
  assert.equal(result.unmatchedBackPairs.length, 0);
  assert.equal(result.epsonPairs.length, 3);
  assert.deepEqual(summarize(result.pairs), EPSON_SIX_FILE_CARDS);
});

test("FastFoto fronts are not sequentially paired with each other when a _b is unmatched", () => {
  const result = buildIntakePairsFromSelection(
    named([
      "2026_August_Cards_0002.jpg",
      "2026_August_Cards_0003.jpg",
      "2026_August_Cards_0002_b.jpg",
    ]),
    "auto",
  );

  assert.equal(result.genericPairs.length, 0);
  assert.equal(result.remaining.length, 0);
  assert.deepEqual(summarize(result.pairs), [
    { front: "2026_August_Cards_0002.jpg", back: "2026_August_Cards_0002_b.jpg" },
    { front: "2026_August_Cards_0003.jpg", back: null },
  ]);
});

test("Epson FastFoto six-file dump pairs into exactly three cards by basename", () => {
  const files = named([
    "2026_August_Cards_0004_b.jpg",
    "2026_August_Cards_0002.jpg",
    "2026_August_Cards_0003_b.jpg",
    "2026_August_Cards_0004.jpg",
    "2026_August_Cards_0002_b.jpg",
    "2026_August_Cards_0003.jpg",
  ]);

  const pairs = pairImages(files, "auto");

  assert.equal(pairs.length, 3);
  assert.deepEqual(summarize(pairs), EPSON_SIX_FILE_CARDS);
});

test("Epson FastFoto pairs SM Cards_0001 with SM Cards_0001_b", () => {
  const pairs = pairImages(named(["SM Cards_0001_b.jpg", "SM Cards_0001.jpg"]), "auto");

  assert.equal(pairs.length, 1);
  assert.deepEqual(summarize(pairs), [
    { front: "SM Cards_0001.jpg", back: "SM Cards_0001_b.jpg" },
  ]);
});

test("Epson front without matching _b becomes a front-only card", () => {
  const pairs = pairImages(named(["2026_August_Cards_0002.jpg"]), "auto");

  assert.equal(pairs.length, 1);
  assert.equal(pairs[0].front.name, "2026_August_Cards_0002.jpg");
  assert.equal(pairs[0].back, undefined);
});

test("Epson _b without matching front is unmatched and not assigned to another card", () => {
  const pairs = pairImages(
    named(["2026_August_Cards_0002_b.jpg", "2026_August_Cards_0003.jpg"]),
    "auto",
  );

  assert.equal(pairs.length, 2);
  assert.deepEqual(summarize(pairs), [
    { front: "2026_August_Cards_0002_b.jpg", back: null },
    { front: "2026_August_Cards_0003.jpg", back: null },
  ]);
});

test("auto still pairs explicit front/back tokens", () => {
  const pairs = pairImages(named(["player-back.jpg", "player-front.jpg"]), "auto");

  assert.equal(pairs.length, 1);
  assert.deepEqual(summarize(pairs), [
    { front: "player-front.jpg", back: "player-back.jpg" },
  ]);
});

test("auto sequential fallback still pairs unlabeled files when no sides are detected", () => {
  const pairs = pairImages(named(["img4.jpg", "img1.jpg", "img2.jpg", "img3.jpg"]), "auto");

  assert.equal(pairs.length, 2);
  assert.deepEqual(summarize(pairs), [
    { front: "img1.jpg", back: "img2.jpg" },
    { front: "img3.jpg", back: "img4.jpg" },
  ]);
});

test("generic sequential mode still pairs unlabeled files by sorted order", () => {
  const pairs = pairGenericImages(named(["img4.jpg", "img1.jpg", "img2.jpg", "img3.jpg"]), "sequential");

  assert.equal(pairs.length, 2);
  assert.deepEqual(summarize(pairs), [
    { front: "img1.jpg", back: "img2.jpg" },
    { front: "img3.jpg", back: "img4.jpg" },
  ]);
});

test("generic front-only mode still creates one card per unlabeled file", () => {
  const pairs = pairGenericImages(named(["img1.jpg", "img2.jpg"]), "front-only");

  assert.equal(pairs.length, 2);
  assert.deepEqual(summarize(pairs), [
    { front: "img1.jpg", back: null },
    { front: "img2.jpg", back: null },
  ]);
});

test("pairing mode does not override Epson basename pairs", () => {
  for (const mode of ["auto", "sequential", "front-only"] as const) {
    const result = buildIntakePairsFromSelection(
      EPSON_SIX_FILE_SELECTION.map((name) => ({ name, type: "image/jpeg" })),
      mode,
    );

    assert.equal(result.epsonPairs.length, 3, `${mode} epson pair count`);
    assert.equal(result.remaining.length, 0, `${mode} remaining count`);
    assert.equal(result.genericPairs.length, 0, `${mode} generic pair count`);
    assert.deepEqual(summarize(result.pairs), EPSON_SIX_FILE_CARDS);
  }
});

test("runtime selection path pairs the live six-file Epson dump into exactly three cards", () => {
  const files = EPSON_SIX_FILE_SELECTION.map((name) => ({ name, type: "image/jpeg" }));
  const result = buildIntakePairsFromSelection(files, "auto");

  assert.equal(result.remaining.length, 0);
  assert.equal(result.genericPairs.length, 0);
  assert.equal(result.pairs.length, 3);
  assert.deepEqual(summarize(result.pairs), EPSON_SIX_FILE_CARDS);
});

test("runtime selection path still pairs Epson files when MIME type is empty", () => {
  const files = EPSON_SIX_FILE_SELECTION.map((name) => ({ name, type: "" }));
  const pairs = pairIntakeFilesFromSelection(files, "auto");

  assert.equal(pairs.length, 3);
  assert.deepEqual(summarize(pairs), EPSON_SIX_FILE_CARDS);
});

test("runtime selection path accepts browser File objects", () => {
  const files = EPSON_SIX_FILE_SELECTION.map(
    (name) => new File(["x"], name, { type: "image/jpeg" }),
  );
  const result = buildIntakePairsFromSelection(files, "auto");

  assert.equal(result.remaining.length, 0);
  assert.equal(result.genericPairs.length, 0);
  assert.equal(result.pairs.length, 3);
  assert.deepEqual(summarize(result.pairs), EPSON_SIX_FILE_CARDS);
});

test("consumed Epson files are not sent to generic pairing", () => {
  const files = named(EPSON_SIX_FILE_SELECTION);
  const result = buildIntakePairsFromSelection(files, "auto");
  const consumed = new Set(
    result.epsonPairs.flatMap((pair) => [pair.front.name, pair.back.name]),
  );

  assert.equal(consumed.size, 6);
  assert.equal(result.remaining.some((file) => consumed.has(file.name)), false);
  assert.equal(result.genericPairs.length, 0);
});

const EPSON_A_B_SIX_FILE_SELECTION = [
  "0002_a.jpg",
  "0002_b.jpg",
  "0003_a.jpg",
  "0003_b.jpg",
  "0004_a.jpg",
  "0004_b.jpg",
];

const EPSON_A_B_SIX_FILE_CARDS = [
  { front: "0002_a.jpg", back: "0002_b.jpg" },
  { front: "0003_a.jpg", back: "0003_b.jpg" },
  { front: "0004_a.jpg", back: "0004_b.jpg" },
];

test("parseFastFotoFilename treats Pattern B _a as front and _b as back with the same baseKey", () => {
  assert.deepEqual(parseFastFotoFilename("2026_August_Cards_0005_a.jpg"), {
    baseKey: "2026_august_cards_0005",
    role: "front",
  });
  assert.deepEqual(parseFastFotoFilename("2026_August_Cards_0005_b.jpg"), {
    baseKey: "2026_august_cards_0005",
    role: "back",
  });
  assert.deepEqual(parseFastFotoFilename("0002_a.jpg"), {
    baseKey: "0002",
    role: "front",
  });
  assert.deepEqual(parseFastFotoFilename("0002_b.jpg"), {
    baseKey: "0002",
    role: "back",
  });
});

test("Pattern A base + _b still pairs into one Epson card", () => {
  const result = buildIntakePairsFromSelection(
    named(["2026_August_Cards_0005.jpg", "2026_August_Cards_0005_b.jpg"]),
    "auto",
  );

  assert.equal(result.remaining.length, 0);
  assert.equal(result.genericPairs.length, 0);
  assert.deepEqual(summarize(result.pairs), [
    { front: "2026_August_Cards_0005.jpg", back: "2026_August_Cards_0005_b.jpg" },
  ]);
});

test("Pattern B _a + _b pairs into one Epson card with the same baseKey", () => {
  const result = buildIntakePairsFromSelection(
    named(["2026_August_Cards_0005_b.jpg", "2026_August_Cards_0005_a.jpg"]),
    "auto",
  );

  assert.equal(result.epsonPairs.length, 1);
  assert.equal(result.remaining.length, 0);
  assert.equal(result.genericPairs.length, 0);
  assert.deepEqual(summarize(result.pairs), [
    { front: "2026_August_Cards_0005_a.jpg", back: "2026_August_Cards_0005_b.jpg" },
  ]);
});

test("multiple Pattern B _a/_b pairs in one batch become three cards and never reach generic pairing", () => {
  const result = buildIntakePairsFromSelection(
    EPSON_A_B_SIX_FILE_SELECTION.map((name) => ({ name, type: "image/jpeg" })),
    "auto",
  );

  assert.equal(result.remaining.length, 0);
  assert.equal(result.genericPairs.length, 0);
  assert.equal(result.unmatchedFrontPairs.length, 0);
  assert.equal(result.unmatchedBackPairs.length, 0);
  assert.equal(result.epsonPairs.length, 3);
  assert.equal(result.pairs.length, 3);
  assert.deepEqual(summarize(result.pairs), EPSON_A_B_SIX_FILE_CARDS);
});

test("unmatched Pattern B _a becomes a front-only Epson card and is not sent to generic pairing", () => {
  const result = buildIntakePairsFromSelection(named(["0002_a.jpg"]), "auto");

  assert.equal(result.remaining.length, 0);
  assert.equal(result.genericPairs.length, 0);
  assert.equal(result.epsonPairs.length, 0);
  assert.deepEqual(summarize(result.pairs), [{ front: "0002_a.jpg", back: null }]);
});

test("unmatched Pattern B _b is unmatched and not assigned to another card", () => {
  const result = buildIntakePairsFromSelection(
    named(["0002_b.jpg", "0003_a.jpg"]),
    "auto",
  );

  assert.equal(result.remaining.length, 0);
  assert.equal(result.genericPairs.length, 0);
  assert.deepEqual(summarize(result.pairs), [
    { front: "0002_b.jpg", back: null },
    { front: "0003_a.jpg", back: null },
  ]);
});

test("matched Pattern B files stay in Epson pairing when mixed with generic files", () => {
  const result = buildIntakePairsFromSelection(
    named([
      "img2.jpg",
      "0002_b.jpg",
      "img1.jpg",
      "0002_a.jpg",
    ]),
    "auto",
  );

  assert.equal(result.epsonPairs.length, 1);
  assert.equal(result.genericPairs.length, 1);
  assert.deepEqual(
    result.remaining.map((file) => file.name),
    ["img2.jpg", "img1.jpg"],
  );
  assert.deepEqual(summarize(result.epsonPairs), [
    { front: "0002_a.jpg", back: "0002_b.jpg" },
  ]);
  assert.deepEqual(summarize(result.genericPairs), [
    { front: "img1.jpg", back: "img2.jpg" },
  ]);
  assert.deepEqual(summarize(result.pairs), [
    { front: "0002_a.jpg", back: "0002_b.jpg" },
    { front: "img1.jpg", back: "img2.jpg" },
  ]);
});
