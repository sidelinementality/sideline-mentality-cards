"use client";

export default function PrintPackingSlipButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500"
    >
      Print Packing Slip
    </button>
  );
}