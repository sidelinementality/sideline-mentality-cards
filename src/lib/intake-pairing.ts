export type PairMode = "auto" | "sequential" | "front-only";

export type NamedFile = { name: string };

export type SelectableFile = NamedFile & { type?: string };

export type IntakePair<T extends NamedFile> = { front: T; back?: T };

export type FastFotoRole = "front" | "back";

export type FastFotoName = {
  baseKey: string;
  role: FastFotoRole;
};

export type IntakeSelectionPairs<T extends NamedFile> = {
  epsonPairs: Array<{ front: T; back: T }>;
  unmatchedBackPairs: Array<IntakePair<T>>;
  unmatchedFrontPairs: Array<IntakePair<T>>;
  remaining: T[];
  genericPairs: Array<IntakePair<T>>;
  pairs: Array<IntakePair<T>>;
};

const INTAKE_IMAGE_EXTENSION = /\.(jpe?g|png|webp|gif|bmp|tif|tiff|heic|heif)$/i;
const INVISIBLE_FILENAME_CHARS = /[\u200B-\u200D\u2060\uFEFF]/g;

export function intakeBasename(fileName: string) {
  const trimmed = String(fileName ?? "").trim();
  const normalized = trimmed.replace(/\\/g, "/");
  const withoutQuery = normalized.split("?")[0] ?? normalized;
  const slash = withoutQuery.lastIndexOf("/");
  return (slash >= 0 ? withoutQuery.slice(slash + 1) : withoutQuery).trim();
}

function stripFinalExtension(basename: string) {
  return basename.replace(/\.[^.]+$/, "");
}

function fastFotoStem(fileName: string) {
  let value = String(fileName ?? "");
  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep the raw name when it is not URI-encoded.
  }
  value = value.normalize("NFC").replace(INVISIBLE_FILENAME_CHARS, "").replace(/\u00A0/g, " ");
  const stem = stripFinalExtension(intakeBasename(value)).trim();
  return stem.replace(/[\uFF3F\u2017]/g, "_");
}

function normalizeBaseKey(stem: string) {
  return stem.trim().toLowerCase().replace(/\s+/g, " ");
}

export function parseFastFotoFilename(fileName: string): FastFotoName | null {
  const stem = fastFotoStem(fileName);
  if (!stem) return null;

  const backMatch = /^(.*)_b$/i.exec(stem);
  if (backMatch && backMatch[1].trim().length > 0) {
    return { baseKey: normalizeBaseKey(backMatch[1]), role: "back" };
  }

  const frontMatch = /^(.*)_a$/i.exec(stem);
  if (frontMatch && frontMatch[1].trim().length > 0) {
    return { baseKey: normalizeBaseKey(frontMatch[1]), role: "front" };
  }

  if (/_\d+$/.test(stem)) {
    return { baseKey: normalizeBaseKey(stem), role: "front" };
  }

  return null;
}

export function isSelectableIntakeImage(file: SelectableFile) {
  if (file.type?.startsWith("image/")) return true;
  return INTAKE_IMAGE_EXTENSION.test(intakeBasename(file.name));
}

export function selectIntakeImageFiles<T extends SelectableFile>(files: T[]) {
  return files.filter(isSelectableIntakeImage);
}

export function consumeEpsonFastFotoPairs<T extends NamedFile>(files: T[]) {
  const annotated = files.map((file) => {
    const fastFoto = parseFastFotoFilename(file.name);
    const stemKey = normalizeBaseKey(fastFotoStem(file.name));
    return { file, fastFoto, stemKey };
  });

  const backKeys = new Set(
    annotated.flatMap((item) => (item.fastFoto?.role === "back" ? [item.fastFoto.baseKey] : [])),
  );

  const isFastFotoCandidate = (item: (typeof annotated)[number]) =>
    Boolean(item.fastFoto) || backKeys.has(item.stemKey);

  const candidates = annotated.filter(isFastFotoCandidate);
  const remaining = annotated.filter((item) => !isFastFotoCandidate(item)).map((item) => item.file);
  const unused = new Set(candidates.map((item) => item.file));
  const frontsByKey = new Map<string, T[]>();

  for (const item of candidates) {
    if (item.fastFoto?.role === "back") continue;
    const key = item.fastFoto?.baseKey ?? item.stemKey;
    const list = frontsByKey.get(key) ?? [];
    list.push(item.file);
    frontsByKey.set(key, list);
  }

  const pairs: Array<{ front: T; back: T }> = [];
  const unmatchedBacks: T[] = [];

  for (const item of candidates) {
    if (item.fastFoto?.role !== "back" || !unused.has(item.file)) continue;

    const key = item.fastFoto.baseKey;
    const front = (frontsByKey.get(key) ?? []).find((candidate) => unused.has(candidate));
    unused.delete(item.file);

    if (front) {
      unused.delete(front);
      pairs.push({ front, back: item.file });
      continue;
    }

    unmatchedBacks.push(item.file);
  }

  const unmatchedFronts = candidates
    .filter((item) => unused.has(item.file) && item.fastFoto?.role !== "back")
    .map((item) => item.file);

  pairs.sort((a, b) =>
    a.front.name.localeCompare(b.front.name, undefined, { numeric: true, sensitivity: "base" }),
  );

  return {
    pairs,
    unmatchedBacks,
    unmatchedFronts,
    remaining,
  };
}

