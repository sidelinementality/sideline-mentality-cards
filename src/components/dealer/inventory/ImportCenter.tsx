"use client";

import { ChangeEvent, useMemo, useState } from "react";

type CsvRow = Record<string, string>;

type ImportFailure = {
  rowNumber: number;
  playerName: string;
  error: string;
};

const templateHeaders = [
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
  "patch",
  "serialNumber",
  "graded",
  "gradeCompany",
  "grade",
  "certificationNumber",
  "purchaseDate",
  "purchaseSource",
  "seller",
  "purchasePrice",
  "shippingCost",
  "salesTax",
  "purchaseFees",
  "marketValue",
  "websitePrice",
  "minimumPrice",
  "quantity",
  "storageArea",
  "cabinet",
  "shelf",
  "box",
  "row",
  "slot",
  "imageUrl",
  "backImageUrl",
  "websiteReady",
  "featured",
  "listingStatus",
  "internalNotes",
];

const requiredHeaders = [
  "playerName",
  "sport",
  "year",
  "brand",
  "purchasePrice",
  "websitePrice",
  "quantity",
  "imageUrl",
];

export default function ImportCenter() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importFailures, setImportFailures] = useState<
    ImportFailure[]
  >([]);

  const missingHeaders = useMemo(
    () =>
      requiredHeaders.filter(
        (requiredHeader) => !headers.includes(requiredHeader),
      ),
    [headers],
  );

  const validRows = useMemo(
    () =>
      rows.filter((row) =>
        requiredHeaders.every(
          (header) => String(row[header] ?? "").trim() !== "",
        ),
      ),
    [rows],
  );

  const invalidRows = rows.length - validRows.length;

  function downloadTemplate() {
    const exampleRow = [
      "Patrick Mahomes",
      "Football",
      "Kansas City Chiefs",
      "2024",
      "Panini",
      "Prizm",
      "Silver",
      "245",
      "No",
      "No",
      "No",
      "",
      "No",
      "",
      "",
      "",
      "2026-08-01",
      "Card Show",
      "Example Seller",
      "100.00",
      "0",
      "0",
      "0",
      "150.00",
      "169.99",
      "125.00",
      "1",
      "Card Room",
      "Cabinet A",
      "Shelf 1",
      "Football Box",
      "Row A",
      "Slot 1",
      "https://example.com/front-image.jpg",
      "https://example.com/back-image.jpg",
      "No",
      "No",
      "Draft",
      "Example import row",
    ];

    const csv = [
      templateHeaders.join(","),
      exampleRow.map(escapeCsvValue).join(","),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      "sideline-mentality-card-import-template.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    setRows([]);
    setHeaders([]);
    setErrorMessage("");
    setImportMessage("");
    setImportFailures([]);

    if (!file) {
      setFileName("");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Please choose a CSV file.");
      setFileName("");
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const parsedRows = parseCsv(text);

      if (parsedRows.length < 2) {
        throw new Error(
          "The CSV must include a header row and at least one card.",
        );
      }

      const parsedHeaders = parsedRows[0].map((value) =>
        value.trim(),
      );

      if (parsedHeaders.some((header) => !header)) {
        throw new Error(
          "The CSV contains an empty column heading.",
        );
      }

      const dataRows = parsedRows
        .slice(1)
        .filter((row) =>
          row.some((value) => value.trim() !== ""),
        )
        .map((row) => {
          const record: CsvRow = {};

          parsedHeaders.forEach((header, index) => {
            record[header] = row[index]?.trim() ?? "";
          });

          return record;
        });

      setFileName(file.name);
      setHeaders(parsedHeaders);
      setRows(dataRows);
    } catch (error) {
      setFileName("");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The CSV file could not be read.",
      );
    }
  }

  async function handleImport() {
    if (
      rows.length === 0 ||
      invalidRows > 0 ||
      missingHeaders.length > 0
    ) {
      return;
    }

    setIsImporting(true);
    setImportMessage("");
    setImportFailures([]);
    setErrorMessage("");

    try {
      const response = await fetch("/api/cards/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setImportFailures(result.failures ?? []);

        throw new Error(
          result.error ||
            "The inventory could not be imported.",
        );
      }

      setImportMessage(
        result.message || "Inventory imported successfully.",
      );

      setRows([]);
      setHeaders([]);
      setFileName("");

      const input = document.getElementById(
        "inventoryCsv",
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while importing inventory.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  function clearFile() {
    setFileName("");
    setRows([]);
    setHeaders([]);
    setErrorMessage("");
    setImportMessage("");
    setImportFailures([]);

    const input = document.getElementById(
      "inventoryCsv",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  const previewHeaders = headers.slice(0, 8);
  const previewRows = rows.slice(0, 10);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
              Step 1
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Download the CSV template
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Use the Dealer OS template so your spreadsheet
              columns match the Sideline Mentality Cards database.
            </p>
          </div>

          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-green-500/40 bg-green-500/10 px-5 py-3 font-black text-green-300 transition hover:bg-green-500 hover:text-black"
          >
            Download CSV Template
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Step 2
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Upload inventory
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Choose a completed CSV file. Dealer OS will check the
            structure before anything is added to inventory.
          </p>
        </div>

        <label
          htmlFor="inventoryCsv"
          className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/20 px-6 py-12 text-center transition hover:border-green-500/60 hover:bg-green-500/[0.04]"
        >
          <span className="text-lg font-black text-white">
            Choose CSV File
          </span>

          <span className="mt-2 text-sm text-zinc-500">
            Only .csv files are accepted
          </span>

          <input
            id="inventoryCsv"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>

        {fileName && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-green-300">
                {fileName}
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                {rows.length.toLocaleString()} inventory rows
                found
              </p>
            </div>

            <button
              type="button"
              onClick={clearFile}
              className="text-left text-sm font-black text-white transition hover:text-red-300"
            >
              Remove File
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
            {errorMessage}
          </div>
        )}
      </section>

      {rows.length > 0 && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Rows Found"
              value={rows.length}
              status="neutral"
            />

            <SummaryCard
              label="Valid Rows"
              value={validRows.length}
              status="success"
            />

            <SummaryCard
              label="Rows Needing Attention"
              value={invalidRows}
              status={
                invalidRows > 0 ? "warning" : "success"
              }
            />

            <SummaryCard
              label="Missing Columns"
              value={missingHeaders.length}
              status={
                missingHeaders.length > 0
                  ? "danger"
                  : "success"
              }
            />
          </section>

          {missingHeaders.length > 0 && (
            <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
              <p className="font-black text-red-300">
                Required columns are missing
              </p>

              <p className="mt-2 text-sm text-red-200">
                {missingHeaders.join(", ")}
              </p>
            </section>
          )}

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
                Step 3
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Review import preview
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Showing the first {previewRows.length} rows before
                import.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-black/30">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-400">
                      Row
                    </th>

                    {previewHeaders.map((header) => (
                      <th
                        key={header}
                        className="whitespace-nowrap px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-400"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {previewRows.map((row, index) => {
                    const isValid = requiredHeaders.every(
                      (header) =>
                        String(row[header] ?? "").trim() !== "",
                    );

                    return (
                      <tr
                        key={index}
                        className={
                          isValid
                            ? "hover:bg-white/[0.03]"
                            : "bg-red-500/[0.05]"
                        }
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-zinc-400">
                          {index + 2}
                        </td>

                        {previewHeaders.map((header) => (
                          <td
                            key={header}
                            className="max-w-[240px] truncate whitespace-nowrap px-5 py-4 text-sm text-zinc-300"
                          >
                            {row[header] || "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-black text-white">
                Ready for final validation
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Dealer OS will validate the rows again before
                importing.
              </p>
            </div>

            <button
              type="button"
              onClick={handleImport}
              disabled={
                rows.length === 0 ||
                invalidRows > 0 ||
                missingHeaders.length > 0 ||
                isImporting
              }
              className="rounded-xl bg-green-600 px-6 py-3 font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isImporting
                ? "Importing Cards..."
                : "Validate and Import"}
            </button>
          </section>
        </>
      )}

      {importMessage && (
        <section className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
          <p className="font-black text-green-300">
            {importMessage}
          </p>

          <a
            href="/dashboard/inventory"
            className="mt-4 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500"
          >
            View Imported Inventory
          </a>
        </section>
      )}

      {importFailures.length > 0 && (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="font-black text-red-300">
            Rows that could not be imported
          </p>

          <div className="mt-4 space-y-3">
            {importFailures.map((failure) => (
              <div
                key={`${failure.rowNumber}-${failure.playerName}`}
                className="rounded-xl border border-red-500/20 bg-black/20 p-4"
              >
                <p className="font-bold text-white">
                  Row {failure.rowNumber}: {failure.playerName}
                </p>

                <p className="mt-1 text-sm text-red-200">
                  {failure.error}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status: "neutral" | "success" | "warning" | "danger";
}) {
  const styles = {
    neutral: "border-white/10 bg-white/5 text-white",
    success:
      "border-green-500/20 bg-green-500/10 text-green-300",
    warning:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
    danger:
      "border-red-500/20 bg-red-500/10 text-red-300",
  };

  return (
    <div className={`rounded-2xl border p-5 ${styles[status]}`}>
      <p className="text-sm font-semibold text-zinc-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function escapeCsvValue(value: string) {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (
      character === '"' &&
      insideQuotes &&
      nextCharacter === '"'
    ) {
      currentValue += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === "," && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if (
      (character === "\n" || character === "\r") &&
      !insideQuotes
    ) {
      if (
        character === "\r" &&
        nextCharacter === "\n"
      ) {
        index += 1;
      }

      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows;
}