function sortByName<T extends NamedFile>(files: T[]) {
  return [...files].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
  );
}

export function pairGenericImages<T extends NamedFile>(files: T[], mode: PairMode): Array<IntakePair<T>> {
  const sorted = sortByName(files);

  if (mode === "front-only") {
    return sorted.map((front) => ({ front }));
  }

  if (mode === "sequential") {
    const pairs: Array<IntakePair<T>> = [];
    for (let index = 0; index < sorted.length; index += 2) {
      pairs.push({ front: sorted[index], back: sorted[index + 1] });
    }
    return pairs;
  }

  return pairRemainingAuto(sorted);
}

export function buildIntakePairsFromSelection<T extends SelectableFile>(
  files: T[],
  mode: PairMode,
): IntakeSelectionPairs<T> {
  const selected = selectIntakeImageFiles(files);
  const { pairs: epsonPairs, unmatchedBacks, unmatchedFronts, remaining } =
    consumeEpsonFastFotoPairs(selected);
  const unmatchedBackPairs = unmatchedBacks.map((back) => ({ front: back }));
  const unmatchedFrontPairs = unmatchedFronts.map((front) => ({ front }));
  const genericPairs = remaining.length === 0 ? [] : pairGenericImages(remaining, mode);

  return {
    epsonPairs,
    unmatchedBackPairs,
    unmatchedFrontPairs,
    remaining,
    genericPairs,
    pairs: [...epsonPairs, ...unmatchedBackPairs, ...unmatchedFrontPairs, ...genericPairs],
  };
}

export function pairIntakeFilesFromSelection<T extends SelectableFile>(
  files: T[],
  mode: PairMode,
): Array<IntakePair<T>> {
  return buildIntakePairsFromSelection(files, mode).pairs;
}

export function pairImages<T extends SelectableFile>(files: T[], mode: PairMode): Array<IntakePair<T>> {
  return pairIntakeFilesFromSelection(files, mode);
}

function pairRemainingAuto<T extends NamedFile>(files: T[]): Array<IntakePair<T>> {
  const sorted = sortByName(files);
  const groups = new Map<string, { front?: T; back?: T; loose: T[] }>();

  for (const file of sorted) {
    const parsed = parseSideFromName(file.name);
    const group = groups.get(parsed.base) ?? { loose: [] };

    if (parsed.side === "front" && !group.front) group.front = file;
    else if (parsed.side === "back" && !group.back) group.back = file;
    else group.loose.push(file);

    groups.set(parsed.base, group);
  }

  const detectedPairs: Array<IntakePair<T>> = [];
  const leftovers: T[] = [];

  for (const group of groups.values()) {
    if (group.front || group.back) {
      if (group.front) {
        detectedPairs.push({ front: group.front, back: group.back });
        leftovers.push(...group.loose);
      } else if (group.back) {
        const [matchedFront, ...restLoose] = group.loose;
        if (matchedFront) {
          detectedPairs.push({ front: matchedFront, back: group.back });
          leftovers.push(...restLoose);
        } else {
          detectedPairs.push({ front: group.back });
        }
      }
    } else {
      leftovers.push(...group.loose);
    }
  }

  if (detectedPairs.length === 0) {
    return pairGenericImages(sorted, "sequential");
  }

  for (let index = 0; index < leftovers.length; index += 2) {
    detectedPairs.push({ front: leftovers[index], back: leftovers[index + 1] });
  }

  return detectedPairs;
}

export function parseSideFromName(fileName: string) {
  const fastFoto = parseFastFotoFilename(fileName);
  if (fastFoto) {
    return {
      base: fastFoto.baseKey.replace(/[-_.\s]+/g, "-").replace(/^-|-$/g, ""),
      side: "unknown" as const,
    };
  }

  const withoutExtension = stripFinalExtension(intakeBasename(fileName));
  const normalized = withoutExtension.toLowerCase().trim();

  const sideMatchers: Array<{ side: "front" | "back"; patterns: RegExp[] }> = [
    {
      side: "front",
      patterns: [
        /(?:^|[-_.\s])(front|fr)(?:$|[-_.\s])/i,
        /(front|fr)$/i,
        /(?:^|[-_.\s])f$/i,
      ],
    },
    {
      side: "back",
      patterns: [
        /(?:^|[-_.\s])(back|bk)(?:$|[-_.\s])/i,
        /(back|bk)$/i,
        /(?:^|[-.\s])b$/i,
      ],
    },
  ];

  for (const matcher of sideMatchers) {
    for (const pattern of matcher.patterns) {
      if (pattern.test(normalized)) {
        const base = normalized
          .replace(pattern, "-")
          .replace(/[-_.\s]+/g, "-")
          .replace(/^-|-$/g, "");
        return { base, side: matcher.side } as const;
      }
    }
  }

  return { base: normalized.replace(/[-_.\s]+/g, "-"), side: "unknown" as const };
}
